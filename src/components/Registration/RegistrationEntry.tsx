import React from 'react';
import BaguaQuiz from './BaguaQuiz';
import { ChestIcon } from './BagModal';
import { useAppContext } from '../../context/AppContext';

interface RegistrationEntryProps {
  t: any;
  lang: string;
  isFlashlightOn: boolean;
  setViewMode: (mode: 'choice' | 'form') => void;
  setShowGames: (show: boolean) => void;
}

const RegistrationEntry: React.FC<RegistrationEntryProps> = ({
  t,
  lang,
  isFlashlightOn,
  setViewMode,
  setShowGames
}) => {
  const { setIsLookupOpen, setIsBagOpen } = useAppContext();

  return (
    <section
      className="registration-section entry-choice-section"
      style={{ position: 'relative' }}
    >
      <h2 className="choice-title">{t.chooseAction}</h2>

      <div className="entry-cards-container">
        {/* 報名按鈕卡片 */}
        <button
          onClick={() => setViewMode('form')}
          className="entry-card primary-card"
          style={{ flex: '1 1 280px' }}
        >
          <span className="entry-icon">📜</span>
          <span className="entry-title">{t.startRegistration}</span>
          <span className="entry-desc">{t.regEntryDesc}</span>
        </button>

        {/* 查詢按鈕卡片 */}
        <button
          onClick={() => setIsLookupOpen(true)}
          className="entry-card primary-card"
          style={{ flex: '1 1 280px' }}
        >
          <span className="entry-icon">🔍</span>
          <span className="entry-title">{t.checkStatus}</span>
          <span className="entry-desc">{t.lookupEntryDesc}</span>
        </button>

        {/* 八卦天命測驗 */}
        <BaguaQuiz t={t} lang={lang} />

        {/* 遊戲入口區 */}
        <button
          onClick={() => setShowGames(true)}
          className="entry-card primary-card"
          style={{ width: '100%', flex: '1 1 100%', marginTop: '15px' }}
        >
          <span
            className="entry-icon"
            style={{
              fontSize: '2.8rem',
              filter:
                'sepia(1) saturate(5) hue-rotate(-10deg) drop-shadow(0 0 5px rgba(212, 175, 55, 0.5))'
            }}
          >
            🧭
          </span>
          <span className="entry-title">陣法挑戰</span>
          <span className="entry-desc">
            在進入迷宮前，先試著感應八卦氣息吧！
          </span>
        </button>

        {/* 我的道具箱入口按鈕 */}
        <button
          onClick={() => setIsBagOpen(true)}
          className="entry-card primary-card"
          style={{
            width: '100%',
            flex: '1 1 100%',
            marginTop: '15px'
          }}
        >
          <span className="entry-icon">
            <ChestIcon size={50} />
          </span>
          <span className="entry-title">我的道具箱</span>
          <span className="entry-desc">存放著您在冒險中獲得的神祕寶物</span>
        </button>

        {/* 彩蛋提示小字 - 僅在手電筒開啟時顯現 */}
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            marginTop: '30px',
            fontSize: '0.85rem',
            color: 'var(--primary-gold)',
            opacity: isFlashlightOn ? 1 : 0,
            transition: 'all 0.5s ease',
            fontStyle: 'italic',
            letterSpacing: '1px',
            textShadow: '0 0 10px rgba(212,175,55,0.8)',
            transform: isFlashlightOn ? 'translateY(0)' : 'translateY(-10px)'
          }}
        >
          {isFlashlightOn ? '—— 傳說輸入「CLUE」獲取殘卷 ——' : ''}
        </div>
      </div>
    </section>
  );
};

export default RegistrationEntry;
