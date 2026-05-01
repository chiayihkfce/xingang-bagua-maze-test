import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LuanQingTheaterProps {
  onClose: () => void;
}

const LuanQingTheater: React.FC<LuanQingTheaterProps> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const dialogueRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const dialogues = [
    '「呵呵，看來這一路上的挑戰難不倒你。虎爺跟我說，有個細心的人正在收集合攏這破碎的記憶。」',
    '「這塊新港飴、這盞舊燈...對你來說或許只是道具，但對我來說，它們是接通百年時空的頻率。」',
    '「你證明了，新港的靈魂並沒有被遺忘。即使在不同的年代，我們依然感應著同樣的八卦氣息。」',
    '「現在，這場傳說的大門已經為你敞開。勇敢地走下去吧，完成我未竟的旅程。」',
    '「我在這八卦陣的彼端，看著你的每一步。加油，新任的天命者。」'
  ];

  // 登場動畫
  useEffect(() => {
    const container = containerRef.current;
    const character = characterRef.current;
    const dialogue = dialogueRef.current;

    const tl = gsap.timeline();
    
    // 背景漸顯
    tl.fromTo(container, 
      { opacity: 0 }, 
      { opacity: 1, duration: 1.5, ease: 'power2.inOut' }
    );

    // 角色登場
    tl.fromTo(character,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 2, ease: 'power3.out' },
      '-=0.5'
    );

    // 對話框登場
    tl.fromTo(dialogue,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'back.out(1.7)' },
      '-=1'
    );

    // 呼吸感動畫
    gsap.to(character, {
      scale: 1.02,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    return () => {
      gsap.killTweensOf([container, character, dialogue]);
    };
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
          width: 'min(80vw, 500px)',
          height: 'min(100vw, 600px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginBottom: '10vh'
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 0 40px rgba(212, 175, 55, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(20, 20, 20, 0.8)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {/* 未來替換為 <img src="/luanqing.png" ... /> */}
          <div style={{
            textAlign: 'center',
            color: 'var(--primary-gold)',
            opacity: 0.6
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🦋</div>
            <div style={{ fontSize: '1.5rem', letterSpacing: '4px' }}>白鸞卿</div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.5 }}>[ 空間頻率連結中 ]</div>
          </div>
        </div>
      </div>

      {/* 對話框 */}
      <div 
        ref={dialogueRef}
        style={{
          position: 'absolute',
          bottom: '8vh',
          width: 'min(90vw, 800px)',
          minHeight: '150px',
          background: 'rgba(15, 15, 15, 0.9)',
          border: '2px solid var(--primary-gold)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.8), 0 0 10px rgba(212, 175, 55, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 10001
        }}
      >
        <div style={{ 
          color: 'var(--primary-gold)', 
          fontSize: '0.9rem', 
          marginBottom: '1rem',
          letterSpacing: '2px',
          fontWeight: 'bold'
        }}>
          白鸞卿
        </div>
        <p 
          ref={textRef}
          style={{
            color: '#eee',
            fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
            lineHeight: '1.8',
            margin: 0,
            letterSpacing: '1px'
          }}
        >
          {dialogues[currentIndex]}
        </p>
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '2rem',
          color: 'var(--primary-gold)',
          fontSize: '0.8rem',
          opacity: 0.6,
          animation: 'pulse 1.5s infinite alternate'
        }}>
          ▼ 點擊繼續
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          from { opacity: 0.3; transform: translateY(0); }
          to { opacity: 0.8; transform: translateY(3px); }
        }
      `}</style>
    </div>
  );
};

export default LuanQingTheater;
