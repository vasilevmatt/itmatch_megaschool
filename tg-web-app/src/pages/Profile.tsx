import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useTelegram } from '../contexts/TelegramContext';
import PhotoUpload from '../components/PhotoUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { getMatches, getCachedCandidates } from '../services/mockApi';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, updateUser, loading } = useUser();
  const { webApp, user: telegramUser } = useTelegram();
  const navigate = useNavigate();
  const [matchesCount, setMatchesCount] = useState(0);
  const [discoverPool, setDiscoverPool] = useState(0);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    age: user?.age || 18,
    bio: user?.bio || '',
    photos: user?.photos || [],
    preferences: user?.preferences || {
      minAge: 18,
      maxAge: 50,
      maxDistance: 50
    }
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const handlePhotosChange = (photos: string[]) => {
    setFormData(prev => ({
      ...prev,
      photos
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateUser(formData);
      setEditing(false);
      webApp?.HapticFeedback.notificationOccurred('success');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      webApp?.HapticFeedback.notificationOccurred('error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      age: user?.age || 18,
      bio: user?.bio || '',
      photos: user?.photos || [],
      preferences: user?.preferences || {
        minAge: 18,
        maxAge: 50,
        maxDistance: 50
      }
    });
    setEditing(false);
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (telegramUser?.id) {
        const matches = await getMatches(telegramUser.id);
        setMatchesCount(matches.length);
      }
      const pool = getCachedCandidates(50);
      setDiscoverPool(pool.length);
    };
    bootstrap();
  }, [telegramUser]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="profile empty-state">
        <div className="profile-hero">
          <div className="hero-icon">👋</div>
          <h1>Профиль ещё не создан</h1>
          <p>Заполните несколько полей и начните свайпить уже через минуту.</p>
          <div className="empty-actions">
            <button className="btn btn-primary" onClick={() => navigate('/setup')}>
              Создать профиль
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Мой профиль</h1>
        {!editing && (
          <button 
            className="btn btn-secondary"
            onClick={() => setEditing(true)}
          >
            Редактировать
          </button>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-photos">
          <h3>Фото</h3>
          {editing ? (
            <PhotoUpload
              photos={formData.photos}
              onChange={handlePhotosChange}
              maxPhotos={6}
            />
          ) : (
            <div className="photos-grid">
              {user.photos.map((photo, index) => (
                <div key={index} className="photo-item">
                  <img src={photo} alt={`Фото ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="profile-info">
          <div className="info-section">
            <h3>Основная информация</h3>
            
            <div className="form-group">
              <label>Имя</label>
              <input
                type="text"
                value={`${user.firstName} ${user.lastName || ''}`}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Возраст</label>
              <input
                type="number"
                min="18"
                max="100"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>О себе</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Напишите немного о себе..."
                maxLength={500}
                rows={4}
                disabled={!editing}
              />
              {editing && <small>{formData.bio.length}/500</small>}
            </div>
          </div>

          <div className="info-section">
            <h3>Предпочтения</h3>
            
            <div className="form-group">
              <label>Минимальный возраст</label>
              {editing ? (
                <input
                  type="number"
                  min="16"
                  max={formData.preferences.maxAge}
                  value={formData.preferences.minAge}
                  onChange={(e) => handlePreferenceChange('minAge', parseInt(e.target.value))}
                />
              ) : (
                <input type="text" value={formData.preferences.minAge} disabled />
              )}
            </div>

            <div className="form-group">
              <label>Максимальный возраст</label>
              {editing ? (
                <input
                  type="number"
                  min={formData.preferences.minAge}
                  max="35"
                  value={formData.preferences.maxAge}
                  onChange={(e) => handlePreferenceChange('maxAge', parseInt(e.target.value))}
                />
              ) : (
                <input type="text" value={formData.preferences.maxAge} disabled />
              )}
            </div>

            <div className="form-group">
              <label>Максимальное расстояние (км)</label>
              {editing ? (
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.preferences.maxDistance}
                  onChange={(e) => handlePreferenceChange('maxDistance', parseInt(e.target.value))}
                />
              ) : (
                <input type="text" value={`${formData.preferences.maxDistance} км`} disabled />
              )}
            </div>
          </div>

          <div className="info-section grid">
            <div className="metric-card">
              <div className="metric-label">Совпадений</div>
              <div className="metric-value">{matchesCount}</div>
              <div className="metric-hint">Всего матчей</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Кандидаты</div>
              <div className="metric-value">{discoverPool}</div>
              <div className="metric-hint">Доступно в ленте</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Активность</div>
              <div className="metric-value">Онлайн</div>
              <div className="metric-hint">Последние 5 мин</div>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <div className="profile-actions">
          <button 
            className="btn btn-secondary" 
            onClick={handleCancel}
            disabled={saving}
          >
            Отмена
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
