import React from 'react';
import './Community.css';

const Community: React.FC = () => {
  return (
    <div className="community">
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
  );
};

export default Community;
