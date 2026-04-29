import React, { useState } from 'react';
import RotationGame from '../MiniGames/RotationGame';
import MazeGame from '../MiniGames/MazeGame';
import MatchGame from '../MiniGames/MatchGame';
import './MiniGames.css';

interface MiniGamesProps {
  onClose: () => void;
}

const MiniGames: React.FC<MiniGamesProps> = ({ onClose }) => {
  const [activeGame, setActiveTab] = useState<'rotation' | 'maze' | 'match'>('rotation');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleWin = () => {
    const msgs = ['氣場穩定，乾坤歸位！', '迷霧散去，生路已現！', '萬象歸宗，神清氣爽！'];
    setSuccessMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  return (
    <div className="modal-overlay games-modal-overlay" style={{ zIndex: 12000 }}>
      <div className="modal-content games-container" onClick={e => e.stopPropagation()}>
        <div className="games-header">
          <div className="games-nav">
            <button className={activeGame === 'rotation' ? 'active' : ''} onClick={() => setActiveTab('rotation')}>旋轉陣</button>
            <button className={activeGame === 'maze' ? 'active' : ''} onClick={() => setActiveTab('maze')}>尋生門</button>
            <button className={activeGame === 'match' ? 'active' : ''} onClick={() => setActiveTab('match')}>對對碰</button>
          </div>
          <button className="games-close" onClick={onClose}>&times;</button>
        </div>

        <div className="game-body">
          {activeGame === 'rotation' && <RotationGame onWin={handleWin} />}
          {activeGame === 'maze' && <MazeGame onWin={handleWin} />}
          {activeGame === 'match' && <MatchGame onWin={handleWin} />}
        </div>

        {showSuccess && (
          <div className="game-success-overlay">
            <div className="success-content">
              <span className="success-icon">✨</span>
              <p>{successMsg}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniGames;
