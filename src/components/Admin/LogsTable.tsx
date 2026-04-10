import React from 'react';
import { AdminAccount } from '../../types';

interface LogsTableProps {
  logs: any[][];
  formatFullDateTime: (date: Date) => string;
  handleClearLogs: () => void;
  currentAdmin: AdminAccount | null;
}

const LogsTable: React.FC<LogsTableProps> = ({ logs, formatFullDateTime, handleClearLogs, currentAdmin }) => {
  const isSuper = currentAdmin?.role === 'super';

  if (!logs || logs.length === 0) {
    return (
      <div className="form-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>尚無操作日誌紀錄</p>
        {isSuper && (
          <button onClick={handleClearLogs} className="delete-btn" style={{ padding: '0.5rem 1.2rem', borderRadius: '8px' }}>
            重置日誌資料庫
          </button>
        )}
      </div>
    );
  }

  // 日誌格式：[時間戳記, 操作類型, 操作者, 操作詳情]
  const header = logs[0];
  const rows = logs.slice(1); 
  
  return (
    <section className="admin-section form-card submissions-table-container">
      <div className="admin-section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="form-section-title" style={{ margin: 0 }}>管理員操作日誌</h3>
        {isSuper && (
          <button 
            onClick={handleClearLogs}
            className="delete-btn"
            style={{ 
              padding: '0.5rem 1.2rem', 
              fontSize: '0.85rem', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            清除所有日誌
          </button>
        )}
      </div>
      <table className="submissions-table">
        <thead>
          <tr>
            {header.map((h: any, i: number) => <th key={i}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell: any, j: number) => (
                <td key={j}>
                  {j === 0 && cell 
                    ? formatFullDateTime(cell) 
                    : (j === 1 ? (
                        <span style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          background: getLogTypeColor(cell),
                          color: 'white'
                        }}>{cell}</span>
                      ) : (j === 2 ? (
                        <strong style={{ color: 'var(--primary-color)' }}>{cell}</strong>
                      ) : cell))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

const getLogTypeColor = (type: string) => {
  switch (type) {
    case '新增場次': return '#27ae60';
    case '修改場次': return '#2980b9';
    case '刪除場次': return '#c0392b';
    case '審核付款': return '#f39c12';
    case '修改報名': return '#8e44ad';
    case '刪除報名': return '#d35400';
    default: return '#7f8c8d';
  }
};

export default LogsTable;
