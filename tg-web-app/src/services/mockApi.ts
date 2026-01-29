import type { TelegramUser } from '../contexts/TelegramContext';

export interface Candidate {
  _id: string;
  firstName: string;
  lastName?: string;
  username?: string;
  age: number;
  bio?: string;
  photos: string[];
}

export interface UserProfile extends Candidate {
  telegramId: number;
  preferences: {
    minAge: number;
    maxAge: number;
    maxDistance: number;
  };
  isActive: boolean;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchPreview {
  matchId: string;
  user: Candidate;
  matchedAt: string;
}

export interface ChatMessage {
  _id: string;
  sender: Candidate;
  content: string;
  type: 'text' | 'image' | 'gif';
  isRead: boolean;
  createdAt: string;
}

export interface SwipeResult {
  matched: boolean;
  matchId?: string;
}

export interface ChatPreview {
  id: string;
  user: Candidate;
  lastMessage: string;
  updatedAt: string;
  unread: number;
}

const STORAGE_KEYS = {
  user: 'demo_user_profile',
  candidates: 'demo_candidates',
  matches: 'demo_matches',
  messages: 'demo_messages',
} as const;

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80';

const BASE_CANDIDATES: Candidate[] = [
  {
    _id: 'cand_1',
    firstName: 'Аня',
    age: 25,
    bio: 'Бегаю марафоны, варю лучший раф и ищу спутника для путешествий.',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    _id: 'cand_2',
    firstName: 'Мария',
    age: 29,
    bio: 'Продакт, обожаю артхаус, крафтовое пиво и котов.',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    _id: 'cand_3',
    firstName: 'Катя',
    age: 22,
    bio: 'Дизайнер UX/UI, люблю выставки, плёночную фотографию и утренние пробежки.',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    _id: 'cand_4',
    firstName: 'Вика',
    age: 27,
    bio: 'Йога, книги и походы в горы. Ищу партнёра в crime & coffee.',
    photos: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    _id: 'cand_5',
    firstName: 'Саша',
    age: 24,
    bio: 'Фронтендер, катаюсь на борде, обожаю инди-музыку и тёплый ламповый свет.',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    ],
  },
];

const PRESET_CHATS: ChatPreview[] = [
  {
    id: 'chat_anya',
    user: BASE_CANDIDATES[0],
    lastMessage: 'Когда выберемся на кофе? ☕️',
    updatedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    unread: 2,
  },
  {
    id: 'chat_maria',
    user: BASE_CANDIDATES[1],
    lastMessage: 'Отправила плейлист, заценишь?',
    updatedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    unread: 0,
  },
  {
    id: 'chat_katya',
    user: BASE_CANDIDATES[2],
    lastMessage: 'В субботу будет выставка, пойдём?',
    updatedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    unread: 1,
  },
];

type MessageStore = Record<string, ChatMessage[]>;

const delay = (min = 120, max = 320) =>
  new Promise<void>((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min),
  );

const getStorage = <T>(key: string, fallback: T): T => {
  try {
    if (typeof window === 'undefined') {
      return fallback;
    }
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const setStorage = <T>(key: string, value: T) => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // noop for private / incognito mode
  }
};

const ensureCandidates = (): Candidate[] => {
  const stored = getStorage<Candidate[]>(STORAGE_KEYS.candidates, []);
  if (stored.length === 0) {
    setStorage(STORAGE_KEYS.candidates, BASE_CANDIDATES);
    return BASE_CANDIDATES;
  }
  return stored;
};

const ensurePresetMessages = () => {
  const store = getStorage<MessageStore>(STORAGE_KEYS.messages, {});
  const selfSender: Candidate = {
    _id: 'me',
    firstName: 'Вы',
    age: 0,
    photos: [DEFAULT_AVATAR],
    bio: '',
  };
  PRESET_CHATS.forEach((chat) => {
    if (!store[chat.id]) {
      const baseMessages: ChatMessage[] = [
        {
          _id: `${chat.id}_m1`,
          sender: chat.user,
          content: chat.lastMessage,
          type: 'text',
          isRead: false,
          createdAt: chat.updatedAt,
        },
        {
          _id: `${chat.id}_m0`,
          sender: chat.user,
          content: 'Привет! Нашла твоё письмо, оно было милым 😊',
          type: 'text',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        },
        {
          _id: `${chat.id}_me1`,
          sender: selfSender,
          content: 'Привет! Давай пересечёмся в субботу, я свободен после 15:00.',
          type: 'text',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        },
      ];
      store[chat.id] = baseMessages;
    }
  });
  setStorage(STORAGE_KEYS.messages, store);
  return store;
};

export const getProfile = async (
  telegramUser: TelegramUser | null,
): Promise<UserProfile | null> => {
  if (!telegramUser) return null;

  await delay();
  const stored = getStorage<UserProfile | null>(STORAGE_KEYS.user, null);
  if (!stored) {
    return null;
  }

  return {
    ...stored,
    lastSeen: stored.lastSeen || new Date().toISOString(),
    createdAt: stored.createdAt || new Date().toISOString(),
    updatedAt: stored.updatedAt || new Date().toISOString(),
  };
};

export const saveProfile = async (
  telegramUser: TelegramUser | null,
  payload: Partial<UserProfile>,
): Promise<UserProfile> => {
  if (!telegramUser) {
    throw new Error('Пользователь Telegram недоступен');
  }

  await delay();
  const now = new Date().toISOString();
  const current = getStorage<UserProfile | null>(STORAGE_KEYS.user, null);

  const baseProfile: UserProfile = {
    _id: telegramUser.id.toString(),
    telegramId: telegramUser.id,
    firstName: telegramUser.first_name ?? 'Гость',
    lastName: telegramUser.last_name,
    username: telegramUser.username,
    age: 18,
    bio: '',
    photos: [DEFAULT_AVATAR],
    preferences: {
      minAge: 18,
      maxAge: 50,
      maxDistance: 50,
    },
    isActive: true,
    lastSeen: now,
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
  };

  const nextProfile: UserProfile = {
    ...baseProfile,
    ...current,
    ...payload,
    lastSeen: now,
    updatedAt: now,
  };

  setStorage(STORAGE_KEYS.user, nextProfile);
  return nextProfile;
};

export const getCandidates = async (
  telegramId: number | undefined,
  limit = 10,
): Promise<Candidate[]> => {
  if (!telegramId) return [];
  await delay();

  const candidates = ensureCandidates();
  return candidates.slice(0, limit);
};

// Синхронно вернуть сохранённые анкеты без задержек/запросов
export const getCachedCandidates = (limit = 10): Candidate[] => {
  const candidates = ensureCandidates();
  return candidates.slice(0, limit);
};

export const getPresetChats = (): ChatPreview[] => {
  ensurePresetMessages();
  return PRESET_CHATS;
};

export const swipeCandidate = async (
  telegramId: number | undefined,
  targetUserId: string,
  liked: boolean,
): Promise<SwipeResult> => {
  if (!telegramId) return { matched: false };
  await delay();

  if (!liked) {
    return { matched: false };
  }

  const candidates = ensureCandidates();
  const target = candidates.find((candidate) => candidate._id === targetUserId);
  if (!target) return { matched: false };

  const matches = getStorage<MatchPreview[]>(STORAGE_KEYS.matches, []);
  const existing = matches.find((item) => item.matchId === targetUserId);

  if (!existing) {
    const newMatch: MatchPreview = {
      matchId: targetUserId,
      user: target,
      matchedAt: new Date().toISOString(),
    };
    setStorage(STORAGE_KEYS.matches, [...matches, newMatch]);
    seedMessagesForMatch(targetUserId, target);
  }

  return { matched: true, matchId: targetUserId };
};

export const getMatches = async (
  telegramId: number | undefined,
): Promise<MatchPreview[]> => {
  if (!telegramId) return [];
  await delay();
  return getStorage<MatchPreview[]>(STORAGE_KEYS.matches, []);
};

const seedMessagesForMatch = (matchId: string, matchUser: Candidate) => {
  const store = getStorage<MessageStore>(STORAGE_KEYS.messages, {});
  if (store[matchId]?.length) return;

  const welcomeMessage: ChatMessage = {
    _id: `msg_${Date.now()}`,
    sender: matchUser,
    content: 'Хей! Кажется, у нас есть совпадение ❤️',
    type: 'text',
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  store[matchId] = [welcomeMessage];
  setStorage(STORAGE_KEYS.messages, store);
};

export const getChatMessages = async (
  matchId: string | undefined,
  matchUser?: Candidate,
): Promise<ChatMessage[]> => {
  if (!matchId) return [];
  await delay();

  if (PRESET_CHATS.some((c) => c.id === matchId)) {
    const store = ensurePresetMessages();
    let messages = store[matchId];
    if (!messages || messages.length === 0) {
      // восстановить базовые сообщения, если были очищены
      setStorage(STORAGE_KEYS.messages, {});
      const refreshed = ensurePresetMessages();
      messages = refreshed[matchId];
    }
    return messages ?? [];
  }

  if (matchUser) {
    seedMessagesForMatch(matchId, matchUser);
  }

  const store = getStorage<MessageStore>(STORAGE_KEYS.messages, {});
  return store[matchId] ?? [];
};

export const sendChatMessage = async (
  telegramUser: TelegramUser | null,
  matchId: string | undefined,
  content: string,
): Promise<ChatMessage> => {
  if (!matchId) {
    throw new Error('Не хватает данных для отправки сообщения');
  }

  await delay();
  const profile = getStorage<UserProfile | null>(STORAGE_KEYS.user, null);
  const fallbackUser: TelegramUser = telegramUser || {
    id: 0,
    first_name: 'Вы',
  };
  const sender: Candidate = {
    _id: fallbackUser.id.toString(),
    firstName: profile?.firstName ?? fallbackUser.first_name ?? 'Вы',
    lastName: profile?.lastName ?? fallbackUser.last_name,
    username: profile?.username ?? fallbackUser.username,
    age: profile?.age ?? 0,
    bio: profile?.bio,
    photos: profile?.photos?.length ? profile.photos : [DEFAULT_AVATAR],
  };

  const store = ensurePresetMessages();
  const newMessage: ChatMessage = {
    _id: `msg_${Date.now()}`,
    sender,
    content,
    type: 'text',
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  const existing = store[matchId] ?? [];
  store[matchId] = [...existing, newMessage];
  setStorage(STORAGE_KEYS.messages, store);

  return newMessage;
};

export const getPlaceholderAvatar = () => DEFAULT_AVATAR;
