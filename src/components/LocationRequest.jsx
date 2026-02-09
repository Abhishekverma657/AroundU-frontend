import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Navigation } from 'lucide-react';

const LocationRequest = () => {
    const { registerLocation, updateProfile, startMatching, error } = useSocket();
    const [step, setStep] = useState(1); // 1: Location, 2: Profile
    const [radius, setRadius] = useState(1000);
    const [loading, setLoading] = useState(false);
    const [geoError, setGeoError] = useState(null);

    // Profile State
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('MALE');
    const [interest, setInterest] = useState('FEMALE');

    const handleLocationSubmit = () => {
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
                registerLocation(Number(latitude.toFixed(3)), Number(longitude.toFixed(3)), radius);
                setStep(2);
                setLoading(false);
            },
            (err) => {
                setGeoError('Please enable location access.');
                setLoading(false);
                console.error(err);
            }
        );
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        if (!username.trim()) return;
        updateProfile(username, gender, interest);
        startMatching();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-4 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-md bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(79,70,229,0.15)] overflow-hidden"
            >
                <div className="bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-800 p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_80%)] opacity-60"></div>
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="relative z-10"
                    >
                        <h1 className="text-4xl font-extrabold mb-1 tracking-tight text-white">AroundU</h1>
                        <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Anonymous Chat Network</p>
                    </motion.div>
                </div>

                <div className="p-8 space-y-8">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 text-center">Search Radius</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[500, 1000, 5000].map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => setRadius(r)}
                                                className={`py-4 rounded-2xl text-sm font-bold transition-all duration-300 border-2 ${radius === r
                                                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-105'
                                                    : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'
                                                    }`}
                                            >
                                                {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-5 flex items-start gap-4">
                                    <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
                                        <Navigation className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-sm text-indigo-900/80 font-semibold leading-relaxed">
                                        Connecting you with nearby users. Your location is completely private.
                                    </p>
                                </div>

                                {geoError && <p className="text-rose-600 text-[11px] text-center font-bold bg-rose-50 py-3 rounded-xl border border-rose-100 uppercase tracking-wider">{geoError}</p>}

                                <button
                                    onClick={handleLocationSubmit}
                                    disabled={loading}
                                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                                        <>
                                            Explore Nearby
                                            <MapPin size={18} />
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                onSubmit={handleProfileSubmit}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Your Nickname</label>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-slate-300"
                                        placeholder="Enter name..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Identity</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['MALE', 'FEMALE'].map((g) => (
                                            <button
                                                key={g}
                                                type="button"
                                                onClick={() => setGender(g)}
                                                className={`py-4 rounded-2xl border-2 text-sm font-bold transition-all ${gender === g
                                                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl'
                                                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                            >
                                                {g === 'MALE' ? 'Male' : 'Female'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Match Preference</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['MALE', 'FEMALE', 'ANY'].map((i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setInterest(i)}
                                                className={`py-3.5 rounded-xl border-2 text-xs font-bold transition-all ${interest === i
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                                                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                            >
                                                {i === 'ANY' ? 'Both' : i === 'MALE' ? 'Male' : 'Female'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-4 py-5 bg-linear-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:opacity-95 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 group"
                                >
                                    Start Chatting
                                    <Users size={18} />
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default LocationRequest;
