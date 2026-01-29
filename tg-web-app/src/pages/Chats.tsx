import React from 'react';
import { Link } from 'react-router-dom';
import { getPresetChats } from '../services/mockApi';
import './Chats.css';

const partyBanner = {
  title: 'FTMI Halloween Party 2026',
  date: '31 октября 2026, 21:00',
  cover: '/placeholders/party-banner.jpeg'
};

const partyCards = [
  {
    title: 'Rooftop Vinyl Night',
    date: '07 ноября 2026, 20:00',
    cover: '/placeholders/party1.jpeg'
  },
  {
    title: 'Boardgames & Matcha',
    date: '10 ноября 2026, 18:30',
    cover: '/placeholders/party2.jpeg'
  },
  {
    title: 'Karaoke Blind Dates',
    date: '15 ноября 2026, 19:00',
    cover: '/placeholders/party3.jpeg'
  },
  {
    title: 'Brunch & Art Walk',
    date: '24 ноября 2026, 12:00',
    cover: '/placeholders/party4.jpeg'
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
        <div className="party-card party-featured">
          <img className="party-img" src={partyBanner.cover} alt={partyBanner.title} />
          <div className="party-overlay" />
          <div className="party-content">
            <div className="party-date">{partyBanner.date}</div>
            <div className="party-title">{partyBanner.title}</div>
          </div>
        </div>

        {partyCards.map((party) => (
          <div key={party.title} className="party-card">
            <img className="party-img" src={party.cover} alt={party.title} />
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
