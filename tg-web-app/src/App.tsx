import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TelegramProvider } from './contexts/TelegramContext';
import { UserProvider, useUser } from './contexts/UserContext';
import ProfileSetup from './pages/ProfileSetup';
import SwipeCards from './pages/SwipeCards';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Chats from './pages/Chats';
import EventDetail from './pages/EventDetail';
import BottomNavigation from './components/BottomNavigation';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

const AppContent: React.FC = () => {
  const { user, loading } = useUser();
  const hasProfile = Boolean(user);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/" 
            element={
              hasProfile ? <Navigate to="/swipe" replace /> : <Navigate to="/setup" replace />
            } 
          />
          <Route path="/setup" element={<ProfileSetup onComplete={() => {}} />} />
          <Route path="/community" element={<Community />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/matches" element={<Navigate to="/chats" replace />} />
          <Route path="/swipe" element={<SwipeCards />} />
          <Route path="/chat/:matchId" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events/:slug" element={<EventDetail />} />
        </Routes>
        
        <BottomNavigation />
      </div>
    </Router>
  );
};

function App() {
  return (
    <TelegramProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </TelegramProvider>
  );
}

export default App;
