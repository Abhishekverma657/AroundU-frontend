"use client";
import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useSocket } from '../contexts/SocketContext';

const MessageBubble = ({ message, isMine }) => {
    if (message.type === 'system') {
        return (
            <div className="flex justify-center my-8">
                <span className="bg-slate-100/60 backdrop-blur-md text-slate-500 text-[10px] px-6 py-2 rounded-full uppercase tracking-[0.2em] font-bold border border-slate-200/50 shadow-sm">
                    {message.text}
                </span>
            </div>
        );
    }

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className={clsx(
                "flex flex-col mb-4 max-w-[85%] md:max-w-[80%]",
                isMine ? "ml-auto items-end" : "mr-auto items-start"
            )}
        >
            <div className={clsx(
                "flex items-end gap-3",
                isMine ? "flex-row-reverse" : "flex-row"
            )}>
                {!isMine && (
                    <div className="w-11 h-11 rounded-[1.2rem] bg-linear-to-br from-indigo-500 via-indigo-600 to-violet-700 flex items-center justify-center text-sm text-white font-extrabold shadow-lg flex-shrink-0 select-none border-2 border-white uppercase transition-all hover:scale-110">
                        {message.username.charAt(0)}
                    </div>
                )}

                <div
                    className={clsx(
                        "px-6 py-3.5 rounded-[1.8rem] text-[15px] leading-relaxed break-words relative transition-shadow duration-300",
                        isMine
                            ? "bg-indigo-600 text-white rounded-br-none shadow-[0_15px_30px_-10px_rgba(79,70,229,0.3)] font-bold"
                            : "bg-white text-slate-900 border border-slate-100 rounded-bl-none shadow-[0_10px_20px_-10px_rgba(0,0,0,0.05)] font-medium"
                    )}
                >
                    {!isMine && (
                        <span className="text-[9px] text-indigo-500 block mb-1 font-bold tracking-[0.15em] uppercase opacity-80">
                            {message.username}
                        </span>
                    )}
                    <span className="whitespace-pre-wrap">{message.text}</span>
                </div>
            </div>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={clsx(
                    "text-[9px] text-slate-300 mt-2 font-bold tracking-widest uppercase",
                    isMine ? "mr-1" : "ml-14"
                )}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </motion.span>
        </motion.div>
    );
};

export default MessageBubble;
