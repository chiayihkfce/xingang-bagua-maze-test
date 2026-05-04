import { useState } from 'react';
import { FormData, ClosedDaysConfig } from '../types';

/**
 * 集中管理應用程式的所有基礎資料狀態
 */
export const useAppState = () => {
  // ... (其他狀態)
  const [closedDaysConfig, setClosedDaysConfig] = useState<ClosedDaysConfig>({
    mode: 'custom',
    excludeWeekends: false,
    excludeHolidays: true,
    manualClosedDates: [],
    holidayDates: [
      '2026-01-01',
      '2026-02-16',
      '2026-02-17',
      '2026-02-18',
      '2026-02-19',
      '2026-02-20',
      '2026-02-21',
      '2026-02-28',
      '2026-04-03',
      '2026-04-04',
      '2026-05-01',
      '2026-06-19',
      '2026-09-25',
      '2026-10-09',
      '2026-10-10'
    ]
  });

  // 1. 報名相關狀態
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmissionId, setLastSubmissionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadTime] = useState(() => Date.now());
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  // 2. 表單資料狀態
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    countryCode: '+886',
    phone: '',
    contactEmail: '',
    session: '',
    quantity: '1',
    players: '1',
    playerList: [{ name: '', email: '' }], // 新增：預設初始化一位玩家
    totalAmount: '',
    paymentMethod: '現金支付',
    bankLast5: '',
    pickupTime: '',
    pickupLocation: '新港文教基金會(閱讀館)',
    referral: ['基金會FB'] as string[],
    notes: '',
    hp_field: '',
    identityType: '一般民眾'
  });

  // 3. 管理員相關狀態
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [editingSession, setEditingSession] = useState({
    id: '',
    oldName: '',
    newName: '',
    newPrice: '',
    fixedDate: '',
    fixedTime: '',
    isSpecial: false,
    enabled: true
  });
  const [adminTab, setAdminTab] = useState<
    'sessions' | 'submissions' | 'timeslots' | 'logs' | 'payments' | 'analytics'
  >('sessions');
  const [newSession, setNewSession] = useState({
    name: '',
    price: '',
    fixedDate: '',
    fixedTime: '',
    isSpecial: false,
    enabled: true
  });
  const [adminFilterDate, setAdminFilterDate] = useState<Date | null>(null);
  const [adminSearchKeyword, setAdminSearchKeyword] = useState('');
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditTarget, setAuditTarget] = useState<{
    index: number;
    row: any[];
  } | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: number;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<number[]>(() => {
    const saved = localStorage.getItem('visibleColumns');
    return saved ? JSON.parse(saved) : [];
  });
  const [showColumnFilter, setShowShowColumnFilter] = useState(false);
  const [newManualTime, setNewManualTime] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 4. 隱藏道具狀態 (實作 localStorage 持久化)
  const [hasFlashlight, setHasFlashlight] = useState(() => 
    localStorage.getItem('hasFlashlight') === 'true'
  );
  const [hasPoetrySlip, setHasPoetrySlip] = useState(() => 
    localStorage.getItem('hasPoetrySlip') === 'true'
  );
  const [hasTigerSeal, setHasTigerSeal] = useState(() => 
    localStorage.getItem('hasTigerSeal') === 'true'
  );
  const [hasDuckSoup, setHasDuckSoup] = useState(() => 
    localStorage.getItem('hasDuckSoup') === 'true'
  );
  const [hasCandy, setHasCandy] = useState(() => 
    localStorage.getItem('hasCandy') === 'true'
  );
  
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isEasterEggActive, setIsEasterEggActive] = useState(false);

  // 封裝帶有持久化邏輯的 Setter
  const updateHasFlashlight = (val: boolean) => {
    setHasFlashlight(val);
    localStorage.setItem('hasFlashlight', String(val));
  };
  const updateHasPoetrySlip = (val: boolean) => {
    setHasPoetrySlip(val);
    localStorage.setItem('hasPoetrySlip', String(val));
  };
  const updateHasTigerSeal = (val: boolean) => {
    setHasTigerSeal(val);
    localStorage.setItem('hasTigerSeal', String(val));
  };
  const updateHasDuckSoup = (val: boolean) => {
    setHasDuckSoup(val);
    localStorage.setItem('hasDuckSoup', String(val));
  };
  const updateHasCandy = (val: boolean) => {
    setHasCandy(val);
    localStorage.setItem('hasCandy', String(val));
  };

  return {
    submitted,
    setSubmitted,
    lastSubmissionId,
    setLastSubmissionId,
    isSubmitting,
    setIsSubmitting,
    calculatedTotal,
    setCalculatedTotal,
    currentPage,
    setCurrentPage,
    loadTime,
    isDataLoading,
    setIsDataLoading,
    showConfirmation,
    setShowConfirmation,
    isLookupOpen,
    setIsLookupOpen,
    formData,
    setFormData,
    isEditing,
    setIsEditing,
    editData,
    setEditData,
    isEditingSession,
    setIsEditingSession,
    editingSession,
    setEditingSession,
    adminTab,
    setAdminTab,
    newSession,
    setNewSession,
    adminFilterDate,
    setAdminFilterDate,
    adminSearchKeyword,
    setAdminSearchKeyword,
    showRecycleBin,
    setShowRecycleBin,
    showAuditModal,
    setShowAuditModal,
    auditTarget,
    setAuditTarget,
    sortConfig,
    setSortConfig,
    visibleColumns,
    setVisibleColumns,
    showColumnFilter,
    setShowShowColumnFilter,
    newManualTime,
    setNewManualTime,
    selectedIds,
    setSelectedIds,
    hasFlashlight,
    setHasFlashlight: updateHasFlashlight,
    hasPoetrySlip,
    setHasPoetrySlip: updateHasPoetrySlip,
    hasTigerSeal,
    setHasTigerSeal: updateHasTigerSeal,
    isFlashlightOn,
    setIsFlashlightOn,
    isBagOpen,
    setIsBagOpen,
    hasDuckSoup,
    setHasDuckSoup: updateHasDuckSoup,
    hasCandy,
    setHasCandy: updateHasCandy,
    isEasterEggActive,
    setIsEasterEggActive,
    closedDaysConfig,
    setClosedDaysConfig
  };
};
