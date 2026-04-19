import React from 'react';
import CustomCursor from '../components/UI/CustomCursor';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AdminLogin from '../components/Admin/AdminLogin';
import SystemModal from '../components/UI/SystemModal';
import { useAppContext } from '../context/AppContext';

const AdminPage: React.FC = () => {
  const { 
    isAdmin, t, theme, toggleTheme, setIsAdmin, 
    adminTab, setAdminTab, currentAdmin, setCurrentAdmin, dashboardStats, 
    logs, sessions, startEditSession, handleDeleteSession, newSession, 
    setNewSession, handleAddSession, isSubmitting, toggleFixedTime, 
    specialTimeSlots, totalRows, handleDownloadExcel, handleImportExcel, 
    handleImportSessionsExcel, adminFilterDate, handleDateFilter, 
    adminSearchKeyword, setAdminSearchKeyword, showColumnFilter, 
    setShowShowColumnFilter, submissions, visibleColumns, toggleColumn, 
    currentPage, isDataLoading, loadPage, handleSort, sortConfig, 
    setAuditTarget, setShowAuditModal, showAuditModal, auditTarget, 
    handleVerifyPayment, startEditSubmission, isEditing, setIsEditing, 
    editData, setEditData, handleUpdateSubmission, handleDeleteSubmission, 
    isEditingSession, setIsEditingSession, editingSession, setEditingSession, 
    handleUpdateSession, timeslotConfig, setTimeslotConfig, generalTimeSlots, 
    setGeneralTimeSlots, setSpecialTimeSlots, generateTimeSlots, newManualTime, 
    setNewManualTime, handleManualTimeAdd, removeTimeSlot, saveTimeSlotsConfig, 
    formatFullDateTime, deletedSubmissions, showRecycleBin, setShowRecycleBin, 
    handleRestoreSubmission, dbStatus, paymentMethods, addPaymentMethod, 
    deletePaymentMethod, sealConfig, updateSealConfig, handleClearLogs, handleClearRecycleBin, showAlert, 
    showConfirm, sysModal, adminUser, setAdminUser, adminPassword, 
    setAdminPassword, handleAdminLogin, navigate 
  } = useAppContext();

  if (isAdmin) {
    return (
      <>
        <CustomCursor />
        <AdminDashboard 
          {...{ t, theme, toggleTheme, setIsAdmin: (val: boolean) => { setIsAdmin(val); if(!val) navigate('/'); }, adminTab, setAdminTab, currentAdmin, setCurrentAdmin, dashboardStats, logs, sessions, startEditSession, handleDeleteSession, newSession, setNewSession, handleAddSession, isSubmitting, toggleFixedTime, specialTimeSlots, totalRows, handleDownloadExcel, handleImportExcel, handleImportSessionsExcel, adminFilterDate, handleDateFilter, adminSearchKeyword, setAdminSearchKeyword, showColumnFilter, setShowShowColumnFilter, submissions, visibleColumns, toggleColumn, currentPage, isDataLoading, loadPage, handleSort, sortConfig, setAuditTarget, setShowAuditModal, showAuditModal, auditTarget, handleVerifyPayment, startEditSubmission, isEditing, setIsEditing, editData, setEditData, handleUpdateSubmission, handleDeleteSubmission, isEditingSession, setIsEditingSession, editingSession, setEditingSession, handleUpdateSession, timeslotConfig, setTimeslotConfig, generalTimeSlots, setGeneralTimeSlots, setSpecialTimeSlots, generateTimeSlots, newManualTime, setNewManualTime, handleManualTimeAdd, removeTimeSlot, saveTimeSlotsConfig, formatFullDateTime, deletedSubmissions, showRecycleBin, setShowRecycleBin, handleRestoreSubmission, dbStatus, paymentMethods, addPaymentMethod, deletePaymentMethod, handleClearLogs, handleClearRecycleBin, sealConfig, updateSealConfig, showAlert, showConfirm }}
        />
        <SystemModal 
          show={sysModal.show}
          type={sysModal.type}
          title={sysModal.title}
          message={sysModal.message}
          onConfirm={sysModal.onConfirm}
          onCancel={sysModal.onCancel}
          confirmText={sysModal.confirmText}
          cancelText={sysModal.cancelText}
        />
      </>
    );
  }
  
  return (
    <div className="admin-only-page">
      <CustomCursor />
      <AdminLogin {...{ t, showAdminLogin: true, setShowAdminLogin: () => navigate('/'), adminUser, setAdminUser, adminPassword, setAdminPassword, handleAdminLogin, isDataLoading }} />
      <SystemModal 
        show={sysModal.show}
        type={sysModal.type}
        title={sysModal.title}
        message={sysModal.message}
        onConfirm={sysModal.onConfirm}
        onCancel={sysModal.onCancel}
        confirmText={sysModal.confirmText}
        cancelText={sysModal.cancelText}
      />
    </div>
  );
};

export default AdminPage;
