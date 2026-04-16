import { useState, useEffect } from 'react'
import "react-datepicker/dist/react-datepicker.css"
import './App.css'
import { registerLocale } from "react-datepicker";

import { zhTW, formatFullDateTime, formatDateTimeMinute, generateTimeSlots, cleanSessionTimeFormat, toggleTimeInString } from './utils/dateUtils'
import { getSessionDisplayName as getSessionDisplayNameUtil, getPickupLocationDisplay as getPickupLocationDisplayUtil, getPaymentMethodDisplay as getPaymentMethodDisplayUtil, copyToClipboard } from './utils/displayUtils'
import { sendPaymentSuccessEmail } from './utils/emailUtils'
import { exportToExcel, readExcelFile } from './utils/excelUtils'
import { formatPhoneForDB } from './utils/formatUtils'
import { sortSubmissions, calculateDashboardStats } from './utils/dataUtils'
import { useSystemTheme } from './hooks/useSystemTheme'
import { useAppRouting } from './hooks/useAppRouting'
import { useAppVersion } from './hooks/useAppVersion'
import { useSystemModal } from './hooks/useSystemModal'
import { useFirebaseListeners } from './hooks/useFirebaseListeners'
import { useRegistrationForm } from './hooks/useRegistrationForm'
import { useAdminAuth } from './hooks/useAdminAuth'
import { useAdminData } from './hooks/useAdminData'

// 註冊語系
registerLocale('zh', zhTW as any);

import { Session, FormData, TimeslotConfig, DashboardStats, PaymentMethod } from './types'

import Header from './components/UI/Header'
import Footer from './components/UI/Footer'
import SocialButtons from './components/UI/SocialButtons'
import EntryAnimation from './components/Registration/EntryAnimation'
import SuccessScreen from './components/Registration/SuccessScreen'
import StorySection from './components/Registration/StorySection'
import EventInfo from './components/Registration/EventInfo'
import RegistrationForm from './components/Registration/RegistrationForm'
import ConfirmationModal from './components/Registration/ConfirmationModal'
import AdminLogin from './components/Admin/AdminLogin'
import AdminDashboard from './components/Admin/AdminDashboard'
import CustomCursor from './components/UI/CustomCursor'
import SystemModal from './components/UI/SystemModal'

import { 
  collection, 
  addDoc, 
  query, 
  updateDoc, 
  doc, 
  deleteDoc, 
  where, 
  setDoc,
  getDocs,
  serverTimestamp,
  writeBatch
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
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditingSession, setIsEditingSession] = useState(false);

  const [adminFilterDate, setAdminFilterDate] = useState<Date | null>(null);
  const [adminSearchKeyword, setAdminSearchKeyword] = useState('');

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
    totalRows
  } = useAdminData({ isAdmin, adminFilterDate, adminSearchKeyword, setIsDataLoading });

  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [adminTab, setAdminTab] = useState<'sessions' | 'submissions' | 'timeslots' | 'logs' | 'payments'>('sessions');
  const [newSession, setNewSession] = useState({ name: '', price: '', fixedDate: '', fixedTime: '', isSpecial: false });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditTarget, setAuditTarget] = useState<{index: number, row: any[]} | null>(null);

  const [calculatedTotal, setCalculatedTotal] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [loadTime] = useState(Date.now());
  const [sortConfig, setSortConfig] = useState<{ key: number, direction: 'asc' | 'desc' } | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<number[]>(() => {
    const saved = localStorage.getItem('visibleColumns');
    return saved ? JSON.parse(saved) : [];
  });
  const [showColumnFilter, setShowShowColumnFilter] = useState(false);

  // 時間段手動調整狀態
  const [newManualTime, setNewManualTime] = useState('');

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

  // [補回] 欄位切換邏輯 (加入持久化)
  const toggleColumn = (index: number) => {
    setVisibleColumns(prev => {
      const newList = prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index].sort((a, b) => a - b);
      localStorage.setItem('visibleColumns', JSON.stringify(newList));
      return newList;
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

  useEffect(() => {
    // 只有在 submissions 有資料，且 visibleColumns 既沒有目前狀態、也沒有 localStorage 存檔時，才自動全選
    const saved = localStorage.getItem('visibleColumns');
    if (submissions.length > 0 && visibleColumns.length === 0 && !saved) {
      const allIndexes = submissions[0].map((_, i) => i);
      setVisibleColumns(allIndexes);
      localStorage.setItem('visibleColumns', JSON.stringify(allIndexes));
    }
  }, [submissions]);

  const handleManualTimeAdd = (type: 'general' | 'special') => {
    if (!newManualTime || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(newManualTime)) {
      showAlert('請輸入正確的時間格式 (HH:mm)');
      return;
    }
    if (type === 'general') {
      if (generalTimeSlots.includes(newManualTime)) return;
      setGeneralTimeSlots([...generalTimeSlots, newManualTime].sort());
    } else {
      if (specialTimeSlots.includes(newManualTime)) return;
      setSpecialTimeSlots([...specialTimeSlots, newManualTime].sort());
    }
    setNewManualTime('');
  };

  const removeTimeSlot = (type: 'general' | 'special', slot: string) => {
    if (type === 'general') {
      setGeneralTimeSlots(generalTimeSlots.filter(s => s !== slot));
    } else {
      setSpecialTimeSlots(specialTimeSlots.filter(s => s !== slot));
    }
  };

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

      // 1. 儲存主要的時段配置
      await setDoc(docRef, {
        config: subConfig,
        slots: slots,
        updatedAt: serverTimestamp()
      });
      
      // 2. [核心修正] 自動清理所有場次中已失效的限制時段
      const batch = writeBatch(db);
      let cleanupCount = 0;
      
      // 找出該類別 (一般/特別) 的場次
      const relevantSessions = sessions.filter(s => s.isSpecial === (type === 'special'));
      
      for (const session of relevantSessions) {
        if (session.fixedTime) {
          const originalTimes = session.fixedTime.split(',').filter(Boolean);
          // 只保留那些仍存在於新 slots 清單中的時間點
          const filteredTimes = originalTimes.filter(t => slots.includes(t));
          
          // 如果數量不一致，代表有時段被刪除了，需要更新該場次文件
          if (originalTimes.length !== filteredTimes.length) {
            const collectionName = type === 'general' ? "sessions" : "special_sessions";
            const sessionRef = doc(db, collectionName, (session as any).id);
            batch.update(sessionRef, { 
              fixedTime: filteredTimes.join(',') 
            });
            cleanupCount++;
          }
        }
      }
      
      // 如果有任何場次需要清理，執行批次寫入
      if (cleanupCount > 0) {
        await batch.commit();
        console.log(`[系統] 已從 ${cleanupCount} 個場次中移除了失效的時段`);
      }

      // 3. 同步更新本地全域 State
      if (type === 'general') {
        setGeneralTimeSlots(slots);
        setTimeslotConfig(prev => ({
          ...prev,
          generalStart: config.generalStart,
          generalEnd: config.generalEnd,
          generalInterval: config.generalInterval
        }));
      } else {
        setSpecialTimeSlots(slots);
        setTimeslotConfig(prev => ({
          ...prev,
          specialStart: config.specialStart,
          specialEnd: config.specialEnd,
          specialInterval: config.specialInterval
        }));
      }
      
      addLog('修改時段', `管理員更新了${type === 'general' ? '一般' : '特別'}預約時段設定，並同步清理了 ${cleanupCount} 個場次的無效時段`);
      showAlert(`${type === 'general' ? '一般' : '特別'}預約時段已儲存${cleanupCount > 0 ? `，並同步清理了 ${cleanupCount} 個場次的失效時段` : ''}`);
    } catch (err) {
      console.error(err);
      showAlert('儲存失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSessionDisplayName = (chineseName: string) => getSessionDisplayNameUtil(chineseName, lang, sessions);

  const addPaymentMethod = async (methodData: any) => {
    if (!methodData.name) return;
    
    // 檢查是新增還是修改
    const existingIndex = paymentMethods.findIndex(m => m.id === methodData.id);
    let newMethods;
    if (existingIndex > -1) {
      // 修改現有項目
      newMethods = [...paymentMethods];
      newMethods[existingIndex] = methodData;
    } else {
      // 新增項目
      newMethods = [...paymentMethods, methodData];
    }

    try {
      await setDoc(doc(db, "config", "payments"), { methods: newMethods });
      addLog('付款方式', `${existingIndex > -1 ? '修改' : '新增'}了付款方式: ${methodData.name}`);
      showAlert('已儲存變更');
    } catch (e) { showAlert('儲存失敗'); }
  };

  const deletePaymentMethod = async (method: PaymentMethod) => {
    showConfirm(`確定要刪除「${method.name}」嗎？`, async () => {
      const newMethods = paymentMethods.filter(m => m.id !== method.id);
      try {
        await setDoc(doc(db, "config", "payments"), { methods: newMethods });
        addLog('付款方式', `刪除了付款方式: ${method.name}`);
      } catch (e) { showAlert('刪除失敗'); }
    });
  };

  useEffect(() => {
    const qty = parseInt(formData.quantity) || 0;
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
        addLog('清除日誌', '超級管理員清空了所有操作日誌');
        showAlert('日誌已全數清除');
      } catch (err) {
        console.error(err);
        showAlert('清除失敗');
      } finally {
        setIsDataLoading(false);
      }
    });
  };

  const loadPage = async (page: number) => {
    // Firebase 分頁邏輯較複雜，此處先維持基礎 100 筆即時更新，
    // 若資料量大於 1000 筆時建議再實作 startAfter 分頁。
    setCurrentPage(page);
  };

  const startEditSubmission = (row: any[], _index: number) => {
    let rawTime = row[11] || ''; 
    if (typeof rawTime === 'string' && rawTime.includes('T')) {
      rawTime = formatDateTimeMinute(new Date(rawTime));
    }
    setEditData({
      timestamp: row[0], status: row[1], name: row[2], phone: row[3], email: row[4], 
      session: row[5], quantity: row[6], players: row[7], totalAmount: row[8], 
      paymentMethod: row[9], bankLast5: row[10], pickupTime: rawTime, 
      pickupLocation: row[12], referral: row[13], notes: row[14],
      id: row[15] // 使用 doc ID
    });
    setIsEditing(true);
  };

  const handleUpdateSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData.id) return;
    setIsSubmitting(true);
    try {
      const docRef = doc(db, "registrations", editData.id);
      const updateData = { ...editData };
      delete updateData.id;
      await updateDoc(docRef, updateData);
      
      addLog('修改報名', `修改了「${editData.name}」的報名資訊`);
      setIsEditing(false);
      showAlert('修改成功');
    } catch (err) {
      showAlert('更新失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [editingSession, setEditingSession] = useState({ id: '', oldName: '', newName: '', newPrice: '', fixedDate: '', fixedTime: '', isSpecial: false });

  const toggleFixedTime = (time: string, isEdit: boolean) => {
    if (isEdit) {
      const newTimes = toggleTimeInString(editingSession.fixedTime, time);
      setEditingSession({ ...editingSession, fixedTime: newTimes });
    } else {
      const newTimes = toggleTimeInString(newSession.fixedTime, time);
      setNewSession({ ...newSession, fixedTime: newTimes });
    }
  };

  const handleAddSession = async () => {
    if (!newSession.name || !newSession.price) return;
    setIsSubmitting(true);
    
    // 修正：一般場次不再自動存入目前的全域時段，使其能保持動態抓取資料庫設定
    let finalFixedTime = newSession.fixedTime;
    // 如果是特別場次且沒有設定時段，才考慮是否要預設（或者維持空白）
    // 這裡我們讓它保持原本的 newSession.fixedTime，不再強制填充一般場次的 generalTimeSlots
    
    const collectionName = newSession.isSpecial ? "special_sessions" : "sessions";

    try {
      await addDoc(collection(db, collectionName), {
        ...newSession,
        fixedTime: finalFixedTime,
        price: Number(newSession.price),
        createdAt: serverTimestamp()
      });
      setNewSession({ name: '', price: '', fixedDate: '', fixedTime: '', isSpecial: false });
      addLog('新增場次', `新增${newSession.isSpecial ? '特別' : '一般'}場次: ${newSession.name}`);
      showAlert('新增成功！');
    } catch (err: any) {
      showAlert(`新增失敗！`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      addLog('修改場次', `將 ${editingSession.oldName} 修改為 ${editingSession.newName}`);
      showAlert('修改成功');
    } catch (err) {
      showAlert('修改失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSession = async (name: string, id?: string) => {
    showConfirm(`確定要刪除場次「${name}」嗎？`, async () => {
      if (!id) return;
      try {
        // 先嘗試從一般場次刪除，如果失敗（例如不在該集合）再嘗試特別場次
        // 或者根據目前的 UI 邏輯，我們可以從 sessions state 中找到該 session 的類型
        const session = sessions.find(s => (s as any).id === id);
        const collectionName = session?.isSpecial ? "special_sessions" : "sessions";
        
        await deleteDoc(doc(db, collectionName, id));
        addLog('刪除場次', `刪除了場次：${name}`);
        showAlert('刪除成功');
      } catch (err) {
        showAlert('刪除失敗');
      }
    });
  };

  const handleDeleteSubmission = async (rowIndex: number) => {
    const target = submissions[rowIndex];
    const docId = target[15];
    if (!docId) return;
    
    showConfirm('確定要將這筆報名資料移至回收桶嗎？', async () => {
      setIsDataLoading(true);
      try {
        const docRef = doc(db, "registrations", docId);
        await updateDoc(docRef, { deleted: true });
        addLog('刪除報名', `將「${target[2]}」移至回收桶`);
        showAlert('已移至回收桶');
      } catch (err) {
        showAlert('操作失敗');
      } finally {
        setIsDataLoading(false);
      }
    });
  };

  const handleVerifyPayment = async (rowIndex: number, status: string) => {
    const target = submissions[rowIndex];
    const docId = target[15];
    const currentStatus = target[1]; // 取得目前資料庫中的狀態
    
    if (!docId) return;

    showConfirm(`確定要將此筆報名標記為「${status}」嗎？`, async () => {
      setIsDataLoading(true);
      try {
        const docRef = doc(db, "registrations", docId);
        await updateDoc(docRef, { status });
        addLog('審核付款', `將「${target[2]}」的狀態由 [${currentStatus}] 變更為 [${status}]`);
        
        // [核心修正]：只有在原本不是「通過」，且新狀態是「通過」時才發信
        if (status === '通過' && currentStatus !== '通過') {
          await sendPaymentSuccessEmail(target);
        }
        
        showAlert('審核狀態已更新');
      } catch (err) {
        showAlert('審核失敗');
      } finally {
        setIsDataLoading(false);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formErrors.email || formErrors.phone || formErrors.name) {
      showAlert('請修正表單中的錯誤紅字後再試。');
      return;
    }
    const requiredFields = [{ key: 'name', label: '姓名' }, { key: 'phone', label: '電話' }, { key: 'email', label: 'Email' }];
    for (const field of requiredFields) {
      const value = formData[field.key as keyof typeof formData];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        showAlert(`請填寫${field.label}`);
        return;
      }
    }
    if (sessionType === '') { showAlert('請選擇場次類型'); return; }
    if (!formData.session) { showAlert('尚未選定場次'); return; }
    if (!formData.pickupTime) { showAlert('請選擇日期時間'); return; }
    setShowConfirmation(true);
  };

  const getPickupLocationDisplay = (location: string) => getPickupLocationDisplayUtil(location, lang, t);

  // 執行最終資料寫入的函數
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
      addLog('報名提交', `${formData.name} 提交了報名 (${formData.session})`);
      return docRef.id;
    } catch (err) {
      console.error("提交失敗:", err);
      showAlert('提交失敗，請檢查網路連線。');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmSubmit = async () => {
    if (formData.hp_field !== '') return; 
    const timeDiff = (Date.now() - loadTime) / 1000;
    if (timeDiff < 3) { showAlert('填表速度過快，請稍候再試'); return; }
    
    const qty = parseInt(formData.quantity) || 0;
    const players = parseInt(formData.players) || 0;
    const maxPlayers = qty * 4;
    
    if (qty <= 0) { showAlert('份數必須至少為 1 份'); setShowConfirmation(false); return; }
    if (players <= 0 || players > maxPlayers) { showAlert(`遊玩人數上限應為 ${maxPlayers} 人`); setShowConfirmation(false); return; }
    
    setShowConfirmation(false);

    // 取得選取的付款方式詳細資訊
    const selectedPayment = (paymentMethods || []).find(m => m.name === formData.paymentMethod);

    // 如果是「銀行轉帳」或「Line Pay」，不立即存檔，而是先顯示成功頁面（引導付款）
    if (selectedPayment?.type === 'bank' || selectedPayment?.type === 'linepay') {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 其他付款方式（如現金）則立即存檔
    try {
      await executeFinalSubmission();
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      // 錯誤已處理
    }
  };

  const handleUpdateBankLast5 = async (id: string, last5: string) => {
    try {
      // 如果 ID 存在，代表已經存過檔（例如現金轉銀行之類的例外狀況）
      if (id) {
        const docRef = doc(db, "registrations", id);
        await updateDoc(docRef, { bankLast5: last5 });
        return true;
      } else {
        // 如果沒有 ID，代表尚未存過檔，現在進行最終存檔並帶入末五碼
        const newId = await executeFinalSubmission(last5);
        return !!newId;
      }
    } catch (err) {
      console.error("更新末五碼失敗:", err);
      return false;
    }
  };

  const getPaymentMethodDisplay = (method: string) => getPaymentMethodDisplayUtil(method, lang, t);

  const resetForm = () => {
    // 透過重新整理頁面來達到最徹底的狀態重置，解決組件內部狀態殘留問題
    window.location.reload();
  };

  const handleRestoreSubmission = async (rowIndex: number) => {
    const target = deletedSubmissions[rowIndex];
    const docId = target[15];
    if (!docId) return;
    
    setIsSubmitting(true);
    try {
      const docRef = doc(db, "registrations", docId);
      await updateDoc(docRef, { deleted: false });
      addLog('還原報名', `從回收桶還原了「${target[2]}」的紀錄`);
      showAlert('資料已還原');
      setShowRecycleBin(false);
    } catch (err) {
      showAlert('還原失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearRecycleBin = async () => {
    showConfirm('確定要徹底刪除回收桶中的所有資料嗎？此動作無法復原。', async () => {
      setIsDataLoading(true);
      try {
        const q = query(collection(db, "registrations"), where("deleted", "==", true));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        addLog('清空回收桶', '超級管理員徹底刪除了回收桶中的所有報名資料');
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

  // [新增] 匯入場次舊資料邏輯
  const handleImportSessionsExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showConfirm('確定要從此 Excel 匯入場次設定嗎？', async () => {
      setIsDataLoading(true);
      try {
        const data = await readExcelFile(file);

        if (data.length <= 1) {
          showAlert('Excel 檔案似乎沒有資料。');
          return;
        }

        const rows = data.slice(1);
        let count = 0;

        for (const row of rows) {
          if (!row[0]) continue; // 沒名稱就跳過

          const isSpecial = row[2] === '是' || row[2] === 'special' || row[2] === true || !!row[3];
          const collectionName = isSpecial ? "special_sessions" : "sessions";

          const sessionData = {
            name: String(row[0]),
            price: Number(row[1]) || 0,
            isSpecial: isSpecial,
            fixedDate: row[3] ? String(row[3]) : '',
            fixedTime: row[4] ? String(row[4]) : '',
            enName: row[5] ? String(row[5]) : '',
            createdAt: serverTimestamp()
          };

          await addDoc(collection(db, collectionName), sessionData);
          count++;
        }
        addLog('匯入場次', `批次匯入了 ${count} 個場次`);
        showAlert(`成功匯入 ${count} 個場次！`);
      } catch (err) {
        console.error(err);
        showAlert('匯入失敗，請檢查檔案格式。');
      } finally {
        setIsDataLoading(false);
        e.target.value = '';
      }
    });
  };

  // 判斷是否顯示管理員後台
  if (SECRET_ADMIN_PATH && SECRET_ADMIN_PATH !== '/' && currentPath === SECRET_ADMIN_PATH) {
    if (isAdmin) {
      return (
        <>
          <CustomCursor />
          <AdminDashboard 
            {...{ t, theme, toggleTheme, setIsAdmin: (val) => { setIsAdmin(val); if(!val) navigate('/'); }, adminTab, setAdminTab, currentAdmin, setCurrentAdmin, dashboardStats: getDisplayStats(), logs, sessions, startEditSession, handleDeleteSession, newSession, setNewSession, handleAddSession, isSubmitting, toggleFixedTime, specialTimeSlots, totalRows, handleDownloadExcel, handleImportExcel, handleImportSessionsExcel, adminFilterDate, handleDateFilter, adminSearchKeyword, setAdminSearchKeyword, showColumnFilter, setShowShowColumnFilter, submissions, visibleColumns, toggleColumn, currentPage, isDataLoading, loadPage, handleSort, sortConfig, setAuditTarget, setShowAuditModal, showAuditModal, auditTarget, handleVerifyPayment, startEditSubmission, isEditing, setIsEditing, editData, setEditData, handleUpdateSubmission, handleDeleteSubmission, isEditingSession, setIsEditingSession, editingSession, setEditingSession, handleUpdateSession, timeslotConfig, setTimeslotConfig, generalTimeSlots, setGeneralTimeSlots, setSpecialTimeSlots, generateTimeSlots, newManualTime, setNewManualTime, handleManualTimeAdd, removeTimeSlot, saveTimeSlotsConfig, formatFullDateTime, deletedSubmissions, showRecycleBin, setShowRecycleBin, handleRestoreSubmission, dbStatus, paymentMethods, addPaymentMethod, deletePaymentMethod, handleClearLogs, handleClearRecycleBin, showAlert, showConfirm }}
          />
          <SystemModal 
            show={sysModal.show}
            type={sysModal.type}
            title={sysModal.title}
            message={sysModal.message}
            onConfirm={sysModal.onConfirm}
            onCancel={sysModal.onCancel}
            confirmText={sysModal.confirmText}
            cancelText={sysModal.cancelText}
          />
        </>
      );
    }
    
    return (
      <div className="admin-only-page">
        <CustomCursor />
        <AdminLogin {...{ t, showAdminLogin: true, setShowAdminLogin: () => navigate('/'), adminUser, setAdminUser, adminPassword, setAdminPassword, handleAdminLogin, isDataLoading }} />
        <SystemModal 
          show={sysModal.show}
          type={sysModal.type}
          title={sysModal.title}
          message={sysModal.message}
          onConfirm={sysModal.onConfirm}
          onCancel={sysModal.onCancel}
          confirmText={sysModal.confirmText}
          cancelText={sysModal.cancelText}
        />
      </div>
    );
  }

  if (submitted) {
    return (
      <>
        <CustomCursor />
        <SuccessScreen 
          {...{ t, formData, calculatedTotal, handleCopyAccount, getSessionDisplayName, getPaymentMethodDisplay, resetForm, paymentMethods, lang, lastSubmissionId, handleUpdateBankLast5, showAlert }}
        />
        <SystemModal 
          show={sysModal.show}
          type={sysModal.type}
          title={sysModal.title}
          message={sysModal.message}
          onConfirm={sysModal.onConfirm}
          onCancel={sysModal.onCancel}
          confirmText={sysModal.confirmText}
          cancelText={sysModal.cancelText}
        />
      </>
    );
  }

  return (
    <div className="container">
      <CustomCursor />
      <EntryAnimation {...{ t, isEntryAnimating, shouldRenderEntry }} />
      <ConfirmationModal {...{ t, lang, showConfirmation, setShowConfirmation, formData, calculatedTotal, handleConfirmSubmit, isSubmitting, getSessionDisplayName, getPickupLocationDisplay, getPaymentMethodDisplay }} />
      <Header {...{ lang, setLang, theme, toggleTheme, t }} />
      <main className="main-content">
        <div className="poster-container"><img src="poster.jpg" alt="Poster" className="poster-image" /></div>
        <StorySection t={t} />
        <EventInfo t={t} />
        <RegistrationForm {...{ t, lang, formData, formErrors, sessionType, setSessionType, sessions, timeslotConfig, generalTimeSlots, specialTimeSlots, handleInputChange, handleCheckboxChange, handleDateChange, handleCopyAccount, handleSubmit, isSubmitting, calculatedTotal, getSessionDisplayName, paymentMethods }} />
      </main>
      <SocialButtons t={t} />
      <Footer t={t} />
      <SystemModal 
        show={sysModal.show}
        type={sysModal.type}
        title={sysModal.title}
        message={sysModal.message}
        onConfirm={sysModal.onConfirm}
        onCancel={sysModal.onCancel}
        confirmText={sysModal.confirmText}
        cancelText={sysModal.cancelText}
      />
    </div>
  )
}
export default App
