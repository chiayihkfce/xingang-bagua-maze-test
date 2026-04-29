import React, { useState } from 'react';
import RotationGame from '../MiniGames/RotationGame';
import MazeGame from '../MiniGames/MazeGame';
import MatchGame from '../MiniGames/MatchGame';
import './MiniGames.css';
import { useAppContext } from '../../context/AppContext';

interface MiniGamesProps {
  onClose: () => void;
}

const MiniGames: React.FC<MiniGamesProps> = ({ onClose }) => {
  const { setHasFlashlight } = useAppContext();
  const [activeGame, setActiveGame] = useState<'rotation' | 'maze' | 'match'>(
    'rotation'
  );
  const [isWin, setIsWin] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const handleWin = () => {
    setIsWin(true);
    setHasFlashlight(true);
  };

  const handleRestart = () => {
    setIsWin(false);
    setGameKey((prev) => prev + 1);
  };

  return (
    <div className="game-overlay">
      <div className="game-container" onClick={(e) => e.stopPropagation()}>
        {/* 頂部選單 */}
        <div className="game-header">
          <div className="game-tabs">
            <button
              className={activeGame === 'rotation' ? 'active' : ''}
              onClick={() => {
                setActiveGame('rotation');
                setIsWin(false);
                setGameKey((k) => k + 1);
              }}
            >
              旋轉陣
            </button>
            <button
              className={activeGame === 'maze' ? 'active' : ''}
              onClick={() => {
                setActiveGame('maze');
                setIsWin(false);
                setGameKey((k) => k + 1);
              }}
            >
              尋生門
            </button>
            <button
              className={activeGame === 'match' ? 'active' : ''}
              onClick={() => {
                setActiveGame('match');
                setIsWin(false);
                setGameKey((k) => k + 1);
              }}
            >
              對對碰
            </button>
          </div>
          <button className="game-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* 遊戲內容區 */}
        <div className="game-content">
          {activeGame === 'rotation' && (
            <RotationGame key={`rot-${gameKey}`} onWin={handleWin} />
          )}
          {activeGame === 'maze' && (
            <MazeGame key={`maze-${gameKey}`} onWin={handleWin} />
          )}
          {activeGame === 'match' && (
            <MatchGame key={`match-${gameKey}`} onWin={handleWin} />
          )}
        </div>

        {/* 勝利提示 */}
        {isWin && (
          <div className="win-overlay">
            <div className="win-card">
              <h3>
                🎉{' '}
                {activeGame === 'rotation'
                  ? '陣法已破！'
                  : activeGame === 'maze'
                    ? '尋得生門！'
                    : '萬象歸宗！'}
              </h3>
              <p>
                {activeGame === 'rotation' &&
                  '您已成功感應八卦氣息，撥雲見日，陣法已開。'}
                {activeGame === 'maze' &&
                  '您在重重迷霧中找到了出口，展現了卓越的智慧。'}
                {activeGame === 'match' &&
                  '所有卦象皆已歸位，混亂的氣流已平息。'}
              </p>
              <div
                style={{
                  color: 'var(--primary-gold)',
                  fontWeight: 'bold',
                  margin: '10px 0',
                  fontSize: '0.9rem'
                }}
              >
                ✨ 獲得神祕道具：【八卦手電筒】✨
              </div>
              <button onClick={handleRestart}>再玩一次</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniGames;
