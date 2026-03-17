import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import './App.css'

function App() {
  // --- 1. 狀態與變數定義 ---
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessions, setSessions] = useState<{name: string, price: number}[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [submissions, setSubmissions] = useState<any[][]>([]);
  const [adminTab, setAdminTab] = useState<'sessions' | 'submissions'>('sessions');
  const [newSession, setNewSession] = useState({ name: '', price: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    contactEmail: '',
    session: '',
    quantity: '1',
    players: '',
    totalAmount: '',
    paymentMethod: '親至新港文教基金會繳費',
    bankLast5: '',
    pickupTime: '',
    pickupLocation: '新港文教基金會(閱讀館)',
    referral: [] as string[],
    notes: ''
  });

  const [calculatedTotal, setCalculatedTotal] = useState(0);

  // 請在此處填入您部署後的 Google Apps Script URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzOdLH2XHxJR7wEcCJYsPne_ZjciEPBKbZr7OmaafuG3l1VQrUtLzhlD2aADa-gOSZ1/exec';

  // --- 2. 工具函式 ---
  const formatDateTime = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  // 1. 初始載入場次
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getSessions`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSessions(data);
          setFormData(prev => ({ ...prev, session: data[0].name }));
        } else {
          setSessions([{ name: '暫無開放場次，請洽管理員', price: 0 }]);
        }
      } catch (err) {
        console.error('無法載入場次:', err);
        setSessions([{ name: '載入場次失敗，請重新整理', price: 0 }]);
      }
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    const qty = parseInt(formData.quantity) || 0;
    const sessionObj = sessions.find(s => s.name === formData.session);
    const price = sessionObj ? sessionObj.price : 650;
    setCalculatedTotal(qty * price);
  }, [formData.quantity, formData.session, sessions]);

  const [isDataLoading, setIsDataLoading] = useState(false);

  // 3. 管理員登入：合併請求優化
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDataLoading(true);
    try {
      // 合併請求：一次抓取場次與第一頁資料
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=adminLogin&pw=${adminPassword}`);
      const result = await res.json();
      
      if (result.submissions) {
        setSubmissions(result.submissions);
        setSessions(result.sessions);
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
        // 如果是第一頁，保留標題；否則僅更新內容
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

  const [isEditingSession, setIsEditingSession] = useState(false);
  const [editingSession, setEditingSession] = useState({ oldName: '', newName: '', newPrice: '' });

  // 4. 管理操作：新增場次
  const handleAddSession = async () => {
    if (!newSession.name || !newSession.price) return;
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'addSession', pw: adminPassword, ...newSession })
      });
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getSessions`);
      const data = await res.json();
      setSessions(data);
      setNewSession({ name: '', price: '' });
      alert('新增成功');
    } catch (err) {
      alert('新增失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4.5 管理操作：開啟修改場次視窗
  const startEditSession = (session: {name: string, price: number}) => {
    setEditingSession({ oldName: session.name, newName: session.name, newPrice: String(session.price) });
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
      // 靜態更新 UI
      setSessions(prev => prev.map(s => 
        s.name === editingSession.oldName 
          ? { name: editingSession.newName, price: Number(editingSession.newPrice) } 
          : s
      ));
      setIsEditingSession(false);
      alert('修改成功');
    } catch (err) {
      alert('修改失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. 管理操作：刪除場次
  const handleDeleteSession = async (name: string) => {
    if (!window.confirm(`確定要刪除場次「${name}」嗎？`)) return;
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'deleteSession', pw: adminPassword, name })
      });
      // 由於 no-cors 無法讀取內容，我們假設送出即成功並更新 UI
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
      // 靜態更新：從列表中移除該行
      setSubmissions(prev => prev.filter((_, i) => i !== rowIndex));
      setTotalRows(prev => prev - 1);
      alert('已刪除');
    } catch (err) {
      alert('刪除失敗');
    } finally {
      setIsDataLoading(false);
    }
  };

  // 7. 管理操作：開啟修改視窗
  const startEditSubmission = (row: any[], index: number) => {
    setEditingRowIndex(index);
    setEditData({
      timestamp: row[0],
      email: row[1],
      name: row[2],
      phone: row[3],
      contactEmail: row[4],
      session: row[5],
      quantity: row[6],
      players: row[7],
      totalAmount: row[8],
      paymentMethod: row[9],
      bankLast5: row[10],
      pickupTime: row[11],
      pickupLocation: row[12],
      referral: row[13],
      notes: row[14]
    });
    setIsEditing(true);
  };

  // 8. 管理操作：送出修改
  const handleUpdateSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ 
          action: 'updateSubmission', 
          pw: adminPassword, 
          rowIndex: editingRowIndex,
          ...editData 
        })
      });
      // 靜態更新該行資料
      const newSubmissions = [...submissions];
      if (editingRowIndex !== null) {
        newSubmissions[editingRowIndex] = [
          editData.timestamp, editData.email, editData.name, editData.phone, editData.contactEmail,
          editData.session, editData.quantity, editData.players, editData.totalAmount, 
          editData.paymentMethod, editData.bankLast5, editData.pickupTime, editData.pickupLocation,
          editData.referral, editData.notes
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // 姓名欄位：僅過濾掉數字，允許其他所有字元（包括輸入法緩衝），長度限制 20
    if (name === 'name') {
      const filteredValue = value.replace(/[0-9]/g, ''); // 僅移除數字
      if (filteredValue.length > 20) return;
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
      return;
    }

    // 電話欄位防呆：限制 15 字
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
      
      // 改用統一的時間格式處理器
      const formattedDate = formatDateTime(date).substring(0, 16); 
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bankLast5 = formData.paymentMethod === '銀行轉帳/ATM' ? formData.bankLast5 : '無';
    const submissionData: any = {
      ...formData,
      players: formData.players.trim() || '1',
      notes: formData.notes.trim() || '無',
      paymentMethod: formData.paymentMethod.split(' (')[0],
      bankLast5: bankLast5,
      totalAmount: calculatedTotal,
      referral: formData.referral.join(', '),
      timestamp: formatDateTime(new Date()), // 使用精確的本地時間格式
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
      quantity: '1', players: '', totalAmount: '', paymentMethod: '親至新港文教基金會繳費',
      bankLast5: '', pickupTime: '', pickupLocation: '新港文教基金會(閱讀館)',
      referral: [] as string[], notes: ''
    });
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 管理員後台 UI
  if (isAdmin) {
    return (
      <div className="container admin-dashboard">
        {isEditing && (
          <div className="modal-overlay">
            <div className="admin-login-modal" style={{maxWidth: '600px'}}>
              <h2>修改報名資料</h2>
              <form onSubmit={handleUpdateSubmission} className="edit-form-grid">
                <div className="form-group"><label>姓名</label><input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} /></div>
                <div className="form-group"><label>電話</label><input type="text" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} /></div>
                <div className="form-group"><label>場次</label>
                  <select value={editData.session} onChange={e => setEditData({...editData, session: e.target.value})}>
                    {sessions.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>份數</label><input type="number" value={editData.quantity} onChange={e => setEditData({...editData, quantity: e.target.value})} /></div>
                <div className="modal-actions">
                  <button type="submit" disabled={isSubmitting}>儲存修改</button>
                  <button type="button" onClick={() => setIsEditing(false)}>取消</button>
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
            <button onClick={() => setIsAdmin(false)}>登出</button>
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
                    <button onClick={() => handleDeleteSession(s.name)} className="delete-btn">刪除</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="add-session-form">
              <h3 className="form-section-title">新增場次</h3>
              <div className="form-group">
                <label>場次名稱</label>
                <input type="text" placeholder="例如：5/2(六)市集場" value={newSession.name} onChange={e => setNewSession({...newSession, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>價格</label>
                <input type="number" placeholder="650" value={newSession.price} onChange={e => setNewSession({...newSession, price: e.target.value})} />
              </div>
              <button onClick={handleAddSession} disabled={isSubmitting} className="submit-btn" style={{width: '100%', marginTop: '1rem'}}>
                確認新增場次
              </button>
            </div>
          </section>
        ) : (
          <section className="admin-section form-card submissions-table-container">
            <div className="admin-section-header">
              <h3 className="form-section-title" style={{margin: 0}}>報名清單 (共 {totalRows} 筆)</h3>
              <div className="pagination">
                <button onClick={() => loadPage(currentPage - 1)} disabled={currentPage === 1 || isDataLoading}>上一頁</button>
                <span className="copy" style={{color: 'var(--primary-gold)'}}>第 {currentPage} 頁 / 共 {Math.ceil(totalRows / 50)} 頁</span>
                <button onClick={() => loadPage(currentPage + 1)} disabled={currentPage >= Math.ceil(totalRows / 50) || isDataLoading}>下一頁</button>
              </div>
            </div>
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>操作</th>
                  {submissions[0]?.map((h: any, i: number) => <th key={i}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {submissions.slice(1).map((row, i) => (
                  <tr key={i}>
                    <td className="action-cell">
                      <button onClick={() => startEditSubmission(row, i + 1)} className="edit-btn">修改</button>
                      <button onClick={() => handleDeleteSubmission(i + 1)} className="delete-btn">刪除</button>
                    </td>
                    {row.map((cell: any, j: number) => (
                      <td key={j}>
                        {j === 0 && cell && cell.includes('T') 
                          ? formatDateTime(new Date(cell)) 
                          : cell}
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
                <label>【報名場次】 *</label>
                <select name="session" value={formData.session} onChange={handleInputChange}>
                  {sessions.length > 0 ? (
                    sessions.map(s => <option key={s.name} value={s.name}>{s.name} (${s.price})</option>)
                  ) : (
                    <option disabled>載入中...</option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label>份數 *</label>
                <input type="number" name="quantity" min="1" required value={formData.quantity} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>當天遊玩人數 (如為單人購買可不填)</label>
                <input type="text" name="players" value={formData.players} onChange={handleInputChange} placeholder="例如：4人" />
              </div>
            </div>

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
                <DatePicker
                  selected={formData.pickupTime ? new Date(formData.pickupTime) : null}
                  onChange={handleDateChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  timeCaption="時間"
                  dateFormat="yyyy-MM-dd HH:mm"
                  className="date-picker-input"
                  placeholderText="請選擇遊玩時間"
                  required
                  minDate={new Date()}
                  filterDate={(date) => date.getDay() !== 1 && date.getDay() !== 2}
                  minTime={new Date(new Date().setHours(9, 0, 0))}
                  maxTime={new Date(new Date().setHours(15, 0, 0))}
                  filterTime={(time) => {
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
