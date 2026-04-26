import { useState, useEffect, useRef } from 'react';
import { collection, query, where, limit, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { AdminAccount } from '../types';
import { formatFullDateTime } from '../utils/dateUtils';

interface UseAdminAuthProps {
  showAlert: (message: string) => void;
  addLog: (type: string, details: string, operatorOverride?: string) => Promise<void>;
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
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(null);
  
  // 避免重複登入的標記
  const hasAttemptedLogin = useRef(false);

  // --- 新增：LINE 一鍵登入自動偵測邏輯 ---
  useEffect(() => {
    const handleLineAutoLogin = async () => {
      // 偵測 URL 參數中的 uid
      const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || window.location.search);
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
            collection(db, "admins"), 
            where("lineUid", "==", lineUid),
            limit(1)
          );

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const adminDoc = querySnapshot.docs[0];
            const adminData = { id: adminDoc.id, ...adminDoc.data() } as AdminAccount;

            setCurrentAdmin(adminData);
            setIsAdmin(true);

            // 更新最後登入時間
            await updateDoc(doc(db, "admins", adminDoc.id), {
              lastLogin: formatFullDateTime(new Date())
            });

            await addLog('系統', `管理者 [${adminData.nickname || adminData.username}] 透過 LINE 一鍵登入成功`, adminData.nickname || adminData.username);
            
            // 清除網址列的 uid，避免重複觸發或分享網址時洩漏
            const cleanUrl = window.location.href.split('?')[0];
            window.history.replaceState({}, document.title, cleanUrl);
          } else {
            showAlert('LINE 登入失敗：此帳號未綁定 LINE ID');
          }
        } catch (error) {
          console.error("LINE Auto Login error:", error);
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
        collection(db, "admins"), 
        where("username", "==", adminUser),
        where("password", "==", adminPassword),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const adminDoc = querySnapshot.docs[0];
        const adminData = { id: adminDoc.id, ...adminDoc.data() } as AdminAccount;

        setCurrentAdmin(adminData);
        setIsAdmin(true);

        await updateDoc(doc(db, "admins", adminDoc.id), {
          lastLogin: formatFullDateTime(new Date())
        });

        addLog('系統', `管理者 [${adminData.nickname || adminData.username}] 登入成功`, adminData.nickname || adminData.username);
      } else {
        showAlert('帳號或密碼錯誤');
      }
    } catch (error) {
      console.error("Login error:", error);
      showAlert('登入過程中發生錯誤');
    } finally {
      setIsDataLoading(false);
    }
  };

  return {
    isAdmin,
    setIsAdmin,
    isAuthenticating,
    adminUser,
    setAdminUser,
    adminPassword,
    setAdminPassword,
    currentAdmin,
    setCurrentAdmin,
    handleAdminLogin
  };
};
