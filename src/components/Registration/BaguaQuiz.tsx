import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';

interface BaguaQuizProps {
  t: any;
  lang: string;
}

const BAGUAS = ['乾', '坤', '震', '巽', '坎', '離', '艮', '兌'] as const;

const BaguaQuiz: React.FC<BaguaQuizProps> = ({ t, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<typeof BAGUAS[number] | null>(null);
  const [isSpinning, setIsSubmitting] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const startQuiz = () => {
    if (isSpinning) return;
    setIsSubmitting(true);
    setResult(null);

    const randomIdx = Math.floor(Math.random() * BAGUAS.length);
    const stopAt = BAGUAS[randomIdx];
    const targetRotation = 1800 + (randomIdx * 45);

    gsap.to(wheelRef.current, {
      rotation: targetRotation,
      duration: 3,
      ease: "power4.out",
      onComplete: () => {
        setResult(stopAt);
        setIsSubmitting(false);
      }
    });
  };

  const closeQuiz = () => {
    setIsOpen(false);
    setResult(null);
  };

  return (
    <>
      {/* 外部入口按鈕：與首頁風格一致的卡片 */}
      <button 
        className="entry-card primary-card bagua-quiz-entry-btn" 
        onClick={() => setIsOpen(true)} 
        style={{
          width: '100%',
          flex: '0 0 100%', // 佔滿整行
          margin: 0,
          cursor: 'pointer',
          boxSizing: 'border-box'
        }}
      >
        <span className="entry-icon">☯</span>
        <span className="entry-title">{t.quizTitle}</span>
        <span className="entry-desc">{t.quizIntro}</span>
        <div style={{ marginTop: '10px', color: 'var(--accent-orange)', fontWeight: 'bold', fontSize: '0.9rem' }}>
          {lang === 'en' ? 'Click to Start ➔' : '立即啟動命運之輪 ➔'}
        </div>
      </button>

      {/* 全螢幕測驗彈窗 */}
      {isOpen && (
        <div className="quiz-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.95)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          backdropFilter: 'blur(10px)', padding: '20px'
        }}>
          <div className="quiz-modal-content" style={{ 
            width: '100%', maxWidth: '500px', textAlign: 'center',
            position: 'relative'
          }}>
            {/* 關閉按鈕 */}
            <button onClick={closeQuiz} style={{
              position: 'absolute', top: '-50px', right: '0',
              background: 'transparent', border: '1px solid #fff', color: '#fff',
              borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer'
            }}>✕</button>

            <h2 style={{ color: 'var(--primary-gold)', fontSize: '1.8rem', marginBottom: '30px' }}>{t.quizTitle}</h2>

            <div className="quiz-container" style={{ 
              position: 'relative', width: '320px', height: '320px', margin: '0 auto',
              filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.4))' // 為整個八角盤加上金色發光
            }}>
              {/* 八邊形底層 (作為金邊) */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'var(--primary-gold)',
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                zIndex: 1
              }}></div>

              {/* 指針 */}
              <div style={{
                position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)',
                width: '0', height: '0', borderLeft: '15px solid transparent', borderRight: '15px solid transparent',
                borderTop: '30px solid var(--accent-orange)', zIndex: 10
              }}></div>

              {/* 旋轉八卦盤面 (縮小 4px 以露出底層的金邊) */}
              <div ref={wheelRef} style={{ 
                position: 'absolute', top: '4px', left: '4px', 
                width: 'calc(100% - 8px)', height: 'calc(100% - 8px)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                zIndex: 2,
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                background: 'radial-gradient(circle, #222 0%, #111 100%)'
              }}>
                {/* 八卦方位文字 */}
                {BAGUAS.map((b, i) => (
                  <div key={b} style={{
                    position: 'absolute', transform: `rotate(${i * 45}deg) translateY(-115px)`, 
                    fontSize: '1.6rem', fontWeight: 'bold', color: '#c1a57b', width: '45px',
                    textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                  }}>{b}</div>
                ))}
                
                {/* 中心區域：金色外圓框 + 純 CSS 繪製的黑白太極 */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: '85px', height: '80px', borderRadius: '50%',
                  border: '3px solid var(--primary-gold)', background: '#000',
                  zIndex: 5, overflow: 'hidden', pointerEvents: 'none',
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)'
                }}>
                  <div style={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    background: 'linear-gradient(to right, #fff 50%, #000 50%)',
                    position: 'relative'
                  }}>
                    <div style={{ position: 'absolute', top: 0, left: '25%', width: '50%', height: '50%', background: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <div style={{ width: '25%', height: '25%', background: '#000', borderRadius: '50%' }}></div>
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: '25%', width: '50%', height: '50%', background: '#000', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <div style={{ width: '25%', height: '25%', background: '#fff', borderRadius: '50%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!result ? (
              <button onClick={startQuiz} disabled={isSpinning} className="cta-button" style={{ marginTop: '40px' }}>
                {isSpinning ? '...' : t.quizBtn}
              </button>
            ) : (
              <div className="result-box" style={{ 
                marginTop: '40px', padding: '25px', background: 'rgba(212, 175, 55, 0.1)', 
                borderRadius: '20px', border: '1px solid var(--primary-gold)',
                animation: 'fadeIn 0.5s forwards'
              }}>
                <h3 style={{ color: 'var(--accent-orange)', fontSize: '1.4rem', marginBottom: '10px' }}>
                  {t.quizResultTitle} {result}
                </h3>
                <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>性格：{t.baguaData[result].role}</p>
                <p style={{ opacity: 0.9, fontSize: '0.95rem', lineHeight: '1.6' }}>{t.baguaData[result].desc}</p>
                <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  💡 {t.baguaData[result].tip}
                </div>
                <button onClick={() => setResult(null)} style={{ marginTop: '20px', background: 'transparent', color: '#888', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  {t.quizReplay}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .bagua-entry-card:hover {
          background: rgba(212, 175, 55, 0.1) !important;
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.2) !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
};

export default BaguaQuiz;
