import React from 'react';
import { AdminAccount } from '../../types';

interface AdminSecurityAlertsProps {
  currentAdmin: AdminAccount;
  setShowSettings: (show: boolean) => void;
}

const AdminSecurityAlerts: React.FC<AdminSecurityAlertsProps> = ({
  currentAdmin,
  setShowSettings
}) => {
  const needsPasswordChange =
    currentAdmin.username.toLowerCase().includes('admin') ||
    (currentAdmin.password &&
      currentAdmin.password.toLowerCase().includes('admin'));

  const needsLineBinding = !currentAdmin.lineUid;

  if (!needsPasswordChange && !needsLineBinding) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2rem'
      }}
    >
      {/* 1. 帳號密碼重大安全隱患 (紅色) */}
      {needsPasswordChange && (
        <div
          style={{
            background: 'rgba(231, 76, 60, 0.1)',
            border: '1px solid #e74c3c',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>🚨</span>
            <div>
              <h4 style={{ margin: 0, color: '#e74c3c', fontSize: '1rem' }}>
                重大安全隱患：帳號或密碼未修改
              </h4>
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '0.85rem',
                  color: 'var(--text-light)'
                }}
              >
                偵測到您的帳號或密碼仍在使用預設關鍵字
                (admin)，這存在極大安全風險，請立即修改。
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              background: '#e74c3c',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            ✏️ 前往個人設定
          </button>
        </div>
      )}

      {/* 2. LINE ID 缺失警告 (黃色) */}
      {needsLineBinding && (
        <div
          style={{
            background: 'rgba(241, 196, 15, 0.1)',
            border: '1px solid var(--primary-gold)',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>💬</span>
            <div>
              <h4
                style={{
                  margin: 0,
                  color: 'var(--primary-gold)',
                  fontSize: '1rem'
                }}
              >
                功能提醒：未綁定 LINE ID
              </h4>
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '0.85rem',
                  color: 'var(--text-light)'
                }}
              >
                您的帳號尚未綁定 LINE ID，將無法使用「一鍵登入」功能。
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              background: 'var(--primary-gold)',
              color: '#000',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            ⚙️ 前往綁定
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSecurityAlerts;
