import React from 'react';
import { Banner, Button, Image } from '@telegram-apps/telegram-ui';
import './Community.css';

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

const Community: React.FC = () => {
  return (
    <>
      <Banner
        before={<Image size={48} src="https://avatars.githubusercontent.com/u/84640980?v=4" />}
        callout="Уведомление"
        description="Прими участие в нашем новом формате скоростных свиданий и найди свою пару за несколько минут!"
        header="Speed dating"
        onCloseIcon={() => {}}
        type="inline"
      >
        <>
          <Button size="s">Участвовать</Button>
          <Button mode="plain" size="s">Позже</Button>
        </>
      </Banner>
    <div className="community">
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
      <div className="community-hero">
        <div className="community-icon">🧑‍🤝‍🧑</div>
        <h1>Коммьюнити</h1>
        <p>Скоро здесь появятся тематические комнаты, ивенты и подборки лучших профилей.</p>
      </div>
      <div className="community-card">
        <h3>Что будет доступно</h3>
        <ul>
          <li>🗣️ Чаты по интересам</li>
          <li>🎉 Рассылки о ближайших мероприятиях</li>
          <li>🏆 Подборки недели</li>
        </ul>
        <p className="community-hint">Пока что это предзапуск — оставайтесь на связи!</p>
      </div>
    </div>
    </>
  );
};

export default Community;
