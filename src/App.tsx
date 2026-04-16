import { useState, useEffect } from 'react'
import "react-datepicker/dist/react-datepicker.css"
import './App.css'
import { registerLocale } from "react-datepicker";

import { zhTW, formatFullDateTime, generateTimeSlots, toggleTimeInString } from './utils/dateUtils'
import { copyToClipboard } from './utils/displayUtils'
import { exportToExcel, readExcelFile } from './utils/excelUtils'
import { sortSubmissions, calculateDashboardStats } from './utils/dataUtils'
import { useSystemTheme } from './hooks/useSystemTheme'
import { useAppRouting } from './hooks/useAppRouting'
import { useAppVersion } from './hooks/useAppVersion'
import { useSystemModal } from './hooks/useSystemModal'
import { useFirebaseListeners } from './hooks/useFirebaseListeners'
import { useRegistrationForm } from './hooks/useRegistrationForm'
import { useAdminAuth } from './hooks/useAdminAuth'
import { useAdminData } from './hooks/useAdminData'
import { useAdminActions } from './hooks/useAdminActions'
import { useSettingsActions } from './hooks/useSettingsActions'
import { useRegistrationActions } from './hooks/useRegistrationActions'
import { useDisplayLogic } from './hooks/useDisplayLogic'

// 註冊語系
registerLocale('zh', zhTW as any);

import { FormData, DashboardStats } from './types'

import SuccessPage from './pages/SuccessPage'
import AdminPage from './pages/AdminPage'
import RegistrationPage from './pages/RegistrationPage'
import { 
  collection, 
  addDoc, 
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

function App() {
  // --- 0. 版本控管與快取清理 ---
  const APP_VERSION = '1.3.2'; // 每次重大更新或修改設定後，請調升此版本號

  // --- 1. 狀態與變數定義 ---

  // 基礎路由狀態
  const { currentPath, navigate, SECRET_ADMIN_PATH } = useAppRouting();

  // 版本控管與快取清理
  useAppVersion(APP_VERSION);

  // 使用抽離出的主題與語言 Hook
  const { lang, setLang, theme, toggleTheme, t } = useSystemTheme();

  const [submitted, setSubmitted] = useState(false);
  const [lastSubmissionId, setLastSubmissionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadTime] = useState(Date.now());
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [newManualTime, setNewManualTime] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const [isEditingSession, setIsEditingSession] = useState(false);
  const [editingSession, setEditingSession] = useState({ id: '', oldName: '', newName: '', newPrice: '', fixedDate: '', fixedTime: '', isSpecial: false });

  const [adminTab, setAdminTab] = useState<'sessions' | 'submissions' | 'timeslots' | 'logs' | 'payments'>('sessions');
  const [newSession, setNewSession] = useState({ name: '', price: '', fixedDate: '', fixedTime: '', isSpecial: false });

  const [adminFilterDate, setAdminFilterDate] = useState<Date | null>(null);
  const [adminSearchKeyword, setAdminSearchKeyword] = useState('');

  const [showRecycleBin, setShowRecycleBin] = useState(false);

  // 狀態管理
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    countryCode: '+886',
    phone: '',
    contactEmail: '',
    session: '',
    quantity: '1',
    players: '1',
    totalAmount: '',
    paymentMethod: '現金支付',
    bankLast5: '',
    pickupTime: '',
    pickupLocation: '新港文教基金會(閱讀館)',
    referral: ['基金會FB'] as string[],
    notes: '',
    hp_field: '' 
  });

  const {
    sessions,
    dbStatus,
    generalTimeSlots,
    setGeneralTimeSlots,
    specialTimeSlots,
    setSpecialTimeSlots,
    timeslotConfig,
    setTimeslotConfig,
    paymentMethods,
    isEntryAnimating,
    shouldRenderEntry
  } = useFirebaseListeners(setFormData);

  // 使用抽離出的顯示邏輯 Hook
  const {
    getSessionDisplayName,
    getPickupLocationDisplay,
    getPaymentMethodDisplay
  } = useDisplayLogic({ lang, sessions, t });

  const {
    sessionType,
    setSessionType,
    formErrors,
    handleInputChange,
    handleDateChange,
    handleCheckboxChange
  } = useRegistrationForm({
    formData,
    setFormData,
    sessions,
    timeslotConfig,
    generalTimeSlots,
    specialTimeSlots,
    t
  });

  // --- 系統自訂彈窗狀態 ---
  const { sysModal, showAlert, showConfirm } = useSystemModal();

  const addLog = async (type: string, details: string, operatorOverride?: string) => {
    try {
      const operator = operatorOverride || (currentAdmin ? (currentAdmin.nickname || currentAdmin.username) : '超級管理員');
      await addDoc(collection(db, "logs"), {
        timestamp: formatFullDateTime(new Date()),
        type,
        operator,
        details,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Log error:", e);
    }
  };

  // 使用抽離出的管理員認證 Hook
  const {
    isAdmin,
    setIsAdmin,
    adminUser,
    setAdminUser,
    adminPassword,
    setAdminPassword,
    currentAdmin,
    setCurrentAdmin,
    handleAdminLogin
  } = useAdminAuth({ showAlert, addLog, setIsDataLoading });

  // 使用抽離出的管理員資料監聽 Hook
  const {
    submissions,
    setSubmissions,
    deletedSubmissions,
    logs,
    dashboardStats,
    totalRows,
    visibleColumns,
    toggleColumn
  } = useAdminData({ isAdmin, adminFilterDate, adminSearchKeyword, setIsDataLoading });

  // 使用抽離出的管理員操作 Hook
  const {
    handleVerifyPayment,
    handleDeleteSubmission,
    handleRestoreSubmission,
    handleClearRecycleBin,
    handleClearLogs,
    startEditSubmission,
    handleUpdateSubmission
  } = useAdminActions({ 
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
    addLog 
  });
// 使用抽離出的管理員設定操作 Hook
const {
  handleAddSession,
  startEditSession,
  handleUpdateSession,
  handleDeleteSession,
  saveTimeSlotsConfig,
  addPaymentMethod,
  deletePaymentMethod,
  handleImportSessionsExcel,
  handleManualTimeAdd,
  removeTimeSlot
  } = useSettingsActions({ 
  sessions,  paymentMethods,
  generalTimeSlots,
  specialTimeSlots,
  newManualTime,
  newSession, 
  editingSession,
  setNewSession, 
  setNewManualTime,
  setIsSubmitting, 
  setIsEditingSession,
  setEditingSession,
  setIsDataLoading,
  setGeneralTimeSlots,
  setSpecialTimeSlots,
  setTimeslotConfig,
  addLog, 
  showAlert,
  showConfirm
  });// 使用抽離出的報名操作 Hook
const {
  handleSubmit,
  handleConfirmSubmit,
  handleUpdateBankLast5,
  resetForm
} = useRegistrationActions({ 
  formData, 
  formErrors, 
  sessionType, 
  calculatedTotal,
  paymentMethods,
  loadTime,
  setIsSubmitting,
  setLastSubmissionId,
  setSubmitted,
  showAlert, 
  setShowConfirmation,
  addLog
});

const [showAuditModal, setShowAuditModal] = useState(false);
const [auditTarget, setAuditTarget] = useState<{index: number, row: any[]} | null>(null);

const [sortConfig, setSortConfig] = useState<{ key: number, direction: 'asc' | 'desc' } | null>(null);
const [showColumnFilter, setShowShowColumnFilter] = useState(false);

// 監聽所有彈窗與載入狀態，防止背景滑動
useEffect(() => {
  const isAnyModalOpen = 
    sysModal.show || 
    showConfirmation || 
    isSubmitting || 
    isDataLoading || 
    showAuditModal || 
    isEditing || 
    isEditingSession || 
    showRecycleBin || 
    shouldRenderEntry;

  if (isAnyModalOpen) {
    document.body.classList.add('modal-open');
  } else {
    document.body.classList.remove('modal-open');
  }
  return () => document.body.classList.remove('modal-open');
}, [
  sysModal.show, 
  showConfirmation, 
  isSubmitting, 
  isDataLoading, 
  showAuditModal, 
  isEditing, 
  isEditingSession, 
  showRecycleBin, 
  shouldRenderEntry
]);

// [補回] 計算動態統計
const getDisplayStats = (): DashboardStats => {
  return calculateDashboardStats(submissions, adminFilterDate, dashboardStats);
};

// [補回] 下載 Excel 邏輯
const handleDownloadExcel = () => exportToExcel(submissions);

// [新增] 匯入 Excel 舊資料邏輯 (用於從 Google Sheets 遷移)
const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  showConfirm('確定要從此 Excel 匯入舊報名資料嗎？', async () => {
    setIsDataLoading(true);
    try {
      const data = await readExcelFile(file);

      if (data.length <= 1) {
        showAlert('Excel 檔案似乎沒有資料（只有標題列或空表）。');
        return;
      }

      const rows = data.slice(1);
      let count = 0;

      for (const row of rows) {
        // 如果這一列幾乎是空的就跳過
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

        try {
          await addDoc(collection(db, "registrations"), submissionData);
          count++;
        } catch (writeErr) {
          console.error('寫入 Firebase 失敗:', writeErr);
        }
      }
      showAlert(`匯入程序結束！成功寫入 ${count} 筆資料。`);
    } catch (err) {
      console.error('Excel 解析錯誤:', err);
      showAlert('匯入失敗：無法讀取 Excel 檔案。請確保檔案格式正確 (.xlsx)。');
    } finally {
      setIsDataLoading(false);
      e.target.value = '';
    }
  });
};

// [補回] 複製帳號邏輯
const handleCopyAccount = async (accountNumber?: string) => {
  if (!accountNumber) {
    console.error('未提供帳號，無法複製');
    return;
  }
  const success = await copyToClipboard(accountNumber);
  if (success) {
    showAlert(t.accountCopied);
  }
};

useEffect(() => {
  const qty = parseInt(formData.quantity) || 1;
  const players = parseInt(formData.players) || 0;
  const maxPlayers = qty * 4;

  if (players > maxPlayers || players === 0) {
    setFormData(prev => ({ ...prev, players: '1' }));
  }
}, [formData.quantity]);

useEffect(() => {    const qty = parseInt(formData.quantity) || 0;
    const sessionObj = sessions.find(s => s.name === formData.session);
    const price = sessionType === '' ? 0 : (sessionObj ? sessionObj.price : 650);
    setCalculatedTotal(qty * price);
  }, [formData.quantity, formData.session, sessions, sessionType]);

  const handleSort = (index: number) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === index && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: index, direction });
    
    const header = submissions[0];
    const data = submissions.slice(1);
    const sortedData = sortSubmissions(data, index, direction);
    
    setSubmissions([header, ...sortedData]);
    };

    const handleDateFilter = (date: Date | null) => setAdminFilterDate(date);

  const loadPage = async (page: number) => {
    // Firebase 分頁邏輯較複雜，此處先維持基礎 100 筆即時更新，
    // 若資料量大於 1000 筆時建議再實作 startAfter 分頁。
    setCurrentPage(page);
  };

  const toggleFixedTime = (time: string, isEdit: boolean) => {
    if (isEdit) {
      const newTimes = toggleTimeInString(editingSession.fixedTime, time);
      setEditingSession({ ...editingSession, fixedTime: newTimes });
    } else {
      const newTimes = toggleTimeInString(newSession.fixedTime, time);
      setNewSession({ ...newSession, fixedTime: newTimes });
    }
  };

  // 判斷是否顯示管理員後台
  if (SECRET_ADMIN_PATH && SECRET_ADMIN_PATH !== '/' && currentPath === SECRET_ADMIN_PATH) {
    return (
      <AdminPage 
        {...{ 
          isAdmin, setIsAdmin, adminTab, setAdminTab, currentAdmin, setCurrentAdmin, 
          dashboardStats: getDisplayStats(), logs, sessions, startEditSession, 
          handleDeleteSession, newSession, setNewSession, handleAddSession, 
          isSubmitting, toggleFixedTime, specialTimeSlots, totalRows, 
          handleDownloadExcel, handleImportExcel, handleImportSessionsExcel, 
          adminFilterDate, handleDateFilter, adminSearchKeyword, setAdminSearchKeyword, 
          showColumnFilter, setShowShowColumnFilter, submissions, visibleColumns, 
          toggleColumn, currentPage, isDataLoading, loadPage, handleSort, sortConfig, 
          setAuditTarget, setShowAuditModal, showAuditModal, auditTarget, 
          handleVerifyPayment, startEditSubmission, isEditing, setIsEditing, 
          editData, setEditData, handleUpdateSubmission, handleDeleteSubmission, 
          isEditingSession, setIsEditingSession, editingSession, setEditingSession, 
          handleUpdateSession, timeslotConfig, setTimeslotConfig, generalTimeSlots, 
          setGeneralTimeSlots, setSpecialTimeSlots, generateTimeSlots, newManualTime, 
          setNewManualTime, handleManualTimeAdd, removeTimeSlot, saveTimeSlotsConfig, 
          formatFullDateTime, deletedSubmissions, showRecycleBin, setShowRecycleBin, 
          handleRestoreSubmission, dbStatus, paymentMethods, addPaymentMethod, 
          deletePaymentMethod, handleClearLogs, handleClearRecycleBin, showAlert, 
          showConfirm, sysModal, t, theme, toggleTheme, adminUser, setAdminUser, 
          adminPassword, setAdminPassword, handleAdminLogin, navigate, SECRET_ADMIN_PATH, currentPath
        }} 
      />
    );
  }

  if (submitted) {
    return (
      <SuccessPage 
        {...{ 
          t, lang, formData, calculatedTotal, paymentMethods, lastSubmissionId, 
          sysModal, handleCopyAccount, getSessionDisplayName, 
          getPaymentMethodDisplay, handleUpdateBankLast5, resetForm, showAlert 
        }} 
      />
    );
  }

  return (
    <RegistrationPage 
      {...{ 
        t, lang, setLang, theme, toggleTheme, formData, formErrors, sessionType, 
        setSessionType, sessions, timeslotConfig, generalTimeSlots, 
        specialTimeSlots, handleInputChange, handleCheckboxChange, 
        handleDateChange, handleCopyAccount, handleSubmit, isSubmitting, 
        calculatedTotal, getSessionDisplayName, getPickupLocationDisplay, 
        getPaymentMethodDisplay, paymentMethods, isEntryAnimating, 
        shouldRenderEntry, showConfirmation, setShowConfirmation, 
        handleConfirmSubmit, sysModal 
      }} 
    />
  )
}
export default App
