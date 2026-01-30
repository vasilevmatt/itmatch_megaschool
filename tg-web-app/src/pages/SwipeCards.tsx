import React, { useState, useEffect } from 'react';
import { useTelegram } from '../contexts/TelegramContext';
import { useUser } from '../contexts/UserContext';
import SwipeCard from '../components/SwipeCard';
import { getCachedCandidates, swipeCandidate, type Candidate } from '../services/mockApi';
import './SwipeCards.css';
import { Button, Input } from '@telegram-apps/telegram-ui';

const SwipeCards: React.FC = () => {
  const { webApp, user: telegramUser } = useTelegram();
  const { user, updateUser } = useUser();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const loadLocalCandidates = () => {
    const data = getCachedCandidates(10).filter((c) => {
      if (!user?.preferences) return true;
      return c.age >= user.preferences.minAge && c.age <= user.preferences.maxAge;
    });
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

      <div className="swipe-actions">
        <Button size="l" mode="filled" onClick={() => handleSwipe(false)} disabled={swiping}>
          Нет
        </Button>
        <Button size="m" mode="bezeled" onClick={() => setFiltersOpen((v) => !v)}>
          Фильтры
        </Button>
        <Button size="l" mode="filled" onClick={() => handleSwipe(true)} disabled={swiping}>
          Лайк
        </Button>
      </div>

      {filtersOpen && (
        <div className="filters-panel">
          <div className="filters-header">
            <strong>Фильтры</strong>
            <Button size="s" mode="plain" onClick={() => setFiltersOpen(false)}>Закрыть</Button>
          </div>
          <label>
            <Input
              type="number"
              min="16"
              header='Мин. возраст'
              max={user?.preferences.maxAge || 35}
              value={user?.preferences.minAge ?? 16}
              onChange={(e) =>
                updateUser({
                  preferences: {
                    ...(user?.preferences ?? { maxAge: 30, maxDistance: 10, minAge: 16 }),
                    minAge: parseInt(e.target.value)
                  }
                }).then(loadLocalCandidates)
              }
            />
          </label>
          <label>
            <Input
              type="number"
              header='Макс. возраст'
              min={user?.preferences.minAge || 16}
              max="35"
              value={user?.preferences.maxAge ?? 30}
              onChange={(e) =>
                updateUser({
                  preferences: {
                    ...(user?.preferences ?? { minAge: 16, maxDistance: 10, maxAge: 30 }),
                    maxAge: parseInt(e.target.value)
                  }
                }).then(loadLocalCandidates)
              }
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default SwipeCards;
