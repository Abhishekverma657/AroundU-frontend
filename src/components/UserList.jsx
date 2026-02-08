import React, { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, RefreshCw, MessageCircle, AlertCircle } from 'lucide-react';

const UserList = () => {
    const { nearbyUsers, getNearbyUsers, requestChat, incomingRequest, user, respondToChat, isRegistered } = useSocket();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isRegistered) {
            getNearbyUsers();
        }
    }, [isRegistered, getNearbyUsers]);

    const handleRefresh = () => {
        setLoading(true);
        getNearbyUsers();
        setTimeout(() => setLoading(false), 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">

            {/* Header */}
            <header className="flex justify-between items-center mb-6 max-w-2xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Available Users</h1>
                    <p className="text-sm text-gray-500">Tap a user to start chatting</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className={`p-2 bg-white rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-blue-600 transition-all ${loading ? 'animate-spin' : ''}`}
                >
                    <RefreshCw size={20} />
                </button>
            </header>

            {/* User List */}
            <div className="max-w-2xl mx-auto space-y-3">
                <AnimatePresence>
                    {nearbyUsers.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white p-8 rounded-xl shadow-sm text-center border border-dashed border-gray-300"
                        >
                            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">No users found nearby</h3>
                            <p className="text-gray-500 mt-1">Try increasing your radius or wait for others to join.</p>
                        </motion.div>
                    ) : (
                        nearbyUsers.map((u) => (
                            <motion.div
                                key={u.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={() => requestChat(u.id)}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-blue-200 transition-all active:scale-[0.99] group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                        {u.avatar}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{u.username}</h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-md font-medium">Available</span>
                                            <span>•</span>
                                            <span>{u.distance < 1000 ? `${u.distance}m` : `${(u.distance / 1000).toFixed(1)}km`} away</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2 bg-gray-50 rounded-full text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    <MessageCircle size={20} />
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Incoming Request Modal */}
            <AnimatePresence>
                {incomingRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                        >
                            <div className="bg-blue-600 p-4 text-white text-center">
                                <h2 className="text-lg font-bold">Incoming Request</h2>
                            </div>
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-2xl mb-4 text-blue-600 font-bold">
                                    {incomingRequest.from.avatar}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{incomingRequest.from.username}</h3>
                                <p className="text-gray-500 text-sm mb-6">Wants to chat with you!</p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => respondToChat(incomingRequest.from.id, false)}
                                        className="flex-1 py-3 text-red-600 font-medium bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={() => respondToChat(incomingRequest.from.id, true)}
                                        className="flex-1 py-3 text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                                    >
                                        Accept
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserList;
