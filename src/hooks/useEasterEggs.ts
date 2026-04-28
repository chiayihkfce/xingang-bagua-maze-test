import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

/**
 * 新港八卦謎蹤 - 彩蛋 Hook
 */
export const useEasterEggs = () => {
  const [isAwakened, setIsAwakened] = useState(false);
  const { isFlashlightOn, setIsFlashlightOn, setHasPoetrySlip } = useAppContext();

  // 將 showMysticScroll 定義在內部以便復用
  const showMysticScroll = () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 200000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); animation: fadeIn 0.8s ease; font-family: 'Noto Serif TC', serif;`;
    overlay.innerHTML = `<div style="background: #1a1a1a; border: 2px solid #d4af37; padding: 40px; border-radius: 10px; text-align: center; max-width: 90%; box-shadow: 0 0 50px rgba(212,175,55,0.3); position: relative;"><div style="color: #d4af37; font-size: 1.5rem; margin-bottom: 25px; letter-spacing: 5px;">📜 獲得隱藏線索 📜</div><div style="color: #fff; font-size: 1.2rem; line-height: 2.5; letter-spacing: 3px; margin-bottom: 30px;"><p>新港街頭八卦生</p><p>培桂堂前影自橫</p><p>乾位尋真坤位引</p><p>萬象歸宗見太平</p></div><button id="close-scroll" style="background: transparent; border: 1px solid #d4af37; color: #d4af37; padding: 8px 30px; border-radius: 20px; cursor: pointer;">領悟</button></div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#close-scroll')?.addEventListener('click', () => overlay.remove());
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const lens = document.getElementById('bagua-lens-cursor');
      const overlay = document.getElementById('bagua-lens-overlay');
      if (!lens || !overlay) return;

      lens.style.left = `${e.clientX}px`;
      lens.style.top = `${e.clientY}px`;
      overlay.style.webkitMaskImage = `radial-gradient(circle 150px at ${e.clientX}px ${e.clientY}px, transparent 0%, black 100%)`;
      
      document.querySelectorAll('.hidden-clue').forEach((clue: any) => {
        const rect = clue.getBoundingClientRect();
        const dist = Math.sqrt(Math.pow(e.clientX - (rect.left + rect.width/2), 2) + Math.pow(e.clientY - (rect.top + rect.height/2), 2));
        clue.style.opacity = dist < 150 ? '1' : '0';
      });
    };

    if (isFlashlightOn) {
      const existingLens = document.getElementById('bagua-lens-overlay');
      if (existingLens) return;

      const overlay = document.createElement('div');
      overlay.id = 'bagua-lens-overlay';
      overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.92); z-index: 150000; pointer-events: none;
        -webkit-mask-image: radial-gradient(circle 150px at 0px 0px, transparent 100%, black 100%);
      `;

      const lens = document.createElement('div');
      lens.id = 'bagua-lens-cursor';
      lens.innerHTML = '☯';
      lens.style.cssText = `
        position: fixed; width: 300px; height: 300px;
        border: 2px solid #d4af37; border-radius: 50%;
        top: 0; left: 0; transform: translate(-50%, -50%);
        z-index: 150001; pointer-events: none;
        display: flex; align-items: center; justify-content: center;
        color: rgba(212, 175, 55, 0.3); font-size: 10rem;
        box-shadow: 0 0 50px rgba(212, 175, 55, 0.5);
      `;

      const tip = document.createElement('div');
      tip.id = 'bagua-lens-tip';
      tip.innerHTML = '【探照模式】移動滑鼠尋找隱藏線索... (再按一次手電筒或 Esc 鍵關閉)';
      tip.style.cssText = `position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); color: #d4af37; z-index: 150002; font-family: \'Noto Serif TC\', serif; background: rgba(0,0,0,0.8); padding: 5px 20px; border-radius: 20px; box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);`;

      document.body.appendChild(overlay);
      document.body.appendChild(lens);
      document.body.appendChild(tip);
      document.body.classList.add('lens-mode');
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      const existing = document.getElementById('bagua-lens-overlay');
      if (existing) {
        existing.remove();
        document.getElementById('bagua-lens-cursor')?.remove();
        document.getElementById('bagua-lens-tip')?.remove();
        document.body.classList.remove('lens-mode');
        window.removeEventListener('mousemove', handleMouseMove);
      }
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isFlashlightOn]);

  useEffect(() => {
    // 1. 控制台預言 (Console Easter Egg)
    const hexagrams = [
      { name: '乾為天', tip: '大吉。元亨利貞，天行健，君子以自強不息。' },
      { name: '坤為地', tip: '承載萬物，德合無疆。柔順伸展，厚德載物。' },
      { name: '水雷屯', tip: '萬事開頭難，動於險中，宜建侯而不寧。' },
      { name: '山水蒙', tip: '啟蒙之時，誠信則靈。' },
      { name: '水天需', tip: '雲上於天，需。君子以飲食宴樂，等待時機。' },
      { name: '天水訟', tip: '爭訟非吉，宜退一步海闊天空。' },
      { name: '地水師', tip: '行軍用兵，貞正則吉。' },
      { name: '水地比', tip: '親比相輔，原筮元永貞，無咎。' }
    ];
    const randomHex = hexagrams[Math.floor(Math.random() * hexagrams.length)];

    console.log(
      `%c
          乾 ☰
      巽 ☴     ☱ 兌
    離 ☲    ☯    ☵ 坎
      艮 ☶     ☳ 震
          坤 ☷

    【 新港八卦謎蹤 - 每日一卦 】
    ──────────────────────────
    卦名：${randomHex.name}
    指引：${randomHex.tip}
    ──────────────────────────
    %c解鎖八卦之謎，尋找隱藏的真相...
      `,
      'color: #d4af37; font-weight: bold; font-family: "Courier New", monospace; line-height: 1.5; font-size: 16px; text-shadow: 0 0 5px rgba(212, 175, 55, 0.3);',
      'color: #888; font-style: italic; font-size: 12px;'
    );

    // 2. 子時 (23:00 - 01:00) 偵測
    const checkZishi = () => {
      const hour = new Date().getHours();
      if (hour === 23 || hour === 0) {
        document.body.classList.add('zishi-mode');
        console.log('%c⏳ 子時已至，陰陽交泰...', 'color: #9b59b6; font-style: italic;');
      } else {
        document.body.classList.remove('zishi-mode');
      }
    };
    checkZishi();

    // 3. 柯納米指令 (Konami Code)
    let konamiIndex = 0;
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    // 4. 解謎密令 (Keywords)
    let clueIndex = 0;
    const clueCode = ['c', 'l', 'u', 'e'];
    let baguaIndex = 0;
    const baguaCode = ['b', 'a', 'g', 'u', 'a'];

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // 按下 Esc 關閉手電筒
      if (e.key === 'Escape' && isFlashlightOn) {
        setIsFlashlightOn(false);
      }

      // 檢查 Konami
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          triggerPulse('✨ 八卦覺醒：洞悉天命 ✨');
          konamiIndex = 0;
        }
      } else konamiIndex = 0;

      // 檢查 CLUE
      if (key === clueCode[clueIndex]) {
        clueIndex++;
        if (clueIndex === clueCode.length) {
          showMysticScroll();
          clueIndex = 0;
        }
      } else clueIndex = 0;

      // 檢查 BAGUA
      if (key === baguaCode[baguaIndex]) {
        baguaIndex++;
        if (baguaIndex === baguaCode.length) {
          triggerBaguaUltimate();
          baguaIndex = 0;
        }
      } else baguaIndex = 0;
    };

    const triggerPulse = (msg: string) => {
      setIsAwakened(true);
      const pulse = document.createElement('div');
      pulse.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%); z-index: 100000; pointer-events: none; animation: pulseFade 1.5s ease-out forwards;`;
      document.body.appendChild(pulse);
      const notify = document.createElement('div');
      notify.innerHTML = msg;
      notify.style.cssText = `position: fixed; top: 30%; left: 50%; transform: translate(-50%, -50%); padding: 20px 40px; background: rgba(0,0,0,0.9); color: #d4af37; border: 2px solid #d4af37; border-radius: 50px; z-index: 100001; font-size: 1.5rem; font-family: 'Noto Serif TC', serif; box-shadow: 0 0 30px rgba(212, 175, 55, 0.5); pointer-events: none; animation: fadeOutUp 3s forwards;`;
      document.body.appendChild(notify);
      setTimeout(() => { pulse.remove(); notify.remove(); setIsAwakened(false); }, 3000);
    };


    const triggerBaguaUltimate = () => {
      setIsAwakened(true);
      document.body.style.animation = 'shake 0.5s ease-in-out infinite, blurShift 2s ease-in-out forwards';
      
      const container = document.createElement('div');
      container.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        z-index: 100000; pointer-events: none; display: flex;
        align-items: center; justify-content: center; overflow: hidden;
        background: radial-gradient(circle, rgba(212,175,55,0.2) 0%, rgba(0,0,0,0.8) 100%);
        animation: fadeInOut 4s forwards;
      `;

      const taiji = document.createElement('div');
      taiji.innerHTML = '☯';
      taiji.style.cssText = `
        font-size: 15rem; color: #d4af37; text-shadow: 0 0 50px #d4af37;
        animation: spin 2s linear infinite, scaleUp 0.5s ease-out forwards;
      `;
      container.appendChild(taiji);

      const trigrams = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
      trigrams.forEach((symbol, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        const distance = Math.max(window.innerWidth, window.innerHeight);
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const tDiv = document.createElement('div');
        tDiv.innerHTML = symbol;
        tDiv.style.cssText = `
          position: absolute; font-size: 4rem; color: #fff;
          text-shadow: 0 0 20px #d4af37; top: 50%; left: 50%;
          transform: translate(-50%, -50%); --tx: ${tx}px; --ty: ${ty}px;
          animation: shootOut 2.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        `;
        container.appendChild(tDiv);
      });

      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes shake { 0%, 100% { transform: translate(0,0); } 10%, 30%, 50%, 70%, 90% { transform: translate(-5px,-5px); } 20%, 40%, 60%, 80% { transform: translate(5px,5px); } }
        @keyframes blurShift { 0% { filter: blur(0); } 50% { filter: blur(4px) hue-rotate(45deg); } 100% { filter: blur(0); } }
        @keyframes shootOut { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; } 100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(3) rotate(720deg); opacity: 0; } }
        @keyframes fadeInOut { 0% { opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes scaleUp { 0% { transform: scale(0); } 100% { transform: scale(1); } }
      `;
      document.head.appendChild(style);
      document.body.appendChild(container);

      setTimeout(() => {
        document.body.style.animation = '';
        container.remove();
        style.remove();
        setIsAwakened(false);
      }, 4000);
    };

    const showMysticScroll = () => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.85); z-index: 200000; display: flex;
        align-items: center; justify-content: center; backdrop-filter: blur(10px);
        animation: fadeIn 0.8s ease; font-family: 'Noto Serif TC', serif;
      `;
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
      overlay.querySelector('#close-scroll')?.addEventListener('click', () => overlay.remove());
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isAwakened };
};
