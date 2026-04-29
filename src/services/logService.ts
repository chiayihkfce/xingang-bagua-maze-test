import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { formatFullDateTime } from '../utils/dateUtils';

/**
 * 系統日誌服務
 */
export const logService = {
  /**
   * 新增操作日誌
   */
  addLog: async (type: string, details: string, operator: string) => {
    try {
      const userAgent = navigator.userAgent;
      const device = userAgent.includes('Mobi') ? '手機' : '電腦';

      await addDoc(collection(db, 'logs'), {
        timestamp: formatFullDateTime(new Date()),
        type,
        operator,
        details: `[${device}] ${details}`,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error('Log error:', e);
    }
  }
};
