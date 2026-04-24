import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';

interface FooterProps {
  t: any;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  const { APP_VERSION } = useAppContext();
  const [clickCount, setClickCount] = useState(0);
  const [showEgg, setShowEgg] = useState(false);
  const timerRef = useRef<any>(null);

  const handleEggTrigger = (e: React.MouseEvent) => {
    // 防止點擊圖片時直接跳轉外部網頁 (如果是在開發彩蛋期間)
    // e.preventDefault(); 
    
    setClickCount(prev => prev + 1);
    
    // 視覺震動回饋
    const target = e.currentTarget as HTMLElement;
    target.style.transform = 'scale(0.9) rotate(5deg)';
    setTimeout(() => { target.style.transform = ''; }, 100);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 2000); // 2秒內沒繼續點就歸零

    if (clickCount + 1 >= 3) {
      setShowEgg(true);
      setClickCount(0);
    }
  };

  const TRIVIA_LIST = [
    { title: "🏰 消失的笨港與新港", content: "清嘉慶九年（1804年），笨港溪洪水氾濫淹沒市區，居民遷往東側的「麻園寮」，這才建立了我們今天所見的「新港」（新笨港）。" },
    { title: "🍜 鴨肉羹的工藝", content: "新港著名的鴨肉羹是以「生炒」聞名。師傅在高溫火候下將鴨肉片與蔥段快速翻炒出炭香味，再加入筍絲勾芡，是新港傳承數十年的經典手藝。" },
    { title: "🏮 奉天宮的黃金馬祖", content: "新港奉天宮的媽祖擁有一面特殊的金牌，是清朝時期由官方特許敕封的象徵。廟內的交趾陶與剪黏工藝，更讓它被譽為「開臺媽祖」的信仰中心。" },
    { title: "🍬 新港飴的誕生 (1891)", content: "光緒十七年（1891年），小販黃倪因大雨導致花生受潮，試著將其融入麥芽糖熬煮，意外創出「老鼠糖」，即今日名聞遐邇的「新港飴」。" },
    { title: "🎨 交趾陶與剪黏故鄉", content: "新港是台灣交趾陶與剪黏工藝的發源地。許多宮廟的裝飾藝術都出自新港大師之手，讓這座小鎮擁有「台灣寺廟藝術殿堂」的美譽。" },
    { title: "🏠 培桂堂 (1933)", content: "這座被稱為「培桂堂」的林開泰診療所建於 1933 年（昭和八年）。它結合了閩式、日式與西洋建築元素，見證了新港醫生世家的人文氣息。" },
    { title: "🚂 五分車的汽笛聲", content: "早期新港有繁忙的台糖五分車鐵道（北港線）。雖然現在已轉型為鐵路公園，但當年蒸氣火車穿梭街區、載運甘蔗的盛況，仍留在老一輩新港人的記憶中。" },
    { title: "📜 白鸞卿的冒險原型", content: "遊戲中的時空神祕疾病，靈感來源於歷史上真實發生的社會變遷。我們希望透過「解謎」，讓大家看見新港在不同時代交替下的韌性與生命力。" },
    { title: "✉️ 給時空旅人的訊息", content: "感謝您來到新港。這款解謎遊戲是由一群熱愛鄉土的夥伴共同研發。希望透過時空穿梭，讓您能感受到這座古鎮真實的溫度。 —— 製作小組敬啟" }
  ];

  const randomTrivia = TRIVIA_LIST[Math.floor(Math.random() * TRIVIA_LIST.length)];

  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>{t.contactInfo}</h3>
        <p>
          <a 
            href="https://www.hkfce.org.tw/tw" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {t.foundationName}
          </a>
        </p>
        <p>
          <a 
            href="https://www.google.com.tw/maps/place/%E8%B2%A1%E5%9C%98%E6%B3%95%E4%BA%BA%E6%96%B0%E6%B8%AF%E6%96%87%E6%95%99%E5%9F%BA%E9%87%91%E6%9C%83/@23.5600241,120.3436242,17z/data=!4m5!3m4!1s0x346ebd52d25d3f79:0xee3b4c7708b19c2e!8m2!3d23.5598989!4d120.3437709?hl=zh-TW&shorturl=1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="address-link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', verticalAlign: 'middle'}}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {t.address}
          </a>
        </p>
        <p>{t.phoneFull}</p>
        <div className="refund-policy">
          <h4>{t.refundTitle}</h4>
          <ul>
            <li>{t.refund1}</li>
            <li>{t.refund2}</li>
            <li>{t.refund3}</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div 
          onClick={handleEggTrigger}
          className="admin-trigger"
          style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
        >
          <img src="footer-logo.svg" alt="Hsinkang Foundation Logo" className="footer-admin-logo" />
        </div>
        <p className="copy">{t.footerCopy} <span style={{ opacity: 0.5, fontSize: '0.8rem', marginLeft: '8px' }}>v{APP_VERSION}</span></p>
      </div>

      {/* 彩蛋彈窗 */}
      {showEgg && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.85)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)', animation: 'fadeIn 0.3s'
          }}
          onClick={() => setShowEgg(false)}
        >
          <div 
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)',
              padding: '30px', borderRadius: '25px', border: '2px solid var(--primary-gold)',
              maxWidth: '350px', width: '90%', textAlign: 'center',
              boxShadow: '0 0 30px rgba(241, 196, 15, 0.3)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📜</div>
            <h3 style={{ color: 'var(--primary-gold)', marginBottom: '15px', fontFamily: 'serif' }}>
              {randomTrivia.title}
            </h3>
            <p style={{ color: '#ecf0f1', lineHeight: '1.6', fontSize: '1.05rem', textAlign: 'justify' }}>
              {randomTrivia.content}
            </p>
            <button 
              onClick={() => setShowEgg(false)}
              style={{
                marginTop: '25px', padding: '10px 30px', borderRadius: '50px',
                background: 'var(--primary-gold)', color: '#000', border: 'none',
                fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              我知道了
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}} />
    </footer>
  );
};

export default Footer;
