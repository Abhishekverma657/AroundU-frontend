"use client";
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

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

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

    return (
        <div className="flex flex-col h-screen bg-white max-w-2xl mx-auto shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] relative border-x border-slate-100 font-sans">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-5 bg-white/95 border-b border-slate-100 z-10 sticky top-0 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-indigo-600 via-indigo-700 to-violet-700 flex items-center justify-center text-white shadow-xl shadow-indigo-100 transition-transform hover:rotate-3">
                        <MessageCircle size={24} />
                    </div>
                    <div>
                        <h2 className="font-extrabold text-slate-900 text-lg tracking-tight">Live Session</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
                                <Users size={12} /> {users.length} Nearby
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={leaveRoom}
                    className="p-3 bg-slate-50 border border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200 rounded-xl transition-all active:scale-95 group"
                    title="Leave Chat"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-8 bg-slate-50/50 scroll-smooth custom-scrollbar">
                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 220, damping: 25 }}
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
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-14"
                    >
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                        typing...
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-50 shadow-[0_-15px_30px_rgba(0,0,0,0.02)]">
                <form onSubmit={handleSend} className="flex items-center gap-3 relative group">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInput}
                            placeholder="Type a message..."
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-300 font-bold"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 disabled:opacity-20 disabled:grayscale hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all aspect-square flex items-center justify-center group"
                    >
                        <Send size={22} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
