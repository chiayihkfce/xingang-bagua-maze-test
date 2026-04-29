import { useState, useEffect } from 'react';

/**
 * 處理應用程式的基礎 Hash 路由與導航邏輯
 */
export const useAppRouting = () => {
  // 取得秘密路徑環境變數，若不存在則設為 null
  const envSecret = import.meta.env.VITE_ADMIN_SECRET_PATH;
  const SECRET_ADMIN_PATH = envSecret ? envSecret.replace(/^\//, '') : null;

  const [currentPath, setCurrentPath] = useState(
    window.location.hash.replace(/^#\/?/, '').split('?')[0] || '/'
  );

  // 監聽網址變化
  useEffect(() => {
    const handleHashChange = () => {
      const path =
        window.location.hash.replace(/^#\/?/, '').split('?')[0] || '/';
      setCurrentPath(path);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 導航函數
  const navigate = (to: string) => {
    window.location.hash = to.startsWith('/') ? to : '/' + to;
  };

  return {
    currentPath,
    navigate,
    SECRET_ADMIN_PATH
  };
};
