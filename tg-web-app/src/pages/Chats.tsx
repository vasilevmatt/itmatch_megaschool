import React from 'react';
import { Link } from 'react-router-dom';
import { getPresetChats } from '../services/mockApi';
import './Chats.css';

const partyBanner = {
  title: 'FTMI Halloween Party 2026',
  date: '31 октября 2026, 21:00',
  cover: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=1200&q=80'
};

const partyCards = [
  {
    title: 'Rooftop Vinyl Night',
    date: '07 ноября 2026, 20:00',
    cover: 'https://images.unsplash.com/photo-1478144592103-25e218a04891?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Boardgames & Matcha',
    date: '10 ноября 2026, 18:30',
    cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Karaoke Blind Dates',
    date: '15 ноября 2026, 19:00',
    cover: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Brunch & Art Walk',
    date: '24 ноября 2026, 12:00',
    cover: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80'
  },
];

const Chats: React.FC = () => {
  const chats = getPresetChats();

  return (
    <div className="chats">
      <div className="chats-header">
        <h1>Чаты</h1>
        <span className="chats-count">{chats.length}</span>
      </div>

      <div className="chats-list">
        {chats.map((chat) => (
          <Link key={chat.id} to={`/chat/${chat.id}`} className="chat-row">
            <div className="chat-avatar">
              <img src={chat.user.photos[0]} alt={chat.user.firstName} />
              {chat.unread > 0 && <span className="chat-unread">{chat.unread}</span>}
            </div>

            <div className="chat-info">
              <div className="chat-name-row">
                <span className="chat-name">{chat.user.firstName}</span>
                <span className="chat-time">
                  {new Date(chat.updatedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="chat-last">{chat.lastMessage}</div>
            </div>

            <div className="chat-arrow">›</div>
          </Link>
        ))}
      </div>

      <div className="parties-header">
        <h2>Мои вечеринки</h2>
      </div>

      <div className="parties-grid">
        <div className="party-card party-featured" data-bg={partyBanner.cover}>
          <div className="party-overlay" />
          <div className="party-content">
            <div className="party-date">{partyBanner.date}</div>
            <div className="party-title">{partyBanner.title}</div>
          </div>
        </div>

        {partyCards.map((party) => (
          <div key={party.title} className="party-card" data-bg={party.cover}>
            <div className="party-overlay" />
            <div className="party-content">
              <div className="party-date">{party.date}</div>
              <div className="party-title">{party.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;
