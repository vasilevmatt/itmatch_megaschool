import React from 'react';
import './SwipeCard.css';
import { type Candidate, getPlaceholderAvatar } from '../services/mockApi';

interface SwipeCardProps {
  candidate: Candidate;
  onSwipe: (liked: boolean) => void;
  disabled?: boolean;
  swipeDirection?: 'left' | 'right' | null;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ candidate, onSwipe, disabled, swipeDirection }) => {
  const photo = candidate.photos?.[0] || getPlaceholderAvatar();
  let touchStartX = 0;
  let touchStartY = 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (disabled) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      onSwipe(dx > 0);
    }
  };

  return (
    <div
      className={`swipe-card ${disabled ? 'swipe-card--disabled' : ''} ${swipeDirection ? `swipe-card--${swipeDirection}` : ''}`}
      onDoubleClick={() => !disabled && onSwipe(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="presentation"
    >
      <img className="swipe-card__img" src={photo} alt={candidate.firstName} />
      {swipeDirection === 'right' && (
        <div className="swipe-card__badge-float like">❤️</div>
      )}
      {swipeDirection === 'left' && (
        <div className="swipe-card__badge-float dislike">✖</div>
      )}
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
          <span>📚 {Math.floor(Math.random() * 4) + 1} курс</span>
          <span>⚡ {candidate.photos.length % 2 ? 'ФТМИ' : "ТИНТ"}</span>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
