import React from 'react';
import { Session, PaymentMethod } from '../../types';
import { translations } from '../../locales/translations';

interface EditSubmissionModalProps {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  editData: any;
  setEditData: (data: any) => void;
  handleUpdateSubmission: (e: React.FormEvent) => void;
  sessions: Session[];
  paymentMethods: PaymentMethod[];
  isSubmitting: boolean;
}

const EditSubmissionModal: React.FC<EditSubmissionModalProps> = ({
  isEditing,
  setIsEditing,
  editData,
  setEditData,
  handleUpdateSubmission,
  sessions,
  paymentMethods,
  isSubmitting
}) => {
  if (!isEditing || !editData) return null;

  return (
    <div className="modal-overlay">
      <div
        className="admin-login-modal form-card admin-edit-modal"
        style={{ maxWidth: '800px', width: '95%' }}
      >
        <h2 className="form-section-title">修改報名資料</h2>
        <form onSubmit={handleUpdateSubmission}>
          <div className="edit-form-grid">
            <div className="form-group">
              <label>審核狀態</label>
              <select
                value={editData.status}
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value })
                }
              >
                <option value="待審核">待審核</option>
                <option value="通過">通過</option>
                <option value="不通過">不通過</option>
              </select>
            </div>
            <div className="form-group">
              <label>報到狀態</label>
              <button
                type="button"
                onClick={() =>
                  setEditData({ ...editData, checkedIn: !editData.checkedIn })
                }
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: '6px',
                  background: editData.checkedIn
                    ? '#27ae60'
                    : 'rgba(255,255,255,0.05)',
                  color: editData.checkedIn ? 'white' : '#bbb',
                  border: '1px solid #444',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
              >
                {editData.checkedIn ? '● 已報到' : '○ 未報到 (點擊標記)'}
              </button>
            </div>
            <div className="form-group">
              <label>填表姓名</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>聯絡電話</label>
              <input
                type="text"
                value={editData.phone}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>報名場次</label>
              <select
                value={editData.session}
                onChange={(e) =>
                  setEditData({ ...editData, session: e.target.value })
                }
              >
                {sessions.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>份數</label>
              <input
                type="number"
                value={editData.quantity}
                onChange={(e) =>
                  setEditData({ ...editData, quantity: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>遊玩人數</label>
              <input
                type="text"
                value={editData.players}
                onChange={(e) =>
                  setEditData({ ...editData, players: e.target.value })
                }
              />
            </div>

            {/* 隊員名單編輯 */}
            {editData.playerList && editData.playerList.length > 0 && (
              <div
                className="admin-player-edit-section"
                style={{
                  gridColumn: '1 / -1',
                  background: 'rgba(255,255,255,0.02)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--input-border)'
                }}
              >
                <p
                  style={{
                    color: 'var(--primary-gold)',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                  }}
                >
                  隊員名單編輯 (用於證書發送)
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem'
                  }}
                >
                  {editData.playerList.map((p: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr',
                        gap: '10px',
                        alignItems: 'center'
                      }}
                    >
                      <input
                        type="text"
                        value={p.name}
                        placeholder="姓名"
                        onChange={(e) => {
                          const newList = [...editData.playerList];
                          newList[idx] = {
                            ...newList[idx],
                            name: e.target.value
                          };
                          setEditData({ ...editData, playerList: newList });
                        }}
                      />
                      <input
                        type="email"
                        value={p.email}
                        placeholder="Email"
                        onChange={(e) => {
                          const newList = [...editData.playerList];
                          newList[idx] = {
                            ...newList[idx],
                            email: e.target.value
                          };
                          setEditData({ ...editData, playerList: newList });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label>總金額</label>
              <input
                type="number"
                value={editData.totalAmount}
                onChange={(e) =>
                  setEditData({ ...editData, totalAmount: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>繳費方式</label>
              <select
                value={editData.paymentMethod}
                onChange={(e) =>
                  setEditData({ ...editData, paymentMethod: e.target.value })
                }
              >
                {paymentMethods.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            {editData.paymentMethod === '銀行轉帳/ATM' && (
              <div className="form-group">
                <label>轉帳末五碼 *</label>
                <input
                  type="text"
                  maxLength={5}
                  inputMode="numeric"
                  pattern="\d*"
                  required
                  value={editData.bankLast5}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                    setEditData({ ...editData, bankLast5: val });
                  }}
                />
              </div>
            )}
            <div className="form-group">
              <label>遊玩日期時間</label>
              <input
                type="text"
                value={editData.pickupTime}
                onChange={(e) =>
                  setEditData({ ...editData, pickupTime: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>領取地點</label>
              <select
                value={editData.pickupLocation}
                onChange={(e) =>
                  setEditData({ ...editData, pickupLocation: e.target.value })
                }
              >
                <option value="新港文教基金會(閱讀館)">
                  新港文教基金會(閱讀館)
                </option>
                <option value="培桂堂(建議選此處，此處為解謎起點)">
                  培桂堂
                </option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>如何得知本活動內容?</label>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px 20px',
                  marginTop: '5px',
                  padding: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {translations.zh.referrals.map((option) => {
                  const currentReferrals = Array.isArray(editData.referral)
                    ? editData.referral
                    : typeof editData.referral === 'string'
                      ? editData.referral.split(/[、,]/).map((s: string) => s.trim()).filter(Boolean)
                      : [];

                  const isChecked = currentReferrals.includes(option);

                  return (
                    <label
                      key={option}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: isChecked ? 'var(--primary-gold)' : '#aaa',
                        margin: 0,
                        padding: '2px 0'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          let nextArr = isChecked
                            ? currentReferrals.filter((r: string) => r !== option)
                            : [...currentReferrals, option];

                          // 關鍵修正：確保只保留預定義清單中的選項，自動移除不匹配的舊資料 (如 "親友告知")
                          nextArr = nextArr.filter((r: string) => translations.zh.referrals.includes(r));
                          
                          // 強制轉回字串格式並使用「、」分隔，確保徹底覆蓋 Firebase 中的舊欄位內容
                          setEditData({ ...editData, referral: nextArr.join('、') });
                        }}
                        style={{ 
                          cursor: 'pointer', 
                          width: '16px', 
                          height: '16px',
                          margin: 0,
                          flexShrink: 0,
                          accentColor: 'var(--accent-orange)',
                          display: 'inline-block',
                          appearance: 'auto' // 強制使用瀏覽器原生外觀
                        }}
                      />

                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>備註</label>
              <textarea
                value={editData.notes}
                onChange={(e) =>
                  setEditData({ ...editData, notes: e.target.value })
                }
                rows={2}
              ></textarea>
            </div>
          </div>

          <div className="modal-actions admin-login-actions">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cancel-btn"
            >
              取消
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              儲存修改
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubmissionModal;
