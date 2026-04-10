import React from 'react';

interface AdminLoginProps {
  t: any;
  showAdminLogin: boolean;
  setShowAdminLogin: (show: boolean) => void;
  adminUser: string;
  setAdminUser: (user: string) => void;
  adminPassword: string;
  setAdminPassword: (pw: string) => void;
  handleAdminLogin: (e: React.FormEvent) => void;
  isDataLoading: boolean;
}

const AdminLogin: React.FC<AdminLoginProps> = ({
  t,
  showAdminLogin,
  setShowAdminLogin,
  adminUser,
  setAdminUser,
  adminPassword,
  setAdminPassword,
  handleAdminLogin,
  isDataLoading
}) => {
  if (!showAdminLogin) return null;

  return (
    <div className="modal-overlay">
      <div className="admin-login-modal form-card">
        <h2 className="form-section-title admin-login-title">{t.adminLogin}</h2>
        <form onSubmit={handleAdminLogin}>
          <div className="form-group">
            <label style={{ textAlign: 'left', display: 'block', marginBottom: '0.5rem' }}>帳號</label>
            <input 
              type="text" 
              placeholder="請輸入管理帳號" 
              value={adminUser} 
              onChange={e => setAdminUser(e.target.value)} 
              autoFocus 
              autoComplete="username"
              style={{ marginBottom: '1.5rem' }}
            />
          </div>
          <div className="form-group">
            <label style={{ textAlign: 'left', display: 'block', marginBottom: '0.5rem' }}>密碼</label>
            <input 
              type="password" 
              placeholder={t.passwordPlaceholder} 
              value={adminPassword} 
              onChange={e => setAdminPassword(e.target.value)} 
              autoComplete="current-password"
            />
          </div>
          
          {isDataLoading && <div className="loading-overlay">{t.loadingData}</div>}
          
          <div className="modal-actions admin-login-actions">
            <button type="button" onClick={() => setShowAdminLogin(false)} className="cancel-btn">
              {t.cancel}
            </button>
            <button type="submit" className="submit-btn" disabled={isDataLoading}>
              {isDataLoading ? t.verifying : t.login}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
