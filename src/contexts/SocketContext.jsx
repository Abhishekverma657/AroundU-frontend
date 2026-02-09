import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState(null);
    const [users, setUsers] = useState([]); // Room users (for inside chat)
    const [nearbyUsers, setNearbyUsers] = useState([]); // List of available users
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const [incomingRequest, setIncomingRequest] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        // Connect to backend
        // Use environment variable for production, or fallback to local network logic for dev
        const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:5004`;
        const newSocket = io(backendUrl, {
            transports: ['websocket'],
            reconnectionAttempts: 5
        });

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
            setIsConnected(true);
            setError(null);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from socket server');
            setIsConnected(false);
            setRoom(null);
            setIsRegistered(false);
            setNearbyUsers([]);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setError('Connection error. Retrying...');
        });

        newSocket.on('session_config', ({ user }) => {
            setUser(user);
        });

        newSocket.on('profile_updated', ({ user }) => {
            setUser(user);
            setIsRegistered(true); // Now we consider registered only after profile is set
            setError(null);
        });

        newSocket.on('nearby_users', ({ users }) => {
            setNearbyUsers(users);
        });

        newSocket.on('room_joined', ({ room }) => {
            setRoom(room);
            setMessages([]);
            setIncomingRequest(null); // Clear any pending requests
            setError(null);
        });

        newSocket.on('room_users', ({ users }) => {
            setUsers(users);
        });

        newSocket.on('receive_message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        newSocket.on('user_typing', ({ userId, isTyping }) => {
            if (isTyping) setTypingUser(userId);
            else setTypingUser(null);
        });

        newSocket.on('incoming_request', (request) => {
            setIncomingRequest(request);
        });

        newSocket.on('chat_rejected', ({ fromId }) => {
            // Check if we were waiting for this specific user or just generic "request rejected" toast
            alert('User rejected your chat request or is busy.');
        });

        newSocket.on('chat_ended', ({ reason, autoClose }) => {
            if (autoClose) {
                alert('Partner ended the chat.');
            } else {
                alert('Chat ended: ' + (reason === 'partner_left' ? 'Partner left the chat.' : 'Partner disconnected.'));
            }
            leaveRoom();
        });

        newSocket.on('error', ({ message }) => {
            setError(message);
            // Auto clear error after 3 seconds
            setTimeout(() => setError(null), 3000);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const registerLocation = (lat, lon, radius) => {
        if (socket) {
            socket.emit('register_location', { lat, lon, radius });
            // Note: In new flow, registration success comes after profile update
        }
    };

    const updateProfile = (username, gender, interest) => {
        if (socket) {
            socket.emit('update_profile', { username, gender, interest });
        }
    };

    const startMatching = () => {
        if (socket) {
            socket.emit('start_matching');
        }
    };

    const getNearbyUsers = useCallback(() => {
        if (socket) {
            socket.emit('get_nearby_users');
        }
    }, [socket]);

    const requestChat = (targetUserId) => {
        if (socket) {
            socket.emit('request_chat', { targetUserId });
        }
    };

    const respondToChat = (targetUserId, accept) => {
        if (socket) {
            socket.emit('respond_chat', { targetUserId, accept });
            if (!accept) setIncomingRequest(null);
        }
    };

    const sendMessage = (text) => {
        if (socket) {
            socket.emit('send_message', text);
        }
    };

    const sendTyping = (isTypingState) => {
        if (socket) {
            socket.emit('typing', isTypingState);
        }
    };

    const leaveRoom = () => {
        if (socket) {
            socket.emit('leave_room');
            setRoom(null);
            setMessages([]);
            setUsers([]);
            // Re-fetch users list as we are now available again
            if (user && user.lat) {
                socket.emit('get_nearby_users');
            }
        }
    };

    return (
        <SocketContext.Provider value={{
            socket,
            user,
            room,
            users, // internal room users
            nearbyUsers, // available users list
            messages,
            error,
            isConnected,
            isRegistered,
            incomingRequest,
            registerLocation,
            updateProfile,
            startMatching,
            getNearbyUsers,
            requestChat,
            respondToChat,
            sendMessage,
            leaveRoom,
            sendTyping,
            typingUser
        }}>
            {children}
        </SocketContext.Provider>
    );
};
