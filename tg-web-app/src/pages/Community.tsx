import React from 'react';
import { Banner, Button, Image } from '@telegram-apps/telegram-ui';
import { useNavigate } from 'react-router-dom';
import { communityEvents } from '../data/events';
import './Community.css';

const Community: React.FC = () => {
  const navigate = useNavigate();

  const featured = communityEvents[0];
  const rest = communityEvents.slice(1);

  return (
    <>
      <Banner
        before={<Image size={48} src="https://avatars.githubusercontent.com/u/84640980?v=4" />}
        callout="Новое"
        description="Прими участие в нашем оффлайн формате скоростных свиданий и найди свою пару за несколько минут!"
        header="Speed dating"
        onCloseIcon={() => {}}
        type="inline"
      >
        <>
          <Button size="s" onClick={() => navigate(`/events/${featured.slug}`)}>Участвовать</Button>
          <Button mode="plain" size="s">Позже</Button>
        </>
      </Banner>
    <div className="community">
      <div className="parties-header">
        <h2>Мои вечеринки</h2>
      </div>

      <div className="parties-grid">
        <div className="party-card party-featured" onClick={() => navigate(`/events/${featured.slug}`)}>
          <img className="party-img" src={featured.cover} alt={featured.title} />
          <div className="party-overlay" />
          <div className="party-content">
            <div className="party-date">{featured.date}</div>
            <div className="party-title">{featured.title}</div>
          </div>
        </div>

        {rest.map((party) => (
          <div key={party.title} className="party-card" onClick={() => navigate(`/events/${party.slug}`)}>
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
        <p>Скоро здесь появятся тематические комнаты, бизнес-связи и подборки лучших профилей.</p>
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
