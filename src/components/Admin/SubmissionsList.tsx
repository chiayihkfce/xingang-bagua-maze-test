import React from 'react';
import DatePicker from 'react-datepicker';

import { useAppContext } from '../../context/AppContext';

const SubmissionsList: React.FC = () => {
  const {
    totalRows,
    handleDownloadExcel,
    handleImportExcel,
    handlePrintCheckInSheet,
    setShowRecycleBin,
    adminFilterDate,
    handleDateFilter,
    adminSearchKeyword,
    setAdminSearchKeyword,
    showColumnFilter,
    setShowShowColumnFilter,
    submissions,
    visibleColumns,
    toggleColumn,
    currentPage,
    isDataLoading,
    loadPage,
    handleSort,
    sortConfig,
    setAuditTarget,
    setShowAuditModal,
    startEditSubmission,
    handleDeleteSubmission,
    formatFullDateTime,
    selectedIds,
    setSelectedIds,
    handleBatchVerifyPayment,
    handleBatchDelete
  } = useAppContext();

  const toggleSelectAll = () => {
    if (selectedIds.length === submissions.length - 1) {
      setSelectedIds([]);
    } else {
      setSelectedIds(submissions.slice(1).map((row) => row[16]));
    }
  };

  const toggleSelect = (docId: string) => {
    if (selectedIds.includes(docId)) {
      setSelectedIds(selectedIds.filter((id) => id !== docId));
    } else {
      setSelectedIds([...selectedIds, docId]);
    }
  };

  return (
    <section className="admin-section form-card submissions-table-container">
      <div className="admin-section-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 className="form-section-title" style={{ margin: 0 }}>
            報名清單 (共 {totalRows} 筆)
          </h3>

          <div
            className="admin-filter-bar"
            style={{ gap: '0.8rem', flexWrap: 'wrap' }}
          >
            {/* 批次操作區 */}
            {selectedIds.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  padding: '0.2rem 1rem',
                  background: 'rgba(243, 156, 18, 0.1)',
                  borderRadius: '10px',
                  alignItems: 'center',
                  border: '1px solid #f39c12'
                }}
              >
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: '#f39c12',
                    fontWeight: 'bold'
                  }}
                >
                  已選取 {selectedIds.length} 筆：
                </span>
                <button
                  onClick={handleBatchVerifyPayment}
                  className="edit-btn"
                  style={{
                    background: '#27ae60',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.8rem',
                    height: 'auto',
                    width: 'auto',
                    margin: 0
                  }}
                >
                  批次通過
                </button>
                <button
                  onClick={handleBatchDelete}
                  className="delete-btn"
                  style={{
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.8rem',
                    height: 'auto',
                    width: 'auto',
                    margin: 0
                  }}
                >
                  批次刪除
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="edit-btn"
                  style={{
                    background: 'var(--input-border)',
                    color: 'var(--text-light)',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.8rem',
                    height: 'auto',
                    width: 'auto',
                    margin: 0
                  }}
                >
                  取消選取
                </button>
              </div>
            )}

            <button
              onClick={handlePrintCheckInSheet}
              className="submit-btn"
              title="列印今日簽到表"
              style={{
                background: '#8e44ad',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                height: '40px',
                width: '130px',
                border: 'none',
                margin: 0
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              列印今日
            </button>

            <button
              onClick={handleDownloadExcel}
              className="submit-btn"
              title="下載 Excel 檔案"
              style={{
                background: '#27ae60',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                height: '40px',
                width: '130px',
                border: 'none',
                margin: 0
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              下載 Excel
            </button>

            <label
              className="submit-btn"
              title="匯入 Excel 舊資料"
              style={{
                background: '#3498db',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                height: '40px',
                width: '130px',
                border: 'none',
                margin: 0,
                color: 'white'
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              匯入舊資料
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleImportExcel}
                style={{ display: 'none' }}
              />
            </label>

            <button
              onClick={() => {
                setShowRecycleBin(true);
              }}
              className="submit-btn"
              title="查看回收桶"
              style={{
                background: '#e67e22',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                height: '40px',
                width: '130px',
                border: 'none',
                margin: 0
              }}
            >
              <svg
                width="18"
                height="18"
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
              回收桶
            </button>

            <div
              style={{
                width: '1px',
                height: '24px',
                background: 'var(--input-border)',
                margin: '0 0.5rem'
              }}
            ></div>

            {/* 統一風格的日期搜尋框 */}
            <div className="filter-input-wrapper" style={{ maxWidth: '250px' }}>
              <div className="filter-icon">
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <DatePicker
                selected={adminFilterDate}
                onChange={(date: Date | null) => handleDateFilter(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="依日期篩選..."
                className="date-picker-input"
                isClearable={false}
              />
              {adminFilterDate && (
                <button
                  onClick={() => handleDateFilter(null)}
                  className="filter-clear-btn"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ff4d4f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </button>
              )}
            </div>

            {/* 統一風格的關鍵字搜尋框 */}
            <div className="filter-input-wrapper" style={{ maxWidth: '250px' }}>
              <div className="filter-icon">
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
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜尋姓名、電話或 Email..."
                value={adminSearchKeyword}
                onChange={(e) => setAdminSearchKeyword(e.target.value)}
              />
              {adminSearchKeyword && (
                <button
                  onClick={() => setAdminSearchKeyword('')}
                  className="filter-clear-btn"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ff4d4f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </button>
              )}
            </div>

            <div
              className="column-filter-container"
              style={{ position: 'relative', marginLeft: 'auto' }}
            >
              <button
                onClick={() => setShowShowColumnFilter(!showColumnFilter)}
                className="edit-btn icon-btn"
                title="顯示欄位設定"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--input-border)',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--primary-gold)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </button>
              {showColumnFilter && (
                <div
                  className="column-filter-dropdown"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    zIndex: 100,
                    background: 'var(--card-bg)',
                    border: '1px solid var(--input-border)',
                    borderRadius: '8px',
                    padding: '1rem',
                    width: '180px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    marginTop: '0.5rem'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}
                  >
                    {submissions[0]?.map((h: any, i: number) => (
                      <label
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          color: 'var(--text-light)'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(i)}
                          onChange={() => toggleColumn(i)}
                        />
                        {h}
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowShowColumnFilter(false)}
                    className="submit-btn icon-btn"
                    title="關閉選單"
                    style={{
                      width: '100%',
                      marginTop: '1rem',
                      padding: '0.4rem',
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {!adminFilterDate && (
          <div className="pagination">
            <button
              onClick={() => loadPage(currentPage - 1)}
              disabled={currentPage === 1 || isDataLoading}
            >
              上一頁
            </button>
            <span className="copy" style={{ color: 'var(--primary-gold)' }}>
              第 {currentPage} 頁 / 共 {Math.ceil(totalRows / 50)} 頁
            </span>
            <button
              onClick={() => loadPage(currentPage + 1)}
              disabled={
                currentPage >= Math.ceil(totalRows / 50) || isDataLoading
              }
            >
              下一頁
            </button>
          </div>
        )}
      </div>
      <table className="submissions-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}>
              <input
                type="checkbox"
                checked={
                  selectedIds.length > 0 &&
                  selectedIds.length === submissions.length - 1
                }
                onChange={toggleSelectAll}
                title="全選"
              />
            </th>
            <th>操作</th>
            {submissions[0]?.map(
              (h: any, i: number) =>
                visibleColumns.includes(i) && (
                  <th key={i}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {h}
                      <button
                        className={`sort-btn ${sortConfig?.key === i ? 'active' : ''}`}
                        onClick={() => handleSort(i)}
                        title="點擊排序"
                      >
                        {sortConfig?.key === i
                          ? sortConfig.direction === 'asc'
                            ? '▲'
                            : '▼'
                          : '↕'}
                      </button>
                    </div>
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody>
          {submissions.slice(1).map((row, i) => (
            <tr
              key={row[16] || i}
              className={selectedIds.includes(row[16]) ? 'selected-row' : ''}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(row[16])}
                  onChange={() => toggleSelect(row[16])}
                />
              </td>
              <td className="action-cell">
                <button
                  onClick={() => {
                    setAuditTarget({ index: i + 1, row });
                    setShowAuditModal(true);
                  }}
                  className="edit-btn"
                  style={{ background: '#f39c12', color: 'white' }}
                >
                  審核
                </button>
                <button
                  onClick={() => startEditSubmission(row, i + 1)}
                  className="edit-btn"
                >
                  修改
                </button>
                <button
                  onClick={() => handleDeleteSubmission(i + 1)}
                  className="delete-btn"
                >
                  刪除
                </button>
              </td>
              {row.map(
                (cell: any, j: number) =>
                  visibleColumns.includes(j) && (
                    <td key={j}>
                      {j === 0 && cell ? (
                        formatFullDateTime(cell)
                      ) : j === 1 ? (
                        <span
                          style={{
                            padding: '0.3rem 0.8rem',
                            borderRadius: '50px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            background:
                              cell === '通過'
                                ? 'rgba(39, 174, 96, 0.2)'
                                : 'rgba(255, 255, 255, 0.1)',
                            color: cell === '通過' ? '#2ecc71' : '#bbb'
                          }}
                        >
                          {cell || '待審核'}
                        </span>
                      ) : j === 15 ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            justifyContent: 'center'
                          }}
                        >
                          <span style={{ fontSize: '0.85rem' }}>{cell}</span>
                          {row[18] === true && (
                            <span
                              title="系統已自動發送證書"
                              style={{
                                background: '#27ae60',
                                color: 'white',
                                fontSize: '10px',
                                padding: '1px 5px',
                                borderRadius: '4px',
                                fontWeight: 'bold'
                              }}
                            >
                              已發證
                            </span>
                          )}
                        </div>
                      ) : (
                        cell
                      )}
                    </td>
                  )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default SubmissionsList;
