import React, { useState, useEffect, useRef } from 'react';

/**
 * 虛擬搖桿組件
 */
export const Joystick: React.FC<{ onMove: (dir: number) => void }> = ({ onMove }) => {
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

interface MazeGameProps {
  onWin: () => void;
}

/**
 * 遊戲二：尋生門 (20x20 高難度迷宮)
 */
const MazeGame: React.FC<MazeGameProps> = ({ onWin }) => {
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

export default MazeGame;
