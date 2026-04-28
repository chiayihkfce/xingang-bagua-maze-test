import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

/**
 * 新港八卦謎蹤 - 彩蛋 Hook
 */
export const useEasterEggs = () => {
  const [isAwakened, setIsAwakened] = useState(false);
  const { isFlashlightOn, setIsFlashlightOn, setHasPoetrySlip } = useAppContext();

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
        z-index: 999999999; pointer-events: none;
        display: flex; align-items: center; justify-content: center;
        color: rgba(212, 175, 55, 0.3); font-size: 10rem;
        box-shadow: 0 0 50px rgba(212, 175, 55, 0.5);
      `;

      const tip = document.createElement('div');
      tip.id = 'bagua-lens-tip';
      tip.innerHTML = '【探照模式】移動滑鼠尋找隱藏線索... (再按一次手電筒或 Esc 鍵關閉)';
      tip.style.cssText = `position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); color: #d4af37; z-index: 999999999; font-family: \'Noto Serif TC\', serif; background: rgba(0,0,0,0.8); padding: 5px 20px; border-radius: 20px; box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);`;

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
    let buguaIndex = 0;
    const buguaCode = ['b', 'u', 'g', 'u', 'a'];

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
          setHasPoetrySlip(true); // 獲得道具
          triggerPulse('📜 獲得道具：【神祕詩籤】📜', false); // 僅跳出獲得提示
          clueIndex = 0;
        }
      } else clueIndex = 0;

      // 檢查 BAGUA
      if (key === baguaCode[baguaIndex]) {
        baguaIndex++;
        if (baguaIndex === baguaCode.length) {
          triggerBaguaBox();
          baguaIndex = 0;
        }
      } else baguaIndex = 0;

      // 檢查 BUGUA (拼寫容錯)
      if (key === buguaCode[buguaIndex]) {
        buguaIndex++;
        if (buguaIndex === buguaCode.length) {
          triggerBaguaBox();
          buguaIndex = 0;
        }
      } else buguaIndex = 0;
    };

    const triggerPulse = (msg: string, showVisual = true) => {
      setIsAwakened(true);
      
      // 只有在需要時才顯示背景光圈特效
      let pulse: HTMLDivElement | null = null;
      if (showVisual) {
        pulse = document.createElement('div');
        pulse.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%); z-index: 100000; pointer-events: none; animation: pulseFade 1.5s ease-out forwards;`;
        document.body.appendChild(pulse);
      }

      const notify = document.createElement('div');
      notify.innerHTML = msg;
      notify.style.cssText = `position: fixed; top: 30%; left: 50%; transform: translate(-50%, -50%); padding: 20px 40px; background: rgba(0,0,0,0.9); color: #d4af37; border: 2px solid #d4af37; border-radius: 50px; z-index: 100001; font-size: 1.5rem; font-family: 'Noto Serif TC', serif; box-shadow: 0 0 30px rgba(212, 175, 55, 0.5); pointer-events: none; animation: fadeOutUp 3s forwards;`;
      document.body.appendChild(notify);

      setTimeout(() => {
        if (pulse) pulse.remove();
        notify.remove();
        setIsAwakened(false);
      }, 3000);
    };


    const triggerBaguaBox = () => {
      if (document.getElementById('bagua-box-overlay')) return;
      setIsAwakened(true);

      const overlay = document.createElement('div');
      overlay.id = 'bagua-box-overlay';
      overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.9); z-index: 200000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); animation: fadeIn 0.8s ease;`;
      
      overlay.innerHTML = `
        <style>
          @keyframes box-glow { 0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.2); } 50% { box-shadow: 0 0 50px rgba(212,175,55,0.5); } }
          @keyframes seal-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
          @keyframes light-beam { 0% { opacity: 0; transform: scaleY(0); } 50% { opacity: 0.5; transform: scaleY(1); } 100% { opacity: 0; transform: scaleY(1.2); } }
        </style>
        <div style="perspective: 1200px; text-align: center;">
          <div id="mystic-box" style="width: 260px; height: 180px; position: relative; transform-style: preserve-3d; transition: transform 2s ease; margin: 0 auto 60px; animation: box-glow 3s infinite;">
            <!-- 盒身 (Lacquer Wood) -->
            <div style="position: absolute; width: 100%; height: 100%; background: #4a0404; border: 4px solid #d4af37; border-radius: 4px; box-shadow: inset 0 0 40px #000; z-index: 1;">
              <!-- 內部金光 -->
              <div id="box-light" style="position: absolute; width: 100%; height: 100%; background: radial-gradient(circle, #ffe082 0%, transparent 70%); opacity: 0; transition: opacity 1.5s ease 0.8s;"></div>
            </div>
            
            <!-- 盒蓋 (帶有八卦圖) -->
            <div id="box-lid" style="position: absolute; width: 268px; height: 188px; background: #5c0505; border: 4px solid #d4af37; border-radius: 4px; top: -8px; left: -8px; z-index: 5; transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1); transform-origin: top; cursor: pointer; display: flex; align-items: center; justify-content: center;">
               <svg width="120" height="120" viewBox="0 0 100 100">
                 <circle cx="50" cy="50" r="45" stroke="#d4af37" stroke-width="1" fill="none" opacity="0.3"/>
                 <path d="M50 20 L50 80 M20 50 L80 50 M28 28 L72 72 M28 72 L72 28" stroke="#d4af37" stroke-width="0.5" opacity="0.5"/>
                 <circle cx="50" cy="50" r="25" fill="#d4af37" opacity="0.1"/>
                 <text x="50" y="57" font-size="25" text-anchor="middle" fill="#d4af37" style="filter: drop-shadow(0 0 5px #d4af37)">☯</text>
                 <g stroke="#d4af37" stroke-width="2">
                   <line x1="45" y1="10" x2="55" y2="10" /> <line x1="45" y1="90" x2="55" y2="90" />
                   <line x1="10" y1="45" x2="10" y2="55" /> <line x1="90" y1="45" x2="90" y2="55" />
                 </g>
               </svg>
               <div style="position: absolute; bottom: 15px; color: #d4af37; font-size: 0.7rem; letter-spacing: 3px; opacity: 0.8;">點擊以此開啟</div>
            </div>

            <!-- 使用奉天宮正宗虎印圖片 -->
            <div id="mystic-seal" style="position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; opacity: 0; z-index: 3; transition: all 2s ease 0.8s; pointer-events: none;">
               <div style="position: relative;">
                 <img 
                   src="/奉天宮虎印.png" 
                   alt="新港奉天宮虎印" 
                   style="width: 220px; height: auto; filter: drop-shadow(0 0 30px rgba(212,175,55,0.7));"
                 />
                 <!-- 底部印面金色光暈 -->
                 <div style="position: absolute; bottom: -10px; left: 10%; width: 80%; height: 30px; background: radial-gradient(ellipse, #d4af37 0%, transparent 70%); filter: blur(15px); opacity: 0.6;"></div>
               </div>
            </div>
            </div>

            <div id="box-text" style="opacity: 0; transition: all 1.5s ease 1.5s; max-width: 600px;">
            <div style="color: #d4af37; font-size: 1.6rem; letter-spacing: 12px; font-family: 'Noto Serif TC', serif; text-shadow: 0 0 20px rgba(212,175,55,0.6); margin-bottom: 15px;">—— 八卦鎮守：新港奉天宮虎印 ——</div>
            <div style="color: rgba(255,255,255,0.8); font-size: 0.95rem; line-height: 1.8; letter-spacing: 2px; font-style: italic; padding: 0 20px;">
              「金虎爺神威顯赫，鎮守八卦方位。此印能避邪除穢，<br/>在重重迷陣之中，助有緣人尋得生門，化險為夷。」
            </div>
            </div>
          
          <style>
            @keyframes ribbon-move { 0%, 100% { transform: rotate(15deg) translateY(0); } 50% { transform: rotate(20deg) translateY(5px); } }
          </style>
          <button id="close-box" style="margin-top: 40px; background: transparent; border: 1px solid #d4af37; color: #d4af37; padding: 10px 40px; border-radius: 30px; cursor: pointer; opacity: 0; transition: all 1s ease 2s; font-size: 1.1rem; letter-spacing: 2px;">領悟</button>
        </div>
      `;
      document.body.appendChild(overlay);

      const lid = document.getElementById('box-lid');
      const box = document.getElementById('mystic-box');
      
      const openBox = () => {
        const light = document.getElementById('box-light');
        const seal = document.getElementById('mystic-seal');
        const text = document.getElementById('box-text');
        const btn = document.getElementById('close-box');
        
        if (lid) {
          lid.style.transform = 'rotateX(110deg)';
          lid.style.opacity = '0';
          lid.style.pointerEvents = 'none';
        }
        if (box) box.style.transform = 'scale(1.1)';
        if (light) light.style.opacity = '1';
        if (seal) { seal.style.opacity = '1'; } // 移除 translateY
        if (text) { text.style.opacity = '1'; }
        if (btn) btn.style.opacity = '1';
      };

      lid?.addEventListener('click', openBox);

      overlay.querySelector('#close-box')?.addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          setIsAwakened(false);
        }, 800);
      });
    };

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
          <button id="close-scroll" style="background: transparent; border: 1px solid #d4af37; color: #d4af37; padding: 8px 30px; border-radius: 20px;">
            領悟
          </button>
        </div>
      `;
      document.body.appendChild(overlay);
      
      overlay.querySelector('#close-scroll')?.addEventListener('click', () => {
        overlay.remove();
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlashlightOn, setIsFlashlightOn, setHasPoetrySlip]); 

  return { isAwakened }; 
};
