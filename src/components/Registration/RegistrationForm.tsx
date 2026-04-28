import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Session, FormData, FormErrors, TimeslotConfig, PaymentMethod, IdentityPricing } from '../../types';
import { translateOption } from '../../utils/translateOptions';
import { translations } from '../../locales/translations';
import StatusLookupModal from './StatusLookupModal';
import BaguaQuiz from './BaguaQuiz';
import { useAppContext } from '../../context/AppContext';
import { useEasterEggs } from '../../hooks/useEasterEggs';

interface RegistrationFormProps {
  t: any;
  lang: string;
  formData: FormData;
  formErrors: FormErrors;
  sessionType: string;
  setSessionType: (type: any) => void;
  sessions: Session[];
  timeslotConfig: TimeslotConfig;
  generalTimeSlots: string[];
  specialTimeSlots: string[];
  handleInputChange: (e: any) => void;
  handlePlayerInfoChange: (index: number, field: 'name' | 'email', value: string) => void;
  handleCheckboxChange: (e: any) => void;
  handleDateChange: (date: Date | null) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  calculatedTotal: number;
  getSessionDisplayName: (name: string) => string;
  paymentMethods: PaymentMethod[];
  identityPricings: IdentityPricing[];
  showAlert: (message: string, title?: string, onConfirm?: () => void, confirmText?: string) => void;
  setShowGames: (show: boolean) => void;
}

/**
 * 寶箱 SVG 圖示組件
 */
const ChestIcon: React.FC<{ size?: number }> = ({ size = 50 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 9V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V9H20Z" stroke="var(--primary-gold)" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M20 9V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V9H20Z" stroke="var(--primary-gold)" strokeWidth="2" strokeLinejoin="round"/>
    <rect x="10" y="8" width="4" height="4" rx="1" fill="#000" stroke="var(--primary-gold)" strokeWidth="1"/>
    <circle cx="12" cy="10" r="0.5" fill="var(--primary-gold)"/>
    <path d="M8 5V19" stroke="var(--primary-gold)" strokeWidth="1" strokeDasharray="2 2" opacity="0.5"/>
    <path d="M16 5V19" stroke="var(--primary-gold)" strokeWidth="1" strokeDasharray="2 2" opacity="0.5"/>
  </svg>
);

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  t,
  lang,
  formData,
  formErrors,
  sessionType,
  setSessionType,
  sessions,
  timeslotConfig,
  generalTimeSlots,
  specialTimeSlots,
  handleInputChange,
  handlePlayerInfoChange,
  handleCheckboxChange,
  handleDateChange,
  handleSubmit,
  isSubmitting,
  calculatedTotal,
  getSessionDisplayName,
  paymentMethods,
  identityPricings,
  showAlert,
  setShowGames
}) => {
  const { hasFlashlight, hasPoetrySlip, isFlashlightOn, setIsFlashlightOn, isBagOpen, setIsBagOpen } = useAppContext();
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isScrollOpen, setIsScrollOpen] = useState(false); 
  const [viewMode, setViewMode] = useState<'choice' | 'form'>('choice'); 
  const pad = (n: number) => String(n).padStart(2, '0');
  const selectedPaymentDetail = (paymentMethods || []).find(m => m.name === formData.paymentMethod);

  // 1. 入口選擇畫面
  if (viewMode === 'choice') {
    return (
      <section className="registration-section entry-choice-section" style={{ position: 'relative' }}>
        <h2 className="choice-title">{t.chooseAction}</h2>
        
        <div className="entry-cards-container">
          {/* 報名按鈕卡片 */}
          <button 
            onClick={() => setViewMode('form')}
            className="entry-card primary-card"
            style={{ flex: '1 1 280px' }}
          >
            <span className="entry-icon">📜</span>
            <span className="entry-title">{t.startRegistration}</span>
            <span className="entry-desc">{t.regEntryDesc}</span>
          </button>

          {/* 查詢按鈕卡片 */}
          <button 
            onClick={() => setIsLookupOpen(true)}
            className="entry-card primary-card"
            style={{ flex: '1 1 280px' }}
          >
            <span className="entry-icon">🔍</span>
            <span className="entry-title">{t.checkStatus}</span>
            <span className="entry-desc">{t.lookupEntryDesc}</span>
          </button>

          {/* 八卦天命測驗 */}
          <BaguaQuiz t={t} lang={lang} />

          {/* 遊戲入口區 */}
          <button 
            onClick={() => setShowGames(true)}
            className="entry-card primary-card"
            style={{ width: '100%', flex: '1 1 100%', marginTop: '15px' }}
          >
            <span className="entry-icon" style={{ 
              fontSize: '2.8rem', 
              filter: 'sepia(1) saturate(5) hue-rotate(-10deg) drop-shadow(0 0 5px rgba(212, 175, 55, 0.5))' 
            }}>🧭</span>
            <span className="entry-title">陣法挑戰</span>
            <span className="entry-desc">在進入迷宮前，先試著感應八卦氣息吧！</span>
          </button>

          {/* 我的道具箱入口按鈕 - 樣式完全統一 */}
          <button 
            onClick={() => setIsBagOpen(true)}
            className="entry-card primary-card"
            style={{ 
              width: '100%', 
              flex: '1 1 100%', 
              marginTop: '15px'
            }}
          >
            <span className="entry-icon"><ChestIcon size={50} /></span>
            <span className="entry-title">我的道具箱</span>
            <span className="entry-desc">存放著您在冒險中獲得的神祕寶物</span>
          </button>

          {/* 彩蛋提示小字 - 僅在手電筒開啟時顯現 */}
          <div style={{ 
            width: '100%', 
            textAlign: 'center', 
            marginTop: '30px', 
            fontSize: '0.85rem', 
            color: 'var(--primary-gold)', 
            opacity: isFlashlightOn ? 1 : 0,
            transition: 'all 0.5s ease',
            fontStyle: 'italic',
            letterSpacing: '1px',
            textShadow: '0 0 10px rgba(212,175,55,0.8)',
            transform: isFlashlightOn ? 'translateY(0)' : 'translateY(-10px)'
          }}>
            {isFlashlightOn ? '—— 傳說輸入「CLUE」獲取殘卷 ——' : ''}
          </div>
        </div>

        {/* 道具箱彈窗 */}
        <BagModal 
          isOpen={isBagOpen} 
          onClose={() => setIsBagOpen(false)} 
          hasFlashlight={hasFlashlight}
          hasPoetrySlip={hasPoetrySlip}
          isFlashlightOn={isFlashlightOn}
          onToggleFlashlight={() => {
            const nextState = !isFlashlightOn;
            setIsFlashlightOn(nextState);
            if (nextState) {
              setIsBagOpen(false); // 僅在「開啟」時自動關閉道具箱
            }
          }}
          showMysticScroll={() => setIsScrollOpen(true)}
        />

        {/* 詩籤彈窗 (React 實作) */}
        {isScrollOpen && (
          <div className="modal-overlay" style={{ zIndex: 200000 }} onClick={() => setIsScrollOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ 
              background: '#0f0f0a', 
              border: '2px solid var(--primary-gold)', 
              padding: '50px 30px', 
              borderRadius: '8px', 
              textAlign: 'center', 
              maxWidth: '450px', 
              width: '85%',
              boxShadow: '0 0 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.2)', 
              position: 'relative',
              backgroundImage: 'radial-gradient(circle at center, #1a1a12 0%, #0a0a05 100%)'
            }}>
              <div style={{ 
                color: 'var(--primary-gold)', 
                fontSize: '1.6rem', 
                marginBottom: '35px', 
                letterSpacing: '8px',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
              }}>📜 神祕詩籤 📜</div>
              
              <div style={{ 
                color: '#ececec', 
                fontSize: '1.25rem', 
                lineHeight: '2.8', 
                letterSpacing: '5px', 
                marginBottom: '40px', 
                fontFamily: "'Noto Serif TC', serif",
                borderTop: '1px solid rgba(212, 175, 55, 0.1)',
                borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
                padding: '20px 0'
              }}>
                <p style={{ margin: '10px 0' }}>新港街頭八卦生</p>
                <p style={{ margin: '10px 0' }}>培桂堂前影自橫</p>
                <p style={{ margin: '10px 0' }}>乾位尋真坤位引</p>
                <p style={{ margin: '10px 0' }}>萬象歸宗見太平</p>
              </div>
              
              <button 
                className="submit-btn" 
                onClick={() => setIsScrollOpen(false)} 
                style={{ 
                  background: 'transparent', 
                  border: '1px solid var(--primary-gold)', 
                  color: 'var(--primary-gold)', 
                  padding: '10px 40px', 
                  borderRadius: '25px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                領悟
              </button>
            </div>
          </div>
        )}

        <StatusLookupModal isOpen={isLookupOpen} onClose={() => setIsLookupOpen(false)} lang={lang} />
      </section>
    );
  }

  // 2. 報名表單畫面
  return (
    <section className="registration-section">
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => setViewMode('choice')}
          style={{ background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {t.backToChoice}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="reg-form">
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
          <h3 className="form-section-title">{t.basicInfo}</h3>
          <div className="form-group">
            <label>
              {t.nameLabel}
              <span className="required-mark">*</span>
            </label>
            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder={t.namePlaceholder} />
            {formErrors.name && <span className="error-msg">{formErrors.name}</span>}
          </div>
          <div className="form-group">
            <label>
              {t.phoneLabel}
              <span className="required-mark">*</span>
            </label>
            <div style={{ 
              display: 'flex', 
              width: '100%',
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              borderRadius: '8px',
              transition: 'all .3s ease',
              boxSizing: 'border-box'
            }}>
              <select 
                name="countryCode" 
                value={formData.countryCode} 
                onChange={handleInputChange}
                style={{ 
                  width: 'auto', 
                  minWidth: '130px',
                  flexShrink: 0,
                  background: 'transparent',
                  border: 'none',
                  borderRight: '1px solid var(--input-border)',
                  color: 'var(--input-text)',
                  padding: '1rem',
                  cursor: 'pointer',
                  fontSize: '16px',
                  outline: 'none',
                  appearance: 'none',
                  WebkitAppearance: 'none'
                }}
              >
                <option value="+886" style={{ color: 'var(--text-light)', background: 'var(--card-bg)' }}>{t.countryNames['+886']}</option>
                <option value="+852" style={{ color: 'var(--text-light)', background: 'var(--card-bg)' }}>{t.countryNames['+852']}</option>
                <option value="+853" style={{ color: 'var(--text-light)', background: 'var(--card-bg)' }}>{t.countryNames['+853']}</option>
                <option value="+65" style={{ color: 'var(--text-light)', background: 'var(--card-bg)' }}>{t.countryNames['+65']}</option>
                <option value="+60" style={{ color: 'var(--text-light)', background: 'var(--card-bg)' }}>{t.countryNames['+60']}</option>
                <option value="landline" style={{ color: 'var(--text-light)', background: 'var(--card-bg)' }}>{t.countryNames['landline']}</option>
              </select>
              <input 
                type="tel" 
                name="phone" 
                required 
                value={formData.phone} 
                onChange={handleInputChange} 
                placeholder={(() => {
                  const placeholders: { [key: string]: string } = {
                    '+886': '0912345678',
                    '+852': '91234567',
                    '+853': '61234567',
                    '+65': '91234567',
                    '+60': '0123456789',
                    'landline': '053745074'
                  };
                  return placeholders[formData.countryCode] || t.phonePlaceholder;
                })()}
                style={{ 
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  padding: '1rem',
                  color: 'var(--input-text)',
                  fontSize: '16px',
                  outline: 'none',
                  width: '100%'
                }}
              />
            </div>
            {formErrors.phone && <span className="error-msg">{formErrors.phone}</span>}
          </div>
          <div className="form-group">
            <label>
              {t.emailLabel}
              <span className="required-mark">*</span>
            </label>
            <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder={t.emailPlaceholder} />
            {formErrors.email && <span className="error-msg">{formErrors.email}</span>}
          </div>
        </div>

        <div className="form-card">
          <h3 className="form-section-title">{t.regInfo}</h3>
          
          <div className="form-group">
            <label>
              {t.sessionType}
              <span className="required-mark">*</span>
            </label>
            <select 
              value={sessionType} 
              required
              onChange={(e) => {
                const newType = e.target.value as '一般預約' | '特別預約' | '';
                setSessionType(newType);
                
                if (newType === '') {
                   handleInputChange({ target: { name: 'session', value: '' } } as any);
                   return;
                }

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const filtered = sessions.filter(s => {
                  const isTypeMatch = newType === '特別預約' ? s.isSpecial : !s.isSpecial;
                  if (!isTypeMatch) return false;
                  
                  // 如果有設定固定日期，檢查是否已過期
                  if (s.fixedDate) {
                    const sessionDate = new Date(s.fixedDate.replace(/-/g, '/'));
                    return sessionDate >= today;
                  }
                  return true;
                });
                
                if (filtered.length > 0) {
                  let targetValue = filtered[0].name;
                  if (newType === '一般預約') {
                    const qty = parseInt(formData.quantity) || 0;
                    if (qty >= 5) {
                      targetValue = filtered.find(s => s.name.includes('團體優惠'))?.name || targetValue;
                    } else {
                      targetValue = filtered.find(s => s.name.includes('單人') || s.name.includes('個人') || s.name.includes('一般'))?.name || targetValue;
                    }
                  }
                  handleInputChange({ target: { name: 'session', value: targetValue } } as any);
                }
              }}
            >
              <option value="" disabled>{t.sessionTypePlaceholder}</option>
              <option value="一般預約">{t.generalReg}</option>
              <option value="特別預約">{t.specialReg}</option>
            </select>
          </div>

          {sessionType === '一般預約' && identityPricings.some(ip => ip.enabled) && (
            <div className="form-group">
              <label>
                {lang === 'en' ? '【Identity Type】' : '【身分類型】'}
                <span className="required-mark">*</span>
              </label>
              <select 
                name="identityType"
                value={formData.identityType} 
                required
                onChange={(e) => {
                  const val = e.target.value;
                  handleInputChange(e);
                  if (val !== '一般民眾') {
                    const msg = lang === 'en' 
                      ? 'Please bring relevant identification/proof on the day of the event for verification.' 
                      : '【提醒】選擇此身分，請於遊玩當天攜帶相關證明文件以供查驗。';
                    showAlert(msg, lang === 'en' ? 'Reminder' : '提示', undefined, lang === 'en' ? 'I understand' : '我瞭解了');
                    
                    // 將場次名稱設為：優惠專案場次（身分名稱）
                    handleInputChange({ target: { name: 'session', value: `優惠專案場次（${val}）` } } as any);
                  } else {
                    // 切換回一般民眾時，觸發重新計算場次名稱 (模擬 sessionType 的邏輯)
                    const qty = parseInt(formData.quantity) || 0;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const filtered = sessions.filter(s => !s.isSpecial);
                    
                    if (filtered.length > 0) {
                      let targetValue = filtered[0].name;
                      if (qty >= 5) {
                        targetValue = filtered.find(s => s.name.includes('團體優惠'))?.name || targetValue;
                      } else {
                        targetValue = filtered.find(s => s.name.includes('單人') || s.name.includes('個人') || s.name.includes('一般'))?.name || targetValue;
                      }
                      handleInputChange({ target: { name: 'session', value: targetValue } } as any);
                    }
                  }
                }}
              >
                <option value="一般民眾">{lang === 'en' ? 'General Public' : '一般民眾'}</option>
                {identityPricings.filter(ip => ip.enabled).map(ip => (
                  <option key={ip.id} value={ip.name}>{ip.name}</option>
                ))}
              </select>
            </div>
          )}

          {sessionType !== '' && (
            <>
              <div className="form-group">
                <label>
                  {t.detailSession}
                  <span className="required-mark">*</span>
                </label>
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
                      {formData.identityType !== '一般民眾' 
                        ? (lang === 'en' ? 'Special Project Price (No additional discounts)' : '優惠專案價 (不參與其他折扣)')
                        : `${t.autoSelected} ${translateOption(getSessionDisplayName(formData.session), lang) || t.calculating}`
                      }
                    </p>
                    {formData.identityType === '一般民眾' && (
                      <div className="discount-hint" style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {t.discountHint}
                      </div>
                    )}
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
                        .filter(s => {
                          if (!s.isSpecial) return false;
                          if (!s.fixedDate) return true;
                          const sessionDate = new Date(s.fixedDate.replace(/-/g, '/'));
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return sessionDate >= today;
                        })
                        .map(s => <option key={s.name} value={s.name}>{lang === 'en' ? (s.enName || translateOption(s.name, lang)) : s.name} (${s.price})</option>)
                    ) : (
                      <option disabled>{t.loading}</option>
                    )}
                  </select>
                )}
              </div>
              <div className="form-group">
                <label>
                  {t.quantity}
                  <span className="required-mark">*</span>
                </label>
                <input type="number" name="quantity" min="1" required value={formData.quantity} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>
                  {t.playersLabel}
                  <span className="required-mark">*</span>
                </label>
                <select name="players" value={formData.players} onChange={handleInputChange}>
                  {Array.from({ length: Number(formData.quantity) * 4 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} {t.playersVal}</option>
                  ))}
                </select>
              </div>

              {/* 多人名單登記區塊 - 僅在人數大於 1 時顯示 */}
              {Number(formData.players) > 1 && (
                <div className="player-list-section" style={{ marginTop: '1.5rem' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--primary-gold)', fontWeight: 'bold', marginBottom: '0.5rem', borderLeft: '3px solid var(--accent-orange)', paddingLeft: '10px' }}>
                    {lang === 'en' ? 'Player Details:' : '隊員名單資料:'}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', paddingLeft: '13px' }}>
                    {lang === 'en' 
                      ? ' (Optional) Used for individual achievement certificates.' 
                      : '（選填）此名單僅用於後續製作與領取個人成就證書使用。'}
                  </p>
                  {formData.playerList.map((player, index) => (
                    <div key={index} className="player-input-row" style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '10px', 
                      marginBottom: '1rem',
                      padding: '1rem',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          {index === 0 
                            ? (lang === 'en' ? 'Registrant (You)' : '填表人 (您)') 
                            : `${lang === 'en' ? 'Player' : '隊員'} ${index}`} - {lang === 'en' ? 'Name' : '姓名'}
                        </label>                        <input 
                          type="text" 
                          value={player.name} 
                          onChange={(e) => handlePlayerInfoChange(index, 'name', e.target.value)}
                          placeholder={t.namePlaceholder}
                          required={index === 0}
                          style={index === 0 ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                          readOnly={index === 0}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          {lang === 'en' ? 'Email' : 'Email'}
                        </label>
                        <input 
                          type="email" 
                          value={player.email} 
                          onChange={(e) => handlePlayerInfoChange(index, 'email', e.target.value)}
                          placeholder={t.emailPlaceholder}
                          required={index === 0}
                          style={index === 0 ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                          readOnly={index === 0}
                        />
                      </div>                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {sessionType !== '' && (
          <>
            <div className="form-card">
              <h3 className="form-section-title">{t.paymentCard}</h3>
              <div className="form-group">
                <label>
                  {t.paymentMethodLabel}
                  <span className="required-mark">*</span>
                </label>
                <div className="radio-group">
                  {paymentMethods.map(m => (
                    <label key={m.id}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={m.name} 
                        checked={formData.paymentMethod === m.name} 
                        onChange={handleInputChange} 
                      /> {translateOption(m.name, lang)}
                    </label>
                  ))}
                </div>
              </div>

              {selectedPaymentDetail?.type === 'bank' && (
                <div className="form-group bank-info" style={{ background: 'rgba(212, 175, 55, 0.05)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                  <p style={{ color: 'var(--primary-gold)', fontWeight: 'bold', marginBottom: '0.8rem', fontSize: '1.1rem' }}>{t.bankInfo || '匯款資訊:'}</p>
                  <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--text-light)' }}>
                    {lang === 'en' 
                      ? 'Bank account details and payment verification will be provided on the next page after you submit this form.' 
                      : '匯款帳號資訊與轉帳核對將於送出報名表後的成功頁面顯示。'}
                  </p>
                </div>
              )}

              {selectedPaymentDetail?.type === 'linepay' && (
                <div className="form-group linepay-info" style={{ background: 'rgba(52, 152, 219, 0.05)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(52, 152, 219, 0.3)' }}>
                  <p style={{ color: '#3498db', fontWeight: 'bold', marginBottom: '0.8rem', fontSize: '1.1rem' }}>{t.digitalPayInfo}</p>
                  <p style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-light)' }}>{t.digitalPayDesc}</p>
                  {selectedPaymentDetail.instructions && (
                    <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap', opacity: 0.8, overflowWrap: 'anywhere' }}>{selectedPaymentDetail.instructions}</p>
                  )}
                </div>
              )}

              {selectedPaymentDetail?.type === 'other' && selectedPaymentDetail.instructions && (
                <div className="instructions-info" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--input-border)' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>付款說明:</p>
                  <p style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{selectedPaymentDetail.instructions}</p>
                </div>
              )}

              <div className="form-group" style={{marginTop: '1.5rem'}}>
                <label>
                  {(() => {
                    const selectedSession = sessions.find(s => s.name === formData.session);
                    if (selectedSession?.fixedTime) {
                       const times = selectedSession.fixedTime.split(',').sort();
                       return t.expectedDate(times[0], times[times.length - 1]);
                    }
                    // 修正：當沒設定時段時，從全域清單抓取顯示範圍
                    const fallbackSlots = sessionType === '特別預約' ? specialTimeSlots : generalTimeSlots;
                    const start = fallbackSlots.length > 0 ? fallbackSlots[0] : timeslotConfig.generalStart;
                    const end = fallbackSlots.length > 0 ? fallbackSlots[fallbackSlots.length - 1] : timeslotConfig.generalEnd;
                    return t.expectedDate(start, end);
                  })()}
                  <span className="required-mark">*</span>
                </label>
                
                {(() => {
                  const selectedSession = sessions.find(s => s.name === formData.session);
                  const currentDateStr = formData.pickupTime.split(' ')[0];

                  if (selectedSession?.isSpecial && (selectedSession?.fixedDate || selectedSession?.fixedTime)) {
                    let displayDate = selectedSession.fixedDate || '不限日期';
                    if (displayDate.includes('T')) displayDate = displayDate.split('T')[0];
                    return (
                      <div className="fixed-session-hint">
                        {t.fixedSessionHint(displayDate, selectedSession.fixedTime ? selectedSession.fixedTime.replace(/,/g, '、') : '全時段')}
                      </div>
                    );
                  }

                  if (currentDateStr) {
                    const conflicts = sessions.filter(s => {
                      let sDate = s.fixedDate || '';
                      if (sDate.includes('T')) sDate = sDate.split('T')[0];
                      return sDate === currentDateStr;
                    });
                    
                    if (conflicts.length > 0) {
                      const conflictTimes = conflicts.map(c => c.fixedTime?.replace(/,/g, '、')).filter(Boolean).join(' ; ');
                      if (conflictTimes) {
                        return (
                          <div className="conflict-notice">
                            {t.conflictNotice(conflictTimes)}
                          </div>
                        );
                      }
                    }
                  }
                  return null;
                })()}

                <DatePicker
                  selected={formData.pickupTime ? new Date(formData.pickupTime.replace(/-/g, '/')) : null}
                  onChange={handleDateChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  timeCaption={t.timeCaption}
                  dateFormat="yyyy-MM-dd HH:mm"
                  className="date-picker-input"
                  placeholderText={t.datepickerPlaceholder}
                  required
                  locale={lang}
                  minDate={(() => {
                    const now = new Date();
                    const selectedSession = sessions.find(s => s.name === formData.session);
                    let endHourStr = timeslotConfig.generalEnd;
                    
                    if (selectedSession?.fixedTime) {
                      const times = selectedSession.fixedTime.split(',').sort();
                      endHourStr = times[times.length - 1];
                    }
                    
                    const endHour = parseInt(endHourStr.split(':')[0]);
                    if (now.getHours() >= endHour) {
                      now.setDate(now.getDate() + 1);
                    }
                    return now;
                  })()}
                  maxDate={sessions.find(s => s.name === formData.session)?.fixedDate 
                    ? new Date(sessions.find(s => s.name === formData.session)!.fixedDate!) 
                    : undefined}
                  filterDate={(date) => {
                    const selectedSession = sessions.find(s => s.name === formData.session);
                    if (selectedSession?.fixedDate) {
                      const fixedDate = new Date(selectedSession.fixedDate);
                      return date.getFullYear() === fixedDate.getFullYear() &&
                             date.getMonth() === fixedDate.getMonth() &&
                             date.getDate() === fixedDate.getDate();
                    }
                    return date.getDay() !== 1 && date.getDay() !== 2;
                  }}
                  minTime={(() => {
                    const d = formData.pickupTime ? new Date(formData.pickupTime.replace(/-/g, '/')) : new Date();
                    const selectedSession = sessions.find(s => s.name === formData.session);
                    let startH = 0, startM = 0;
                    
                    if (selectedSession?.fixedTime) {
                      const times = selectedSession.fixedTime.split(',').sort();
                      const parts = times[0].split(':');
                      startH = parseInt(parts[0]);
                      startM = parseInt(parts[1]);
                    } else {
                      // 修正：當場次沒選時段時，從全域時段清單抓取第一個
                      const fallbackSlots = sessionType === '特別預約' ? specialTimeSlots : generalTimeSlots;
                      const defaultStart = fallbackSlots.length > 0 ? fallbackSlots[0] : timeslotConfig.generalStart;
                      const parts = defaultStart.split(':');
                      startH = parseInt(parts[0]);
                      startM = parseInt(parts[1]);
                    }
                    
                    d.setHours(startH, startM, 0);
                    return d;
                  })()}
                  maxTime={(() => {
                    const d = formData.pickupTime ? new Date(formData.pickupTime.replace(/-/g, '/')) : new Date();
                    const selectedSession = sessions.find(s => s.name === formData.session);
                    let endH = 23, endM = 30;
                    
                    if (selectedSession?.fixedTime) {
                      const times = selectedSession.fixedTime.split(',').sort();
                      const parts = times[times.length - 1].split(':');
                      endH = parseInt(parts[0]);
                      endM = parseInt(parts[1]);
                    } else {
                      // 修正：當場次沒選時段時，從全域時段清單抓取最後一個
                      const fallbackSlots = sessionType === '特別預約' ? specialTimeSlots : generalTimeSlots;
                      const defaultEnd = fallbackSlots.length > 0 ? fallbackSlots[fallbackSlots.length - 1] : timeslotConfig.generalEnd;
                      const parts = defaultEnd.split(':');
                      endH = parseInt(parts[0]);
                      endM = parseInt(parts[1]);
                    }
                    
                    d.setHours(endH, endM, 0);
                    return d;
                  })()}
                  filterTime={(time) => {
                    const now = new Date();
                    const selectedDate = formData.pickupTime ? new Date(formData.pickupTime.replace(/-/g, '/')) : new Date();
                    
                    // 如果是今天，過濾掉過去的時間
                    if (selectedDate.toDateString() === now.toDateString()) {
                      // 這裡判斷：如果時段的時間小於等於現在時間，則不顯示
                      if (time.getTime() <= now.getTime()) {
                        return false;
                      }
                    }

                    const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}`;
                    const selectedSession = sessions.find(s => s.name === formData.session);
                    
                    // 優先邏輯：如果該場次本身有設定固定時段（不論是一般還是特別），一律優先以場次設定為準
                    if (selectedSession?.fixedTime) {
                      return selectedSession.fixedTime.split(',').includes(timeStr);
                    }
                    
                    // 否則 fallback 到資料庫全域時段
                    const allowedSlots = sessionType === '特別預約' ? specialTimeSlots : generalTimeSlots;
                    if (!allowedSlots.includes(timeStr)) return false;


                    if (sessionType === '一般預約') {
                      const currentDateStr = formData.pickupTime.split(' ')[0];
                      const isTakenByOtherSpecial = sessions.some(s => {
                        let sDate = s.fixedDate || '';
                        if (sDate.includes('T')) sDate = sDate.split('T')[0];
                        return sDate === currentDateStr && s.fixedTime?.split(',').includes(timeStr);
                      });
                      if (isTakenByOtherSpecial) return false;
                    }

                    return true;
                  }}
                />
              </div>
              <div className="form-group">
                <label>
                  {t.pickupLocation}
                  <span className="required-mark">*</span>
                </label>
                <select name="pickupLocation" value={formData.pickupLocation} onChange={handleInputChange}>
                  <option value="新港文教基金會(閱讀館)">{t.locFoundation}</option>
                  <option value="培桂堂(建議選此處，此處為解謎起點)">{t.locPeiGui}</option>
                </select>
              </div>
            </div>

            <div className="form-card">
              <h3 className="form-section-title">{t.other}</h3>
              <div className="form-group">
                <label>{t.referralLabel}</label>
                <div className="checkbox-grid">
                  {t.referrals.map((item: string, index: number) => {
                    const stableKey = translations.zh.referrals[index];
                    return (
                      <label key={stableKey}>
                        <input 
                          type="checkbox" 
                          value={stableKey} 
                          checked={formData.referral.includes(stableKey)} 
                          onChange={handleCheckboxChange} 
                        /> 
                        {item}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="form-group">
                <label>{t.notesLabel}</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3}></textarea>
              </div>
            </div>

            <div className="submit-container">
              <div className="total-display">
                <span>{t.total}</span>
                <span className="amount">NT$ {calculatedTotal}</span>
              </div>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? t.submitting : t.submitBtn}
              </button>
            </div>
          </>
        )}
      </form>

      <StatusLookupModal isOpen={isLookupOpen} onClose={() => setIsLookupOpen(false)} lang={lang} />

    </section>
  );
};

/**
 * 🎒 我的道具箱彈窗
 */
const BagModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  hasFlashlight: boolean;
  hasPoetrySlip: boolean;
  isFlashlightOn: boolean;
  onToggleFlashlight: () => void;
  showMysticScroll: () => void;
}> = ({ isOpen, onClose, hasFlashlight, hasPoetrySlip, isFlashlightOn, onToggleFlashlight, showMysticScroll }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '15px' }}>
          <ChestIcon size={30} />
          <h2 style={{ color: 'var(--primary-gold)', margin: 0 }}>我的道具箱</h2>
        </div>
        
        <div className="modal-body" style={{ padding: '30px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '25px' }}>
            點擊道具以使用或查看
          </p>

          <div style={{ display: 'flex', gap: '25px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* 手電筒道具 */}
            <div 
              onClick={hasFlashlight ? onToggleFlashlight : undefined}
              style={{
                width: '90px',
                height: '90px',
                background: hasFlashlight 
                  ? (isFlashlightOn ? 'var(--primary-gold)' : 'rgba(212, 175, 55, 0.1)') 
                  : 'rgba(255,255,255,0.05)',
                border: `2px solid ${hasFlashlight ? (isFlashlightOn ? '#fff' : 'var(--primary-gold)') : '#444'}`,
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: hasFlashlight ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                boxShadow: isFlashlightOn ? '0 0 35px var(--primary-gold), inset 0 0 15px rgba(255,255,255,0.5)' : 'none',
                opacity: hasFlashlight ? 1 : 0.4,
                position: 'relative'
              }}
            >
              <span style={{ 
                fontSize: '2.8rem', 
                filter: isFlashlightOn ? 'drop-shadow(0 0 15px #fff) brightness(1.2)' : 'grayscale(1) opacity(0.7)' 
              }}>
                {hasFlashlight ? '🔦' : '🔒'}
              </span>
              {isFlashlightOn && (
                <div style={{ 
                  position: 'absolute', top: '-10px', right: '-10px', 
                  background: '#ff4d4d', color: '#fff', fontSize: '0.65rem',
                  padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                }}>ON</div>
              )}
              <span style={{ 
                position: 'absolute', bottom: '-28px', fontSize: '0.8rem', 
                color: hasFlashlight ? 'var(--primary-gold)' : '#666',
                whiteSpace: 'nowrap', fontWeight: 'bold',
                textShadow: isFlashlightOn ? '0 0 10px var(--primary-gold)' : 'none'
              }}>
                {hasFlashlight ? '八卦手電筒' : '未獲得'}
              </span>
            </div>

            {/* 神祕詩籤道具 */}
            <div 
              onClick={hasPoetrySlip ? showMysticScroll : undefined}
              style={{
                width: '90px',
                height: '90px',
                background: hasPoetrySlip ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.05)',
                border: `2px solid ${hasPoetrySlip ? 'var(--primary-gold)' : '#444'}`,
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: hasPoetrySlip ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                opacity: hasPoetrySlip ? 1 : 0.4,
                position: 'relative'
              }}
            >
              <span style={{ fontSize: '2.8rem' }}>
                {hasPoetrySlip ? '📜' : '🔒'}
              </span>
              <span style={{ 
                position: 'absolute', bottom: '-28px', fontSize: '0.8rem', 
                color: hasPoetrySlip ? 'var(--primary-gold)' : '#666',
                whiteSpace: 'nowrap', fontWeight: 'bold'
              }}>
                {hasPoetrySlip ? '神祕詩籤' : '未獲得'}
              </span>
            </div>

            {/* 空插槽 (未來擴充) */}
            <div style={{
              width: '90px', height: '90px',
              background: 'rgba(255,255,255,0.02)',
              border: '2px dashed #333',
              borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '1.5rem', opacity: 0.1 }}>?</span>
            </div>
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <button className="submit-btn" onClick={onClose} style={{ width: '100%', background: 'transparent', border: '1px solid var(--primary-gold)', color: 'var(--primary-gold)' }}>
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
