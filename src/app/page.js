"use client";

import React from 'react';
import { SocketProvider, useSocket } from '../contexts/SocketContext';
import LocationRequest from '../components/LocationRequest';
import ChatWindow from '../components/ChatWindow';
import UserList from '../components/UserList';

const AppContent = () => {
  const { room, isConnected, error, isRegistered, startMatching } = useSocket();

  // Auto trigger matching when registered but not in a room
  React.useEffect(() => {
    if (isRegistered && !room && isConnected) {
      const timer = setTimeout(() => {
        startMatching();
      }, 1500); // 1.5s delay to make it feel natural
      return () => clearTimeout(timer);
    }
  }, [isRegistered, room, isConnected]);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-semibold tracking-tight">Connecting to network...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-rose-50 p-4">
        <div className="bg-white border border-rose-100 p-8 rounded-3xl shadow-xl max-w-sm text-center space-y-4">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h2 className="text-slate-900 font-bold text-xl tracking-tight">System Error</h2>
          <p className="text-slate-600 text-sm leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (room) {
    return <ChatWindow />;
  }

  if (isRegistered) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-4">
        <div className="w-full max-w-md text-center space-y-10">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-purple-100 border-b-purple-600 rounded-full animate-pulse mx-auto"></div>
            </div>
            <div className="absolute -top-2 -right-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest animate-bounce shadow-lg">
              Searching
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Finding someone...
            </h2>
            <p className="text-slate-500 text-sm font-medium">Looking for a partner matching your vibe.</p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => startMatching()}
              className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95 text-sm shadow-sm"
            >
              Still Searching? Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-slate-900 transition-colors"
            >
              Change My Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <LocationRequest />;
};

const App = () => {
  return (
    <SocketProvider>
      <AppContent />
    </SocketProvider>
  );
};

export default App;
