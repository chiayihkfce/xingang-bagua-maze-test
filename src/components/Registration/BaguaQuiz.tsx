import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import html2canvas from 'html2canvas';

interface BaguaQuizProps {
  t: any;
  lang: string;
}

const BAGUAS = ['乾', '坤', '震', '巽', '坎', '離', '艮', '兌'] as const;

const BaguaQuiz: React.FC<BaguaQuizProps> = ({ t, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<typeof BAGUAS[number] | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0); // 記錄當前累計旋轉角度

  // 彈窗開啟時鎖定背景滾動
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleShareCard = async () => {
    if (!cardRef.current || isGenerating) return;
    setIsGenerating(true);
    try {
      const card = cardRef.current;
      card.style.display = 'block';
      
      const canvas = await html2canvas(card, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      card.style.display = 'none';
      const dataUrl = canvas.toDataURL('image/png');

      // 嘗試使用 Web Share API 分享圖片
      if (navigator.share && navigator.canShare) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `新港八卦謎蹤_天命卡片_${result}.png`, { type: 'image/png' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: '新港八卦謎蹤 - 我的天命方位',
            text: `我在新港謎蹤測出了【${result}】方位！你也快來測測看。`
          });
          setIsGenerating(false);
          return;
        }
      }

      // 如果不支援分享或分享失敗，則下載圖片
      const link = document.createElement('a');
      link.download = `新港八卦謎蹤_天命卡片_${result}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Share error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const startQuiz = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    const randomIdx = Math.floor(Math.random() * BAGUAS.length);
    const stopAt = BAGUAS[randomIdx];

    // 計算目標角度邏輯：
    // 1. 為了讓隨機方位 i 對齊 12 點鐘指針，盤面需要轉到 - (i * 45) 度
    const targetRelativeDeg = -(randomIdx * 45);
    const currentDeg = rotationRef.current;

    // 2. 在當前角度基礎上，增加至少 1800 度 (5圈)，並補足到目標方位的差距
    // 使用模運算確保永遠是順時針向前轉
    const spinRounds = 1800;
    const offset = ((targetRelativeDeg - (currentDeg % 360) + 360) % 360);
    const finalRotation = currentDeg + spinRounds + offset;

    rotationRef.current = finalRotation;

    gsap.to(wheelRef.current, {
      rotation: finalRotation,
      duration: 3,
      ease: "power4.out",
      onComplete: () => {
        setResult(stopAt);
        setIsSpinning(false);
      }
    });
  };

  const closeQuiz = () => {
    setIsOpen(false);
    setResult(null);
    // 不重置 rotationRef，讓下次打開時保持位置
  };

  const resetQuiz = () => {
    setResult(null);
    // 只清除結果文字，不重置轉盤旋轉
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
        <div className="entry-icon" style={{ 
          transform: 'rotate(180deg)', 
          WebkitTransform: 'rotate(180deg)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '2px solid var(--primary-gold)',
          background: 'linear-gradient(to right, #fff 50%, #000 50%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'inline-block'
        }}>
          <div style={{ position: 'absolute', top: 0, left: '25%', width: '50%', height: '50%', background: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '25%', height: '25%', background: '#000', borderRadius: '50%' }}></div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: '25%', width: '50%', height: '50%', background: '#000', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '25%', height: '25%', background: '#fff', borderRadius: '50%' }}></div>
          </div>
        </div>
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
          backdropFilter: 'blur(10px)', padding: '10px',
          boxSizing: 'border-box'
        }}>
          <div className="quiz-modal-content" style={{ 
            width: '95%', maxWidth: '500px', textAlign: 'center',
            position: 'relative', maxHeight: '90vh', overflowY: 'auto',
            padding: '40px 15px 20px', scrollbarWidth: 'none',
            background: '#111', borderRadius: '30px', border: '1px solid var(--primary-gold)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            boxSizing: 'border-box', boxShadow: '0 0 50px rgba(0,0,0,1)'
          }}>
            <button onClick={closeQuiz} style={{
              position: 'absolute', top: '15px', right: '15px',
              background: 'rgba(255,255,255,0.1)', border: '1px solid #fff', color: '#fff',
              borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer',
              zIndex: 100, fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>✕</button>

            <h2 style={{ color: 'var(--primary-gold)', fontSize: '1.6rem', marginBottom: '20px', marginTop: '10px' }}>{t?.quizTitle}</h2>

            <div className="quiz-container" style={{ 
              position: 'relative', width: '320px', height: '320px', margin: '0 auto',
              flexShrink: 0 // 關鍵：防止被下方的文字內容擠壓變形
            }}>
              {/* 指針 (不動) */}
              <div style={{
                position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)',
                width: '0', height: '0', borderLeft: '15px solid transparent', borderRight: '15px solid transparent',
                borderTop: '30px solid var(--accent-orange)', zIndex: 10
              }}></div>

              {/* 整個旋轉體 (金邊 + 盤面) */}
              <div ref={wheelRef} style={{ 
                width: '100%', height: '100%', position: 'relative',
                filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.4))'
              }}>
                {/* 金色底層 */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  background: 'var(--primary-gold)',
                  clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                }}></div>

                {/* 盤面內容 */}
                <div style={{ 
                  position: 'absolute', top: '4px', left: '4px', 
                  width: 'calc(100% - 8px)', height: 'calc(100% - 8px)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
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
                  
                  {/* 中心太極 */}
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '80px', height: '80px', borderRadius: '50%',
                    border: '3px solid var(--primary-gold)', background: '#000',
                    zIndex: 5, overflow: 'hidden'
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
            </div>

            {!result ? (
              <button onClick={startQuiz} disabled={isSpinning} className="cta-button" style={{ marginTop: '40px' }}>
                {isSpinning ? '...' : (t?.quizBtn || '啟動命運之輪')}
              </button>
            ) : (
              <div className="result-box" style={{ 
                marginTop: '40px', padding: '25px', background: 'rgba(212, 175, 55, 0.1)', 
                borderRadius: '20px', border: '1px solid var(--primary-gold)',
                animation: 'fadeIn 0.5s forwards'
              }}>
                <h3 style={{ color: 'var(--accent-orange)', fontSize: '1.4rem', marginBottom: '10px' }}>
                  {(t?.quizResultTitle || '【 您的天命方位 】')} {result}
                </h3>
                <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>性格：{t?.baguaData?.[result]?.role || '---'}</p>
                <p style={{ opacity: 0.9, fontSize: '0.95rem', lineHeight: '1.6' }}>{t?.baguaData?.[result]?.desc || ''}</p>
                <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  💡 {t?.baguaData?.[result]?.tip || ''}
                </div>
                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  justifyContent: 'center', 
                  alignItems: 'stretch', // 確保高度一致
                  marginTop: '25px'
                }}>
                  <button 
                    onClick={handleShareCard} 
                    disabled={isGenerating}
                    className="cta-button"
                    style={{ 
                      padding: '12px 10px', 
                      fontSize: '0.9rem', 
                      background: 'var(--accent-orange)',
                      margin: 0,
                      flex: '1',
                      borderRadius: '12px',
                      display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}
                  >
                    {isGenerating ? '...' : (lang === 'en' ? 'Share' : '分享成就')}
                  </button>
                  <button 
                    onClick={resetQuiz} 
                    style={{ 
                      background: 'rgba(212, 175, 55, 0.1)', 
                      color: 'var(--primary-gold)', 
                      border: '1px solid var(--primary-gold)', 
                      cursor: 'pointer', 
                      fontSize: '0.9rem',
                      padding: '12px 10px',
                      borderRadius: '12px',
                      flex: '1',
                      transition: 'all 0.2s ease',
                      display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}
                  >
                    {t?.quizReplay || '再次問卜'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 隱藏的卡片模板 (用於圖片產生) */}
      <div ref={cardRef} style={{
        position: 'absolute', left: '-9999px', top: 0,
        width: '500px', padding: '40px', background: '#0a0a0a',
        color: '#c1a57b', border: '12px double #d4af37',
        textAlign: 'center', fontFamily: 'serif'
      }}>
        <div style={{ fontSize: '1.2rem', letterSpacing: '4px', marginBottom: '20px', color: '#d4af37' }}>
          {t.mainTitle}
        </div>
        <div style={{ fontSize: '5rem', margin: '20px 0' }}>{result}</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-orange)', marginBottom: '15px' }}>
          {t.quizResultTitle}
        </div>
        <div style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid #d4af37', paddingBottom: '10px' }}>
          {result && t.baguaData[result].role}
        </div>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', textAlign: 'left', opacity: 0.9 }}>
          {result && t.baguaData[result].desc}
        </p>
        <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(212,175,55,0.1)', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '5px' }}>天命指引</div>
          <div style={{ fontSize: '1.1rem', fontStyle: 'italic' }}>{result && t.baguaData[result].tip}</div>
        </div>
        <div style={{ marginTop: '40px', fontSize: '0.8rem', opacity: 0.5 }}>
          探索新港謎蹤 ‧ 尋找遺落的八卦
        </div>
      </div>

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
