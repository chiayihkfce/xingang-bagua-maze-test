import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import './App.css'

function App() {
  // --- 1. 狀態與變數定義 ---
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessions, setSessions] = useState<{name: string, price: number, fixedDate?: string, fixedTime?: string}[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // 新增：初始載入狀態
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [submissions, setSubmissions] = useState<any[][]>([]);
  const [adminTab, setAdminTab] = useState<'sessions' | 'submissions'>('sessions');
  const [newSession, setNewSession] = useState({ name: '', price: '', fixedDate: '', fixedTime: '', isSpecial: false });
  const [isEditing, setIsEditing] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditTarget, setAuditTarget] = useState<{index: number, row: any[]} | null>(null);

  const [sessionType, setSessionType] = useState<'一般預約' | '特別預約' | ''>('');

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    contactEmail: '',
    session: '',
    quantity: '1',
    players: '1',
    totalAmount: '',
    paymentMethod: '親至新港文教基金會繳費',
    bankLast5: '',
    pickupTime: '',
    pickupLocation: '新港文教基金會(閱讀館)',
    referral: [] as string[],
    notes: '',
    hp_field: '' // 陷阱欄位 (Honeypot)
  });

  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [loadTime] = useState(Date.now()); // 紀錄頁面載入時間
  const [adminFilterDate, setAdminFilterDate] = useState<Date | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: number, direction: 'asc' | 'desc' } | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<number[]>([]);
  const [showColumnFilter, setShowShowColumnFilter] = useState(false);

  // 當份數改變時，確保遊玩人數不會超過上限 (份數 * 4)
  useEffect(() => {
    const qty = parseInt(formData.quantity) || 1;
    const players = parseInt(formData.players) || 0;
    const maxPlayers = qty * 4;
    
    if (players > maxPlayers || players === 0) {
      setFormData(prev => ({ ...prev, players: '1' }));
    }
  }, [formData.quantity]);

  // 初始化可見欄位 (預設全選)
  useEffect(() => {
    if (submissions.length > 0 && visibleColumns.length === 0) {
      setVisibleColumns(submissions[0].map((_, i) => i));
    }
  }, [submissions]);

  const toggleColumn = (index: number) => {
    setVisibleColumns(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index].sort((a, b) => a - b)
    );
  };

  // 請在此處填入您部署後的 Google Apps Script URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzOdLH2XHxJR7wEcCJYsPne_ZjciEPBKbZr7OmaafuG3l1VQrUtLzhlD2aADa-gOSZ1/exec';

  // --- 2. 工具與常數 ---
  const TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00'
  ];

  const pad = (n: number) => String(n).padStart(2, '0');

  // 格式 A: 2026-03-11 13:26:05 (用於時間戳記)
  const formatFullDateTime = (date: Date) => {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  // 格式 B: 2026-03-14 14:00 (用於預計遊玩時間)
  const formatDateTimeMinute = (date: Date) => {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // 1. 初始載入場次 (優化效能版：減少渲染、精準計時)
  useEffect(() => {
    const fetchSessions = async () => {
      console.time('🚀 [Performance] 初始載入場次 (fetchSessions)');
      
      // 1. 優先從快取讀取
      const cached = localStorage.getItem('bagua_maze_sessions');
      let currentSessions: any[] = [];
      
      if (cached) {
        try {
          currentSessions = JSON.parse(cached);
          setSessions(currentSessions);
          setIsInitialLoading(false);
          console.log('📦 [Cache] 已從快取快速載入');
        } catch (e) {
          console.error('❌ 快取解析失敗');
        }
      }

      try {
        const apiStartTime = Date.now();
        const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getSessions`);
        const newData = await res.json();
        const apiDuration = Date.now() - apiStartTime;
        
        console.log(`⏱️ [Debug] 純網絡請求耗時: ${apiDuration}ms`);

        if (Array.isArray(newData) && newData.length > 0) {
          // 2. 只有當資料真的有變動時才更新 sessions 狀態
          const isDataChanged = JSON.stringify(newData) !== JSON.stringify(currentSessions);
          
          if (isDataChanged) {
            setSessions(newData);
            localStorage.setItem('bagua_maze_sessions', JSON.stringify(newData));
          }
        }
      } catch (err) {
        console.error('❌ [Error] 無法更新場次:', err);
      } finally {
        setIsInitialLoading(false);
        console.timeEnd('🚀 [Performance] 初始載入場次 (fetchSessions)');
      }
    };
    fetchSessions();
  }, []);

  // 2. 價格與場次聯動邏輯
  useEffect(() => {
    const qty = parseInt(formData.quantity) || 0;
    const sessionObj = sessions.find(s => s.name === formData.session);
    
    // 修正：如果沒有選擇場次(sessionType === '')，價格為 0；否則若找不到 sessionObj 則預設 650
    const price = sessionType === '' ? 0 : (sessionObj ? sessionObj.price : 650);
    
    setCalculatedTotal(qty * price);
  }, [formData.quantity, formData.session, sessions, sessionType]);

  const [isDataLoading, setIsDataLoading] = useState(false);

  // 3.1 根據日期篩選報名資料
  const handleDateFilter = async (date: Date | null) => {
    setAdminFilterDate(date);
    if (!date) {
      loadPage(1); // 如果清除日期，回歸分頁顯示
      return;
    }
    
    setIsDataLoading(true);
    // 修改搜尋格式為 M/D/YYYY 以符合試算表中的存儲格式
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getSubmissionsByDate&pw=${adminPassword}&date=${formattedDate}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSubmissions(data);
        setTotalRows(data.length - 1); // 扣掉標題列
      }
    } catch (err) {
      alert('篩選失敗');
    } finally {
      setIsDataLoading(false);
    }
  };

  // 3.6 排序邏輯
  const handleSort = (index: number) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === index && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: index, direction });

    const header = submissions[0];
    const data = submissions.slice(1);

    const sortedData = [...data].sort((a, b) => {
      let valA = a[index];
      let valB = b[index];

      // 1. 針對時間戳記 (第 0 欄) 進行日期排序
      if (index === 0) {
        const dateA = new Date(valA).getTime();
        const dateB = new Date(valB).getTime();
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // 2. 數值型排序處理
      if (!isNaN(Number(valA)) && !isNaN(Number(valB))) {
        return direction === 'asc' ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
      }

      // 字串型排序處理
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSubmissions([header, ...sortedData]);
  };

  // 3. 管理員登入
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDataLoading(true);
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=adminLogin&pw=${adminPassword}`);
      const result = await res.json();
      
      if (result.submissions) {
        setSubmissions(result.submissions);
        // 如果目前已經有場次資料且後端傳回的場次資料一致，則不強制更新
        if (result.sessions && result.sessions.length > 0) {
          setSessions(result.sessions);
          localStorage.setItem('bagua_maze_sessions', JSON.stringify(result.sessions));
        }
        setTotalRows(result.totalRows);
        setCurrentPage(1);
        setIsAdmin(true);
        setShowAdminLogin(false);
      } else {
        alert('密碼錯誤');
      }
    } catch (err) {
      console.error('登入偵錯資訊:', err);
      alert('登入失敗，可能是後端腳本未更新或密碼錯誤。');
    } finally {
      setIsDataLoading(false);
    }
  };

  // 3.5 載入特定分頁
  const loadPage = async (page: number) => {
    setIsDataLoading(true);
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getSubmissionsPage&pw=${adminPassword}&page=${page}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        if (page === 1) {
          setSubmissions(data);
        } else {
          setSubmissions([submissions[0], ...data]);
        }
        setCurrentPage(page);
      }
    } catch (err) {
      alert('無法載入分頁資料');
    } finally {
      setIsDataLoading(false);
    }
  };

  // --- 管理員操作功能 ---

  // 7. 管理操作：開啟修改視窗 (報名資料)
  const startEditSubmission = (row: any[], index: number) => {
    setEditingRowIndex(index);
    let rawTime = row[11] || ''; // 15 欄位架構中，第 12 欄 (Index 11) 為領取時間
    if (typeof rawTime === 'string' && rawTime.includes('T')) {
      rawTime = formatDateTimeMinute(new Date(rawTime));
    }
    setEditData({
      timestamp: row[0], 
      status: row[1], 
      name: row[2], 
      phone: row[3], 
      email: row[4], 
      session: row[5], 
      quantity: row[6], 
      players: row[7], 
      totalAmount: row[8], 
      paymentMethod: row[9], 
      bankLast5: row[10], 
      pickupTime: rawTime, 
      pickupLocation: row[12], 
      referral: row[13], 
      notes: row[14]
    });
    setIsEditing(true);
  };

  // 8. 管理操作：送出修改 (報名資料)
  const handleUpdateSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'updateSubmission', pw: adminPassword, rowIndex: editingRowIndex, ...editData })
      });
      const newSubmissions = [...submissions];
      if (editingRowIndex !== null) {
        // 對齊 15 欄位順序儲存至本地狀態
        newSubmissions[editingRowIndex] = [
          editData.timestamp, 
          editData.status, 
          editData.name, 
          editData.phone, 
          editData.email,
          editData.session, 
          editData.quantity, 
          editData.players, 
          editData.totalAmount, 
          editData.paymentMethod, 
          editData.bankLast5, 
          editData.pickupTime, 
          editData.pickupLocation, 
          editData.referral, 
          editData.notes
        ];
        setSubmissions(newSubmissions);
      }
      setIsEditing(false);
      alert('修改成功');
    } catch (err) {
      alert('修改失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isEditingSession, setIsEditingSession] = useState(false);
  const [editingSession, setEditingSession] = useState({ 
    oldName: '', newName: '', newPrice: '', fixedDate: '', fixedTime: '', isSpecial: false 
  });

  // 管理操作：切換固定時間多選
  const toggleFixedTime = (time: string, isEdit: boolean) => {
    if (isEdit) {
      const currentTimes = editingSession.fixedTime ? editingSession.fixedTime.split(',') : [];
      const newTimes = currentTimes.includes(time) 
        ? currentTimes.filter(t => t !== time) 
        : [...currentTimes, time].sort();
      setEditingSession({ ...editingSession, fixedTime: newTimes.join(',') });
    } else {
      const currentTimes = newSession.fixedTime ? newSession.fixedTime.split(',') : [];
      const newTimes = currentTimes.includes(time) 
        ? currentTimes.filter(t => t !== time) 
        : [...currentTimes, time].sort();
      setNewSession({ ...newSession, fixedTime: newTimes.join(',') });
    }
  };

  // 4. 管理操作：新增場次
  const handleAddSession = async () => {
    if (!newSession.name || !newSession.price) return;
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ 
          action: 'addSession', 
          pw: adminPassword, 
          ...newSession 
        })
      });
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getSessions`);
      const data = await res.json();
      setSessions(data);
      setNewSession({ name: '', price: '', fixedDate: '', fixedTime: '', isSpecial: false });
      alert('新增成功');
    } catch (err) {
      alert('新增失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4.5 管理操作：開啟修改場次視窗
  const startEditSession = (session: any) => {
    setEditingSession({ 
      oldName: session.name, 
      newName: session.name, 
      newPrice: String(session.price),
      fixedDate: session.fixedDate || '',
      fixedTime: session.fixedTime || '',
      isSpecial: !!(session.fixedDate || session.fixedTime)
    });
    setIsEditingSession(true);
  };

  // 4.6 管理操作：送出修改場次
  const handleUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ 
          action: 'updateSession', 
          pw: adminPassword, 
          ...editingSession 
        })
      });
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getSessions`);
      const data = await res.json();
      setSessions(data);
      setIsEditingSession(false);
      alert('修改成功');
    } catch (err) {
      alert('修改失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. 管理操作：刪除場次
  const handleDeleteSession = async (name: string, isSpecial: boolean) => {
    if (!window.confirm(`確定要刪除場次「${name}」嗎？`)) return;
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ 
          action: 'deleteSession', 
          pw: adminPassword, 
          name,
          isSpecial // 告知後端是哪種類型，以便搜尋正確的試算表分頁
        })
      });
      setSessions(prev => prev.filter(s => s.name !== name));
      alert('刪除要求已送出');
    } catch (err) {
      console.error('刪除失敗:', err);
      alert('刪除失敗，請檢查網路連線');
    }
  };

  // 6. 管理操作：刪除報名資料
  const handleDeleteSubmission = async (rowIndex: number) => {
    if (!window.confirm('確定要刪除這筆報名資料嗎？此操作不可復原！')) return;
    setIsDataLoading(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'deleteSubmission', pw: adminPassword, rowIndex })
      });
      setSubmissions(prev => prev.filter((_, i) => i !== rowIndex));
      setTotalRows(prev => prev - 1);
      alert('已刪除');
    } catch (err) {
      alert('刪除失敗');
    } finally {
      setIsDataLoading(false);
    }
  };

  // 6.5 管理操作：審核付款
  const handleVerifyPayment = async (rowIndex: number, status: string) => {
    if (!window.confirm(`確定要將此筆報名標記為「${status}」嗎？`)) return;
    setIsDataLoading(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'verifyPayment', pw: adminPassword, rowIndex, status })
      });
      
      const newSubmissions = [...submissions];
      // 修正：狀態欄位在 Index 1
      newSubmissions[rowIndex][1] = status;
      
      setSubmissions(newSubmissions);
      alert('審核狀態已更新');
    } catch (err) {
      alert('審核失敗');
    } finally {
      setIsDataLoading(false);
    }
  };

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // 姓名欄位：僅過濾掉數字
    if (name === 'name') {
      const filteredValue = value.replace(/[0-9]/g, '');
      if (filteredValue.length > 20) return;
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
      return;
    }

    // 當份數改變時，如果是一般預約，自動切換場次
    if (name === 'quantity') {
      const qty = parseInt(value) || 0;
      setFormData(prev => {
        let updatedSession = prev.session;
        if (sessionType === '一般預約') {
          const filtered = sessions.filter(s => !s.fixedDate && !s.fixedTime);
          if (qty >= 5) {
            const groupSession = filtered.find(s => s.name.includes('團體優惠')) || filtered[0];
            updatedSession = groupSession?.name || '';
          } else {
            // 優先找包含「單人」、「個人」或「一般」的場次，若都沒有則選第一個
            const soloSession = filtered.find(s => s.name.includes('單人') || s.name.includes('個人') || s.name.includes('一般')) || filtered[0];
            updatedSession = soloSession?.name || '';
          }
        }
        return { ...prev, quantity: value, session: updatedSession };
      });
      return;
    }

    // 當場次改變時 (主要是特別預約手動切換)
    if (name === 'session') {
      const selectedSession = sessions.find(s => s.name === value);
      const times = selectedSession?.fixedTime ? selectedSession.fixedTime.split(',') : [];
      const fixedTime = (selectedSession?.fixedDate && times.length === 1) 
        ? `${selectedSession.fixedDate} ${times[0]}` 
        : '';
      setFormData(prev => ({ ...prev, session: value, pickupTime: fixedTime }));
      return;
    }

    if (name === 'phone') {
      if (value.length > 15) return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const day = date.getDay();
      if (day === 1 || day === 2) return;
      const hours = date.getHours();
      if (hours < 9 || hours > 15) date.setHours(9, 0, 0);
      
      // 改用不含秒的時間格式處理器 (YYYY-MM-DD HH:mm)
      const formattedDate = formatDateTimeMinute(date); 
      setFormData(prev => ({ ...prev, pickupTime: formattedDate }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const newReferral = checked 
        ? [...prev.referral, value]
        : prev.referral.filter(item => item !== value);
      return { ...prev, referral: newReferral };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    // --- 機器人驗證 (Honeypot & Speed Check) ---
    if (formData.hp_field !== '') {
      console.warn('機器人行為檢測：陷阱欄位被填寫，值為:', formData.hp_field);
      alert('檢測到異常行為（可能是自動填寫功能干擾），請重新整理頁面再試一次。');
      return; 
    }

    const timeDiff = (Date.now() - loadTime) / 1000;
    if (timeDiff < 3) { // 將 5 秒放寬到 3 秒
      alert('【送出失敗】填表速度過快，請稍候再按送出。');
      return;
    }

    // --- 原有的二次驗證邏輯 ---
    const qty = parseInt(formData.quantity) || 0;
    const players = parseInt(formData.players) || 0;
    const maxPlayers = qty * 4;

    if (qty <= 0) {
      alert('【報名失敗】份數必須至少為 1 份。');
      setShowConfirmation(false);
      return;
    }

    if (players <= 0 || players > maxPlayers) {
      alert(`【報名失敗】遊玩人數不符規定。\n目前報名 ${qty} 份，遊玩人數上限應為 ${maxPlayers} 人。\n請檢查後重新輸入。`);
      setShowConfirmation(false);
      return;
    }
    // ------------------

    setIsSubmitting(true);
    setShowConfirmation(false);

    const bankLast5 = formData.paymentMethod === '銀行轉帳/ATM' ? formData.bankLast5 : '無';
    const submissionData: any = {
      ...formData,
      players: formData.players.trim() || '1',
      notes: formData.notes.trim() || '無',
      paymentMethod: formData.paymentMethod.split(' (')[0],
      bankLast5: bankLast5,
      totalAmount: calculatedTotal,
      referral: formData.referral.join(', '),
      timestamp: formatFullDateTime(new Date()), // 使用包含秒數的完整格式
      action: 'addRegistration'
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('提交失敗:', error);
      alert('報名失敗，請檢查網路連線或稍後再試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '', name: '', phone: '', contactEmail: '', session: sessions[0]?.name || '',
      quantity: '1', players: '1', totalAmount: '', paymentMethod: '親至新港文教基金會繳費',
      bankLast5: '', pickupTime: '', pickupLocation: '新港文教基金會(閱讀館)',
      referral: [] as string[], notes: '', hp_field: ''
    });
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 管理員後台 UI
  if (isAdmin) {
    return (
      <div className="container admin-dashboard">
        {showAuditModal && auditTarget && (
          <div className="modal-overlay">
            <div className="admin-login-modal form-card" style={{maxWidth: '500px'}}>
              <h2 className="form-section-title">報名資料審核</h2>
              <div className="audit-details" style={{textAlign: 'left', marginBottom: '1.5rem', lineHeight: '1.8'}}>
                <p><strong>報名人：</strong>{auditTarget.row[2]}</p>
                <p><strong>報名場次：</strong>{auditTarget.row[5]}</p>
                <p><strong>份數：</strong>{auditTarget.row[6]} 份</p>
                <p><strong>總金額：</strong><span style={{color: 'var(--primary-gold)', fontWeight: 'bold'}}>NT$ {auditTarget.row[8]}</span></p>
                <p><strong>當前狀態：</strong>{auditTarget.row[1] || '待審核'}</p>
              </div>
              <div className="modal-actions admin-login-actions" style={{flexDirection: 'column', gap: '0.8rem'}}>
                <button 
                  onClick={() => {
                    handleVerifyPayment(auditTarget.index, '通過');
                    setShowAuditModal(false);
                  }} 
                  className="submit-btn" 
                  style={{width: '100%', background: '#27ae60'}}
                >
                  確認付款完成 (標記為通過)
                </button>
                <button 
                  onClick={() => setShowAuditModal(false)} 
                  className="cancel-btn" 
                  style={{width: '100%'}}
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="modal-overlay">
            <div className="admin-login-modal form-card admin-edit-modal" style={{maxWidth: '800px', width: '95%'}}>
              <h2 className="form-section-title">修改報名資料</h2>
              <form onSubmit={handleUpdateSubmission}>
                <div className="edit-form-grid">
                  <div className="form-group">
                    <label>審核狀態</label>
                    <select value={editData.status} onChange={e => setEditData({...editData, status: e.target.value})}>
                      <option value="待審核">待審核</option>
                      <option value="通過">通過</option>
                      <option value="不通過">不通過</option>
                    </select>
                  </div>
                  <div className="form-group"><label>填表姓名</label><input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} /></div>
                  <div className="form-group"><label>聯絡電話</label><input type="text" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} /></div>
                  <div className="form-group"><label>Email</label><input type="email" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} /></div>
                  <div className="form-group"><label>報名場次</label>
                    <select value={editData.session} onChange={e => setEditData({...editData, session: e.target.value})}>
                      {sessions.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>份數</label><input type="number" value={editData.quantity} onChange={e => setEditData({...editData, quantity: e.target.value})} /></div>
                  <div className="form-group"><label>遊玩人數</label><input type="text" value={editData.players} onChange={e => setEditData({...editData, players: e.target.value})} /></div>
                  <div className="form-group"><label>總金額</label><input type="number" value={editData.totalAmount} onChange={e => setEditData({...editData, totalAmount: e.target.value})} /></div>
                  <div className="form-group"><label>繳費方式</label>
                    <select value={editData.paymentMethod} onChange={e => setEditData({...editData, paymentMethod: e.target.value})}>
                      <option value="親至新港文教基金會繳費">親至新港文教基金會繳費</option>
                      <option value="銀行轉帳/ATM">銀行轉帳/ATM</option>
                      <option value="Line Pay">Line Pay</option>
                    </select>
                  </div>
                  <div className="form-group"><label>轉帳帳戶(末五碼)</label><input type="text" value={editData.bankLast5} onChange={e => setEditData({...editData, bankLast5: e.target.value})} /></div>
                  <div className="form-group"><label>遊玩日期時間</label><input type="text" value={editData.pickupTime} onChange={e => setEditData({...editData, pickupTime: e.target.value})} /></div>
                  <div className="form-group"><label>領取地點</label>
                    <select value={editData.pickupLocation} onChange={e => setEditData({...editData, pickupLocation: e.target.value})}>
                      <option value="新港文教基金會(閱讀館)">新港文教基金會(閱讀館)</option>
                      <option value="培桂堂(建議選此處，可同時參觀)">培桂堂</option>
                    </select>
                  </div>
                  <div className="form-group" style={{gridColumn: '1 / -1'}}><label>如何得知本活動內容?</label><input type="text" value={editData.referral} onChange={e => setEditData({...editData, referral: e.target.value})} /></div>
                  <div className="form-group" style={{gridColumn: '1 / -1'}}><label>備註</label>
                    <textarea value={editData.notes} onChange={e => setEditData({...editData, notes: e.target.value})} rows={2}></textarea>
                  </div>
                </div>
                
                <div className="modal-actions admin-login-actions">
                  <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">取消</button>
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>儲存修改</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditingSession && (
          <div className="modal-overlay">
            <div className="admin-login-modal form-card" style={{maxWidth: '500px'}}>
              <h2 className="form-section-title">修改場次資訊</h2>
              <form onSubmit={handleUpdateSession}>
                <div className="form-group">
                  <label>場次名稱</label>
                  <input type="text" value={editingSession.newName} onChange={e => setEditingSession({...editingSession, newName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>價格</label>
                  <input type="number" value={editingSession.newPrice} onChange={e => setEditingSession({...editingSession, newPrice: e.target.value})} />
                </div>
                <div className="form-group" style={{gridColumn: '1 / -1'}}>
                  <label>場次分組 (決定儲存分頁) *</label>
                  <select 
                    value={editingSession.isSpecial ? 'special' : 'general'} 
                    onChange={e => setEditingSession({...editingSession, isSpecial: e.target.value === 'special'})}
                  >
                    <option value="general">📅 一般預約場次 (存入「一般場次」分頁)</option>
                    <option value="special">✨ 固定特別場次 (存入「特別場次」分頁)</option>
                  </select>
                </div>
                {editingSession.isSpecial && (
                  <>
                    <div className="form-group">
                      <label>固定日期</label>
                      <DatePicker
                        selected={editingSession.fixedDate ? new Date(editingSession.fixedDate) : null}
                        onChange={(date: Date | null) => {
                          if (date) {
                            const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                            setEditingSession({...editingSession, fixedDate: formatted});
                          } else {
                            setEditingSession({...editingSession, fixedDate: ''});
                          }
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="date-picker-input"
                        placeholderText="點擊選擇日期"
                        isClearable
                      />
                    </div>
                    <div className="form-group" style={{gridColumn: '1 / -1'}}>
                      <label>固定開放時段 (可多選，不選則代表全時段開放)</label>
                      <div className="time-slot-grid">
                        {TIME_SLOTS.map(t => (
                          <button 
                            key={t} 
                            type="button"
                            className={`time-slot-btn ${editingSession.fixedTime.split(',').includes(t) ? 'active' : ''}`}
                            onClick={() => toggleFixedTime(t, true)}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                <div className="modal-actions admin-login-actions">
                  <button type="button" onClick={() => setIsEditingSession(false)} className="cancel-btn">取消</button>
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>儲存修改</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <header className="header">
          <h1>管理後台</h1>
          <div className="admin-nav">
            <button onClick={() => setAdminTab('sessions')} className={adminTab === 'sessions' ? 'active' : ''}>場次管理</button>
            <button onClick={() => setAdminTab('submissions')} className={adminTab === 'submissions' ? 'active' : ''}>報名清單</button>
            <button onClick={() => setIsAdmin(false)}>登出後台</button>
          </div>
        </header>

        {adminTab === 'sessions' ? (
          <section className="admin-section form-card">
            <h3 className="form-section-title">目前場次管理</h3>
            <div className="session-list">
              {sessions.map(s => (
                <div key={s.name} className="session-item">
                  <span style={{color: 'var(--text-light)', flex: 1}}>{s.name} - ${s.price}</span>
                  <div className="action-cell">
                    <button onClick={() => startEditSession(s)} className="edit-btn">修改</button>
                    <button 
                      onClick={() => handleDeleteSession(s.name, !!(s.fixedDate || s.fixedTime))} 
                      className="delete-btn"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="add-session-form">
              <h3 className="form-section-title">新增場次</h3>
              <div className="edit-form-grid">
                <div className="form-group">
                  <label>場次名稱</label>
                  <input type="text" placeholder="例如：5/2(六)市集場" value={newSession.name} onChange={e => setNewSession({...newSession, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>價格</label>
                  <input type="number" placeholder="650" value={newSession.price} onChange={e => setNewSession({...newSession, price: e.target.value})} />
                </div>
                <div className="form-group" style={{gridColumn: '1 / -1'}}>
                  <label>場次分組 (決定儲存分頁) *</label>
                  <select 
                    value={newSession.isSpecial ? 'special' : 'general'} 
                    onChange={e => setNewSession({...newSession, isSpecial: e.target.value === 'special'})}
                  >
                    <option value="general">📅 一般預約場次 (存入「一般場次」分頁)</option>
                    <option value="special">✨ 固定特別場次 (存入「特別場次」分頁)</option>
                  </select>
                </div>
                {newSession.isSpecial && (
                  <>
                    <div className="form-group">
                      <label>固定日期</label>
                      <DatePicker
                        selected={newSession.fixedDate ? new Date(newSession.fixedDate) : null}
                        onChange={(date: Date | null) => {
                          if (date) {
                            const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                            setNewSession({...newSession, fixedDate: formatted});
                          } else {
                            setNewSession({...newSession, fixedDate: ''});
                          }
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="date-picker-input"
                        placeholderText="點擊選擇日期"
                        isClearable
                      />
                    </div>
                    <div className="form-group" style={{gridColumn: '1 / -1'}}>
                      <label>固定開放時段 (可多選，不選則代表全時段開放)</label>
                      <div className="time-slot-grid">
                        {TIME_SLOTS.map(t => (
                          <button 
                            key={t} 
                            type="button"
                            className={`time-slot-btn ${newSession.fixedTime.split(',').includes(t) ? 'active' : ''}`}
                            onClick={() => toggleFixedTime(t, false)}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <button onClick={handleAddSession} disabled={isSubmitting} className="submit-btn" style={{width: '100%', marginTop: '1rem'}}>
                確認新增場次
              </button>
            </div>
          </section>
        ) : (
          <section className="admin-section form-card submissions-table-container">
            <div className="admin-section-header">
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <h3 className="form-section-title" style={{margin: 0}}>報名清單 (共 {totalRows} 筆)</h3>
                <div className="admin-filter-bar" style={{display: 'flex', alignItems: 'center', gap: '1rem', background: '#333', padding: '0.8rem', borderRadius: '8px'}}>
                  <span title="依遊玩日期篩選" style={{display: 'flex', alignItems: 'center', color: 'var(--primary-gold)'}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                      <path d="M10 14l2 2 4-4"></path>
                    </svg>
                  </span>
                  <DatePicker
                    selected={adminFilterDate}
                    onChange={(date: Date | null) => handleDateFilter(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="選擇日期"
                    className="date-picker-input"
                    isClearable
                  />
                  {adminFilterDate && (
                    <button 
                      onClick={() => handleDateFilter(null)} 
                      className="cancel-btn icon-btn" 
                      title="清除篩選"
                      style={{padding: '0.3rem', display: 'flex', alignItems: 'center'}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                  
                  <div className="column-filter-container" style={{position: 'relative', marginLeft: 'auto'}}>
                    <button 
                      onClick={() => setShowShowColumnFilter(!showColumnFilter)} 
                      className="edit-btn icon-btn" 
                      title="顯示欄位設定"
                      style={{
                        background: '#444', border: '1px solid #666', padding: '0.5rem', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                    </button>
                    {showColumnFilter && (
                      <div className="column-filter-dropdown" style={{
                        position: 'absolute', top: '100%', right: 0, zIndex: 100,
                        background: '#222', border: '1px solid #444', borderRadius: '8px',
                        padding: '1rem', width: '180px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        marginTop: '0.5rem'
                      }}>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '300px', overflowY: 'auto'}}>
                          {submissions[0]?.map((h: any, i: number) => (
                            <label key={i} style={{display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', cursor: 'pointer', color: '#ccc'}}>
                              <input type="checkbox" checked={visibleColumns.includes(i)} onChange={() => toggleColumn(i)} />
                              {h}
                            </label>
                          ))}
                        </div>
                        <button 
                          onClick={() => setShowShowColumnFilter(false)} 
                          className="submit-btn icon-btn" 
                          title="關閉選單"
                          style={{width: '100%', marginTop: '1rem', padding: '0.4rem', display: 'flex', justifyContent: 'center'}}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {!adminFilterDate && (
                <div className="pagination">
                  <button onClick={() => loadPage(currentPage - 1)} disabled={currentPage === 1 || isDataLoading}>上一頁</button>
                  <span className="copy" style={{color: 'var(--primary-gold)'}}>第 {currentPage} 頁 / 共 {Math.ceil(totalRows / 50)} 頁</span>
                  <button onClick={() => loadPage(currentPage + 1)} disabled={currentPage >= Math.ceil(totalRows / 50) || isDataLoading}>下一頁</button>
                </div>
              )}
            </div>
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>操作</th>
                  {submissions[0]?.map((h: any, i: number) => visibleColumns.includes(i) && (
                    <th key={i}>
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {h}
                        <button 
                          className={`sort-btn ${sortConfig?.key === i ? 'active' : ''}`} 
                          onClick={() => handleSort(i)}
                          title="點擊排序"
                        >
                          {sortConfig?.key === i ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {submissions.slice(1).map((row, i) => (
                  <tr key={i}>
                    <td className="action-cell">
                      <button onClick={() => { setAuditTarget({index: i + 1, row}); setShowAuditModal(true); }} className="edit-btn" style={{background: '#f39c12', color: 'white'}}>審核</button>
                      <button onClick={() => startEditSubmission(row, i + 1)} className="edit-btn">修改</button>
                      <button onClick={() => handleDeleteSubmission(i + 1)} className="delete-btn">刪除</button>
                    </td>
                    {row.map((cell: any, j: number) => visibleColumns.includes(j) && (
                      <td key={j}>
                        {j === 0 && cell && cell.includes('T') 
                          ? formatFullDateTime(new Date(cell)) 
                          : (j === 1 ? (
                              <span style={{
                                padding: '0.3rem 0.8rem', 
                                borderRadius: '50px', 
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                background: cell === '通過' ? 'rgba(39, 174, 96, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                color: cell === '通過' ? '#2ecc71' : '#bbb'
                              }}>
                                {cell || '待審核'}
                              </span>
                            ) : cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    );
  }

  if (isInitialLoading && sessions.length === 0) {
    return (
      <div className="container">
        <div className="loading-screen" style={{
          height: '80vh', display: 'flex', flexDirection: 'column', 
          alignItems: 'center', justifyContent: 'center', color: 'var(--primary-gold)'
        }}>
          <div className="loading-spinner" style={{
            width: '50px', height: '50px', border: '3px solid rgba(212, 175, 55, 0.3)',
            borderTop: '3px solid var(--primary-gold)', borderRadius: '50%',
            animation: 'spin 1s linear infinite', marginBottom: '1.5rem'
          }}></div>
          <p style={{fontSize: '1.2rem', letterSpacing: '2px'}}>正在開啟八卦時空...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container">
        <div className="success-screen">
          <div className="check-icon">✓</div>
          <h1>報名已送出！</h1>
          <p>感謝您的參與，<strong>{formData.name}</strong>。</p>
          <p>我們已收到您的報名資訊，請確認以下明細並完成繳費。</p>
          <div className="summary-box">
            <p><strong>報名場次：</strong>{formData.session}</p>
            <p><strong>預計遊玩時間：</strong>{formData.pickupTime}</p>
            <p><strong>訂單總額：</strong>NT$ {calculatedTotal}</p>
            <p><strong>付款方式：</strong>{formData.paymentMethod.split(' (')[0]}</p>
            {formData.paymentMethod === '銀行轉帳/ATM' && <p className="bank-alert">請記得轉帳至：(617) 00817220606250</p>}
            {formData.paymentMethod.includes('Line Pay') && (
              <div className="linepay-box">
                <p>請點擊下方連結完成 Line Pay 付款：</p>
                <a href="https://qrcodepay.line.me/qr/payment/t1pM7jY1P9C5oOEJ7gc7o%252FnGCvoXh75q7xD7BSn4lKJxf9hIkbwGfT9i8EeGD2QC" target="_blank" rel="noopener noreferrer" className="linepay-btn">
                  前往 Line Pay 付款 ➔
                </a>
              </div>
            )}
          </div>
          <button onClick={resetForm} className="cta-button">返回首頁</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {showAdminLogin && (
        <div className="modal-overlay">
          <div className="admin-login-modal form-card">
            <h2 className="form-section-title admin-login-title">管理員登入</h2>
            <form onSubmit={handleAdminLogin}>
              <div className="form-group">
                <input type="password" placeholder="請輸入管理密碼" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} autoFocus />
              </div>
              
              {isDataLoading && <div className="loading-overlay">資料讀取中</div>}
              
              <div className="modal-actions admin-login-actions">
                <button type="button" onClick={() => setShowAdminLogin(false)} className="cancel-btn">
                  取消
                </button>
                <button type="submit" className="submit-btn" disabled={isDataLoading}>
                  {isDataLoading ? '驗證中...' : '登入'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="modal-overlay">
          <div className="admin-login-modal form-card" style={{maxWidth: '600px', width: '90%'}}>
            <h2 className="form-section-title">確認報名資訊</h2>
            <div className="confirmation-details" style={{textAlign: 'left', marginBottom: '2rem', lineHeight: '1.8'}}>
              <p><strong>報名人：</strong>{formData.name}</p>
              <p><strong>聯絡電話：</strong>{formData.phone}</p>
              <p><strong>Email：</strong>{formData.email}</p>
              <p><strong>場次：</strong>{formData.session}</p>
              <p><strong>份數：</strong>{formData.quantity} 份</p>
              <p><strong>當天遊玩人數：</strong>{formData.players} 人</p>
              <p><strong>預計遊玩日期時間：</strong>{formData.pickupTime}</p>
              <p><strong>領取地點：</strong>{formData.pickupLocation}</p>
              <p><strong>付款方式：</strong>{formData.paymentMethod.split(' (')[0]}</p>
              <p><strong>估計總額：</strong><span style={{color: 'var(--primary-gold)', fontWeight: 'bold', fontSize: '1.2rem'}}>NT$ {calculatedTotal}</span></p>
              {formData.notes && <p><strong>備註：</strong>{formData.notes}</p>}
            </div>
            <div className="modal-actions admin-login-actions">
              <button type="button" onClick={() => setShowConfirmation(false)} className="cancel-btn">
                返回修改
              </button>
              <button type="button" onClick={handleConfirmSubmit} className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? '正在送出...' : '確認送出'}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="header">
        <div className="era-badge">光緒 x 昭和</div>
        <h1>【新港八卦迷蹤】</h1>
        <h2 className="main-title">實境解謎 活動報名</h2>
      </header>

      <main className="main-content">
        <div className="poster-container">
          <img src="poster.jpg" alt="新港八卦迷蹤 海報" className="poster-image" />
        </div>

        <section className="story-section">
          <div className="story-box">
            <h2 className="section-title">故事背景</h2>
            <div className="story-text">
              <p>昭和九年。一場疫病肆虐新港。</p>
              <p>診療所裡人滿為患，哀嚎與咳嗽聲交織成一片不安。</p>
              <p>——然而這一切，對白鸞卿來說，都不該存在。</p>
              <p>身為清朝縣丞，他原在勘查新港水脈與風水。卻在卦相異動之際，頭暈目眩——</p>
              <p>醒來時，已置身七十餘年後的日治時期。陌生的年號、陌生的語言、陌生的疫病。他看到印著不明政策的公文，聽到祈求平安的廟宇喧囂。</p>
              <p>他發現——新港的卦象錯亂，守護神失蹤。八卦動盪，時空重疊，清朝與昭和，交錯於此。</p>
              <p>若不修正卦象，他將永遠困在這個不屬於他的年代；若不找出疫病源頭，百姓將持續凋零。</p>
              <p className="highlight">你，能協助他找出真相嗎？</p>
            </div>
          </div>
        </section>

        <section className="event-info">
          <h2 className="section-title">活動內容</h2>
          <p className="intro-p">準備好踏上一場神秘又刺激的冒險了嗎？這場解謎將帶你穿梭在新港的巷弄間，解開織進文化與歷史中的謎團。</p>
          <div className="info-grid">
            <div className="info-item">
              <strong>► 解謎包定價</strong>
              <span>$650 (配合活動享優惠)</span>
            </div>
            <div className="info-item">
              <strong>► 建議人數</strong>
              <span>1份解謎包 1-4 人使用</span>
            </div>
            <div className="info-item">
              <strong>► 遊玩時間</strong>
              <span>約 2 小時</span>
            </div>
            <div className="info-item">
              <strong>► 內容物</strong>
              <span>解謎道具、特製伴手禮</span>
            </div>
          </div>
        </section>

        <section className="registration-section">
          <form onSubmit={handleSubmit} className="reg-form">
            {/* 陷阱欄位 (Honeypot) - 機器人會填寫，人類看不到 */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <input 
                type="text" 
                name="hp_field" 
                value={formData.hp_field} 
                onChange={handleInputChange} 
                tabIndex={-1} 
                autoComplete="off" 
              />
            </div>

            <div className="form-card">
              <h3 className="form-section-title">基本資料</h3>
              <div className="form-group">
                <label>報名人 姓名 *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="請輸入姓名" />
              </div>
              <div className="form-group">
                <label>聯絡電話(手機為主) *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="0912-345-678" />
              </div>
              <div className="form-group">
                <label>Email (會寄送行前通知) *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="您的電子郵件" />
              </div>
            </div>

            <div className="form-card">
              <h3 className="form-section-title">報名資訊</h3>
              
              <div className="form-group">
                <label>【場次類型】 *</label>
                <select 
                  value={sessionType} 
                  required
                  onChange={(e) => {
                    const newType = e.target.value as '一般預約' | '特別預約' | '';
                    setSessionType(newType);
                    
                    if (newType === '') {
                      setFormData(prev => ({ ...prev, session: '', pickupTime: '' }));
                      return;
                    }

                    // 切換類型後，過濾出該類型的場次
                    const filtered = sessions.filter(s => 
                      newType === '特別預約' ? (s.fixedDate || s.fixedTime) : (!s.fixedDate && !s.fixedTime)
                    );
                    
                    if (filtered.length > 0) {
                      let targetValue = filtered[0].name;
                      
                      // 如果是一般預約，根據目前的份數自動選擇場次
                      if (newType === '一般預約') {
                        const qty = parseInt(formData.quantity) || 0;
                        if (qty >= 5) {
                          targetValue = filtered.find(s => s.name.includes('團體優惠'))?.name || targetValue;
                        } else {
                          targetValue = filtered.find(s => s.name.includes('單人') || s.name.includes('個人') || s.name.includes('一般'))?.name || targetValue;
                        }
                      }
                      
                      // 更新場次，並觸發連動邏輯
                      handleInputChange({ 
                        target: { name: 'session', value: targetValue } 
                      } as any);
                    }
                  }}
                >
                  <option value="">-------請選擇場次類型--------</option>
                  <option value="一般預約">📅 一般預約 (自由選擇遊玩時段)</option>
                  <option value="特別預約">✨ 特別預約 (固定日期與特定時段)</option>
                </select>
              </div>

              {/* 選定場次類型後才展開後續表單 */}
              {sessionType !== '' && (
                <>
                  <div className="form-group">
                    <label>【詳細場次】 *</label>
                    {sessionType === '一般預約' ? (
                      <div className="general-session-info" style={{ 
                        padding: '1rem', 
                        background: 'rgba(212, 175, 55, 0.1)', 
                        border: '1px solid var(--primary-gold)', 
                        borderRadius: '8px',
                        color: 'var(--primary-gold)',
                        fontSize: '0.95rem',
                        lineHeight: '1.6'
                      }}>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>
                          ⚡ 系統已自動選定：{formData.session || '正在計算中...'}
                        </p>
                        <div className="discount-hint" style={{ marginTop: '0.5rem', color: '#ccc', fontSize: '0.85rem' }}>
                          ★ 優惠提醒：一般預約滿 5 份(含)以上可享有團體優惠價唷!!!!!!
                        </div>
                      </div>
                    ) : (
                      <select 
                        name="session" 
                        value={formData.session} 
                        onChange={handleInputChange}
                        required
                      >
                        {sessions.length > 0 ? (
                          sessions
                            .filter(s => (s.fixedDate || s.fixedTime))
                            .map(s => <option key={s.name} value={s.name}>{s.name} (${s.price})</option>)
                        ) : (
                          <option disabled>載入中...</option>
                        )}
                      </select>
                    )}
                  </div>
                  <div className="form-group">
                    <label>份數 *</label>
                    <input type="number" name="quantity" min="1" required value={formData.quantity} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>當天遊玩人數 (每份解謎包建議 1-4 人) *</label>
                    <select name="players" value={formData.players} onChange={handleInputChange}>
                      {Array.from({ length: Number(formData.quantity) * 4 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}人</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            {sessionType !== '' && (
              <>
                <div className="form-card">
                  <h3 className="form-section-title">繳費與取件</h3>
                  <div className="form-group">
                    <label>繳費方式 *</label>
                    <div className="radio-group">
                      <label><input type="radio" name="paymentMethod" value="親至新港文教基金會繳費" checked={formData.paymentMethod === '親至新港文教基金會繳費'} onChange={handleInputChange} /> 親至新港文教基金會繳費</label>
                      <label><input type="radio" name="paymentMethod" value="銀行轉帳/ATM" checked={formData.paymentMethod === '銀行轉帳/ATM'} onChange={handleInputChange} /> 銀行轉帳/ATM</label>
                      <label>
                        <input type="radio" name="paymentMethod" value="Line Pay (https://qrcodepay.line.me/qr/payment/t1pM7jY1P9C5oOEJ7gc7o%252FnGCvoXh75q7xD7BSn4lKJxf9hIkbwGfT9i8EeGD2QC)" checked={formData.paymentMethod.includes('Line Pay')} onChange={handleInputChange} /> 
                        Line Pay
                      </label>
                    </div>
                  </div>

                  {formData.paymentMethod === '銀行轉帳/ATM' && (
                    <div className="form-group bank-info">
                      <p>匯款銀行：新港鄉農會 (代碼 617)</p>
                      <p>帳號：00817220606250</p>
                      <label>轉帳帳戶後五碼</label>
                      <input type="text" name="bankLast5" value={formData.bankLast5} onChange={handleInputChange} placeholder="請輸入後五碼" />
                    </div>
                  )}

                  <div className="form-group">
                    <label>預計遊玩日期 & 時間 (開放日 09:00-15:00，週一二不開放) *</label>
                    
                    {/* 顯示固定場次或衝突告示 */}
                    {(() => {
                      const selectedSession = sessions.find(s => s.name === formData.session);
                      const currentDateStr = formData.pickupTime.split(' ')[0];

                      // 情況 A：目前選的就是特別場次 -> 顯示固定資訊
                      if (selectedSession?.fixedDate || selectedSession?.fixedTime) {
                        let displayDate = selectedSession.fixedDate || '不限日期';
                        if (displayDate.includes('T')) displayDate = displayDate.split('T')[0];
                        return (
                          <div className="fixed-session-hint">
                            ★ 此場次固定於 {displayDate}，
                            開放時段：{selectedSession.fixedTime ? selectedSession.fixedTime.replace(/,/g, '、') : '全時段'}
                          </div>
                        );
                      }

                      // 情況 B：目前選的是普通場次，但選中的日期有特別場次 -> 顯示衝突告示
                      if (currentDateStr) {
                        const conflicts = sessions.filter(s => {
                          let sDate = s.fixedDate || '';
                          if (sDate.includes('T')) sDate = sDate.split('T')[0];
                          return sDate === currentDateStr;
                        });
                        
                        if (conflicts.length > 0) {
                          const conflictTimes = conflicts.map(c => c.fixedTime?.replace(/,/g, '、')).join(' ; ');
                          return (
                            <div className="conflict-notice">
                              ★ 提醒：您目前選擇的日期有特別場，特別場次時段：{conflictTimes} 不開放一般場次預約，如有這些時段需求請選擇特別場次。
                            </div>
                          );
                        }
                      }
                      return null;
                    })()}

                    <DatePicker
                      selected={formData.pickupTime ? new Date(formData.pickupTime) : null}
                      onChange={handleDateChange}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={30}
                      timeCaption="時間"
                      dateFormat="yyyy-MM-dd HH:mm"
                      className={`date-picker-input ${sessions.find(s => s.name === formData.session)?.fixedDate ? 'fixed-readonly' : ''}`}
                      placeholderText="請選擇遊玩時間"
                      required
                      readOnly={!!sessions.find(s => s.name === formData.session)?.fixedDate}
                      minDate={new Date()}
                      filterDate={(date) => date.getDay() !== 1 && date.getDay() !== 2}
                      minTime={new Date(new Date().setHours(9, 0, 0))}
                      maxTime={new Date(new Date().setHours(15, 0, 0))}
                      filterTime={(time) => {
                        const selectedSession = sessions.find(s => s.name === formData.session);
                        const timeStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;
                        
                        // 1. 如果目前選的是特別場次 -> 只允許顯示固定的那幾個時段
                        if (selectedSession?.fixedDate || selectedSession?.fixedTime) {
                          const fixedTimes = selectedSession.fixedTime ? selectedSession.fixedTime.split(',') : [];
                          return fixedTimes.includes(timeStr);
                        }
                        
                        // 2. 如果目前選的是普通場次 -> 過濾掉「任何」其他場次的固定時段
                        const currentDateStr = formData.pickupTime.split(' ')[0];
                        const isTakenBySpecial = sessions.some(s => {
                          let sDate = s.fixedDate || '';
                          if (sDate.includes('T')) sDate = sDate.split('T')[0];
                          return sDate === currentDateStr && s.fixedTime?.split(',').includes(timeStr);
                        });
                        
                        if (isTakenBySpecial) return false;

                        // 3. 基礎時段限制 09:00 - 15:00
                        const hours = time.getHours();
                        const minutes = time.getMinutes();
                        if (hours >= 9 && hours < 15) return true;
                        if (hours === 15 && minutes === 0) return true;
                        return false;
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>領取地點 *</label>
                    <select name="pickupLocation" value={formData.pickupLocation} onChange={handleInputChange}>
                      <option value="新港文教基金會(閱讀館)">新港文教基金會(閱讀館)</option>
                      <option value="培桂堂(建議選此處，可同時參觀)">培桂堂</option>
                    </select>
                  </div>
                </div>

                <div className="form-card">
                  <h3 className="form-section-title">其他</h3>
                  <div className="form-group">
                    <label>如何得知本活動內容? (可多選)</label>
                    <div className="checkbox-grid">
                      {['基金會FB', '基金會LINE', '基金會電子報', '活動現場', '親友介紹', '其他FB社團', '海報/摺頁'].map(item => (
                        <label key={item}><input type="checkbox" value={item} checked={formData.referral.includes(item)} onChange={handleCheckboxChange} /> {item}</label>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>其他/備註</label>
                    <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3}></textarea>
                  </div>
                </div>

                <div className="submit-container">
                  <div className="total-display">
                    <span>估計總額：</span>
                    <span className="amount">NT$ {calculatedTotal}</span>
                  </div>
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? '正在送出...' : '送出報名表單'}
                  </button>
                </div>
              </>
            )}
          </form>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <h3>聯絡資訊</h3>
          <p>新港文教基金會</p>
          <p>電話：05-3745074 分機 73 林先生</p>
          <div className="refund-policy">
            <h4>退費說明：</h4>
            <ul>
              <li>活動前 30 日取消：全額退費（扣除手續費 30 元）</li>
              <li>活動前 7 日取消：退費 80%（扣除手續費 30 元）</li>
              <li>活動當日取消：不予退費</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="admin-trigger" onClick={() => setShowAdminLogin(true)}>
            <img src="footer-logo.svg" alt="HKFCE Logo" className="footer-admin-logo" />
          </div>
          <p className="copy">&copy; 2026 新港文教基金會 | 新港八卦迷蹤 製作團隊</p>
        </div>
      </footer>
    </div>
  )
}


export default App
