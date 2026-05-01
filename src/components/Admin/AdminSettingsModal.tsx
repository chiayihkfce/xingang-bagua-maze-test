import React, { useState, useEffect } from 'react';
import {
  AdminAccount,
  SealConfig,
  SealType,
  IdentityPricing,
  ClosedDaysConfig
} from '../../types';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import SettingsProfileTab from './Settings/SettingsProfileTab';
import SettingsPricingTab from './Settings/SettingsPricingTab';
import SettingsSealTab from './Settings/SettingsSealTab';
import SettingsAdminListTab from './Settings/SettingsAdminListTab';
import SettingsClosedDaysTab from './Settings/SettingsClosedDaysTab';

interface AdminSettingsModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  currentAdmin: AdminAccount | null;
  setCurrentAdmin: (admin: AdminAccount | null) => void;
  sealConfig: SealConfig;
  updateSealConfig: (type: SealType) => Promise<void>;
  identityPricings: IdentityPricing[];
  saveIdentityPricing: (config: Partial<IdentityPricing>) => Promise<void>;
  deleteIdentityPricing: (id: string, name: string) => Promise<void>;
  closedDaysConfig: ClosedDaysConfig;
  saveClosedDaysConfig: (config: ClosedDaysConfig) => Promise<void>;
  showAlert: (message: string, title?: string) => void;
  showConfirm: (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    title?: string
  ) => void;
}

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  show,
  setShow,
  currentAdmin,
  setCurrentAdmin,
  sealConfig,
  updateSealConfig,
  identityPricings,
  saveIdentityPricing,
  deleteIdentityPricing,
  closedDaysConfig,
  saveClosedDaysConfig,
  showAlert,
  showConfirm
}) => {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [activeTab, setActiveTab] = useState<
    'profile' | 'list' | 'seal' | 'pricing' | 'calendar'
  >('profile');

  const fetchAdmins = async () => {
    try {
      const q = query(collection(db, 'admins'), orderBy('username'));
      const snap = await getDocs(q);
      const data = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as AdminAccount
      );
      setAdmins(data);
    } catch (e) {
      console.error('Error fetching admins:', e);
    }
  };

  useEffect(() => {
    if (show && currentAdmin) {
      fetchAdmins();
    }
  }, [show, currentAdmin]);

  if (!show) return null;

  return (
    <div
      className="modal-overlay"
      style={{ zIndex: 1100, backdropFilter: 'blur(8px)' }}
    >
      <div
        className="modal-content admin-settings-modal"
        style={{
          maxWidth: '650px',
          width: '95%',
          position: 'relative',
          background: 'var(--container-bg, #121212)',
          border: '2px solid var(--primary-gold)',
          boxShadow:
            '0 20px 60px rgba(0,0,0,0.8), 0 0 20px rgba(241, 196, 15, 0.1)',
          borderRadius: '16px',
          padding: '0',
          overflow: 'hidden'
        }}
      >
        {/* Header 區域 */}
        <div
          className="modal-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem 2rem',
            background: 'rgba(241, 196, 15, 0.05)',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: "'Noto Serif TC', serif",
              color: 'var(--primary-gold)',
              fontSize: '1.5rem',
              letterSpacing: '1px'
            }}
          >
            系統設定 & 帳號管理
          </h2>
          <button
            className="close-btn"
            onClick={() => setShow(false)}
            style={{
              fontSize: '2.5rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              lineHeight: 0.5,
              padding: '10px',
              transition: 'color 0.3s'
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.color = 'var(--primary-gold)')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.color = 'var(--text-muted)')
            }
          >
            &times;
          </button>
        </div>

        {/* Tab 切換區 */}
        <div
          className="admin-tabs"
          style={{
            display: 'flex',
            gap: '0',
            background: 'rgba(255,255,255,0.02)'
          }}
        >
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            style={{
              flex: 1,
              padding: '1rem',
              background:
                activeTab === 'profile' ? 'rgba(241, 196, 15, 0.1)' : 'none',
              border: 'none',
              borderBottom:
                activeTab === 'profile'
                  ? '3px solid var(--primary-gold)'
                  : '3px solid transparent',
              color:
                activeTab === 'profile'
                  ? 'var(--primary-gold)'
                  : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            👤 個人設定
          </button>
          <button
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
            style={{
              flex: 1,
              padding: '1rem',
              background:
                activeTab === 'list' ? 'rgba(241, 196, 15, 0.1)' : 'none',
              border: 'none',
              borderBottom:
                activeTab === 'list'
                  ? '3px solid var(--primary-gold)'
                  : '3px solid transparent',
              color:
                activeTab === 'list'
                  ? 'var(--primary-gold)'
                  : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            🔑 管理者名單
          </button>
          <button
            className={`tab-btn ${activeTab === 'seal' ? 'active' : ''}`}
            onClick={() => setActiveTab('seal')}
            style={{
              flex: 1,
              padding: '1rem',
              background:
                activeTab === 'seal' ? 'rgba(241, 196, 15, 0.1)' : 'none',
              border: 'none',
              borderBottom:
                activeTab === 'seal'
                  ? '3px solid var(--primary-gold)'
                  : '3px solid transparent',
              color:
                activeTab === 'seal'
                  ? 'var(--primary-gold)'
                  : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            📜 系統官印
          </button>
          <button
            className={`tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
            style={{
              flex: 1,
              padding: '1rem',
              background:
                activeTab === 'pricing' ? 'rgba(241, 196, 15, 0.1)' : 'none',
              border: 'none',
              borderBottom:
                activeTab === 'pricing'
                  ? '3px solid var(--primary-gold)'
                  : '3px solid transparent',
              color:
                activeTab === 'pricing'
                  ? 'var(--primary-gold)'
                  : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            💰 費率
          </button>
          <button
            className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
            style={{
              flex: 1,
              padding: '1rem',
              background:
                activeTab === 'calendar' ? 'rgba(241, 196, 15, 0.1)' : 'none',
              border: 'none',
              borderBottom:
                activeTab === 'calendar'
                  ? '3px solid var(--primary-gold)'
                  : '3px solid transparent',
              color:
                activeTab === 'calendar'
                  ? 'var(--primary-gold)'
                  : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            📅 日期
          </button>
        </div>

        <div
          className="modal-body"
          style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}
        >
          {activeTab === 'profile' && (
            <SettingsProfileTab
              currentAdmin={currentAdmin}
              setCurrentAdmin={setCurrentAdmin}
              showAlert={showAlert}
              fetchAdmins={fetchAdmins}
            />
          )}
          {activeTab === 'list' && (
            <SettingsAdminListTab
              currentAdmin={currentAdmin}
              admins={admins}
              fetchAdmins={fetchAdmins}
              showAlert={showAlert}
              showConfirm={showConfirm}
            />
          )}
          {activeTab === 'seal' && (
            <SettingsSealTab
              sealConfig={sealConfig}
              updateSealConfig={updateSealConfig}
            />
          )}
          {activeTab === 'pricing' && (
            <SettingsPricingTab
              identityPricings={identityPricings}
              saveIdentityPricing={saveIdentityPricing}
              deleteIdentityPricing={deleteIdentityPricing}
              showAlert={showAlert}
            />
          )}
          {activeTab === 'calendar' && (
            <SettingsClosedDaysTab
              closedDaysConfig={closedDaysConfig}
              saveClosedDaysConfig={saveClosedDaysConfig}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModal;
