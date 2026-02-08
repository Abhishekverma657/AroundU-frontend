import React from 'react';
import { SocketProvider, useSocket } from './contexts/SocketContext';
import LocationRequest from './components/LocationRequest';
import ChatWindow from './components/ChatWindow';
import UserList from './components/UserList';

const AppContent = () => {
  const { room, isConnected, error, isRegistered } = useSocket();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to server...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
          <h2 className="text-red-600 font-bold mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Navigation Logic:
  // 1. If in a room -> Show ChatWindow
  // 2. If registered (location set) but no room -> Show UserList
  // 3. Default -> Show LocationRequest

  if (room) {
    return <ChatWindow />;
  }

  if (isRegistered) {
    return <UserList />;
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
