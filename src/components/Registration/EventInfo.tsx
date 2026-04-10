import React from 'react';

interface EventInfoProps {
  t: any;
}

const EventInfo: React.FC<EventInfoProps> = ({ t }) => {
  return (
    <section className="event-info">
      <h2 className="section-title">{t.eventTitle}</h2>
      <p className="intro-p">{t.eventIntro}</p>
      <div className="info-grid">
        <div className="info-item">
          <strong>{t.itemPrice}</strong>
          <span>{t.itemPriceVal}</span>
        </div>
        <div className="info-item">
          <strong>{t.itemPlayers}</strong>
          <span>{t.itemPlayersVal}</span>
        </div>
        <div className="info-item">
          <strong>{t.itemTime}</strong>
          <span>{t.itemTimeVal}</span>
        </div>
        <div className="info-item">
          <strong>{t.itemContent}</strong>
          <span>{t.itemContentVal}</span>
        </div>
      </div>
    </section>
  );
};

export default EventInfo;
