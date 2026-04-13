import React, { useEffect, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cursorVisible = useRef(false);
  const [shouldRender, setShouldRender] = React.useState(false);

  useEffect(() => {
    // 偵測是否為觸控裝置（不支援 hover）
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (isTouchDevice) {
      setShouldRender(false);
      return;
    }

    setShouldRender(true);

    // 2. 核心移動邏輯 (使用 requestAnimationFrame 並直接操作樣式)
    const onMouseMove = (e: MouseEvent) => {
      if (!cursorVisible.current) {
        cursorVisible.current = true;
        dotRef.current?.classList.add('visible');
        ringRef.current?.classList.add('visible');
        // 只有在自定義鼠標開始運作時才隱藏原生鼠標
        document.body.classList.add('custom-cursor-active');
      }
      
      const { clientX: x, clientY: y } = e;
      
      requestAnimationFrame(() => {
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        }
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        }
      });
    };

    // 3. 核心 Hover 邏輯
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = !!target.closest('button, a, input, select, textarea, .radio-group label, .checkbox-grid label, .clickable, .admin-trigger, .close-btn, .slot-tag i');
      
      if (isClickable) {
        dotRef.current?.classList.add('hover');
        ringRef.current?.classList.add('hover');
      } else {
        dotRef.current?.classList.remove('hover');
        ringRef.current?.classList.remove('hover');
      }
    };

    const onMouseLeave = () => {
      cursorVisible.current = false;
      dotRef.current?.classList.remove('visible');
      ringRef.current?.classList.remove('visible');
      document.body.classList.remove('custom-cursor-active');
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', () => {
      cursorVisible.current = true;
      dotRef.current?.classList.add('visible');
      ringRef.current?.classList.add('visible');
      document.body.classList.add('custom-cursor-active');
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" style={{ left: 0, top: 0 }} />
      <div ref={ringRef} className="custom-cursor-ring" style={{ left: 0, top: 0 }}>
        <svg viewBox="0 0 100 100">
          <path 
            className="bagua-octagon"
            d="M 50 5 L 82 18 L 95 50 L 82 82 L 50 95 L 18 82 L 5 50 L 18 18 Z"
            fill="none"
            stroke="var(--primary-gold)"
            strokeWidth="1.2"
            opacity="0.8"
          />
          <circle cx="50" cy="50" r="10" stroke="var(--primary-gold)" fill="none" strokeWidth="0.3" opacity="0.3"/>
          <path d="M 50 40 A 5 5 0 0 1 50 50 A 5 5 0 0 0 50 60" stroke="var(--primary-gold)" fill="none" strokeWidth="0.3" opacity="0.3"/>
          <g className="trigrams" stroke="var(--primary-gold)" strokeWidth="0.4">
            <g transform="rotate(0 50 50)"><line x1="42" y1="11" x2="58" y2="11" /><line x1="42" y1="16" x2="58" y2="16" /><line x1="42" y1="21" x2="58" y2="21" /></g>
            <g transform="rotate(45 50 50)"><line x1="42" y1="11" x2="58" y2="11" /><line x1="42" y1="16" x2="58" y2="16" /><line x1="42" y1="21" x2="48" y2="21" /><line x1="52" y1="21" x2="58" y2="21" /></g>
            <g transform="rotate(90 50 50)"><line x1="42" y1="11" x2="48" y2="11" /><line x1="52" y1="11" x2="58" y2="11" /><line x1="42" y1="16" x2="58" y2="16" /><line x1="42" y1="21" x2="48" y2="21" /><line x1="52" y1="21" x2="58" y2="21" /></g>
            <g transform="rotate(135 50 50)"><line x1="42" y1="11" x2="58" y2="11" /><line x1="42" y1="16" x2="48" y2="16" /><line x1="52" y1="16" x2="58" y2="16" /><line x1="42" y1="21" x2="48" y2="21" /><line x1="52" y1="21" x2="58" y2="21" /></g>
            <g transform="rotate(180 50 50)"><line x1="42" y1="11" x2="48" y2="11" /><line x1="52" y1="11" x2="58" y2="11" /><line x1="42" y1="16" x2="48" y2="16" /><line x1="52" y1="16" x2="58" y2="16" /><line x1="42" y1="21" x2="48" y2="21" /><line x1="52" y1="21" x2="58" y2="21" /></g>
            <g transform="rotate(225 50 50)"><line x1="42" y1="11" x2="48" y2="11" /><line x1="52" y1="11" x2="58" y2="11" /><line x1="42" y1="16" x2="48" y2="16" /><line x1="52" y1="16" x2="58" y2="16" /><line x1="42" y1="21" x2="58" y2="21" /></g>
            <g transform="rotate(270 50 50)"><line x1="42" y1="11" x2="58" y2="11" /><line x1="42" y1="16" x2="48" y2="16" /><line x1="52" y1="16" x2="58" y2="16" /><line x1="42" y1="21" x2="58" y2="21" /></g>
            <g transform="rotate(315 50 50)"><line x1="42" y1="11" x2="48" y2="11" /><line x1="52" y1="11" x2="58" y2="11" /><line x1="42" y1="16" x2="58" y2="16" /><line x1="42" y1="21" x2="58" y2="21" /></g>
          </g>
        </svg>
      </div>
    </>
  );
};

export default CustomCursor;
