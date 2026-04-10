import React from 'react';

interface SystemModalProps {
  show: boolean;
  type: 'alert' | 'confirm';
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const SystemModal: React.FC<SystemModalProps> = ({
  show,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = '確定',
  cancelText = '取消'
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: '450px', width: '90%' }}>
        <div className="modal-header">
          <h2 style={{ 
            margin: 0, 
            color: 'var(--primary-gold)', 
            fontSize: '1.3rem',
            textAlign: 'center',
            width: '100%'
          }}>{title}</h2>
        </div>
        
        <div className="modal-body" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ 
            fontSize: '1.1rem', 
            lineHeight: '1.6', 
            color: 'var(--text-light)',
            whiteSpace: 'pre-wrap',
            margin: 0
          }}>{message}</p>
        </div>

        <div className="modal-actions">
          {type === 'confirm' && (
            <button 
              className="cancel-btn" 
              onClick={onCancel}
              style={{ flex: 1 }}
            >
              {cancelText}
            </button>
          )}
          <button 
            className="submit-btn" 
            onClick={onConfirm}
            style={{ flex: 1 }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemModal;
