import React from 'react';

interface EntryAnimationProps {
  t: any;
  isEntryAnimating: boolean;
  shouldRenderEntry: boolean;
}

const EntryAnimation: React.FC<EntryAnimationProps> = ({
  t,
  isEntryAnimating,
  shouldRenderEntry
}) => {
  if (!shouldRenderEntry) return null;

  return (
    <div
      className={`entry-animation-overlay ${!isEntryAnimating ? 'exit' : ''}`}
    >
      <div className="thematic-loading">
        <div className="bagua-spinner-container">
          <div className="bagua-spinner">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`trigram trigram-${i}`}
                style={{ '--i': i } as any}
              ></div>
            ))}
            <div className="bagua-center">
              <div className="taiji"></div>
            </div>
          </div>
          <div className="loading-glow"></div>
        </div>
        <div className="loading-text-container">
          <p className="loading-main-text">{t.openingBagua}</p>
          <p className="loading-sub-text">{t.traversingTime}</p>
        </div>
      </div>
    </div>
  );
};

export default EntryAnimation;
