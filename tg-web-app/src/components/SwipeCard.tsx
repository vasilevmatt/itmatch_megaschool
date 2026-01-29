import React from 'react';
import './SwipeCard.css';
import { type Candidate, getPlaceholderAvatar } from '../services/mockApi';

interface SwipeCardProps {
  candidate: Candidate;
  onSwipe: (liked: boolean) => void;
  disabled?: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ candidate, onSwipe, disabled }) => {
  const photo = candidate.photos?.[0] || getPlaceholderAvatar();

  return (
    <div
      className={`swipe-card ${disabled ? 'swipe-card--disabled' : ''}`}
      style={{ backgroundImage: `url(${photo})` }}
      onDoubleClick={() => !disabled && onSwipe(true)}
      role="presentation"
    >
      <div className="swipe-card__overlay" />
      <div className="swipe-card__info">
        <div className="swipe-card__title">
          <div>
            <h3>{candidate.firstName} {candidate.lastName}</h3>
            <span className="swipe-card__age">{candidate.age} лет</span>
          </div>
          <span className="swipe-card__badge">Swipe</span>
        </div>
        {candidate.bio && (
          <p className="swipe-card__bio">{candidate.bio}</p>
        )}
        <div className="swipe-card__meta">
          <span>📸 {candidate.photos.length} фото</span>
          <span>⚡ Двойной тап = лайк</span>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
