import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // 偵測是否為觸控裝置
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        window.matchMedia('(hover: none)').matches
      );
    };
    
    checkTouch();

    if (isTouchDevice) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      const { clientX: x, clientY: y } = e;
      
      // 使用 requestAnimationFrame 確保同步螢幕刷新率
      requestAnimationFrame(() => {
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        }
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        }
      });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('.radio-group label') ||
        target.closest('.checkbox-grid label') ||
        target.closest('.clickable') ||
        target.closest('.admin-trigger') ||
        target.closest('.close-btn')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseenter', () => setIsVisible(true));
    document.addEventListener('mouseleave', () => setIsVisible(false));

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, [isVisible, isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      <div 
        ref={dotRef}
        className={`custom-cursor-dot ${isHovering ? 'hover' : ''}`}
        style={{ left: 0, top: 0 }}
      />
      <div 
        ref={ringRef}
        className={`custom-cursor-ring ${isHovering ? 'hover' : ''}`}
        style={{ left: 0, top: 0 }}
      >
        <svg viewBox="0 0 100 100">
          {/* 八角形外框 */}
          <path 
            className="bagua-octagon"
            d="M 50 5 L 82 18 L 95 50 L 82 82 L 50 95 L 18 82 L 5 50 L 18 18 Z"
            fill="none"
            stroke="var(--primary-gold)"
            strokeWidth="1.2"
            opacity="0.8"
          />
          
          {/* 太極中心 */}
          <circle cx="50" cy="50" r="10" stroke="var(--primary-gold)" fill="none" strokeWidth="0.3" opacity="0.3"/>
          <path d="M 50 40 A 5 5 0 0 1 50 50 A 5 5 0 0 0 50 60" stroke="var(--primary-gold)" fill="none" strokeWidth="0.3" opacity="0.3"/>
          
          {/* 八卦符號 (完整八方位) */}
          <g className="trigrams" stroke="var(--primary-gold)" strokeWidth="0.4">
            {/* 0度 (北) - 乾 ☰ */}
            <g transform="rotate(0 50 50)">
              <line x1="42" y1="11" x2="58" y2="11" />
              <line x1="42" y1="16" x2="58" y2="16" />
              <line x1="42" y1="21" x2="58" y2="21" />
            </g>
            {/* 45度 (東北) - 巽 ☴ */}
            <g transform="rotate(45 50 50)">
              <line x1="42" y1="11" x2="58" y2="11" />
              <line x1="42" y1="16" x2="58" y2="16" />
              <line x1="42" y1="21" x2="48" y2="21" /><line x1="52" y1="21" x2="58" y2="21" />
            </g>
            {/* 90度 (東) - 坎 ☵ */}
            <g transform="rotate(90 50 50)">
              <line x1="42" y1="11" x2="48" y2="11" /><line x1="52" y1="11" x2="58" y2="11" />
              <line x1="42" y1="16" x2="58" y2="16" />
              <line x1="42" y1="21" x2="48" y2="21" /><line x1="52" y1="21" x2="58" y2="21" />
            </g>
            {/* 135度 (東南) - 艮 ☶ */}
            <g transform="rotate(135 50 50)">
              <line x1="42" y1="11" x2="58" y2="11" />
              <line x1="42" y1="16" x2="48" y2="16" /><line x1="52" y1="16" x2="58" y2="16" />
              <line x1="42" y1="21" x2="48" y2="21" /><line x1="52" y1="21" x2="58" y2="21" />
            </g>
            {/* 180度 (南) - 坤 ☷ */}
            <g transform="rotate(180 50 50)">
              <line x1="42" y1="11" x2="48" y2="11" /><line x1="52" y1="11" x2="58" y2="11" />
              <line x1="42" y1="16" x2="48" y2="16" /><line x1="52" y1="16" x2="58" y2="16" />
              <line x1="42" y1="21" x2="48" y2="21" /><line x1="52" y1="21" x2="58" y2="21" />
            </g>
            {/* 225度 (西南) - 震 ☳ */}
            <g transform="rotate(225 50 50)">
              <line x1="42" y1="11" x2="48" y2="11" /><line x1="52" y1="11" x2="58" y2="11" />
              <line x1="42" y1="16" x2="48" y2="16" /><line x1="52" y1="16" x2="58" y2="16" />
              <line x1="42" y1="21" x2="58" y2="21" />
            </g>
            {/* 270度 (西) - 離 ☲ */}
            <g transform="rotate(270 50 50)">
              <line x1="42" y1="11" x2="58" y2="11" />
              <line x1="42" y1="16" x2="48" y2="16" /><line x1="52" y1="16" x2="58" y2="16" />
              <line x1="42" y1="21" x2="58" y2="21" />
            </g>
            {/* 315度 (西北) - 兌 ☱ */}
            <g transform="rotate(315 50 50)">
              <line x1="42" y1="11" x2="48" y2="11" /><line x1="52" y1="11" x2="58" y2="11" />
              <line x1="42" y1="16" x2="58" y2="16" />
              <line x1="42" y1="21" x2="58" y2="21" />
            </g>
          </g>
        </svg>
      </div>
    </>
  );
};

export default CustomCursor;
