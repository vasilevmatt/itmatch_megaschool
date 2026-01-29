import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTelegram } from './TelegramContext';
import {
  getProfile,
  saveProfile,
  type UserProfile,
} from '../services/mockApi';

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateUser: (userData: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  updateUser: async () => {},
  refreshUser: async () => {}
});

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: telegramUser, isReady } = useTelegram();

  const fetchUser = async () => {
    if (!telegramUser?.id) {
      setUser(null);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const profile = await getProfile(telegramUser);
      setUser(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: Partial<UserProfile>) => {
    if (!telegramUser?.id) return;
    
    try {
      setError(null);
      const updatedUser = await saveProfile(telegramUser, {
        telegramId: telegramUser.id,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
        ...userData
      });
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      throw err;
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  useEffect(() => {
    if (isReady && telegramUser) {
      fetchUser();
    } else if (isReady && !telegramUser) {
      // Телеграм готов, но user не пришёл — работаем без профиля
      setUser(null);
      setLoading(false);
    }
  }, [isReady, telegramUser]);

  return (
    <UserContext.Provider value={{ user, loading, error, updateUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};
