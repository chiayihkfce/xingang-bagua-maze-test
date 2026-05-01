import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAppContext } from '../../context/AppContext';

interface LuanQingTheaterProps {
  onClose: () => void;
}

const LuanQingTheater: React.FC<LuanQingTheaterProps> = ({ onClose }) => {
  const { t } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const dialogueRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const dialogues = t.luanqingDialogues || [];

  // 登場與呼吸動畫 (GSAP Context 優化)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      // 背景漸顯
      tl.fromTo(containerRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.5, ease: 'power2.inOut' }
      );

      // 角色登場
      tl.fromTo(characterRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 2, ease: 'power3.out' },
        '-=0.5'
      );

      // 對話框登場
      tl.fromTo(dialogueRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'back.out(1.7)' },
        '-=1'
      );

      // 呼吸感動畫
      gsap.to(characterRef.current, {
        scale: 1.02,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }, containerRef);

    return () => ctx.revert(); // 自動清理所有內部動畫
  }, []);

  // 切換對話動畫
  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(textRef.current,
        { opacity: 0, x: 10 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // 離場動畫
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 1,
        onComplete: onClose
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleNext}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
        fontFamily: "'Noto Serif TC', serif"
      }}
    >
      {/* 聚光燈效果層 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 40%, rgba(212, 175, 55, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* 角色容器 */}
      <div 
        ref={characterRef}
        style={{
          width: 'min(85vw, 550px)',
          height: 'min(120vw, 700px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginBottom: '8vh',
          zIndex: 10001
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(212, 175, 55, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(15, 15, 15, 0.4)',
          borderRadius: '12px',
          overflow: 'hidden',
          backdropFilter: 'blur(3px)'
        }}>
          <img 
            src="./luanqing.png" 
            alt="白鸞卿" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.3)) brightness(0.9)'
            }} 
          />
        </div>
      </div>

      {/* 對話框 */}
      <div 
        ref={dialogueRef}
        style={{
          position: 'absolute',
          bottom: '8vh',
          width: 'min(92vw, 850px)',
          minHeight: '160px',
          background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(30, 30, 30, 0.9) 100%)',
          border: '2px solid var(--primary-gold)',
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.9), 0 0 20px rgba(212, 175, 55, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 10002,
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{ 
          color: 'var(--primary-gold)', 
          fontSize: '1rem', 
          marginBottom: '1.2rem',
          letterSpacing: '4px',
          fontWeight: 'bold',
          opacity: 0.9,
          borderLeft: '3px solid var(--primary-gold)',
          paddingLeft: '12px'
        }}>
          白鸞卿
        </div>
        <p 
          ref={textRef}
          style={{
            color: '#ffffff',
            fontSize: 'clamp(1.15rem, 4.5vw, 1.5rem)',
            lineHeight: '1.8',
            margin: 0,
            letterSpacing: '1.5px',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          {dialogues[currentIndex]}
        </p>
        <div style={{
          position: 'absolute',
          bottom: '1.2rem',
          right: '2.5rem',
          color: 'var(--primary-gold)',
          fontSize: '0.85rem',
          opacity: 0.7,
          letterSpacing: '2px',
          animation: 'pulse-text 2s infinite'
        }}>
          —— 輕觸螢幕以感應時空 ——
        </div>
      </div>

      <style>{`
        @keyframes pulse-text {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50% { opacity: 0.8; transform: translateY(2px); }
        }
      `}</style>
    </div>
  );
};

export default LuanQingTheater;
