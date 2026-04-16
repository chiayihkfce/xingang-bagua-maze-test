import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

interface UseSettingsActionsProps {
  newSession: { name: string, price: string, fixedDate: string, fixedTime: string, isSpecial: boolean };
  setNewSession: (data: any) => void;
  setIsSubmitting: (val: boolean) => void;
  addLog: (type: string, details: string) => Promise<void>;
  showAlert: (message: string) => void;
}

/**
 * 處理管理員後台的場次、時段與付款方式等設定變更邏輯
 */
export const useSettingsActions = ({
  newSession,
  setNewSession,
  setIsSubmitting,
  addLog,
  showAlert
}: UseSettingsActionsProps) => {

  /**
   * 新增場次 (一般或特別)
   */
  const handleAddSession = async () => {
    if (!newSession.name || !newSession.price) return;
    setIsSubmitting(true);
    
    const collectionName = newSession.isSpecial ? "special_sessions" : "sessions";

    try {
      await addDoc(collection(db, collectionName), {
        ...newSession,
        price: Number(newSession.price),
        createdAt: serverTimestamp()
      });
      setNewSession({ name: '', price: '', fixedDate: '', fixedTime: '', isSpecial: false });
      await addLog('新增場次', `新增${newSession.isSpecial ? '特別' : '一般'}場次: ${newSession.name}`);
      showAlert('新增成功！');
    } catch (err: any) {
      console.error(err);
      showAlert(`新增失敗！`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleAddSession
  };
};
