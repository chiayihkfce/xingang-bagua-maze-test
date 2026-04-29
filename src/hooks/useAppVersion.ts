import { useEffect } from 'react';

/**
 * 處理應用程式的版本檢查與快取清理
 */
export const useAppVersion = (appVersion: string) => {
  useEffect(() => {
    const savedVersion = localStorage.getItem('app_version');
    if (savedVersion !== appVersion) {
      console.log(
        `[系統] 偵測到版本更新 (${savedVersion} -> ${appVersion})，正在清理過時快取...`
      );
      // 清理可能導致 UI 不一致的關鍵快取
      const keysToClear = [
        'bagua_maze_sessions',
        'bagua_maze_slots',
        'adminSortConfig'
      ];
      keysToClear.forEach((key) => localStorage.removeItem(key));

      localStorage.setItem('app_version', appVersion);

      // 如果是從舊版本升級，可視情況強制重新載入頁面確保狀態乾淨
      if (savedVersion) {
        window.location.reload();
      }
    }
  }, [appVersion]);
};
