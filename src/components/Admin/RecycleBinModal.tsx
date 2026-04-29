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
    <div className="modal-overlay" onClick={() => setShow(false)}>
      <div
        className="admin-login-modal form-card"
        style={{
          maxWidth: '1000px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 固定頂部標題欄 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem 2rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            background: 'var(--card-bg)',
            zIndex: 10
          }}
        >
          <h2 className="form-section-title" style={{ margin: 0 }}>
            回收桶 (已刪除的報名)
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isSuper && rows.length > 0 && (
              <button
                onClick={handleClearRecycleBin}
                className="delete-btn"
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                清空回收桶
              </button>
            )}

            {/* 固定的 X 關閉按鈕 */}
            <button
              onClick={() => setShow(false)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'var(--text-light)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              className="hover-bright"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* 可滾動內容區 - 延伸至底部 */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem 2rem 6rem 2rem',
            position: 'relative'
          }}
        >
          {rows.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>回收桶空空如也</p>
            </div>
          ) : (
            <div className="submissions-table-container">
              <table className="submissions-table">
                <thead
                  style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 5,
                    background: 'var(--card-bg)'
                  }}
                >
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
                    <tr key={row[16] || i}>
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
        </div>

        {/* 懸浮底部按鈕區 */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '2rem',
            background:
              'linear-gradient(to top, var(--card-bg) 20%, transparent 100%)',
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none', // 讓容器本身不擋滑鼠，只有按鈕擋
            zIndex: 10
          }}
        >
          <button
            type="button"
            onClick={() => setShow(false)}
            className="cancel-btn"
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              pointerEvents: 'auto' // 恢復按鈕的點擊
            }}
          >
            關閉回收桶
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecycleBinModal;
