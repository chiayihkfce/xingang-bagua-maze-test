import React, { useState } from 'react';
import { PaymentMethod } from '../../types';

interface PaymentManagementProps {
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: PaymentMethod) => void;
  deletePaymentMethod: (method: PaymentMethod) => void;
  isSubmitting: boolean;
}

const PaymentManagement: React.FC<PaymentManagementProps> = ({
  paymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  isSubmitting
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<PaymentMethod>>({
    name: '',
    type: 'bank',
    bankName: '',
    accountNumber: '',
    accountName: '',
    link: '',
    instructions: ''
  });

  const startEdit = (method: PaymentMethod) => {
    setFormData(method);
    setEditingId(method.id);
    setIsEditing(true);
    // 捲動到表單位置
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setFormData({
      name: '',
      type: 'bank',
      bankName: '',
      accountNumber: '',
      accountName: '',
      link: '',
      instructions: ''
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const handleConfirm = () => {
    if (!formData.name) return;
    // 如果是編輯，addPaymentMethod 會在 App.tsx 處理覆蓋邏輯（我待會會更新 App.tsx）
    addPaymentMethod({
      ...(formData as PaymentMethod),
      id: isEditing && editingId ? editingId : Date.now().toString()
    });
    cancelEdit();
  };

  return (
    <section className="admin-section form-card">
      <h3 className="form-section-title">現有付款方式管理</h3>
      <div className="session-list" style={{ marginBottom: '2rem' }}>
        {paymentMethods.map((m) => (
          <div
            key={m.id}
            className="session-item"
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '1.2rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <strong
                style={{ color: 'var(--primary-gold)', fontSize: '1.1rem' }}
              >
                {m.name}
              </strong>
              <div className="action-cell">
                <button onClick={() => startEdit(m)} className="edit-btn">
                  修改
                </button>
                <button
                  onClick={() => deletePaymentMethod(m)}
                  className="delete-btn"
                  disabled={isSubmitting}
                >
                  刪除
                </button>
              </div>
            </div>

            <div
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.03)',
                padding: '8px',
                borderRadius: '4px',
                width: '100%'
              }}
            >
              <div>
                類型:{' '}
                {m.type === 'bank'
                  ? '銀行轉帳'
                  : m.type === 'linepay'
                    ? '電子支付'
                    : m.type === 'inPerson'
                      ? '現金支付'
                      : '其他'}
              </div>
              {m.type === 'bank' && (
                <div>
                  資訊: {m.bankName} / {m.accountNumber} / {m.accountName}
                </div>
              )}
              {m.type === 'linepay' && (
                <div
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                    display: 'block'
                  }}
                  title={m.link}
                >
                  連結: {m.link}
                </div>
              )}
              {m.instructions && (
                <div style={{ fontStyle: 'italic' }}>
                  備註: {m.instructions}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        id="payment-form"
        className="add-session-form"
        style={{
          borderTop: '2px solid var(--primary-gold)',
          paddingTop: '1.5rem',
          marginTop: '2rem'
        }}
      >
        <h3
          className="form-section-title"
          style={{ color: isEditing ? 'var(--primary-gold)' : 'inherit' }}
        >
          {isEditing ? '📝 正在修改付款方式' : '➕ 新增詳細付款方式'}
        </h3>

        <div className="form-group">
          <label>顯示名稱 (如：台新銀行轉帳 / 電子支付)</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="請輸入名稱"
          />
        </div>

        <div className="form-group">
          <label>類型</label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as any })
            }
          >
            <option value="bank">銀行轉帳 (含帳號資訊)</option>
            <option value="linepay">電子支付 (含跳轉連結)</option>
            <option value="inPerson">現金支付</option>
            <option value="other">其他說明</option>
          </select>
        </div>

        {formData.type === 'bank' && (
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid var(--input-border)'
            }}
          >
            <div className="form-group">
              <label>銀行名稱與代碼</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) =>
                  setFormData({ ...formData, bankName: e.target.value })
                }
                placeholder="例如：新港郵局 (700)"
              />
            </div>
            <div className="form-group">
              <label>帳號</label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>戶名</label>
              <input
                type="text"
                value={formData.accountName}
                onChange={(e) =>
                  setFormData({ ...formData, accountName: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {formData.type === 'linepay' && (
          <div className="form-group">
            <label>電子支付連結 (URL)</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              placeholder="https://..."
            />
          </div>
        )}

        <div className="form-group">
          <label>額外備註或操作說明 (會顯示在前台)</label>
          <textarea
            value={formData.instructions}
            onChange={(e) =>
              setFormData({ ...formData, instructions: e.target.value })
            }
            rows={3}
            placeholder="例如：請於三天內完成匯款..."
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {isEditing && (
            <button
              onClick={cancelEdit}
              className="cancel-btn"
              style={{ flex: 1 }}
            >
              取消修改
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || !formData.name}
            className="submit-btn"
            style={{ flex: 2 }}
          >
            {isEditing ? '儲存修改內容' : '確認新增付款方式'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default PaymentManagement;
