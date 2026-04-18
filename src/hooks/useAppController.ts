import { useAppState } from './useAppState';
import { useAppRouting } from './useAppRouting';
import { useSystemTheme } from './useSystemTheme';
import { useFirebaseListeners } from './useFirebaseListeners';
import { useDisplayLogic } from './useDisplayLogic';
import { useRegistrationForm } from './useRegistrationForm';
import { useAppEffects } from './useAppEffects';
import { useSystemModal } from './useSystemModal';
import { useAdminAuth } from './useAdminAuth';
import { useAdminData } from './useAdminData';
import { useAdminActions } from './useAdminActions';
import { useSettingsActions } from './useSettingsActions';
import { useRegistrationActions } from './useRegistrationActions';
import { formatFullDateTime, generateTimeSlots, toggleTimeInString } from '../utils/dateUtils';
import { copyToClipboard, generatePrintContent } from '../utils/displayUtils';
import { exportToExcel, readExcelFile } from '../utils/excelUtils';
import { calculateDashboardStats, sortSubmissions } from '../utils/dataUtils';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const useAppController = () => {
  const state = useAppState();
  const routing = useAppRouting();
  const theme = useSystemTheme();
  const firebase = useFirebaseListeners(state.formData, state.setFormData, state.setSubmitted, state.setLastSubmissionId, state.setCalculatedTotal);
  const display = useDisplayLogic({ lang: theme.lang, sessions: firebase.sessions, t: theme.t });
  const form = useRegistrationForm({ formData: state.formData, setFormData: state.setFormData, sessions: firebase.sessions, timeslotConfig: firebase.timeslotConfig, generalTimeSlots: firebase.generalTimeSlots, specialTimeSlots: firebase.specialTimeSlots, t: theme.t });
  const modal = useSystemModal();

  const addLog = async (type: string, details: string, operatorOverride?: string) => {
    try {
      const operator = operatorOverride || (auth.currentAdmin ? (auth.currentAdmin.nickname || auth.currentAdmin.username) : '超級管理員');
      await addDoc(collection(db, "logs"), {
        timestamp: formatFullDateTime(new Date()), type, operator, details, createdAt: serverTimestamp()
      });
    } catch (e) { console.error("Log error:", e); }
  };

  const handleCopyAccount = async (accountNumber?: string) => {
    if (!accountNumber) return;
    const success = await copyToClipboard(accountNumber);
    if (success) modal.showAlert(theme.t.accountCopied);
  };

  const getDisplayStats = () => calculateDashboardStats(adminData.submissions, state.adminFilterDate, adminData.dashboardStats);
  const handleDownloadExcel = () => exportToExcel(adminData.submissions);
  
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    modal.showConfirm('確定要從此 Excel 匯入舊報名資料嗎？', async () => {
      state.setIsDataLoading(true);
      try {
        const data = await readExcelFile(file);
        if (data.length <= 1) { modal.showAlert('Excel 檔案似乎沒有資料。'); return; }
        const rows = data.slice(1);
        let count = 0;
        for (const row of rows) {
          if (!row[2] && !row[3]) continue; 
          const submissionData = {
            timestamp: row[0] ? String(row[0]) : formatFullDateTime(new Date()),
            status: row[1] || '待審核',
            name: String(row[2] || '無姓名'),
            phone: String(row[3] || '無電話'),
            email: String(row[4] || ''),
            session: String(row[5] || '未知場次'),
            quantity: String(row[6] || '1'),
            players: String(row[7] || '1'),
            totalAmount: Number(row[8]) || 0,
            paymentMethod: String(row[9] || '現金支付'),
            bankLast5: String(row[10] || '無'),
            pickupTime: row[11] ? String(row[11]) : '',
            pickupLocation: String(row[12] || '新港文教基金會(閱讀館)'),
            referral: String(row[13] || ''),
            notes: String(row[14] || '無'),
            createdAt: serverTimestamp(),
            deleted: false
          };
          await addDoc(collection(db, "registrations"), submissionData);
          count++;
        }
        modal.showAlert(`匯入結束！成功寫入 ${count} 筆。`);
      } catch (err) { modal.showAlert('匯入失敗'); } finally { state.setIsDataLoading(false); e.target.value = ''; }
    });
  };

  const handleDateFilter = (date: Date | null) => state.setAdminFilterDate(date);
  
  const handleSort = (index: number) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (state.sortConfig && state.sortConfig.key === index && state.sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    state.setSortConfig({ key: index, direction });
    const header = adminData.submissions[0];
    const data = adminData.submissions.slice(1);
    const sortedData = sortSubmissions(data, index, direction);
    adminData.setSubmissions([header, ...sortedData]);
  };

  const toggleFixedTime = (time: string, isEdit: boolean) => {
    if (isEdit) {
      const newTimes = toggleTimeInString(state.editingSession.fixedTime, time);
      state.setEditingSession({ ...state.editingSession, fixedTime: newTimes });
    } else {
      const newTimes = toggleTimeInString(state.newSession.fixedTime, time);
      state.setNewSession({ ...state.newSession, fixedTime: newTimes });
    }
  };

  const auth = useAdminAuth({ showAlert: modal.showAlert, addLog, setIsDataLoading: state.setIsDataLoading });
  const adminData = useAdminData({ isAdmin: auth.isAdmin, adminFilterDate: state.adminFilterDate, adminSearchKeyword: state.adminSearchKeyword, setIsDataLoading: state.setIsDataLoading });
  const adminActions = useAdminActions({ 
    submissions: adminData.submissions, 
    deletedSubmissions: adminData.deletedSubmissions, 
    editData: state.editData, 
    showConfirm: modal.showConfirm, 
    showAlert: modal.showAlert, 
    setIsDataLoading: state.setIsDataLoading, 
    setIsSubmitting: state.setIsSubmitting, 
    setShowRecycleBin: state.setShowRecycleBin, 
    setIsEditing: state.setIsEditing, 
    setEditData: state.setEditData, 
    addLog,
    selectedIds: state.selectedIds,
    setSelectedIds: state.setSelectedIds
  });
  const settingsActions = useSettingsActions({ 
    sessions: firebase.sessions, 
    paymentMethods: firebase.paymentMethods, 
    generalTimeSlots: firebase.generalTimeSlots,
    specialTimeSlots: firebase.specialTimeSlots,
    newManualTime: state.newManualTime, 
    newSession: state.newSession, 
    editingSession: state.editingSession, 
    setNewSession: state.setNewSession, 
    setNewManualTime: state.setNewManualTime, 
    setIsSubmitting: state.setIsSubmitting, 
    setIsEditingSession: state.setIsEditingSession, 
    setEditingSession: state.setEditingSession, 
    setIsDataLoading: state.setIsDataLoading, 
    setGeneralTimeSlots: firebase.setGeneralTimeSlots, 
    setSpecialTimeSlots: firebase.setSpecialTimeSlots, 
    setTimeslotConfig: firebase.setTimeslotConfig, 
    addLog, 
    showAlert: modal.showAlert, 
    showConfirm: modal.showConfirm 
  });

  const registrationActions = useRegistrationActions({ formData: state.formData, formErrors: form.formErrors, sessionType: form.sessionType, calculatedTotal: state.calculatedTotal, paymentMethods: firebase.paymentMethods, loadTime: state.loadTime, setIsSubmitting: state.setIsSubmitting, setLastSubmissionId: state.setLastSubmissionId, setSubmitted: state.setSubmitted, showAlert: modal.showAlert, setShowConfirmation: state.setShowConfirmation, addLog });

  useAppEffects({ formData: state.formData, setFormData: state.setFormData, sessions: firebase.sessions, sessionType: form.sessionType, setCalculatedTotal: state.setCalculatedTotal, sysModalShow: modal.sysModal.show, showConfirmation: state.showConfirmation, isSubmitting: state.isSubmitting, isDataLoading: state.isDataLoading, showAuditModal: state.showAuditModal, isEditing: state.isEditing, isEditingSession: state.isEditingSession, showRecycleBin: state.showRecycleBin, shouldRenderEntry: firebase.shouldRenderEntry });

  const loadPage = (page: number) => state.setCurrentPage(page);

  const handlePrintCheckInSheet = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayData = adminData.submissions.slice(1).filter(row => {
      const pickupTime = row[11] || '';
      const status = row[1] || '';
      return pickupTime.startsWith(todayStr) && status === '通過';
    });

    if (todayData.length === 0) {
      modal.showAlert('今天尚無已通過審核的預約資料');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generatePrintContent(todayData));
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  return {
    ...state, 
    ...routing, 
    ...theme, 
    ...firebase, 
    ...display, 
    ...form, 
    ...modal, 
    ...auth, 
    ...adminData, 
    ...adminActions, 
    ...settingsActions, 
    ...registrationActions,
    dashboardStats: adminData.dashboardStats || { pendingCount: 0, totalRevenue: 0, todayKits: 0, todayPlayers: 0 },
    handleCopyAccount, getDisplayStats, handleDownloadExcel, handleImportExcel, handleDateFilter, handleSort, toggleFixedTime, formatFullDateTime, generateTimeSlots, loadPage, addLog,
    handlePrintCheckInSheet,
    handleBatchVerifyPayment: adminActions.handleBatchVerifyPayment,
    handleBatchDelete: adminActions.handleBatchDelete
  };
};
