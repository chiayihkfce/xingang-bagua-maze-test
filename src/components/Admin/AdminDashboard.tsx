import React, { useState } from 'react';
import SessionManagement from './SessionManagement';
import SubmissionsList from './SubmissionsList';
import TimeSlotManagement from './TimeSlotManagement';
import AuditModal from './AuditModal';
import EditSubmissionModal from './EditSubmissionModal';
import EditSessionModal from './EditSessionModal';
import DashboardStats from './DashboardStats';
import AnalyticsCharts from './AnalyticsCharts';
import LogsTable from './LogsTable';
import RecycleBinModal from './RecycleBinModal';
import PaymentManagement from './PaymentManagement';
import AdminSettingsModal from './AdminSettingsModal';
import AdminSecurityAlerts from './AdminSecurityAlerts';
import {
  Session,
  Theme,
  TimeslotConfig,
  DashboardStats as IStats,
  PaymentMethod,
  AdminAccount,
  SealConfig,
  SealType,
  IdentityPricing,
  ClosedDaysConfig
} from '../../types';
import DatePicker from 'react-datepicker';

interface AdminDashboardProps {
  t: any;
  theme: Theme;
  toggleTheme: () => void;
  setIsAdmin: (isAdmin: boolean) => void;
  adminTab:
    | 'sessions'
    | 'submissions'
    | 'timeslots'
    | 'logs'
    | 'payments'
    | 'analytics';
  setAdminTab: (
    tab:
      | 'sessions'
      | 'submissions'
      | 'timeslots'
      | 'logs'
      | 'payments'
      | 'analytics'
  ) => void;
  currentAdmin: AdminAccount | null;
  setCurrentAdmin: (admin: AdminAccount | null) => void;
  sealConfig: SealConfig;
  updateSealConfig: (type: SealType) => Promise<void>;
  identityPricings: IdentityPricing[];
  saveIdentityPricing: (config: Partial<IdentityPricing>) => Promise<void>;
  deleteIdentityPricing: (id: string, name: string) => Promise<void>;
  closedDaysConfig: ClosedDaysConfig;
  saveClosedDaysConfig: (config: ClosedDaysConfig) => Promise<void>;
  dashboardStats: IStats | null;
  logs: any[][];
  deletedSubmissions: any[][];
  showRecycleBin: boolean;
  setShowRecycleBin: (show: boolean) => void;
  handleRestoreSubmission: (index: number) => void;
  sessions: Session[];
  startEditSession: (session: Session) => void;
  handleDeleteSession: (name: string, id?: string) => void;
  toggleSessionEnabled: (session: Session) => void;
  newSession: any;
  setNewSession: (session: any) => void;
  handleAddSession: () => void;
  isSubmitting: boolean;
  toggleFixedTime: (time: string, isEdit: boolean) => void;
  specialTimeSlots: string[];
  totalRows: number;
  handleDownloadExcel: () => void;
  handleImportExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImportSessionsExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  adminFilterDate: Date | null;
  handleDateFilter: (date: Date | null) => void;
  adminSearchKeyword: string;
  setAdminSearchKeyword: (keyword: string) => void;
  showColumnFilter: boolean;
  setShowShowColumnFilter: (show: boolean) => void;
  submissions: any[][];
  visibleColumns: number[];
  toggleColumn: (index: number) => void;
  currentPage: number;
  isDataLoading: boolean;
  loadPage: (page: number) => void;
  handleSort: (index: number) => void;
  sortConfig: { key: number; direction: 'asc' | 'desc' } | null;
  setAuditTarget: (target: any) => void;
  setShowAuditModal: (show: boolean) => void;
  showAuditModal: boolean;
  auditTarget: any;
  handleVerifyPayment: (index: number, status: string) => void;
  startEditSubmission: (row: any[], index: number) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  editData: any;
  setEditData: (data: any) => void;
  handleUpdateSubmission: (e: React.FormEvent) => void;
  handleDeleteSubmission: (index: number) => void;
  isEditingSession: boolean;
  setIsEditingSession: (editing: boolean) => void;
  editingSession: any;
  setEditingSession: (session: any) => void;
  handleUpdateSession: (e: React.FormEvent) => void;
  timeslotConfig: TimeslotConfig;
  setTimeslotConfig: (config: TimeslotConfig) => void;
  generalTimeSlots: string[];
  setGeneralTimeSlots: (slots: string[]) => void;
  setSpecialTimeSlots: (slots: string[]) => void;
  generateTimeSlots: (start: string, end: string, interval: number) => string[];
  newManualTime: string;
  setNewManualTime: (time: string) => void;
  handleManualTimeAdd: (type: 'general' | 'special') => void;
  removeTimeSlot: (type: 'general' | 'special', slot: string) => void;
  saveTimeSlotsConfig: (
    type: 'general' | 'special',
    config: TimeslotConfig,
    slots: string[]
  ) => void;
  formatFullDateTime: (date: Date) => string;
  dbStatus: 'connecting' | 'connected' | 'error';
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: PaymentMethod) => void;
  deletePaymentMethod: (method: PaymentMethod) => void;
  handleClearLogs: () => void;
  handleClearRecycleBin: () => void;
  showAlert: (message: string, title?: string, onConfirm?: () => void) => void;
  showConfirm: (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    title?: string
  ) => void;
  dailyHex?: { name: string; tip: string } | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const {
    t,
    theme,
    toggleTheme,
    setIsAdmin,
    adminTab,
    setAdminTab,
    currentAdmin,
    setCurrentAdmin,
    showAuditModal,
    auditTarget,
    setShowAuditModal,
    handleVerifyPayment,
    dashboardStats,
    logs,
    deletedSubmissions,
    showRecycleBin,
    setShowRecycleBin,
    handleRestoreSubmission,
    isEditing,
    setIsEditing,
    editData,
    setEditData,
    handleUpdateSubmission,
    sessions,
    isSubmitting,
    isEditingSession,
    setIsEditingSession,
    editingSession,
    setEditingSession,
    handleUpdateSession,
    generalTimeSlots,
    specialTimeSlots,
    toggleFixedTime,
    paymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
    handleClearLogs,
    handleClearRecycleBin,
    showAlert,
    showConfirm,
    dailyHex
  } = props;

  const [showSettings, setShowSettings] = useState(false);

  // 安全性偵測：提醒使用預設 admin 關鍵字帳密格式的管理員修改帳號密碼
  React.useEffect(() => {
    if (currentAdmin) {
      const username = currentAdmin.username.toLowerCase();
      const password = (currentAdmin as any).password?.toLowerCase() || '';

      // 偵測帳號或密碼是否包含預設 admin 關鍵字 (例如 admin, admin2, admin3...)
      if (username.includes('admin') || password.includes('admin')) {
        const displayName = currentAdmin.nickname || currentAdmin.username;
        showAlert(
          `偵測到帳號「${displayName}」仍在使用預設的帳號或密碼格式。\n\n為了確保系統安全，請立即點擊右上方姓名處展開「系統設定」，修改您的管理員帳號與密碼。\n\n※ 注意：請勿將一組帳號供多人共用。`,
          '⚠️ 安全性提醒'
        );
      }
    }
  }, [currentAdmin?.id]);

  return (
    <div className="container admin-dashboard">
      <AdminSettingsModal
        show={showSettings}
        setShow={setShowSettings}
        currentAdmin={currentAdmin}
        setCurrentAdmin={setCurrentAdmin}
        sealConfig={props.sealConfig}
        updateSealConfig={props.updateSealConfig}
        identityPricings={props.identityPricings}
        saveIdentityPricing={props.saveIdentityPricing}
        deleteIdentityPricing={props.deleteIdentityPricing}
        closedDaysConfig={props.closedDaysConfig}
        saveClosedDaysConfig={props.saveClosedDaysConfig}
        showAlert={showAlert}
        showConfirm={showConfirm}
      />
      <RecycleBinModal
        show={showRecycleBin}
        setShow={setShowRecycleBin}
        deletedSubmissions={deletedSubmissions}
        handleRestore={handleRestoreSubmission}
        formatFullDateTime={props.formatFullDateTime}
        isSubmitting={isSubmitting}
        handleClearRecycleBin={handleClearRecycleBin}
        currentAdmin={currentAdmin}
      />

      <AuditModal
        showAuditModal={showAuditModal}
        auditTarget={auditTarget}
        setShowAuditModal={setShowAuditModal}
        handleVerifyPayment={handleVerifyPayment}
      />

      <EditSubmissionModal
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editData={editData}
        setEditData={setEditData}
        handleUpdateSubmission={handleUpdateSubmission}
        sessions={sessions}
        paymentMethods={paymentMethods}
        isSubmitting={isSubmitting}
      />

      <EditSessionModal
        isEditingSession={isEditingSession}
        setIsEditingSession={setIsEditingSession}
        editingSession={editingSession}
        setEditingSession={setEditingSession}
        handleUpdateSession={handleUpdateSession}
        isSubmitting={isSubmitting}
        generalTimeSlots={generalTimeSlots}
        specialTimeSlots={specialTimeSlots}
        toggleFixedTime={toggleFixedTime}
      />

      <header className="header">
        <div
          className="lang-switcher"
          style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          <div
            className="admin-profile-trigger"
            onClick={() => setShowSettings(true)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--primary-gold)'
            }}
          >
            <div
              className="admin-avatar"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--primary-gold)',
                color: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.8rem'
              }}
            >
              {(currentAdmin?.nickname || currentAdmin?.username || 'A')
                .charAt(0)
                .toUpperCase()}
            </div>
            <span style={{ fontWeight: 'bold' }}>
              {currentAdmin?.nickname || currentAdmin?.username}
            </span>
          </div>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={t.themeToggle}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <h1>管理後台</h1>
          {dailyHex && (
            <div
              className="daily-hexagram-badge"
              title={dailyHex.tip}
              style={{
                fontSize: '0.85rem',
                color: 'var(--primary-gold)',
                marginTop: '-5px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'help'
              }}
            >
              <span>☯ 每日一卦：</span>
              <strong style={{ letterSpacing: '2px' }}>{dailyHex.name}</strong>
              <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>
                ({dailyHex.tip})
              </span>
            </div>
          )}
        </div>
        <div className="admin-nav">
          <button
            onClick={() => setAdminTab('sessions')}
            className={adminTab === 'sessions' ? 'active' : ''}
          >
            場次管理
          </button>
          <button
            onClick={() => setAdminTab('timeslots')}
            className={adminTab === 'timeslots' ? 'active' : ''}
          >
            時間段管理
          </button>
          <button
            onClick={() => setAdminTab('submissions')}
            className={adminTab === 'submissions' ? 'active' : ''}
          >
            報名清單
          </button>
          <button
            onClick={() => setAdminTab('logs')}
            className={adminTab === 'logs' ? 'active' : ''}
          >
            操作日誌
          </button>
          <button
            onClick={() => setAdminTab('payments')}
            className={adminTab === 'payments' ? 'active' : ''}
          >
            付款方式
          </button>
          <button
            onClick={() => setAdminTab('analytics')}
            className={adminTab === 'analytics' ? 'active' : ''}
          >
            數據分析
          </button>
          <button onClick={() => setIsAdmin(false)}>登出後台</button>
        </div>
      </header>

      {currentAdmin && (
        <AdminSecurityAlerts
          currentAdmin={currentAdmin}
          setShowSettings={setShowSettings}
        />
      )}

      <DashboardStats stats={dashboardStats} />

      {adminTab === 'sessions' ? (
        <SessionManagement {...props} DatePicker={DatePicker} />
      ) : adminTab === 'submissions' ? (
        <SubmissionsList />
      ) : adminTab === 'logs' ? (
        <LogsTable
          logs={logs}
          handleClearLogs={handleClearLogs}
          currentAdmin={currentAdmin}
        />
      ) : adminTab === 'payments' ? (
        <PaymentManagement
          paymentMethods={paymentMethods}
          addPaymentMethod={addPaymentMethod}
          deletePaymentMethod={deletePaymentMethod}
          isSubmitting={isSubmitting}
        />
      ) : adminTab === 'analytics' ? (
        <AnalyticsCharts submissions={props.submissions} />
      ) : (
        <TimeSlotManagement {...props} />
      )}
    </div>
  );
};

export default AdminDashboard;
