import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allEvents } from '../data/events';
import './EventDetail.css';
import { useEffect } from 'react';

const EventDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const event = allEvents.find((e) => e.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [slug]);

  if (!event) {
    return (
      <div className="event-detail-page">
        <h1>Событие не найдено</h1>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Назад</button>
      </div>
    );
  }

  return (
    <div className="event-detail-page">
      <div className="event-shell">
        <div className="event-cover" style={{ backgroundImage: `url(${event.cover})` }}>
          <div className="event-cover__gradient" />
          <div className="event-cover__tag">{event.tag}</div>
          <div className="event-cover__title">{event.title}</div>
          <button className="event-cover__back" onClick={() => navigate(-1)} aria-label="Назад">←</button>
        </div>

        <div className="event-body">
          <div className="event-title-row">
            <div className="event-date">{event.date}</div>
            <div className="event-location">📍 {event.location}</div>
          </div>

          <p className="event-description">{event.description}</p>

          <div className="event-agenda">
            <h3>Программа</h3>
            <ul>
              {event.agenda.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="event-actions">
            <button className="btn btn-primary">Забронировать слот</button>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Назад</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
