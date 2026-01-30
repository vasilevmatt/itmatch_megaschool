import React, { useState, useEffect } from 'react';
import { useTelegram } from '../contexts/TelegramContext';
import { useUser } from '../contexts/UserContext';
import SwipeCard from '../components/SwipeCard';
import { getCachedCandidates, swipeCandidate, type Candidate } from '../services/mockApi';
import './SwipeCards.css';

const SwipeCards: React.FC = () => {
  const { webApp, user: telegramUser } = useTelegram();
  const { user } = useUser();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showHint, setShowHint] = useState(true);

  const loadLocalCandidates = () => {
    const data = getCachedCandidates(10);
    setCandidates(data);
    setCurrentIndex(0);
  };

  const handleSwipe = async (liked: boolean) => {
    if (swiping || currentIndex >= candidates.length) return;

    setSwiping(true);
    setSwipeDirection(liked ? 'right' : 'left');
    const currentCandidate = candidates[currentIndex];

    // Дождёмся анимации, затем сдвинем стек
    setTimeout(async () => {
      try {
        const result = await swipeCandidate(telegramUser?.id, currentCandidate._id, liked);
        
        if (result.matched) {
          webApp?.HapticFeedback.notificationOccurred('success');
          alert('🎉 Поздравляем! У вас новый матч!');
        } else {
          webApp?.HapticFeedback.impactOccurred('light');
        }
        
        setCurrentIndex(prev => prev + 1);
        setShowHint(false);
        
        if (currentIndex >= candidates.length - 3) {
          loadLocalCandidates();
        }
      } catch (error) {
        console.error('Ошибка свайпа:', error);
        webApp?.HapticFeedback.notificationOccurred('error');
      } finally {
        setSwipeDirection(null);
        setSwiping(false);
      }
    }, 280);
  };

  useEffect(() => {
    loadLocalCandidates();
  }, [user, telegramUser]);

  if (candidates.length === 0 || currentIndex >= candidates.length) {
    return (
      <div className="swipe-cards">
        <div className="no-candidates">
          <div className="no-candidates-icon">🔍</div>
          <h2>Никого не найдено</h2>
          <p>Попробуйте расширить параметры поиска в настройках</p>
          <button 
            className="btn btn-primary" 
            onClick={loadLocalCandidates}
          >
            Обновить
          </button>
        </div>
      </div>
    );
  }

  const currentCandidate = candidates[currentIndex];

  return (
    <div className="swipe-cards">
      {showHint && (
        <div className="swipe-hint">
          <span>Свайпайте влево / вправо, чтобы выбирать</span>
          <div className="swipe-hint-arrows">← →</div>
        </div>
      )}
      <div className="cards-container">
        <SwipeCard
          candidate={currentCandidate}
          onSwipe={handleSwipe}
          disabled={swiping}
          swipeDirection={swipeDirection}
        />
        
        {/* Показываем следующую карточку сзади */}
        {currentIndex + 1 < candidates.length && (
          <div className="next-card">
            <SwipeCard
              candidate={candidates[currentIndex + 1]}
              onSwipe={() => {}}
              disabled={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeCards;
