import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { sendPaymentSuccessEmail } from "../utils/emailUtils";

interface UseAdminActionsProps {
  submissions: any[][];
  showConfirm: (message: string, onConfirm: () => void) => void;
  showAlert: (message: string) => void;
  setIsDataLoading: (val: boolean) => void;
  addLog: (type: string, details: string) => Promise<void>;
}

/**
 * 處理管理員的各項寫入操作邏輯
 */
export const useAdminActions = ({
  submissions,
  showConfirm,
  showAlert,
  setIsDataLoading,
  addLog
}: UseAdminActionsProps) => {

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

  return {
    handleVerifyPayment
  };
};
