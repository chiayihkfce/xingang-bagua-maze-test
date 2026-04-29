import { useEffect, useState } from 'react';
/**
 * 新港八卦謎蹤 - 彩蛋 Hook
 */
export const useEasterEggs = (props?: {
  isFlashlightOn: boolean;
  setIsFlashlightOn: (val: boolean) => void;
  setHasPoetrySlip: (val: boolean) => void;
  setHasTigerSeal: (val: boolean) => void;
  setHasDuckSoup: (val: boolean) => void;
  setHasCandy: (val: boolean) => void;
  showAlert: (message: string, title?: string) => void;
}) => {
  const [isAwakened, setIsAwakened] = useState(false);

  // 優先使用 props，若無則不執行（相容舊邏輯但避免崩潰）
  const isFlashlightOn = props?.isFlashlightOn ?? false;
  const setIsFlashlightOn = props?.setIsFlashlightOn ?? (() => {});
  const setHasPoetrySlip = props?.setHasPoetrySlip ?? (() => {});
  const setHasTigerSeal = props?.setHasTigerSeal ?? (() => {});
  const setHasDuckSoup = props?.setHasDuckSoup ?? (() => {});
  const setHasCandy = props?.setHasCandy ?? (() => {});
  const showAlert = props?.showAlert ?? (() => {});

  // 1. 顯示神祕詩籤
  const showMysticScroll = () => {
    if (document.getElementById('mystic-scroll-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'mystic-scroll-overlay';
    overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 200000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); animation: fadeIn 0.8s ease; font-family: 'Noto Serif TC', serif;`;
    overlay.innerHTML = `
      <div style="background: #1a1a1a; border: 2px solid #d4af37; padding: 40px; border-radius: 10px; text-align: center; max-width: 90%; box-shadow: 0 0 50px rgba(212,175,55,0.3); position: relative;">
        <div style="color: #d4af37; font-size: 1.5rem; margin-bottom: 25px; letter-spacing: 5px;">📜 獲得隱藏線索 📜</div>
        <div style="color: #fff; font-size: 1.2rem; line-height: 2.5; letter-spacing: 3px; margin-bottom: 30px;">
          <p>新港街頭八卦生</p>
          <p>培桂堂前影自橫</p>
          <p>乾位尋真坤位引</p>
          <p>萬象歸宗見太平</p>
        </div>
        <button id="close-scroll" style="background: transparent; border: 1px solid #d4af37; color: #d4af37; padding: 8px 30px; border-radius: 20px; cursor: pointer;">領悟</button>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay
      .querySelector('#close-scroll')
      ?.addEventListener('click', () => overlay.remove());
  };

  // 2. 顯示八卦寶盒 (虎爺符令)
  const triggerBaguaBox = () => {
    if (document.getElementById('bagua-box-overlay')) return;
    setIsAwakened(true);
    setHasTigerSeal(true); // 獲得道具

    const overlay = document.createElement('div');
    overlay.id = 'bagua-box-overlay';
    overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.9); z-index: 200000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); animation: fadeIn 0.8s ease;`;

    overlay.innerHTML = `
      <div style="perspective: 1200px; text-align: center;">
        <div id="mystic-box" style="width: 260px; height: 180px; position: relative; transform-style: preserve-3d; transition: transform 2s ease; margin: 0 auto 60px;">
          <div style="position: absolute; width: 100%; height: 100%; background: #4a0404; border: 4px solid #d4af37; border-radius: 4px; box-shadow: inset 0 0 40px #000; z-index: 1;">
            <div id="box-light" style="position: absolute; width: 100%; height: 100%; background: radial-gradient(circle, #ffe082 0%, transparent 70%); opacity: 0; transition: opacity 1.5s ease 0.8s;"></div>
          </div>
          <div id="box-lid" style="position: absolute; width: 268px; height: 188px; background: #5c0505; border: 4px solid #d4af37; border-radius: 4px; top: -8px; left: -8px; z-index: 5; transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1); transform-origin: top; cursor: pointer; display: flex; align-items: center; justify-content: center;">
             <svg width="120" height="120" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="45" stroke="#d4af37" stroke-width="1" fill="none" opacity="0.3"/><text x="50" y="57" font-size="25" text-anchor="middle" fill="#d4af37">☯</text>
             </svg>
             <div style="position: absolute; bottom: 15px; color: #d4af37; font-size: 0.7rem; letter-spacing: 3px;">點擊開啟</div>
          </div>
          <div id="mystic-seal" style="position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; opacity: 0; z-index: 3; transition: all 2s ease 0.8s; pointer-events: none;">
             <div style="position: relative;">
               <img src="/奉天宮虎印.png" alt="新港奉天宮虎印" style="width: 220px; height: auto; filter: drop-shadow(0 0 30px rgba(212,175,55,0.7));" />
               <div style="position: absolute; bottom: -10px; left: 10%; width: 80%; height: 30px; background: radial-gradient(ellipse, #d4af37 0%, transparent 70%); filter: blur(15px); opacity: 0.6;"></div>
             </div>
          </div>
        </div>
        <div id="box-text" style="opacity: 0; transition: all 1.5s ease 1.5s; max-width: 650px;">
          <div style="color: #d4af37; font-size: 1.8rem; letter-spacing: 12px; font-family: 'Noto Serif TC', serif; text-shadow: 0 0 20px rgba(212,175,55,0.6); margin-bottom: 20px;">—— 虎爺符令 ——</div>
          <div style="color: rgba(255,255,255,0.9); font-size: 1rem; line-height: 2.2; letter-spacing: 2.5px; font-style: italic; padding: 0 30px; text-align: justify; background: rgba(212, 175, 55, 0.05); border-left: 2px solid var(--primary-gold); border-right: 2px solid var(--primary-gold);">
            中間斷裂用鐵片包覆，嘉慶年間奉天宮立廟時之虎爺大符印，上刻書「新南港 奉天宮 虎將軍」。古笨港沖毀後，街分南北，笨南港東遷麻園寮演變為「新南港」。奉天宮虎爺受封，奉於案桌上為全台獨有。
            <div style="text-align: right; font-size: 0.75rem; opacity: 0.6; margin-top: 15px;">—— 資訊來源：新港奉天宮官方文獻 ——</div>
          </div>
        </div>
        <button id="close-box" style="margin-top: 40px; background: transparent; border: 1px solid #d4af37; color: #d4af37; padding: 10px 40px; border-radius: 30px; cursor: pointer; opacity: 0; transition: all 1s ease 2s; font-size: 1.1rem;">領悟</button>
      </div>
    `;
    document.body.appendChild(overlay);

    const lid = document.getElementById('box-lid');
    lid?.addEventListener('click', () => {
      lid.style.transform = 'rotateX(110deg)';
      lid.style.opacity = '0';
      lid.style.pointerEvents = 'none';
      document.getElementById('mystic-box')!.style.transform = 'scale(1.1)';
      document.getElementById('box-light')!.style.opacity = '1';
      document.getElementById('mystic-seal')!.style.opacity = '1';
      document.getElementById('box-text')!.style.opacity = '1';
      document.getElementById('close-box')!.style.opacity = '1';
    });

    overlay.querySelector('#close-box')?.addEventListener('click', () => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        setIsAwakened(false);
      }, 800);
    });
  };

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      const lens = document.getElementById('bagua-lens-cursor');
      const overlay = document.getElementById('bagua-lens-overlay');
      if (!lens || !overlay) return;
      lens.style.left = `${x}px`;
      lens.style.top = `${y}px`;
      overlay.style.webkitMaskImage = `radial-gradient(circle 150px at ${x}px ${y}px, transparent 0%, black 100%)`;
      document.querySelectorAll('.hidden-clue').forEach((clue: any) => {
        const rect = clue.getBoundingClientRect();
        const dist = Math.sqrt(
          Math.pow(x - (rect.left + rect.width / 2), 2) +
            Math.pow(y - (rect.top + rect.height / 2), 2)
        );
        clue.style.opacity = dist < 150 ? '1' : '0';
      });
    };
    const handleMouseMove = (e: MouseEvent) =>
      updatePosition(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0)
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    };

    if (isFlashlightOn) {
      if (document.getElementById('bagua-lens-overlay')) return;
      const overlay = document.createElement('div');
      overlay.id = 'bagua-lens-overlay';
      overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.92); z-index: 150000; pointer-events: none; -webkit-mask-image: radial-gradient(circle 150px at 0px 0px, transparent 100%, black 100%); transition: opacity 0.5s ease;`;
      const lens = document.createElement('div');
      lens.id = 'bagua-lens-cursor';
      lens.innerHTML = '☯';
      lens.style.cssText = `position: fixed; width: 300px; height: 300px; border: 2px solid #d4af37; border-radius: 50%; top: 0; left: 0; transform: translate(-50%, -50%); z-index: 999999999; pointer-events: none; display: flex; align-items: center; justify-content: center; color: rgba(212, 175, 55, 0.3); font-size: 10rem; box-shadow: 0 0 50px rgba(212, 175, 55, 0.5);`;
      const tip = document.createElement('div');
      tip.id = 'bagua-lens-tip';
      tip.innerHTML =
        '【探照模式】移動尋找隱藏線索... (再按一次手電筒或 Esc 關閉)';
      tip.style.cssText = `position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); color: #d4af37; z-index: 999999999; font-family: 'Noto Serif TC', serif; background: rgba(0,0,0,0.8); padding: 5px 20px; border-radius: 20px; font-size: 0.9rem;`;
      document.body.appendChild(overlay);
      document.body.appendChild(lens);
      document.body.appendChild(tip);
      document.body.classList.add('lens-mode');
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
    } else {
      const existing = document.getElementById('bagua-lens-overlay');
      if (existing) {
        existing.remove();
        document.getElementById('bagua-lens-cursor')?.remove();
        document.getElementById('bagua-lens-tip')?.remove();
        document.body.classList.remove('lens-mode');
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
      }
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isFlashlightOn]);

  useEffect(() => {
    const hexagrams = [
      { name: '乾為天', tip: '大吉。元亨利貞，天行健。' },
      { name: '坤為地', tip: '厚德載物。' },
      { name: '水雷屯', tip: '宜建侯而不寧。' },
      { name: '山水蒙', tip: '啟蒙之時。' }
    ];
    const randomHex = hexagrams[Math.floor(Math.random() * hexagrams.length)];
    console.log(
      `%c【 新港八卦謎蹤 - 每日一卦 】\n卦名：${randomHex.name}\n指引：${randomHex.tip}`,
      'color: #d4af37; font-weight: bold;'
    );

    const konamiCode = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a'
    ];

    // 英文備用密令
    const clueCode = ['c', 'l', 'u', 'e'];
    const baguaCode = ['b', 'a', 'g', 'u', 'a'];
    let kIdx = 0,
      cIdx = 0,
      bIdx = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (e.key === 'Escape' && isFlashlightOn) setIsFlashlightOn(false);

      // 上上下下左右左右BA (無敵模式)
      if (e.key === konamiCode[kIdx]) {
        kIdx++;
        if (kIdx === konamiCode.length) {
          kIdx = 0;
          setIsAwakened(true);
        }
      } else kIdx = 0;

      // 英文密令保留作為後門
      if (key === clueCode[cIdx]) {
        cIdx++;
        if (cIdx === clueCode.length) {
          cIdx = 0;
          setHasPoetrySlip(true);
          showAlert('獲得了【神祕詩籤】！已放入道具箱。', '📜 獲得道具');
        }
      } else cIdx = 0;
      if (key === baguaCode[bIdx]) {
        bIdx++;
        if (bIdx === baguaCode.length) {
          bIdx = 0;
          triggerBaguaBox();
        }
      } else bIdx = 0;
    };

    // 處理自定義密令事件 (支援中文)
    const handleSecretCommand = (e: any) => {
      const command = (e.detail || '').trim();

      if (command === '培桂堂') {
        setHasPoetrySlip(true);
        showAlert('感應到培桂堂的氣息...獲得了【神祕詩籤】！', '📜 獲得道具');
      } else if (command === '乾坤') {
        triggerBaguaBox();
      } else if (command === '鴨肉羹') {
        setHasDuckSoup(true);
        showAlert(
          '聞到了大火爆香的鴨肉與筍絲香味...獲得了【新港鴨肉羹】！',
          '🍜 獲得美食'
        );
      } else if (command === '老鼠糖' || command === '新港飴') {
        setHasCandy(true);
        showAlert(
          '嚼著香 Q 帶勁的花生麥芽糖...獲得了【新港飴(老鼠糖)】！',
          '🍬 獲得美食'
        );
      } else if (command === '太平') {
        showAlert('萬象歸宗，天下太平。', '☯ 啟示');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('secret-command' as any, handleSecretCommand);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('secret-command' as any, handleSecretCommand);
    };
  }, [
    isFlashlightOn,
    setIsFlashlightOn,
    setHasPoetrySlip,
    setHasTigerSeal,
    showAlert
  ]);

  return { isAwakened, triggerBaguaBox, showMysticScroll };
};
