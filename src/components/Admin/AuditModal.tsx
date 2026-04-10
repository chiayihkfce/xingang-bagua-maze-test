import React from 'react';

interface AuditModalProps {
  showAuditModal: boolean;
  auditTarget: { index: number, row: any[] } | null;
  setShowAuditModal: (show: boolean) => void;
  handleVerifyPayment: (index: number, status: string) => void;
}

const AuditModal: React.FC<AuditModalProps> = ({
  showAuditModal,
  auditTarget,
  setShowAuditModal,
  handleVerifyPayment
}) => {
  if (!showAuditModal || !auditTarget) return null;

  return (
    <div className="modal-overlay">
      <div className="admin-login-modal form-card" style={{maxWidth: '500px', padding: '2.5rem'}}>
        <h2 className="form-section-title" style={{textAlign: 'center', fontSize: '1.5rem', marginBottom: '2rem'}}>報名資料審核</h2>
        
        <div className="audit-details" style={{textAlign: 'left', marginBottom: '2rem'}}>
          <div style={{background: 'rgba(255,255,255,0.05)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'}}>
            <p style={{margin: '0 0 0.8rem 0', display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: 'var(--text-muted)'}}>報名人：</span>
              <strong style={{color: 'white', fontSize: '1.1rem'}}>{auditTarget.row[2]}</strong>
            </p>
            <p style={{margin: '0 0 0.8rem 0', display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: 'var(--text-muted)'}}>報名場次：</span>
              <span style={{textAlign: 'right'}}>{auditTarget.row[5]}</span>
            </p>
            <p style={{margin: '0 0 0.8rem 0', display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: 'var(--text-muted)'}}>份數 / 人數：</span>
              <span>{auditTarget.row[6]} 份 / {auditTarget.row[7]} 人</span>
            </p>
            <p style={{margin: '0 0 0.8rem 0', display: 'flex', justifyContent: 'space-between', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
              <span style={{color: 'var(--text-muted)'}}>付款方式：</span>
              <strong style={{color: 'var(--primary-gold)'}}>{auditTarget.row[9]}</strong>
            </p>
            
            {(String(auditTarget.row[9]).includes('銀行轉帳') || String(auditTarget.row[9]).includes('ATM')) && (
              <p style={{margin: '0.5rem 0 0 0', background: 'rgba(230, 126, 34, 0.15)', padding: '0.8rem', borderRadius: '8px', border: '1px dashed var(--accent-orange)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{color: 'var(--accent-orange)', fontWeight: 'bold'}}>帳戶末五碼：</span>
                <strong style={{color: 'var(--accent-orange)', fontSize: '1.2rem', letterSpacing: '2px'}}>{auditTarget.row[10] || '未提供'}</strong>
              </p>
            )}
          </div>

          <div style={{marginTop: '1.5rem', padding: '0 0.5rem'}}>
            <p style={{margin: '0 0 0.5rem 0', display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: 'var(--text-muted)'}}>訂單總額：</span>
              <strong style={{color: 'var(--primary-gold)', fontSize: '1.3rem'}}>NT$ {auditTarget.row[8]}</strong>
            </p>
            <p style={{margin: '0', display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: 'var(--text-muted)'}}>目前狀態：</span>
              <span style={{
                padding: '0.2rem 0.8rem', 
                borderRadius: '50px', 
                background: auditTarget.row[1] === '通過' ? 'rgba(39, 174, 96, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                color: auditTarget.row[1] === '通過' ? '#2ecc71' : '#bbb',
                fontSize: '0.85rem'
              }}>{auditTarget.row[1] || '待審核'}</span>
            </p>
          </div>
        </div>

        <div className="modal-actions" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <button 
            onClick={() => {
              handleVerifyPayment(auditTarget.index, '通過');
              setShowAuditModal(false);
            }} 
            className="submit-btn audit-confirm-btn" 
            style={{
              width: '100%', 
              height: '50px', 
              background: '#27ae60', 
              fontWeight: 'bold',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(39, 174, 96, 0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap'
            }}
          >
            確認付款完成
          </button>
          <button 
            onClick={() => setShowAuditModal(false)} 
            className="cancel-btn audit-cancel-btn" 
            style={{
              width: '100%', 
              height: '50px', 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#ccc',
              fontWeight: 'bold',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditModal;
