import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, LogOut, MessageCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';

const ChatWindow = () => {
    const {
        room,
        user,
        users,
        messages,
        sendMessage,
        sendTyping,
        typingUser,
        leaveRoom
    } = useSocket();

    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, typingUser]);

    const handleInput = (e) => {
        setInputValue(e.target.value);

        if (!isTyping) {
            setIsTyping(true);
            sendTyping(true);
        }

        // Cancel previous timeout
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // Set new timeout
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            sendTyping(false);
        }, 3000);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            sendMessage(inputValue);
            setInputValue('');
            setIsTyping(false);
            sendTyping(false);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        }
    };

    const formatRadius = (radius) => {
        return radius >= 1000 ? `${radius / 1000}km` : `${radius}m`;
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 max-w-2xl mx-auto shadow-2xl relative">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 z-10 sticky top-0 backdrop-blur-md bg-white/90">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
                        <MessageCircle size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-800 text-lg">Room #{room?.id.slice(0, 4)}</h2>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wide">
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                {formatRadius(room?.radius)} Range
                            </span>
                            <span className="flex items-center gap-1">
                                <Users size={12} /> {users.length} Online
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={leaveRoom}
                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors group"
                    title="Leave Room"
                >
                    <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/50 scroll-smooth">
                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <MessageBubble
                                message={msg}
                                isMine={msg.userId === user?.id}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {typingUser && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-gray-400 text-xs italic ml-12 animate-pulse"
                    >
                        Someone is typing...
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInput}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 font-medium"
                />
                <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none hover:bg-blue-700 active:scale-95 transition-all w-12 h-12 flex items-center justify-center"
                >
                    <Send size={20} className={inputValue.trim() ? "translate-x-0.5 ml-0.5" : ""} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
