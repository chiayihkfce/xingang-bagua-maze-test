import React from 'react';

interface StorySectionProps {
  t: any;
}

const StorySection: React.FC<StorySectionProps> = ({ t }) => {
  return (
    <section className="story-section">
      <div className="story-box">
        <h2 className="section-title">{t.storyTitle}</h2>
        <div className="story-text">
          <p>{t.storyPara1}</p>
          <p>{t.storyPara2}</p>
          <p>{t.storyPara3}</p>
          <p>{t.storyPara4}</p>
          <p>{t.storyPara5}</p>
          <p>{t.storyPara6}</p>
          <p>{t.storyPara7}</p>
          <p className="highlight">{t.storyHighlight}</p>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
