import React, { useState, useEffect, useRef } from 'react';
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase';
import { AdminAccount } from '../types';
import { formatFullDateTime } from '../utils/dateUtils';

interface UseAdminAuthProps {
  showAlert: (message: string) => void;
  addLog: (
    type: string,
    details: string,
    operatorOverride?: string
  ) => Promise<void>;
  setIsDataLoading: (val: boolean) => void;
}

/**
 * 處理管理員身分驗證與登入邏輯
 */
export const useAdminAuth = (props?: UseAdminAuthProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true); // 預設開啟
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(null);

  // 避免重複登入的標記
  const hasAttemptedLogin = useRef(false);

  // --- 新增：初始化檢查 localStorage 自動登入 ---
  useEffect(() => {
    const attemptAutoLogin = async () => {
      if (isAdmin || hasAttemptedLogin.current || !props) return;

      const savedAdmin = localStorage.getItem('admin_session');
      if (savedAdmin) {
        try {
          const parsed = JSON.parse(savedAdmin);
          // 為了安全與資料即時性，自動登入時重新從 Firebase 驗證一次
          if (parsed.username && parsed.password) {
            hasAttemptedLogin.current = true;
            const { addLog, setIsDataLoading } = props;
            setIsDataLoading(true);

            const q = query(
              collection(db, 'admins'),
              where('username', '==', parsed.username),
              where('password', '==', parsed.password),
              limit(1)
            );

            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const adminDoc = querySnapshot.docs[0];
              const adminData = {
                id: adminDoc.id,
                ...adminDoc.data()
              } as AdminAccount;

              setCurrentAdmin(adminData);
              setIsAdmin(true);

              await addLog(
                '系統',
                `管理者 [${adminData.nickname || adminData.username}] 透過自動登入成功`,
                adminData.nickname || adminData.username
              );
            } else {
              // 密碼可能被改過，清除無效 session
              localStorage.removeItem('admin_session');
            }
            setIsDataLoading(false);
          }
        } catch (e) {
          console.error('Auto login parse error:', e);
        }
      }
    };

    attemptAutoLogin();
  }, [props, isAdmin]);

  // --- 新增：LINE 一鍵登入自動偵測邏輯 ---
  useEffect(() => {
    const handleLineAutoLogin = async () => {
      // 偵測 URL 參數中的 uid
      const urlParams = new URLSearchParams(
        window.location.hash.split('?')[1] || window.location.search
      );
      const lineUid = urlParams.get('uid');

      // 只有在有 uid 且尚未嘗試過登入時才執行
      if (lineUid && props && !hasAttemptedLogin.current) {
        hasAttemptedLogin.current = true; // 鎖定，不再重複執行

        const { addLog, setIsDataLoading, showAlert } = props;
        setIsAuthenticating(true);
        setIsDataLoading(true);
        try {
          // 搜尋擁有此 LINE UID 的管理者
          const q = query(
            collection(db, 'admins'),
            where('lineUid', '==', lineUid),
            limit(1)
          );

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const adminDoc = querySnapshot.docs[0];
            const adminData = {
              id: adminDoc.id,
              ...adminDoc.data()
            } as AdminAccount;

            setCurrentAdmin(adminData);
            setIsAdmin(true);

            // 更新最後登入時間
            await updateDoc(doc(db, 'admins', adminDoc.id), {
              lastLogin: formatFullDateTime(new Date())
            });

            await addLog(
              '系統',
              `管理者 [${adminData.nickname || adminData.username}] 透過 LINE 一鍵登入成功`,
              adminData.nickname || adminData.username
            );

            // 清除網址列的 uid，避免重複觸發或分享網址時洩漏
            const cleanUrl = window.location.href.split('?')[0];
            window.history.replaceState({}, document.title, cleanUrl);
          } else {
            showAlert('LINE 登入失敗：此帳號未綁定 LINE ID');
          }
        } catch (error) {
          console.error('LINE Auto Login error:', error);
        } finally {
          setIsDataLoading(false);
          setIsAuthenticating(false);
        }
      }
    };

    handleLineAutoLogin();
  }, [props]);
  // --- 結束 LINE 自動登入邏輯 ---

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!props) return;
    const { showAlert, addLog, setIsDataLoading } = props;

    setIsDataLoading(true);
    try {
      if (!adminUser) {
        showAlert('請輸入帳號');
        setIsDataLoading(false);
        return;
      }

      const q = query(
        collection(db, 'admins'),
        where('username', '==', adminUser),
        where('password', '==', adminPassword),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const adminDoc = querySnapshot.docs[0];
        const adminData = {
          id: adminDoc.id,
          ...adminDoc.data()
        } as AdminAccount;

        setCurrentAdmin(adminData);
        setIsAdmin(true);

        await updateDoc(doc(db, 'admins', adminDoc.id), {
          lastLogin: formatFullDateTime(new Date())
        });

        addLog(
          '系統',
          `管理者 [${adminData.nickname || adminData.username}] 登入成功`,
          adminData.nickname || adminData.username
        );

        // 如果勾選記住我，儲存至 localStorage
        if (rememberMe) {
          localStorage.setItem(
            'admin_session',
            JSON.stringify({ username: adminUser, password: adminPassword })
          );
        } else {
          localStorage.removeItem('admin_session');
        }
      } else {
        showAlert('帳號或密碼錯誤');
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert('登入過程中發生錯誤');
    } finally {
      setIsDataLoading(false);
    }
  };

  /**
   * 登出處理
   */
  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentAdmin(null);
    setAdminUser('');
    setAdminPassword('');
    localStorage.removeItem('admin_session');
  };

  return {
    isAdmin,
    setIsAdmin,
    isAuthenticating,
    adminUser,
    setAdminUser,
    adminPassword,
    setAdminPassword,
    rememberMe,
    setRememberMe,
    currentAdmin,
    setCurrentAdmin,
    handleAdminLogin,
    handleLogout
  };
};
