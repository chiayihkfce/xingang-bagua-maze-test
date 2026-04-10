import React from 'react';
import { AdminAccount } from '../../types';

interface RecycleBinModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  deletedSubmissions: any[][];
  handleRestore: (index: number) => void;
  isSubmitting: boolean;
  handleClearRecycleBin: () => void;
  currentAdmin: AdminAccount | null;
  formatFullDateTime: (date: any) => string;
}

const RecycleBinModal: React.FC<RecycleBinModalProps> = ({
  show,
  setShow,
  deletedSubmissions,
  handleRestore,
  isSubmitting,
  handleClearRecycleBin,
  currentAdmin,
  formatFullDateTime
}) => {
  if (!show) return null;

  const isSuper = currentAdmin?.role === 'super';
  const rows = deletedSubmissions;

  return (
    <div className="modal-overlay">
      <div className="admin-login-modal form-card" style={{ maxWidth: '1000px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 1rem' }}>
          <h2 className="form-section-title" style={{ margin: 0 }}>回收桶 (已刪除的報名)</h2>
          {isSuper && rows.length > 0 && (
            <button 
              onClick={handleClearRecycleBin}
              className="delete-btn"
              style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              清空回收桶
            </button>
          )}
        </div>
        
        {rows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>回收桶空空如也</p>
          </div>
        ) : (
          <div className="submissions-table-container">
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>操作</th>
                  <th>刪除時間</th>
                  <th>報名人</th>
                  <th>場次</th>
                  <th>日期時間</th>
                  <th>金額</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row[15] || i}>
                    <td>
                      <button 
                        onClick={() => handleRestore(i)} 
                        className="edit-btn" 
                        style={{ background: '#27ae60' }}
                        disabled={isSubmitting}
                      >
                        還原
                      </button>
                    </td>
                    <td>{formatFullDateTime(row[0])}</td>
                    <td>{row[2]}</td>
                    <td>{row[5]}</td>
                    <td>{row[11]}</td>
                    <td>NT$ {row[8]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="modal-actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <button 
            type="button" 
            onClick={() => setShow(false)} 
            className="cancel-btn" 
            style={{ width: '100%', height: '52px', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecycleBinModal;
