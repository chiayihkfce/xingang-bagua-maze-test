import React, { useState } from 'react';
import { AdminAccount } from '../../types';

interface LogsTableProps {
  logs: any[][];
  formatFullDateTime: (date: Date) => string;
  handleClearLogs: () => void;
  currentAdmin: AdminAccount | null;
}

const LogsTable: React.FC<LogsTableProps> = ({ logs, formatFullDateTime, handleClearLogs, currentAdmin }) => {
  const isSuper = currentAdmin?.role === 'super';
  
  // 分頁狀態
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage, setLogsPerPage] = useState(20);

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
  const allRows = logs.slice(1);
  
  // 計算分頁資料
  const totalLogs = allRows.length;
  const totalPages = Math.ceil(totalLogs / logsPerPage);
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentRows = allRows.slice(indexOfFirstLog, indexOfLastLog);

  // 切換分頁
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // 切換每頁顯示筆數
  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLogsPerPage(Number(e.target.value));
    setCurrentPage(1); // 回到第一頁
  };

  return (
    <section className="admin-section form-card submissions-table-container">
      <div className="admin-section-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h3 className="form-section-title" style={{ margin: 0 }}>管理員操作日誌</h3>
          <div className="pagination-info" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            顯示 {indexOfFirstLog + 1} - {Math.min(indexOfLastLog, totalLogs)} 筆 / 共 {totalLogs} 筆
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <span>每頁顯示：</span>
            <select 
              value={logsPerPage} 
              onChange={handlePerPageChange}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
            >
              <option value={10}>10 筆</option>
              <option value={20}>20 筆</option>
              <option value={50}>50 筆</option>
              <option value={100}>100 筆</option>
            </select>
          </div>

          {isSuper && (
            <button 
              onClick={handleClearLogs}
              className="delete-btn"
              style={{ 
                padding: '0.5rem 1rem', 
                fontSize: '0.8rem', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              清除日誌
            </button>
          )}
        </div>
      </div>

      <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table className="submissions-table">
          <thead>
            <tr>
              {header.map((h: any, i: number) => <th key={i}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, i) => {
              // 檢查是否需要顯示日期分隔標題
              const currentDate = row[0] ? String(row[0]).split(' ')[0] : '';
              const prevDate = i > 0 && currentRows[i-1][0] ? String(currentRows[i-1][0]).split(' ')[0] : '';
              const showDateHeader = currentDate !== prevDate;

              return (
                <React.Fragment key={i}>
                  {showDateHeader && (
                    <tr className="date-group-header">
                      <td colSpan={header.length} style={{ 
                        background: 'var(--bg-secondary)', 
                        padding: '0.8rem 1.2rem', 
                        fontWeight: 'bold',
                        color: 'var(--primary-color)',
                        fontSize: '0.9rem',
                        borderLeft: '4px solid var(--primary-color)'
                      }}>
                        📅 {currentDate}
                      </td>
                    </tr>
                  )}
                  <tr>
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
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 分頁導覽列 */}
      {totalPages > 1 && (
        <div className="pagination-nav" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '8px', 
          marginTop: '1rem',
          paddingBottom: '1rem'
        }}>
          <button 
            onClick={() => paginate(1)} 
            disabled={currentPage === 1}
            className="pagination-btn"
            style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            «
          </button>
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-btn"
            style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            ‹
          </button>
          
          <span style={{ fontSize: '0.9rem', margin: '0 10px' }}>
            第 <strong>{currentPage}</strong> 頁 / 共 {totalPages} 頁
          </span>

          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
            style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            ›
          </button>
          <button 
            onClick={() => paginate(totalPages)} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
            style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            »
          </button>
        </div>
      )}
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
