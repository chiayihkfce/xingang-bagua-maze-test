import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import './App.css'

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    contactEmail: '',
    session: '5/2(六)新港市集+沉浸體驗特別場（早鳥/現場價$650/份）',
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

  // 價格邏輯
  useEffect(() => {
    const qty = parseInt(formData.quantity) || 0;
    let price = 650;
    
    if (formData.session.includes('團體優惠')) price = 550;
    else if (formData.session.includes('校園團體')) price = 500;
    else if (formData.session.includes('單人購買')) price = 600;
    
    setCalculatedTotal(qty * price);
  }, [formData.quantity, formData.session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      // 防呆：如果是週一(1)或週二(2)，則不進行更新
      const day = date.getDay();
      if (day === 1 || day === 2) return;

      // 如果選取的時間不在 09:00 - 15:00 之間（例如點選日期後預設的 00:00），則強制設為 09:00
      const hours = date.getHours();
      if (hours < 9 || hours > 15) {
        date.setHours(9, 0, 0);
      }

      // 轉換為 YYYY-MM-DD HH:mm 格式字串存入 formData
      const formattedDate = date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(/\//g, '-');
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

    // 根據付款方式決定末五碼內容
    const bankLast5 = formData.paymentMethod === '銀行轉帳/ATM' ? formData.bankLast5 : '無';

    // 準備要傳送的資料
    const submissionData: any = {
      ...formData,
      bankLast5: bankLast5,
      totalAmount: calculatedTotal,
      referral: formData.referral.join(', '),
      timestamp: new Date().toLocaleString('zh-TW')
    };

    try {
      // 檢查是否已設定有效的 Google Script URL
      const isConfigured = GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes('YOUR_GOOGLE_SCRIPT_URL');

      if (isConfigured) {
        // 使用最標準的 fetch POST 方式
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        });
      } else {
        console.warn('尚未設定 GOOGLE_SCRIPT_URL，僅模擬提交');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
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
      email: '',
      name: '',
      phone: '',
      contactEmail: '',
      session: '5/2(六)新港市集+沉浸體驗特別場（早鳥/現場價$650/份）',
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
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                  <option value="5/2(六)新港市集+沉浸體驗特別場（早鳥/現場價$650/份）">5/2(六)新港市集+沉浸體驗特別場 ($650)</option>
                  <option value="團體優惠價（5份以上/含導覽/需電話預約）$550/份">團體優惠價 (5份以上/含導覽) $550</option>
                  <option value="校園團體（請電洽新港文教基金會）$500/份">校園團體 $500</option>
                  <option value="單人購買（隨時出發/無導覽/無參與活動）$600/份">單人購買 (隨時出發) $600</option>
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
                  filterTime={(time) => {
                    const hours = time.getHours();
                    return hours >= 9 && hours <= 15;
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
        <p className="copy">&copy; 2024 新港文教基金會 | 新港八卦迷蹤 製作團隊</p>
      </footer>
    </div>
  )
}

export default App
