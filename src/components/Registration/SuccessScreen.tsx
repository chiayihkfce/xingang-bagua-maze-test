import React from 'react';
import { translateOption } from '../../utils/translateOptions';
import { generateGoogleCalendarUrl, downloadIcalFile } from '../../utils/calendarUtils';
import { generateCertificate, downloadCertificate } from '../../utils/certificateUtils';

interface SuccessScreenProps {
  t: any;
  formData: any;
  calculatedTotal: number;
  handleCopyAccount: (text?: string) => void;
  getSessionDisplayName: (name: string) => string;
  getPaymentMethodDisplay: (method: string) => string;
  resetForm: () => void;
  paymentMethods: any[];
  lang: string;
  lastSubmissionId?: string | null;
  handleUpdateBankLast5?: (id: string, last5: string) => Promise<boolean>;
  showAlert: (message: string, title?: string) => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  t,
  formData,
  calculatedTotal,
  handleCopyAccount,
  getSessionDisplayName,
  getPaymentMethodDisplay,
  resetForm,
  paymentMethods,
  lang,
  lastSubmissionId,
  handleUpdateBankLast5,
  showAlert
}) => {
  const [bankLast5, setBankLast5] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [updateSuccess, setUpdateSuccess] = React.useState(false);
  const [hasClickedPayment, setHasClickedPayment] = React.useState(false);
  const [hasDownloaded, setHasDownloaded] = React.useState(false);

  const selectedPaymentDetail = (paymentMethods || []).find(m => m.name === formData.paymentMethod);
  const isFullyCompleted = selectedPaymentDetail?.type === 'bank' ? updateSuccess : (selectedPaymentDetail?.type === 'linepay' ? hasClickedPayment : !!lastSubmissionId);

  const urlParams = new URLSearchParams(window.location.search);
  const isCertMode = !!urlParams.get('certId');

  // 手動觸發高品質下載
  const handleThemeDownload = async (selectedTheme: 'dark' | 'light') => {
    if (!formData.name) return;
    setIsUpdating(true);
    try {
      const dataUrl = await generateCertificate({
        name: formData.name,
        session: translateOption(getSessionDisplayName(formData.session), lang),
        date: formData.pickupTime.split(' ')[0],
        lang,
        t,
        theme: selectedTheme
      });
      if (dataUrl) {
        downloadCertificate(dataUrl, `${t.certDownloadName || '成就證書'}_${selectedTheme === 'dark' ? '黑金' : '米白'}.png`);
        setHasDownloaded(true);
      }
    } catch (err) {
      console.error("Manual Download Error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // 離開頁面警告
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFullyCompleted && !isCertMode) {
        e.preventDefault();
        e.returnValue = t.exitWarning || '報名尚未完成！';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isFullyCompleted, isCertMode, t.exitWarning]);

  const onUpdateLast5 = async () => {
    if (!bankLast5 || bankLast5.length !== 5) {
      showAlert(lang === 'en' ? 'Please enter 5 digits.' : '請輸入完整 5 碼');
      return;
    }
    if (handleUpdateBankLast5) {
      setIsUpdating(true);
      const success = await handleUpdateBankLast5(lastSubmissionId || '', bankLast5);
      setIsUpdating(false);
      if (success) setUpdateSuccess(true);
      else showAlert(lang === 'en' ? 'Update failed.' : '更新失敗');
    }
  };

  const onLinePayClick = async (e: React.MouseEvent) => {
    if (lastSubmissionId) { setHasClickedPayment(true); return; }
    e.preventDefault();
    const link = (e.currentTarget as HTMLAnchorElement).href;
    if (handleUpdateBankLast5) {
      setIsUpdating(true);
      try {
        const success = await handleUpdateBankLast5('', '');
        if (success) { setHasClickedPayment(true); window.open(link, '_blank', 'noopener,noreferrer'); }
      } catch (err) { console.error(err); } finally { setIsUpdating(false); }
    }
  };

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl({
      title: `【新港八卦謎蹤】${formData.session}`,
      startTime: formData.pickupTime,
      location: formData.pickupLocation,
      details: `感謝您的報名！\n訂單總額：NT$ ${calculatedTotal}\n報名序號：${lastSubmissionId || '待核對'}`
    });
    window.open(url, '_blank');
  };

  const handleIcal = () => {
    downloadIcalFile({
      title: `【新港八卦謎蹤】${formData.session}`,
      startTime: formData.pickupTime,
      location: formData.pickupLocation,
      details: `感謝您的報名！\n訂單總額：NT$ ${calculatedTotal}\n報名序號：${lastSubmissionId || '待核對'}`
    });
  };

  const canGoHome = (selectedPaymentDetail?.type === 'bank' ? updateSuccess : true) && (selectedPaymentDetail?.type === 'linepay' ? hasClickedPayment : true);

  // 如果是證書領取模式，顯示主題選擇畫面
  if (isCertMode) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0a0a0a', color: '#fff', textAlign: 'center', padding: '20px' }}>
        <div className="check-icon" style={{ background: '#27ae60', margin: '0 auto 20px' }}>✓</div>
        <h2 style={{ fontSize: '2rem', letterSpacing: '4px', color: '#d4af37' }}>挑戰成就達成</h2>
        <p style={{ marginTop: '10px', opacity: 0.8, fontSize: '1.2rem' }}>恭喜您，<strong>{formData.name}</strong>！</p>
        <p style={{ marginTop: '10px', opacity: 0.7 }}>請選擇您喜愛的證書風格進行領取：</p>
        
        <div style={{ display: 'flex', gap: '20px', marginTop: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* 米白宣紙選項 */}
          <button 
            onClick={() => handleThemeDownload('light')}
            disabled={isUpdating}
            style={{ 
              width: '240px', padding: '40px 20px', background: '#f5f2e9', color: '#333', border: '4px solid #d4af37', 
              borderRadius: '20px', cursor: 'pointer', transition: 'transform 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span style={{ fontSize: '2rem', marginBottom: '15px' }}>📜</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>米白宣紙版</span>
            <span style={{ fontSize: '0.9rem', marginTop: '15px', opacity: 0.7 }}>古典溫潤 · 書卷氣息</span>
          </button>

          {/* 深色黑金選項 */}
          <button 
            onClick={() => handleThemeDownload('dark')}
            disabled={isUpdating}
            style={{ 
              width: '240px', padding: '40px 20px', background: '#1a1a1a', color: '#d4af37', border: '4px solid #d4af37', 
              borderRadius: '20px', cursor: 'pointer', transition: 'transform 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span style={{ fontSize: '2rem', marginBottom: '15px' }}>🌟</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>深色黑金版</span>
            <span style={{ fontSize: '0.9rem', marginTop: '15px', opacity: 0.7 }}>莊重神祕 · 皇家氣勢</span>
          </button>
        </div>

        {isUpdating && (
          <div style={{ marginTop: '40px' }}>
            <p style={{ color: '#d4af37', fontSize: '1.1rem' }}>正在為您繪製高品質證書，請稍候...</p>
          </div>
        )}
        
        {hasDownloaded && !isUpdating && (
          <p style={{ marginTop: '40px', color: '#27ae60', fontWeight: 'bold', fontSize: '1.1rem' }}>✓ 證書已開始下載。您可以再次點擊選擇另一種配色。</p>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="success-screen">
        <div className="check-icon" style={{ background: isFullyCompleted ? '#27ae60' : 'var(--accent-orange)' }}>
          {isFullyCompleted ? '✓' : '!'}
        </div>
        <h1>{isFullyCompleted ? t.submitSuccess : (t.awaitingPayment || '待完成付款動作')}</h1>
        <p>{t.thanks} <strong>{formData.name}</strong>。</p>
        <p>{isFullyCompleted ? t.received : (t.pleaseVerify || '請確認以下明細並完成繳費動作以完成報名。')}</p>
        
        <div className="summary-box">
          <p><strong>{t.session}</strong> {translateOption(getSessionDisplayName(formData.session), lang)}</p>
          <p><strong>{t.playTime}</strong> {formData.pickupTime}</p>
          <p><strong>{t.orderTotal}</strong> NT$ {calculatedTotal}</p>
          <p><strong>{t.paymentMethod}</strong> {translateOption(getPaymentMethodDisplay(formData.paymentMethod), lang)}</p>

          <div className="calendar-actions" style={{ marginTop: '1.5rem', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1.2rem' }}>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.8rem', opacity: 0.8 }}>{t.addToCalendar}</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={handleGoogleCalendar} className="copy-btn" style={{ background: '#4285F4', color: 'white', border: 'none' }}>{t.googleCalendar}</button>
              <button onClick={handleIcal} className="copy-btn" style={{ background: '#333', color: 'white', border: 'none' }}>{t.iCalendar}</button>
            </div>
          </div>
          
          {selectedPaymentDetail?.type === 'bank' && (
            <div className="bank-info" style={{marginTop: '1.2rem', padding: '1.2rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)'}}>
              <p style={{ color: 'var(--primary-gold)', fontWeight: 'bold', marginBottom: '0.8rem', fontSize: '1.1rem' }}>{t.bankInfoFull}</p>
              
              <div style={{ marginBottom: '0.6rem' }}>
                <strong>{t.bank || '銀行'}:</strong> {translateOption(selectedPaymentDetail.bankName || '', lang)}
              </div>
              
              <div className="account-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0.6rem 0' }}>
                <p style={{ margin: 0 }}>
                  <strong>{t.accountLabel || '帳號'}:</strong> {translateOption(selectedPaymentDetail.accountNumber || '', lang)}
                </p>
                <button 
                  onClick={() => handleCopyAccount(selectedPaymentDetail.accountNumber || '')} 
                  className="copy-btn"
                  style={{ padding: '4px 12px', fontSize: '0.85rem' }}
                >
                  {t.copy || '複製'}
                </button>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <strong>{t.accountNameLabel || '戶名'}:</strong> {translateOption(selectedPaymentDetail.accountName || '', lang)}
              </div>

              <div className="bank-last5-section" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.2rem' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.8rem', fontSize: '1rem' }}>
                  {lang === 'en' ? 'Provide Last 5 Digits for Verification:' : '填寫轉帳帳號末五碼以供核對:'}
                </p>
                
                {updateSuccess ? (
                  <div style={{ color: '#27ae60', fontWeight: 'bold', padding: '0.5rem', background: 'rgba(39, 174, 96, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
                    ✓ {lang === 'en' ? 'Verified info submitted!' : '核對資訊已送出！'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      maxLength={5}
                      placeholder="12345"
                      value={bankLast5}
                      onChange={(e) => setBankLast5(e.target.value.replace(/\D/g, ''))}
                      style={{ 
                        flex: 1, 
                        padding: '0.8rem', 
                        borderRadius: '8px', 
                        border: '1px solid var(--input-border)',
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        textAlign: 'center',
                        fontSize: '1.1rem',
                        letterSpacing: '3px'
                      }}
                    />
                    <button 
                      onClick={onUpdateLast5}
                      disabled={isUpdating}
                      className="submit-btn"
                      style={{ 
                        padding: '0 1.5rem', 
                        margin: 0, 
                        fontSize: '0.95rem',
                        height: 'auto',
                        width: 'auto',
                        minWidth: '80px'
                      }}
                    >
                      {isUpdating ? '...' : (lang === 'en' ? 'Send' : '送出')}
                    </button>
                  </div>
                )}
              </div>

              <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '1rem' }}>
                {lang === 'en' 
                  ? 'Please complete the transfer and provide the digits above.' 
                  : '匯款後請填寫上方末五碼以便審核。'}
              </p>
            </div>
          )}

          {selectedPaymentDetail?.type === 'linepay' && selectedPaymentDetail.link && (
            <div className="linepay-box" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <p style={{ marginBottom: '1rem', color: 'var(--text-light)', fontSize: '1rem' }}>{t.linePayInfo || '請點擊下方按鈕完成電子支付：'}</p>
              <a 
                href={selectedPaymentDetail.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={onLinePayClick}
                className="submit-btn" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px',
                  background: isUpdating ? '#ccc' : 'var(--primary-gold)', 
                  textDecoration: 'none', 
                  color: 'var(--card-bg)',
                  fontWeight: 'bold',
                  padding: '1rem 1.5rem',
                  borderRadius: '50px',
                  fontSize: '1.05rem',
                  boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)',
                  pointerEvents: isUpdating ? 'none' : 'auto',
                  width: '100%',
                  maxWidth: '320px',
                  margin: '0 auto',
                  boxSizing: 'border-box',
                  lineHeight: '1.4'
                }}
              >
                {isUpdating ? (lang === 'en' ? 'Processing...' : '正在準備支付連結...') : (t.toLinePay || '立即前往支付 ➔')}
              </a>
              {selectedPaymentDetail.instructions && (
                <p style={{ marginTop: '1rem', fontSize: '0.85rem', opacity: 0.7, overflowWrap: 'anywhere' }}>{selectedPaymentDetail.instructions}</p>
              )}
            </div>
          )}

          {selectedPaymentDetail?.type === 'other' && selectedPaymentDetail.instructions && (
            <div className="other-pay-box" style={{ marginTop: '1.2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>下一步指引:</p>
              <p style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{selectedPaymentDetail.instructions}</p>
            </div>
          )}
        </div>

        {canGoHome && <button onClick={resetForm} className="cta-button">{t.backToHome}</button>}
      </div>
    </div>
  );
};

export default SuccessScreen;
