import { doc, updateDoc, writeBatch, query, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { sendPaymentSuccessEmail } from "../utils/emailUtils";

interface UseAdminActionsProps {
  submissions: any[][];
  deletedSubmissions: any[][];
  editData: any;
  showConfirm: (message: string, onConfirm: () => void) => void;
  showAlert: (message: string) => void;
  setIsDataLoading: (val: boolean) => void;
  setIsSubmitting: (val: boolean) => void;
  setShowRecycleBin: (val: boolean) => void;
  setIsEditing: (val: boolean) => void;
  setEditData: (data: any) => void;
  addLog: (type: string, details: string) => Promise<void>;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

/**
 * 處理管理員的各項寫入操作邏輯
 */
export const useAdminActions = ({
  submissions,
  deletedSubmissions,
  editData,
  showConfirm,
  showAlert,
  setIsDataLoading,
  setIsSubmitting,
  setShowRecycleBin,
  setIsEditing,
  setEditData,
  addLog,
  selectedIds,
  setSelectedIds
}: UseAdminActionsProps) => {

  /**
   * 批次審核付款 (通過)
   */
  const handleBatchVerifyPayment = async () => {
    if (selectedIds.length === 0) return;

    showConfirm(`確定要將選取的 ${selectedIds.length} 筆報名標記為「通過」並發送成功信嗎？`, async () => {
      setIsSubmitting(true);
      try {
        const batch = writeBatch(db);
        let count = 0;

        for (const docId of selectedIds) {
          const target = submissions.find(row => row[15] === docId);
          if (target && target[1] !== '通過') {
            const docRef = doc(db, "registrations", docId);
            batch.update(docRef, { status: '通過' });
            await sendPaymentSuccessEmail(target);
            count++;
          }
        }

        await batch.commit();
        await addLog('批次審核', `批次通過了 ${count} 筆報名資料`);
        showAlert(`成功批次處理 ${count} 筆資料`);
        setSelectedIds([]);
      } catch (err) {
        console.error(err);
        showAlert('批次處理失敗');
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  /**
   * 批次刪除 (移至回收桶)
   */
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;

    showConfirm(`確定要將選取的 ${selectedIds.length} 筆報名資料移至回收桶嗎？`, async () => {
      setIsSubmitting(true);
      try {
        const batch = writeBatch(db);
        let count = 0;

        for (const docId of selectedIds) {
          const target = submissions.find(row => row[15] === docId);
          if (target) {
            const sourceRef = doc(db, "registrations", docId);
            const targetRef = doc(db, "registrations_deleted", docId);
            
            const dataToMove = {
              timestamp: target[0], status: target[1], name: target[2], phone: target[3], email: target[4],
              session: target[5], quantity: target[6], players: target[7], totalAmount: target[8],
              paymentMethod: target[9], bankLast5: target[10], pickupTime: target[11],
              pickupLocation: target[12], referral: target[13], notes: target[14],
              createdAt: target[16] || serverTimestamp(),
              certSent: target[17] || false // 補上證書發送狀態
            };

            batch.set(targetRef, dataToMove);
            batch.delete(sourceRef);
            count++;
          }
        }

        await batch.commit();
        await addLog('批次刪除', `將 ${count} 筆報名移至回收桶`);
        showAlert(`已批次移至回收桶 ${count} 筆資料`);
        setSelectedIds([]);
      } catch (err) {
        console.error(err);
        showAlert('批次刪除失敗');
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  /**
   * 審核付款狀態
   */
  const handleVerifyPayment = async (rowIndex: number, status: string) => {
    const target = submissions[rowIndex];
    const docId = target[15];
    const currentStatus = target[1];
    
    if (!docId) return;

    showConfirm(`確定要將此筆報名標記為「${status}」嗎？`, async () => {
      setIsDataLoading(true);
      try {
        const docRef = doc(db, "registrations", docId);
        await updateDoc(docRef, { status });
        await addLog('審核付款', `將「${target[2]}」的狀態由 [${currentStatus}] 變更為 [${status}]`);
        
        if (status === '通過' && currentStatus !== '通過') {
          await sendPaymentSuccessEmail(target);
        }
        
        showAlert('審核狀態已更新');
      } catch (err) {
        console.error(err);
        showAlert('審核失敗');
      } finally {
        setIsDataLoading(false);
      }
    });
  };

  /**
   * 將報名資料移至回收桶 (跨集合搬移)
   */
  const handleDeleteSubmission = async (rowIndex: number) => {
    const target = submissions[rowIndex];
    const docId = target[15];
    if (!docId) return;
    
    showConfirm('確定要將這筆報名資料移至回收桶嗎？', async () => {
      setIsDataLoading(true);
      try {
        const sourceRef = doc(db, "registrations", docId);
        const targetRef = doc(db, "registrations_deleted", docId);
        
        // 構建原始對象 (補上索引 17: certSent)
        const dataToMove = {
          timestamp: target[0], status: target[1], name: target[2], phone: target[3], email: target[4],
          session: target[5], quantity: target[6], players: target[7], totalAmount: target[8],
          paymentMethod: target[9], bankLast5: target[10], pickupTime: target[11],
          pickupLocation: target[12], referral: target[13], notes: target[14],
          createdAt: target[16] || serverTimestamp(),
          certSent: target[17] || false
        };

        const batch = writeBatch(db);
        batch.set(targetRef, dataToMove);
        batch.delete(sourceRef);
        await batch.commit();

        await addLog('刪除報名', `將「${target[2]}」移至回收桶`);
        showAlert('已移至回收桶');
      } catch (err) {
        console.error(err);
        showAlert('操作失敗');
      } finally {
        setIsDataLoading(false);
      }
    });
  };

  /**
   * 從回收桶還原報名資料 (跨集合搬移)
   */
  const handleRestoreSubmission = async (rowIndex: number) => {
    const target = deletedSubmissions[rowIndex];
    const docId = target[15];
    if (!docId) return;
    
    setIsSubmitting(true);
    try {
      const sourceRef = doc(db, "registrations_deleted", docId);
      const targetRef = doc(db, "registrations", docId);
      
      const dataToMove = {
        timestamp: target[0], status: target[1], name: target[2], phone: target[3], email: target[4],
        session: target[5], quantity: target[6], players: target[7], totalAmount: target[8],
        paymentMethod: target[9], bankLast5: target[10], pickupTime: target[11],
        pickupLocation: target[12], referral: target[13], notes: target[14],
        createdAt: target[16] || serverTimestamp(),
        certSent: target[17] || false,
        deleted: false // 還原後標記為未刪除
      };

      const batch = writeBatch(db);
      batch.set(targetRef, dataToMove);
      batch.delete(sourceRef);
      await batch.commit();

      await addLog('還原報名', `從回收桶還原了「${target[2]}」的紀錄`);
      showAlert('資料已還原');
      setShowRecycleBin(false);
    } catch (err) {
      console.error(err);
      showAlert('還原失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 清空回收桶 (徹底刪除 registrations_deleted 集合內容)
   */
  const handleClearRecycleBin = async () => {
    showConfirm('確定要徹底刪除回收桶中的所有資料嗎？此動作無法復原。', async () => {
      setIsDataLoading(true);
      try {
        const q = query(collection(db, "registrations_deleted"));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        await addLog('清空回收桶', '超級管理員清空了回收桶');
        showAlert('回收桶已清空');
        setShowRecycleBin(false);
      } catch (err) {
        console.error(err);
        showAlert('清空失敗');
      } finally {
        setIsDataLoading(false);
      }
    });
  };

  /**
   * 清除所有操作日誌
   */
  const handleClearLogs = async () => {
    showConfirm('確定要清除所有操作日誌嗎？此動作無法復原。', async () => {
      setIsDataLoading(true);
      try {
        const q = query(collection(db, "logs"));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        await addLog('清除日誌', '超級管理員清空了所有操作日誌');
        showAlert('日誌已全數清除');
      } catch (err) {
        console.error(err);
        showAlert('清除失敗');
      } finally {
        setIsDataLoading(false);
      }
    });
  };

  /**
   * 開始編輯報名資料 (準備編輯資料並開啟 Modal)
   */
  const startEditSubmission = (row: any[], _index: number) => {
    let rawTime = row[11] || ''; 
    if (typeof rawTime === 'string' && rawTime.includes('T')) {
      rawTime = new Date(rawTime).toLocaleString('zh-TW', { hour12: false }).replace(/\//g, '-');
    }
    setEditData({
      timestamp: row[0], status: row[1], name: row[2], phone: row[3], email: row[4], 
      session: row[5], quantity: row[6], players: row[7], totalAmount: row[8], 
      paymentMethod: row[9], bankLast5: row[10], pickupTime: rawTime, 
      pickupLocation: row[12], referral: row[13], notes: row[14],
      id: row[15] 
    });
    setIsEditing(true);
  };

  /**
   * 提交報名資料修改
   */
  const handleUpdateSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData?.id) return;
    setIsSubmitting(true);
    try {
      const docRef = doc(db, "registrations", editData.id);
      const updateData = { ...editData };
      delete updateData.id;
      await updateDoc(docRef, updateData);
      
      await addLog('修改報名', `修改了「${editData.name}」的報名資訊`);
      setIsEditing(false);
      showAlert('修改成功');
    } catch (err) {
      console.error(err);
      showAlert('更新失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleVerifyPayment,
    handleDeleteSubmission,
    handleRestoreSubmission,
    handleClearRecycleBin,
    handleClearLogs,
    startEditSubmission,
    handleUpdateSubmission,
    handleBatchVerifyPayment,
    handleBatchDelete
  };
};







