import React, { useState, useEffect, useRef } from 'react';
import './MiniGames.css';

interface MiniGamesProps {
  show: boolean;
  onClose: () => void;
}

const MiniGames: React.FC<MiniGamesProps> = ({ show, onClose }) => {
  const [activeGame, setActiveGame] = useState<'rotation' | 'maze' | 'match'>('rotation');
  const [isWin, setIsWin] = useState(false);

  if (!show) return null;

  return (
    <div className="game-overlay">
      <div className="game-container">
        {/* 頂部選單 */}
        <div className="game-header">
          <div className="game-tabs">
            <button 
              className={activeGame === 'rotation' ? 'active' : ''} 
              onClick={() => { setActiveGame('rotation'); setIsWin(false); }}
            >
              旋轉陣
            </button>
            <button 
              className={activeGame === 'maze' ? 'active' : ''} 
              onClick={() => { setActiveGame('maze'); setIsWin(false); }}
            >
              尋生門
            </button>
            <button 
              className={activeGame === 'match' ? 'active' : ''} 
              onClick={() => { setActiveGame('match'); setIsWin(false); }}
            >
              對對碰
            </button>
          </div>
          <button className="game-close" onClick={onClose}>×</button>
        </div>

        {/* 遊戲內容區 */}
        <div className="game-content">
          {activeGame === 'rotation' && <RotationGame onWin={() => setIsWin(true)} />}
          {activeGame === 'maze' && <MazeGame onWin={() => setIsWin(true)} />}
          {activeGame === 'match' && <MatchGame onWin={() => setIsWin(true)} />}
        </div>

        {/* 勝利提示 */}
        {isWin && (
          <div className="win-overlay">
            <div className="win-card">
              <h3>🎉 破陣成功！</h3>
              <p>您已成功引導氣流，獲得「迷宮智者」稱號。</p>
              <button onClick={() => setIsWin(false)}>再玩一次</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 遊戲一：八卦旋轉陣 (隨機出題聯動版)
 */
const RotationGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const [level, setLevel] = useState(1);
  const [angles, setAngles] = useState([0, 0, 0]);
  const isReady = useRef(false);
  const trigrams = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];

  const generateNewPuzzle = () => {
    isReady.current = false;
    let newAngles = [0, 0, 0];
    const scrambleMoves = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < scrambleMoves; i++) {
      const idx = Math.floor(Math.random() * 3);
      newAngles[idx] = (newAngles[idx] + 45) % 360;
      if (idx === 0) newAngles[1] = (newAngles[1] + 45) % 360;
      if (idx === 1) newAngles[2] = (newAngles[2] + 45) % 360;
      if (idx === 2) newAngles[0] = (newAngles[0] + 45) % 360;
    }
    
    if (newAngles.every(a => a === 0)) {
      generateNewPuzzle();
    } else {
      setAngles(newAngles);
      // 給予一點延遲確保渲染後才開啟判定
      setTimeout(() => { isReady.current = true; }, 100);
    }
  };

  useEffect(() => { generateNewPuzzle(); }, [level]);

  const handleLinkedRotate = (index: number) => {
    if (!isReady.current) return;
    setAngles(prev => {
      const next = [...prev];
      next[index] = (next[index] + 45) % 360;
      if (index === 0) next[1] = (next[1] + 45) % 360;
      if (index === 1) next[2] = (next[2] + 45) % 360;
      if (index === 2) next[0] = (next[0] + 45) % 360;
      return next;
    });
  };

  useEffect(() => {
    if (isReady.current && angles.every(a => a === 0)) {
      isReady.current = false; // 防止重複觸發
      setTimeout(() => onWin(), 600);
    }
  }, [angles, onWin]);

  return (
    <div className="rotation-game">
      <div className="game-instructions" style={{ textAlign: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--primary-gold)' }}>八卦聯動機關</h3>
        <p style={{ fontSize: '0.75rem', margin: '6px 0', opacity: 0.8 }}>點擊撥動圓環，使三圈「☰」對齊正上方</p>
      </div>

      <div className="bagua-layers" style={{ position: 'relative', width: '280px', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {angles.map((angle, i) => (
          <div 
            key={i} 
            className={`layer layer-${i} ${angle === 0 ? 'aligned' : ''}`} 
            style={{ 
              position: 'absolute',
              width: `${280 - i * 80}px`,
              height: `${280 - i * 80}px`,
              border: '2px solid rgba(212,175,55,0.3)',
              borderRadius: '50%',
              transform: `rotate(${angle}deg)`,
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => handleLinkedRotate(i)}
          >
            {trigrams.map((symbol, idx) => (
              <div 
                key={idx} 
                className={`symbol-item ${idx === 0 ? 'target-symbol' : ''}`}
                style={{ 
                  position: 'absolute',
                  transform: `rotate(${idx * 45}deg) translateY(-${[130, 90, 50][i]}px)`,
                  color: 'var(--primary-gold)',
                  fontSize: '1.1rem',
                  opacity: (angle === 0 && idx === 0) ? 1 : 0.6
                }}
              >
                {symbol}
              </div>
            ))}
            <div className="marker" style={{ position: 'absolute', top: '-6px', width: '10px', height: '10px', background: 'var(--primary-gold)', borderRadius: '50%' }}></div>
          </div>
        ))}
        {/* 中心太極 - 修正對齊問題 */}
        <div className="center-core" style={{ 
          width: '60px', 
          height: '60px', 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
        }}>
          <div className="taiji" style={{ width: '100%', height: '100%', animationDuration: '10s' }}></div>
        </div>
      </div>
      
      <div className="control-hint" style={{ color: 'var(--primary-gold)', fontSize: '0.7rem', marginTop: '10px', textAlign: 'center' }}>
        {angles.every(a => a === 0) ? "陣法已破！" : "觀察環與環之間的連動規律"}
      </div>
    </div>
  );
};

/**
 * 遊戲二：尋生門 (20x20 高難度迷宮)
 */
const MazeGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const gridSize = 20;
  const cellSize = 15;
  const [level, setLevel] = useState(1);
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [maze, setMaze] = useState<{walls: boolean[][][]} | null>(null);

  const generateMaze = () => {
    const walls = Array.from({ length: gridSize }, () => 
      Array.from({ length: gridSize }, () => [true, true, true, true])
    );
    const visited = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
    const stack: [number, number][] = [[0, 0]];
    visited[0][0] = true;

    while (stack.length > 0) {
      const [cx, cy] = stack[stack.length - 1];
      const neighbors: [number, number, number][] = [];
      [[0, -1, 0], [1, 0, 1], [0, 1, 2], [-1, 0, 3]].forEach(([dx, dy, dir]) => {
        const nx = cx + dx, ny = cy + dy;
        if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && !visited[ny][nx]) neighbors.push([nx, ny, dir]);
      });
      if (neighbors.length > 0) {
        const [nx, ny, dir] = neighbors[Math.floor(Math.random() * neighbors.length)];
        walls[cy][cx][dir] = false;
        walls[ny][nx][(dir + 2) % 4] = false;
        visited[ny][nx] = true;
        stack.push([nx, ny]);
      } else stack.pop();
    }
    setMaze({ walls });
    setPlayer({ x: 0, y: 0 });
  };

  useEffect(() => { generateMaze(); }, [level]);

  const move = (dir: number) => {
    if (!maze) return;
    setPlayer(prev => {
      let nx = prev.x, ny = prev.y;
      if (dir === 0) ny -= 1;
      if (dir === 1) nx += 1;
      if (dir === 2) ny += 1;
      if (dir === 3) nx -= 1;

      if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) return prev;
      if (maze.walls[prev.y][prev.x][dir]) return prev;

      if (nx === gridSize - 1 && ny === gridSize - 1) {
        onWin();
        setTimeout(() => setLevel(l => l + 1), 1500);
      }
      return { x: nx, y: ny };
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowUp' || e.key === 'w') move(0);
      if (e.key === 'ArrowRight' || e.key === 'd') move(1);
      if (e.key === 'ArrowDown' || e.key === 's') move(2);
      if (e.key === 'ArrowLeft' || e.key === 'a') move(3);
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [maze, player]);

  if (!maze) return null;

  return (
    <div className="maze-game">
      <div className="game-instructions" style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-gold)', margin: 0 }}>九幽禁地</h3>
        <p style={{ fontSize: '0.75rem', margin: '6px 0', opacity: 0.8 }}>撥動搖桿尋找出口</p>
      </div>

      <div className="maze-view-port">
        <div className="maze-container-square">
          <svg viewBox={`0 0 ${gridSize * cellSize} ${gridSize * cellSize}`} className="maze-svg-rect" preserveAspectRatio="xMidYMid meet">
            <g className="maze-content-layer">
              {maze.walls.map((row, y) => row.map((cell, x) => (
                <g key={`${x}-${y}`}>
                  {cell[0] && <line x1={x*cellSize} y1={y*cellSize} x2={(x+1)*cellSize} y2={y*cellSize} stroke="var(--primary-gold)" strokeWidth="1" strokeLinecap="round" />}
                  {cell[1] && <line x1={(x+1)*cellSize} y1={y*cellSize} x2={(x+1)*cellSize} y2={(y+1)*cellSize} stroke="var(--primary-gold)" strokeWidth="1" strokeLinecap="round" />}
                  {cell[2] && <line x1={x*cellSize} y1={(y+1)*cellSize} x2={(x+1)*cellSize} y2={(y+1)*cellSize} stroke="var(--primary-gold)" strokeWidth="1" strokeLinecap="round" />}
                  {cell[3] && <line x1={x*cellSize} y1={y*cellSize} x2={x*cellSize} y2={(y+1)*cellSize} stroke="var(--primary-gold)" strokeWidth="1" strokeLinecap="round" />}
                </g>
              )))}
              <rect x={(gridSize-1)*cellSize+1} y={(gridSize-1)*cellSize+1} width={cellSize-2} height={cellSize-2} fill="#ff4d4d" opacity="0.8" />
              <circle cx={player.x*cellSize+cellSize/2} cy={player.y*cellSize+cellSize/2} r={cellSize/3} fill="#fff" />
            </g>
          </svg>
        </div>
      </div>

      <Joystick onMove={move} />
    </div>
  );
};

/**
 * 虛擬搖桿組件
 */
const Joystick: React.FC<{ onMove: (dir: number) => void }> = ({ onMove }) => {
  const stickRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const lastMoveTime = useRef(0);
  const [isActive, setIsActive] = useState(false);

  const handleMove = (clientX: number, clientY: number) => {
    if (!baseRef.current || !stickRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = rect.width / 2;
    const limitedDist = Math.min(dist, maxDist);
    const angle = Math.atan2(dy, dx);
    const moveX = Math.cos(angle) * limitedDist;
    const moveY = Math.sin(angle) * limitedDist;
    
    stickRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    stickRef.current.style.transition = 'none'; 

    const now = Date.now();
    if (dist > 18 && now - lastMoveTime.current > 150) {
      lastMoveTime.current = now;
      const deg = (angle * 180 / Math.PI + 360) % 360;
      if (deg > 315 || deg <= 45) onMove(1);
      else if (deg > 45 && deg <= 135) onMove(2);
      else if (deg > 135 && deg <= 225) onMove(3);
      else onMove(0);
    }
  };

  useEffect(() => {
    const handleGlobalUpdate = (e: MouseEvent | TouchEvent) => {
      if (!isActive) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      handleMove(clientX, clientY);
    };
    const handleGlobalEnd = () => {
      if (!isActive) return;
      setIsActive(false);
      if (stickRef.current) {
        stickRef.current.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        stickRef.current.style.transform = `translate(0, 0)`;
      }
    };
    if (isActive) {
      window.addEventListener('mousemove', handleGlobalUpdate);
      window.addEventListener('mouseup', handleGlobalEnd);
      window.addEventListener('touchmove', handleGlobalUpdate, { passive: false });
      window.addEventListener('touchend', handleGlobalEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalUpdate);
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchmove', handleGlobalUpdate);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isActive]);

  return (
    <div className="joystick-wrapper">
      <div ref={baseRef} className="joystick-base" onMouseDown={(e) => { setIsActive(true); handleMove(e.clientX, e.clientY); }} onTouchStart={(e) => { setIsActive(true); handleMove(e.touches[0].clientX, e.touches[0].clientY); }}>
        <div ref={stickRef} className="joystick-stick"></div>
      </div>
    </div>
  );
};

/**
 * 遊戲三：萬象歸宗 (卦象對對碰)
 */
const MatchGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const trigrams = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
  const [cards, setCards] = useState<{ id: number; symbol: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  const initGame = () => {
    const shuffledCards = [...trigrams, ...trigrams]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedIndices([]);
    setIsLocked(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [first, second] = newFlipped;
      
      if (cards[first].symbol === cards[second].symbol) {
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[first].isMatched = true;
            updated[second].isMatched = true;
            return updated;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[first].isFlipped = false;
            updated[second].isFlipped = false;
            return updated;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setTimeout(() => onWin(), 500);
    }
  }, [cards]);

  return (
    <div className="match-game">
      <div className="game-instructions" style={{ textAlign: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: 'var(--primary-gold)' }}>萬象歸宗</h3>
        <p style={{ fontSize: '0.75rem', margin: '6px 0', opacity: 0.8 }}>找出成對的卦象，平息混亂的氣流</p>
      </div>
      <div className="card-grid">
        {cards.map((card, i) => (
          <div 
            key={card.id} 
            className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
            onClick={() => handleCardClick(i)}
          >
            <div className="card-front">{card.symbol}</div>
            <div className="card-back">☯</div>
          </div>
        ))}
      </div>
      <button className="reset-btn" onClick={initGame} style={{ marginTop: '20px', padding: '5px 15px', background: 'transparent', border: '1px solid var(--primary-gold)', color: 'var(--primary-gold)', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer' }}>
        重置陣法
      </button>
    </div>
  );
};

export default MiniGames;
