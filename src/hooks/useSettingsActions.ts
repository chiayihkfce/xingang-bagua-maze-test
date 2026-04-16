import { collection, addDoc, updateDoc, doc, deleteDoc, setDoc, writeBatch, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Session, TimeslotConfig, PaymentMethod } from "../types";
import { cleanSessionTimeFormat } from "../utils/dateUtils";

interface UseSettingsActionsProps {
  sessions: Session[];
  paymentMethods: PaymentMethod[];
  newSession: { name: string, price: string, fixedDate: string, fixedTime: string, isSpecial: boolean };
  editingSession: { id: string, oldName: string, newName: string, newPrice: string, fixedDate: string, fixedTime: string, isSpecial: boolean };
  setNewSession: (data: any) => void;
  setIsSubmitting: (val: boolean) => void;
  setIsEditingSession: (val: boolean) => void;
  setEditingSession: (data: any) => void;
  setGeneralTimeSlots: (slots: string[]) => void;
  setSpecialTimeSlots: (slots: string[]) => void;
  setTimeslotConfig: (val: any) => void;
  addLog: (type: string, details: string) => Promise<void>;
  showAlert: (message: string) => void;
  showConfirm: (message: string, onConfirm: () => void) => void;
}

/**
 * 處理管理員後台的場次、時段與付款方式等設定變更邏輯
 */
export const useSettingsActions = ({
  sessions,
  paymentMethods,
  newSession,
  editingSession,
  setNewSession,
  setIsSubmitting,
  setIsEditingSession,
  setEditingSession,
  setGeneralTimeSlots,
  setSpecialTimeSlots,
  setTimeslotConfig,
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

  /**
   * 儲存預約時段配置
   */
  const saveTimeSlotsConfig = async (type: 'general' | 'special', config: TimeslotConfig, slots: string[]) => {
    setIsSubmitting(true);
    try {
      const docPath = type === 'general' ? "general_timeslots" : "special_timeslots";
      const docRef = doc(db, "config", docPath);
      
      const subConfig = type === 'general' ? {
        start: config.generalStart,
        end: config.generalEnd,
        interval: config.generalInterval
      } : {
        start: config.specialStart,
        end: config.specialEnd,
        interval: config.specialInterval
      };

      await setDoc(docRef, {
        config: subConfig,
        slots: slots,
        updatedAt: serverTimestamp()
      });
      
      const batch = writeBatch(db);
      let cleanupCount = 0;
      const relevantSessions = sessions.filter(s => s.isSpecial === (type === 'special'));
      
      for (const session of relevantSessions) {
        if (session.fixedTime) {
          const originalTimes = session.fixedTime.split(',').filter(Boolean);
          const filteredTimes = originalTimes.filter(t => slots.includes(t));
          
          if (originalTimes.length !== filteredTimes.length) {
            const collectionName = type === 'general' ? "sessions" : "special_sessions";
            const sessionRef = doc(db, collectionName, (session as any).id);
            batch.update(sessionRef, { fixedTime: filteredTimes.join(',') });
            cleanupCount++;
          }
        }
      }
      
      if (cleanupCount > 0) {
        await batch.commit();
      }

      if (type === 'general') {
        setGeneralTimeSlots(slots);
        setTimeslotConfig((prev: any) => ({
          ...prev,
          generalStart: config.generalStart,
          generalEnd: config.generalEnd,
          generalInterval: config.generalInterval
        }));
      } else {
        setSpecialTimeSlots(slots);
        setTimeslotConfig((prev: any) => ({
          ...prev,
          specialStart: config.specialStart,
          specialEnd: config.specialEnd,
          specialInterval: config.specialInterval
        }));
      }
      
      await addLog('修改時段', `管理員更新了${type === 'general' ? '一般' : '特別'}預約時段設定，並同步清理了 ${cleanupCount} 個場次的無效時段`);
      showAlert(`${type === 'general' ? '一般' : '特別'}預約時段已儲存${cleanupCount > 0 ? `，並同步清理了 ${cleanupCount} 個場次的失效時段` : ''}`);
    } catch (err) {
      console.error(err);
      showAlert('儲存失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 付款方式管理：新增或修改
   */
  const addPaymentMethod = async (methodData: any) => {
    if (!methodData.name) return;
    
    const existingIndex = paymentMethods.findIndex(m => m.id === methodData.id);
    let newMethods;
    if (existingIndex > -1) {
      newMethods = [...paymentMethods];
      newMethods[existingIndex] = methodData;
    } else {
      newMethods = [...paymentMethods, methodData];
    }

    try {
      await setDoc(doc(db, "config", "payments"), { methods: newMethods });
      await addLog('付款方式', `${existingIndex > -1 ? '修改' : '新增'}了付款方式: ${methodData.name}`);
      showAlert('已儲存變更');
    } catch (e) { 
      console.error(e);
      showAlert('儲存失敗'); 
    }
  };

  /**
   * 刪除付款方式
   */
  const deletePaymentMethod = async (method: PaymentMethod) => {
    showConfirm(`確定要刪除「${method.name}」嗎？`, async () => {
      const newMethods = paymentMethods.filter(m => m.id !== method.id);
      try {
        await setDoc(doc(db, "config", "payments"), { methods: newMethods });
        await addLog('付款方式', `刪除了付款方式: ${method.name}`);
      } catch (e) { 
        console.error(e);
        showAlert('刪除失敗'); 
      }
    });
  };

  return {
    handleAddSession,
    startEditSession,
    handleUpdateSession,
    handleDeleteSession,
    saveTimeSlotsConfig,
    addPaymentMethod,
    deletePaymentMethod
  };
};






