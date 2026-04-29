import React from 'react';
import { Session } from '../../types';

interface SessionManagementProps {
  sessions: Session[];
  startEditSession: (session: Session) => void;
  handleDeleteSession: (name: string, id?: string) => void;
  newSession: any;
  setNewSession: (session: any) => void;
  handleAddSession: () => void;
  handleImportSessionsExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  toggleFixedTime: (time: string, isEdit: boolean) => void;
  generalTimeSlots: string[];
  specialTimeSlots: string[];
  DatePicker: any;
}

const SessionManagement: React.FC<SessionManagementProps> = (props) => {
  const {
    sessions,
    startEditSession,
    handleDeleteSession,
    newSession,
    setNewSession,
    handleAddSession,
    handleImportSessionsExcel,
    isSubmitting,
    toggleFixedTime,
    generalTimeSlots,
    specialTimeSlots,
    DatePicker
  } = props;

  return (
    <section className="admin-section form-card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}
      >
        <h3 className="form-section-title" style={{ margin: 0 }}>
          目前場次管理
        </h3>
        <label
          className="submit-btn"
          title="匯入舊場次"
          style={{
            background: '#3498db',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            height: '32px',
            border: 'none',
            color: 'white'
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          匯入舊場次
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleImportSessionsExcel}
            style={{ display: 'none' }}
          />
        </label>
      </div>
      <div className="session-list">
        {sessions.map((s) => (
          <div key={s.name} className="session-item">
            <span style={{ color: 'var(--text-light)', flex: 1 }}>
              {s.name} - ${s.price}
            </span>
            <div className="action-cell">
              <button onClick={() => startEditSession(s)} className="edit-btn">
                修改
              </button>
              <button
                onClick={() => handleDeleteSession(s.name, (s as any).id)}
                className="delete-btn"
              >
                刪除
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="add-session-form">
        <h3 className="form-section-title">新增場次</h3>
        <div className="edit-form-grid">
          <div className="form-group">
            <label>場次名稱</label>
            <input
              type="text"
              placeholder="例如：5/2(六)市集場"
              value={newSession.name}
              onChange={(e) =>
                setNewSession({ ...newSession, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>價格</label>
            <input
              type="number"
              placeholder="650"
              value={newSession.price}
              onChange={(e) =>
                setNewSession({ ...newSession, price: e.target.value })
              }
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>場次分組 (決定儲存分頁) *</label>
            <select
              value={newSession.isSpecial ? 'special' : 'general'}
              onChange={(e) =>
                setNewSession({
                  ...newSession,
                  isSpecial: e.target.value === 'special'
                })
              }
            >
              <option value="general">
                📅 一般預約場次 (存入「一般場次」分頁)
              </option>
              <option value="special">
                ✨ 固定特別場次 (存入「特別場次」分頁)
              </option>
            </select>
          </div>
          {newSession.isSpecial && (
            <div className="form-group">
              <label>固定日期 (特別場專用)</label>
              <DatePicker
                selected={
                  newSession.fixedDate ? new Date(newSession.fixedDate) : null
                }
                onChange={(date: Date | null) => {
                  if (date) {
                    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                    setNewSession({ ...newSession, fixedDate: formatted });
                  } else {
                    setNewSession({ ...newSession, fixedDate: '' });
                  }
                }}
                dateFormat="yyyy-MM-dd"
                className="date-picker-input"
                placeholderText="點擊選擇日期"
                isClearable
              />
            </div>
          )}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>
              場次限定時段
              (可多選，不選則代表全時段開放，若有勾選則優先以此為準)
            </label>
            <div className="time-slot-grid">
              {(newSession.isSpecial ? specialTimeSlots : generalTimeSlots).map(
                (t: string) => (
                  <button
                    key={t}
                    type="button"
                    className={`time-slot-btn ${newSession.fixedTime.split(',').includes(t) ? 'active' : ''}`}
                    onClick={() => toggleFixedTime(t, false)}
                  >
                    {t}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleAddSession}
          disabled={isSubmitting}
          className="submit-btn"
          style={{ width: '100%', marginTop: '1rem' }}
        >
          確認新增場次
        </button>
      </div>
    </section>
  );
};

export default SessionManagement;
