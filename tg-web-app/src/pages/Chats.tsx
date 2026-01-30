import React from 'react';
import { Link } from 'react-router-dom';
import { getPresetChats } from '../services/mockApi';
import './Chats.css';

const partyBanner = {
  title: 'Speed Meeting Quest',
  date: 'Каждый четверг, 19:00',
  cover: '/placeholders/game-banner.jpg'
};

const partyCards = [
  {
    title: 'Icebreaker Bingo',
    date: 'Пятница, 18:00',
    cover: '/placeholders/game1.jpg'
  },
  {
    title: 'Spyfall Night',
    date: 'Среда, 19:30',
    cover: '/placeholders/game2.jpg'
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
        <h2>Мои игры</h2>
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
