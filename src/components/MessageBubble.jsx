import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useSocket } from '../contexts/SocketContext';

const MessageBubble = ({ message, isMine }) => {
    if (message.type === 'system') {
        return (
            <div className="flex justify-center my-4">
                <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-medium shadow-sm border border-gray-200">
                    {message.text}
                </span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={clsx(
                "flex flex-col mb-4 max-w-[85%] md:max-w-[70%]",
                isMine ? "self-end items-end" : "self-start items-start"
            )}
        >
            <div className="flex items-end gap-2">
                {!isMine && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs text-white font-bold shadow-md flex-shrink-0 select-none">
                        {message.username.charAt(0)}
                    </div>
                )}

                <div
                    className={clsx(
                        "px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed break-words relative",
                        isMine
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                    )}
                >
                    {!isMine && (
                        <span className="text-[10px] text-gray-400 block mb-1 font-semibold tracking-wide uppercase">
                            {message.username}
                        </span>
                    )}
                    {message.text}
                </div>
            </div>
            <span className={clsx(
                "text-[10px] text-gray-400 mt-1 mx-1",
                isMine ? "text-right" : "text-left"
            )}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </motion.div>
    );
};

export default MessageBubble;
