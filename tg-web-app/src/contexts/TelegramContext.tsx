import React, { createContext, useContext, useEffect, useState } from 'react';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: {
    isVisible: boolean;
    show(): void;
    hide(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive?: boolean): void;
    hideProgress(): void;
    setParams(params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }): void;
  };
  HapticFeedback: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
    selectionChanged(): void;
  };
  expand(): void;
  close(): void;
  ready(): void;
  sendData(data: string): void;
  showAlert?(message: string): void;
  setHeaderColor?(color: string): void;
  setBackgroundColor?(color: string): void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  isReady: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  isReady: false
});

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};

interface TelegramProviderProps {
  children: React.ReactNode;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({ children }) => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      tg.ready();
      tg.expand();

      setWebApp(tg);
      setUser(tg.initDataUnsafe.user || null);
      setIsReady(true);

      const theme = {
        bg: tg.themeParams.bg_color || '#ffffff',
        text: tg.themeParams.text_color || '#0f172a',
        hint: tg.themeParams.hint_color || '#8b98a5',
        link: tg.themeParams.link_color || '#2481cc',
        button: tg.themeParams.button_color || '#2481cc',
        buttonText: tg.themeParams.button_text_color || '#ffffff',
        secondaryBg: (tg.themeParams.bg_color && `${tg.themeParams.bg_color}E6`) || '#f4f6fb',
        separator: '#e5e5e5'
      };

      document.documentElement.style.setProperty('--tg-theme-bg-color', theme.bg);
      document.documentElement.style.setProperty('--tg-theme-text-color', theme.text);
      document.documentElement.style.setProperty('--tg-theme-hint-color', theme.hint);
      document.documentElement.style.setProperty('--tg-theme-link-color', theme.link);
      document.documentElement.style.setProperty('--tg-theme-button-color', theme.button);
      document.documentElement.style.setProperty('--tg-theme-button-text-color', theme.buttonText);
      document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', theme.secondaryBg);
      document.documentElement.style.setProperty('--tg-theme-section-separator-color', theme.separator);

      document.body.style.backgroundColor = theme.bg;

      if (typeof tg.setHeaderColor === 'function') {
        tg.setHeaderColor('bg_color');
      }
      if (typeof tg.setBackgroundColor === 'function') {
        tg.setBackgroundColor(theme.bg);
      }
    } else {
      console.warn('Telegram WebApp не найден. Работаем в режиме разработки.');
      // Мок-данные для разработки
      setUser({
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser'
      });
      setIsReady(true);

      document.documentElement.style.setProperty('--tg-theme-bg-color', '#f4f6fb');
      document.documentElement.style.setProperty('--tg-theme-text-color', '#0f172a');
      document.documentElement.style.setProperty('--tg-theme-hint-color', '#8b98a5');
      document.documentElement.style.setProperty('--tg-theme-link-color', '#2481cc');
      document.documentElement.style.setProperty('--tg-theme-button-color', '#7366ff');
      document.documentElement.style.setProperty('--tg-theme-button-text-color', '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-section-separator-color', '#e5e5e5');
      document.body.style.backgroundColor = '#f4f6fb';
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ webApp, user, isReady }}>
      {children}
    </TelegramContext.Provider>
  );
};
