import React from 'react';
import './MessageBubble.css';

interface Message {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName?: string;
    photos: string[];
  };
  content: string;
  type: 'text' | 'image' | 'gif';
  isRead: boolean;
  createdAt: string;
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, showAvatar = true }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
      {isOwn && (
        <div className="sender-avatar sender-avatar--spacer" />
      )}
      {!isOwn && (
        showAvatar ? (
          <div className="sender-avatar">
            <img 
              src={message.sender.photos[0] || '/placeholders/avatar.jpg'} 
              alt={message.sender.firstName}
            />
          </div>
        ) : (
          <div className="sender-avatar sender-avatar--spacer" />
        )
      )}
      
      <div className="message-content">
        {message.type === 'text' && (
          <div className="message-text">
            {message.content}
          </div>
        )}
        
        {message.type === 'image' && (
          <div className="message-image">
            <img src={message.content} alt="Изображение" />
          </div>
        )}
        
        <div className="message-meta">
          <span className="message-time">
            {formatTime(message.createdAt)}
          </span>
          {isOwn && (
            <span className={`message-status ${message.isRead ? 'read' : 'sent'}`}>
              {message.isRead ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
