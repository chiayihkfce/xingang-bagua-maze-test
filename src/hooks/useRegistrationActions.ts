import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { FormData, FormErrors } from '../types';
import { formatPhoneForDB } from '../utils/formatUtils';
import { formatFullDateTime } from '../utils/dateUtils';

interface UseRegistrationActionsProps {
  formData: FormData;
  formErrors: FormErrors;
  sessionType: '一般預約' | '特別預約' | '';
  calculatedTotal: number;
  setIsSubmitting: (val: boolean) => void;
  setLastSubmissionId: (id: string | null) => void;
  showAlert: (message: string) => void;
  setShowConfirmation: (val: boolean) => void;
  addLog: (type: string, details: string) => Promise<void>;
}

/**
 * 處理報名流程中的各項行為邏輯 (提交、存檔、更新末五碼)
 */
export const useRegistrationActions = ({
  formData,
  formErrors,
  sessionType,
  calculatedTotal,
  setIsSubmitting,
  setLastSubmissionId,
  showAlert,
  setShowConfirmation,
  addLog
}: UseRegistrationActionsProps) => {

  /**
   * 報名表單初步送出 (驗證並開啟確認視窗)
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formErrors.email || formErrors.phone || formErrors.name) {
      showAlert('請修正表單中的錯誤紅字後再試。');
      return;
    }

    const requiredFields = [
      { key: 'name', label: '姓名' }, 
      { key: 'phone', label: '電話' }, 
      { key: 'email', label: 'Email' }
    ];

    for (const field of requiredFields) {
      const value = formData[field.key as keyof typeof formData];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        showAlert(`請填寫${field.label}`);
        return;
      }
    }

    if (sessionType === '') {
      showAlert('請選擇場次類型');
      return;
    }
    if (!formData.session) {
      showAlert('尚未選定場次');
      return;
    }
    if (!formData.pickupTime) {
      showAlert('請選擇日期時間');
      return;
    }

    setShowConfirmation(true);
  };

  /**
   * 執行最終資料寫入的函數 (核心存檔邏輯)
   */
  const executeFinalSubmission = async (last5?: string) => {
    setIsSubmitting(true);
    try {
      const combinedPhone = formatPhoneForDB(formData.countryCode, formData.phone);
      
      const submissionData = {
        ...formData,
        phone: combinedPhone,
        players: formData.players.trim() || '1',
        notes: formData.notes.trim() || '無',
        paymentMethod: formData.paymentMethod.split(' (')[0],
        bankLast5: last5 || '無',
        totalAmount: calculatedTotal,
        referral: formData.referral.join(', '),
        timestamp: formatFullDateTime(new Date()),
        status: '待審核',
        createdAt: serverTimestamp(),
        deleted: false
      };

      const docRef = await addDoc(collection(db, "registrations"), submissionData);
      setLastSubmissionId(docRef.id);
      await addLog('報名提交', `${formData.name} 提交了報名 (${formData.session})`);
      return docRef.id;
    } catch (err) {
      console.error("提交失敗:", err);
      showAlert('提交失敗，請檢查網路連線。');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    executeFinalSubmission
  };
};

