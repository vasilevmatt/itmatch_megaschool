import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTelegram } from '../contexts/TelegramContext';
import LoadingSpinner from '../components/LoadingSpinner';
import MessageBubble from '../components/MessageBubble';
import {
  getChatMessages,
  getMatches,
  getPresetChats,
  sendChatMessage,
  type ChatMessage,
  type ChatPreview,
} from '../services/mockApi';
import './Chat.css';

const Chat: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { webApp, user: telegramUser } = useTelegram();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatPreview, setChatPreview] = useState<ChatPreview | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!matchId) return;
    
    try {
      const presets = getPresetChats();
      const presetChat = presets.find((c) => c.id === matchId);

      if (presetChat) {
        setChatPreview(presetChat);
        const data = await getChatMessages(matchId, presetChat.user);
        setMessages(data);
      } else {
        const matches = telegramUser?.id ? await getMatches(telegramUser.id) : [];
        const currentMatch = matches.find((item) => item.matchId === matchId);
        if (!currentMatch) {
          navigate('/chats');
          return;
        }

        setChatPreview({
          id: currentMatch.matchId,
          user: currentMatch.user,
          lastMessage: '',
          updatedAt: '',
          unread: 0,
        });
        const data = await getChatMessages(matchId, currentMatch.user);
        setMessages(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    
    try {
      const sentMessage = await sendChatMessage(
        telegramUser,
        matchId,
        newMessage.trim()
      );
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      webApp?.HapticFeedback.impactOccurred('light');
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      webApp?.HapticFeedback.notificationOccurred('error');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      await fetchMessages();
      setLoading(false);
    };
    
    initChat();
    
    // Настройка кнопки назад
    if (webApp) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => navigate('/matches'));
      
      return () => {
        webApp.BackButton.hide();
      };
    }
  }, [matchId, telegramUser, webApp, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="chat">
      {chatPreview && (
        <div className="chat-header">
          <div className="chat-peer">
            <div className="chat-avatar">
              <img src={chatPreview.user.photos[0]} alt={chatPreview.user.firstName} />
            </div>
            <div>
              <div className="chat-name">{chatPreview.user.firstName}</div>
              <div className="chat-subtitle">
                Последнее сообщение{' '}
                {new Date(chatPreview.updatedAt || Date.now()).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-icon">💬</div>
            <p>Начните общение!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isOwn={message.sender._id === telegramUser?.id?.toString()}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напишите сообщение..."
            rows={1}
            disabled={sending}
          />
          <button 
            className="send-btn"
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
