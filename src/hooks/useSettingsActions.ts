import { collection, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Session } from "../types";
import { cleanSessionTimeFormat } from "../utils/dateUtils";

interface UseSettingsActionsProps {
  sessions: Session[];
  newSession: { name: string, price: string, fixedDate: string, fixedTime: string, isSpecial: boolean };
  editingSession: { id: string, oldName: string, newName: string, newPrice: string, fixedDate: string, fixedTime: string, isSpecial: boolean };
  setNewSession: (data: any) => void;
  setIsSubmitting: (val: boolean) => void;
  setIsEditingSession: (val: boolean) => void;
  setEditingSession: (data: any) => void;
  addLog: (type: string, details: string) => Promise<void>;
  showAlert: (message: string) => void;
  showConfirm: (message: string, onConfirm: () => void) => void;
}

/**
 * 處理管理員後台的場次、時段與付款方式等設定變更邏輯
 */
export const useSettingsActions = ({
  sessions,
  newSession,
  editingSession,
  setNewSession,
  setIsSubmitting,
  setIsEditingSession,
  setEditingSession,
  addLog,
  showAlert,
  showConfirm
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

  /**
   * 開始編輯場次 (準備編輯資料並開啟 Modal)
   */
  const startEditSession = (session: Session) => {
    const cleanedTime = cleanSessionTimeFormat(session.fixedTime || '');
    setEditingSession({ 
      id: (session as any).id, 
      oldName: session.name, 
      newName: session.name, 
      newPrice: String(session.price), 
      fixedDate: session.fixedDate || '', 
      fixedTime: cleanedTime, 
      isSpecial: session.isSpecial !== undefined ? session.isSpecial : !!session.fixedDate 
    });
    setIsEditingSession(true);
  };

  /**
   * 提交場次修改
   */
  const handleUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession.id) return;
    setIsSubmitting(true);
    const collectionName = editingSession.isSpecial ? "special_sessions" : "sessions";
    try {
      const docRef = doc(db, collectionName, editingSession.id);
      await updateDoc(docRef, {
        name: editingSession.newName,
        price: Number(editingSession.newPrice),
        fixedDate: editingSession.fixedDate,
        fixedTime: editingSession.fixedTime,
        isSpecial: editingSession.isSpecial
      });
      setIsEditingSession(false);
      await addLog('修改場次', `將 ${editingSession.oldName} 修改為 ${editingSession.newName}`);
      showAlert('修改成功');
    } catch (err) {
      console.error(err);
      showAlert('修改失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 刪除場次
   */
  const handleDeleteSession = async (name: string, id?: string) => {
    showConfirm(`確定要刪除場次「${name}」嗎？`, async () => {
      if (!id) return;
      try {
        const session = sessions.find(s => (s as any).id === id);
        const collectionName = session?.isSpecial ? "special_sessions" : "sessions";
        
        await deleteDoc(doc(db, collectionName, id));
        await addLog('刪除場次', `刪除了場次：${name}`);
        showAlert('刪除成功');
      } catch (err) {
        console.error(err);
        showAlert('刪除失敗');
      }
    });
  };

  return {
    handleAddSession,
    startEditSession,
    handleUpdateSession,
    handleDeleteSession
  };
};



