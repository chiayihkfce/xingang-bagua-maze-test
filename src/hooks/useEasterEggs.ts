import { useEffect, useState } from 'react';

/**
 * 新港八卦謎蹤 - 彩蛋 Hook
 */
export const useEasterEggs = () => {
  const [isAwakened, setIsAwakened] = useState(false);

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
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 
      'ArrowDown', 'ArrowDown', 
      'ArrowLeft', 'ArrowRight', 
      'ArrowLeft', 'ArrowRight', 
      'b', 'a'
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          triggerAwakening();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    const triggerAwakening = () => {
      setIsAwakened(true);
      document.body.classList.add('awakened-mode');
      
      // 顯示神祕提示
      const notification = document.createElement('div');
      notification.innerHTML = '✨ 八卦覺醒：洞悉天命 ✨';
      notification.style.cssText = `
        position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%);
        padding: 20px 40px; background: rgba(212, 175, 55, 0.9);
        color: #000; font-weight: bold; border-radius: 50px;
        z-index: 10000; box-shadow: 0 0 50px rgba(212, 175, 55, 1);
        font-size: 1.5rem; animation: fadeOutUp 3s forwards; pointer-events: none;
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isAwakened };
};
