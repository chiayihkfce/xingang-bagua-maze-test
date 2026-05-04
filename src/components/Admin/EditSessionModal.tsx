import React from 'react';
import DatePicker from 'react-datepicker';

interface EditSessionModalProps {
  isEditingSession: boolean;
  setIsEditingSession: (editing: boolean) => void;
  editingSession: any;
  setEditingSession: (session: any) => void;
  handleUpdateSession: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  generalTimeSlots: string[];
  specialTimeSlots: string[];
  toggleFixedTime: (time: string, isEdit: boolean) => void;
}

const EditSessionModal: React.FC<EditSessionModalProps> = ({
  isEditingSession,
  setIsEditingSession,
  editingSession,
  setEditingSession,
  handleUpdateSession,
  isSubmitting,
  generalTimeSlots,
  specialTimeSlots,
  toggleFixedTime
}) => {
  if (!isEditingSession) return null;

  // 內部 ToggleSwitch 組件 (與 SessionManagement 保持一致)
  const ToggleSwitch = ({ checked, onChange, disabled }: { checked: boolean, onChange: () => void, disabled?: boolean }) => (
    <label className="switch" style={{
      position: 'relative',
      display: 'inline-block',
      width: '46px',
      height: '24px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1
    }}>
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange} 
        disabled={disabled}
        style={{ opacity: 0, width: 0, height: 0 }} 
      />
      <span className="slider" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: checked ? 'var(--accent-orange, #e67e22)' : '#444',
        transition: '.3s',
        borderRadius: '24px',
        boxShadow: checked ? '0 0 8px rgba(230, 126, 34, 0.4)' : 'none'
      }}>
        <span style={{
          position: 'absolute',
          content: '""',
          height: '18px',
          width: '18px',
          left: checked ? '24px' : '4px',
          bottom: '3px',
          backgroundColor: 'white',
          transition: '.3s',
          borderRadius: '50%',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}></span>
      </span>
    </label>
  );

  return (
    <div className="modal-overlay">
      <div
        className="modal-content form-card"
        style={{ maxWidth: '500px', width: '95%' }}
      >
        <div
          className="modal-header"
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <h2 className="form-section-title" style={{ margin: 0 }}>
            修改場次資訊
          </h2>
        </div>

        <div
          className="modal-body"
          style={{ padding: '2rem', overflowY: 'auto' }}
        >
          <form onSubmit={handleUpdateSession}>
            <div className="form-group">
              <label>場次名稱</label>
              <input
                type="text"
                value={editingSession.newName}
                onChange={(e) =>
                  setEditingSession({
                    ...editingSession,
                    newName: e.target.value
                  })
                }
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-group">
              <label>價格</label>
              <input
                type="number"
                value={editingSession.newPrice}
                onChange={(e) =>
                  setEditingSession({
                    ...editingSession,
                    newPrice: e.target.value
                  })
                }
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-group">
              <label>前台顯示狀態</label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                height: '42px',
                width: 'fit-content'
              }}>
                <ToggleSwitch 
                  checked={editingSession.enabled} 
                  onChange={() => setEditingSession({ ...editingSession, enabled: !editingSession.enabled })} 
                />
              </div>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>場次分組 (決定儲存分頁) *</label>
              <select
                value={editingSession.isSpecial ? 'special' : 'general'}
                onChange={(e) =>
                  setEditingSession({
                    ...editingSession,
                    isSpecial: e.target.value === 'special'
                  })
                }
                style={{ width: '100%' }}
              >
                <option value="general">📅 一般預約場次</option>
                <option value="special">✨ 固定特別場次</option>
              </select>
            </div>
            {editingSession.isSpecial && (
              <div className="form-group">
                <label>固定日期 (特別場專用)</label>
                <DatePicker
                  selected={
                    editingSession.fixedDate
                      ? new Date(editingSession.fixedDate)
                      : null
                  }
                  onChange={(date: Date | null) => {
                    if (date) {
                      const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                      setEditingSession({
                        ...editingSession,
                        fixedDate: formatted
                      });
                    } else {
                      setEditingSession({ ...editingSession, fixedDate: '' });
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
              <label>場次限定時段 (可多選，優先於全域設定)</label>
              <div className="time-slot-grid">
                {(editingSession.isSpecial
                  ? specialTimeSlots
                  : generalTimeSlots
                ).map((t: string) => (
                  <button
                    key={t}
                    type="button"
                    className={`time-slot-btn ${editingSession.fixedTime.split(',').includes(t) ? 'active' : ''}`}
                    onClick={() => toggleFixedTime(t, true)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="modal-actions admin-login-actions">
          <button
            type="button"
            onClick={() => setIsEditingSession(false)}
            className="cancel-btn"
          >
            取消
          </button>
          <button
            type="button"
            onClick={(e: any) => handleUpdateSession(e)}
            className="submit-btn"
            disabled={isSubmitting}
          >
            儲存修改
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSessionModal;
