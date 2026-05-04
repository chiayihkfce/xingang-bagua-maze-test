import { useEffect } from 'react';

/**
 * 系統安全守衛：防止 F12、右鍵選單檢視
 */
export const useSecurityGuard = () => {
  useEffect(() => {
    const isDev =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
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
        (e.metaKey && e.altKey && e.key === 'i')
      ) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);
};
