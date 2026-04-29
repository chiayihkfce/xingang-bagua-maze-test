import React, { useState, useEffect, useRef } from 'react';

/**
 * 遊戲一：八卦旋轉陣 (隨機出題聯動版)
 */
const RotationGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const [angles, setAngles] = useState(() => {
    const generate = (): number[] => {
      const a = [0, 0, 0];
      const scrambleMoves = 4 + Math.floor(Math.random() * 3);
      for (let i = 0; i < scrambleMoves; i++) {
        const idx = Math.floor(Math.random() * 3);
        a[idx] = (a[idx] + 45) % 360;
        if (idx === 0) a[1] = (a[1] + 45) % 360;
        if (idx === 1) a[2] = (a[2] + 45) % 360;
        if (idx === 2) a[0] = (a[0] + 45) % 360;
      }
      return a.every(val => val === 0) ? generate() : a;
    };
    return generate();
  });
  
  const isReady = useRef(true);
  const trigrams = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];

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
        {/* 中心太極 */}
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

export default RotationGame;
