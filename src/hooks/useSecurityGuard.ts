import { useEffect } from 'react';

/**
 * 系統安全守衛：防止 F12、右鍵與開發者工具檢視
 */
export const useSecurityGuard = () => {
  useEffect(() => {
    // 僅在正式環境或特定需求下啟用 (若需開發時偵錯可加條件)
    const isDev = window.location.hostname === 'localhost';
    if (isDev) return;

    // 1. 禁用右鍵選單
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. 禁用快捷鍵 (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U') ||
        (e.metaKey && e.altKey && e.key === 'i') // Mac CMD+ALT+I
      ) {
        e.preventDefault();
        return false;
      }
    };

    // 3. 開發者工具偵測與反制 (Debugger 陷阱)
    const trap = setInterval(() => {
      const startTime = performance.now();
      debugger; // 如果開啟 F12，會卡在這裡
      const endTime = performance.now();
      
      // 如果執行時間過長，代表可能被 debugger 攔截
      if (endTime - startTime > 100) {
        console.clear();
        // 這裡可以選擇 reload 或導向警告頁面
      }
    }, 2000);

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(trap);
    };
  }, []);
};
