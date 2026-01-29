import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const isActive = (paths: string[]) => {
    return paths.some((p) =>
      p.endsWith('*')
        ? location.pathname.startsWith(p.replace('*', ''))
        : location.pathname === p
    );
  };

  return (
    <nav className="bottom-navigation">
      <Link 
        to="/chats" 
        className={`nav-item ${isActive(['/chats', '/chat/*']) ? 'active' : ''}`}
      >
        <span className="nav-icon">💬</span>
        <span className="nav-label">Чаты</span>
      </Link>
      
      <Link 
        to="/community" 
        className={`nav-item ${isActive(['/community']) ? 'active' : ''}`}
      >
        <span className="nav-icon">🧑‍🤝‍🧑</span>
        <span className="nav-label">Коммьюнити</span>
      </Link>
      
      <Link 
        to="/swipe" 
        className={`nav-item ${isActive(['/swipe']) ? 'active' : ''}`}
      >
        <span className="nav-icon">💖</span>
        <span className="nav-label">Свайпы</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={`nav-item ${isActive(['/profile']) ? 'active' : ''}`}
      >
        <span className="nav-icon">👤</span>
        <span className="nav-label">Мой профиль</span>
      </Link>
    </nav>
  );
};

export default BottomNavigation;
