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

  const selectedPaymentDetail = (paymentMethods || []).find(m => m.name === formData.paymentMethod);

  // 判斷是否真正完成「送出」動作
  // 1. 現金支付：只要 isSaved 有 ID 就算完成
  // 2. 銀行轉帳：需 updateSuccess 為 true
  // 3. 電子支付：需 hasClickedPayment 為 true
  const isFullyCompleted = 
    selectedPaymentDetail?.type === 'bank' ? updateSuccess :
    selectedPaymentDetail?.type === 'linepay' ? hasClickedPayment :
    !!lastSubmissionId;

  const [hasDownloaded, setHasDownloaded] = React.useState(false);

  // 自動偵測連結並下載高品質證書
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const certId = urlParams.get('certId');
    
    // 如果有 certId 且 formData 已載入，且「尚未執行過下載」
    if (certId && formData.name && isFullyCompleted && !hasDownloaded) {
      const themeParam = urlParams.get('theme') as 'dark' | 'light' || 'light';
      
      const triggerAutoDownload = async () => {
        try {
          const dataUrl = await generateCertificate({
            name: formData.name,
            session: translateOption(getSessionDisplayName(formData.session), lang),
            date: formData.pickupTime.split(' ')[0],
            lang,
            t,
            theme: themeParam
          });
          if (dataUrl) {
            downloadCertificate(dataUrl, t.certDownloadName);
            setHasDownloaded(true); // 標記為已下載，停止迴圈
          }
        } catch (err) {
          console.error("Auto Download Error:", err);
        }
      };
      
      const timer = setTimeout(triggerAutoDownload, 800);
      return () => clearTimeout(timer);
    }
  }, [formData.name, isFullyCompleted, hasDownloaded]); // 精簡依賴項

  // 離開頁面警告邏輯：若尚未完成付款動作，跳出警告
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFullyCompleted) {
        e.preventDefault();
        e.returnValue = t.exitWarning || '報名尚未完成！';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isFullyCompleted, t.exitWarning]);

  // 判斷是否顯示「返回首頁」按鈕
  const canGoHome = 
    (selectedPaymentDetail?.type === 'bank' ? updateSuccess : true) &&
    (selectedPaymentDetail?.type === 'linepay' ? hasClickedPayment : true);

  const onUpdateLast5 = async () => {
    if (!bankLast5 || bankLast5.length !== 5) {
      showAlert(lang === 'en' ? 'Please enter 5 digits.' : '請輸入完整 5 碼');
      return;
    }
    if (handleUpdateBankLast5) {
      setIsUpdating(true);
      // 傳入空字串 ID 代表尚未存檔，handleUpdateBankLast5 會執行 executeFinalSubmission
      const success = await handleUpdateBankLast5(lastSubmissionId || '', bankLast5);
      setIsUpdating(false);
      if (success) {
        setUpdateSuccess(true);
      } else {
        showAlert(lang === 'en' ? 'Update failed, please try again.' : '更新失敗，請稍後再試');
      }
    }
  };

  const onLinePayClick = async (e: React.MouseEvent) => {
    // 如果已經存過檔了，就讓它正常跳轉
    if (lastSubmissionId) {
      setHasClickedPayment(true);
      return;
    }

    // 尚未存檔，攔截跳轉先存檔
    e.preventDefault();
    const link = (e.currentTarget as HTMLAnchorElement).href;
    
    if (handleUpdateBankLast5) {
      setIsUpdating(true);
      try {
        // 傳入空字串 ID 代表執行最終存檔
        const success = await handleUpdateBankLast5('', '');
        if (success) {
          setHasClickedPayment(true);
          // 存檔成功後，開啟連結
          window.open(link, '_blank', 'noopener,noreferrer');
        } else {
          showAlert(lang === 'en' ? 'Connection failed, please try again.' : '連線失敗，請稍後再試');
        }
      } catch (err) {
        console.error("LinePay Submit Error:", err);
      } finally {
        setIsUpdating(false);
      }
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

  const urlParams = new URLSearchParams(window.location.search);
  const isCertMode = !!urlParams.get('certId');

  // 如果是證書領取模式，只顯示極簡載入狀態 (隱身模式)
  if (isCertMode) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000', color: '#d4af37', textAlign: 'center' }}>
        <p style={{ letterSpacing: '3px', fontSize: '1.2rem', fontWeight: 'bold' }}>正在為您準備最高畫質證書...</p>
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
