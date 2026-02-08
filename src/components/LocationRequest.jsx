import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Navigation } from 'lucide-react';

const LocationRequest = () => {
    const { registerLocation, error, isRegistered } = useSocket();
    const [radius, setRadius] = useState(1000); // meters
    const [loading, setLoading] = useState(false);
    const [geoError, setGeoError] = useState(null);

    const handleJoin = () => {
        setLoading(true);
        setGeoError(null);

        if (!navigator.geolocation) {
            setGeoError('Geolocation is not supported by your browser.');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Rounding for privacy as requested
                const lat = Number(latitude.toFixed(3));
                const lon = Number(longitude.toFixed(3));

                // Now we register location instead of joining room directly
                registerLocation(lat, lon, radius);
                // Loading state will be handled by parent switching to UserList
            },
            (err) => {
                setGeoError('Please enable location access to find nearby users.');
                setLoading(false);
                console.error(err);
            }
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
                    <div className="mx-auto bg-white/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3 backdrop-blur-sm">
                        <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold mb-1">AroundU</h1>
                    <p className="text-blue-100 text-sm">Find & Chat with Available Users</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Select Search Radius</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[500, 1000, 2000].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRadius(r)}
                                    className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 border ${radius === r
                                            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-500'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-800 flex items-start gap-3">
                        <Navigation className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
                        <p>We need your location to show available users near you. Valid for this session only.</p>
                    </div>

                    {geoError && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100"
                        >
                            {geoError}
                        </motion.div>
                    )}

                    <button
                        onClick={handleJoin}
                        disabled={loading}
                        className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold shadow-lg shadow-gray-900/10 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Scanning Area...
                            </>
                        ) : (
                            <>
                                <Users className="w-5 h-5" />
                                Find People
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        By continuing, you become visible to others in your selected range.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LocationRequest;
