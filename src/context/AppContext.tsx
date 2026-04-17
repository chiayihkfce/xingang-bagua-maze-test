import React, { createContext, useContext, ReactNode } from 'react';
import { useAppController } from '../hooks/useAppController';

/**
 * 定義 Context 的型別 (直接繼承自 useAppController 的回傳型別)
 */
type AppContextType = ReturnType<typeof useAppController>;

const AppContext = createContext<AppContextType | null>(null);

/**
 * AppProvider 組件：封裝全域狀態提供者
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const app = useAppController();

  return (
    <AppContext.Provider value={app}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * 自定義 Hook：方便子組件獲取全域狀態與方法
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext 必須在 AppProvider 內部使用');
  }
  return context;
};
