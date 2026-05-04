import React, { useEffect } from 'react';
import {
  FormData,
  Session,
  IdentityPricing,
  ClosedDaysConfig,
  TimeslotConfig
} from '../types';
import {
  isDateClosed,
  adjustSelectedDate,
  formatDateTimeMinute
} from '../utils/dateUtils';

interface UseAppEffectsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  sessions: Session[];
  sessionType: string;
  setCalculatedTotal: (total: number) => void;
  identityPricings: IdentityPricing[];
  closedDaysConfig: ClosedDaysConfig;
  timeslotConfig: TimeslotConfig;
  generalTimeSlots: string[];
  specialTimeSlots: string[];
  sysModalShow: boolean;
  showConfirmation: boolean;
  isSubmitting: boolean;
  showAuditModal: boolean;
  isEditing: boolean;
  isEditingSession: boolean;
  showRecycleBin: boolean;
  shouldRenderEntry: boolean;
  isAdmin: boolean;
}

/**
 * 處理應用程式內部的全域連動副作用邏輯
 */
export const useAppEffects = ({
  formData,
  setFormData,
  sessions,
  sessionType,
  setCalculatedTotal,
  identityPricings,
  closedDaysConfig,
  timeslotConfig,
  generalTimeSlots,
  specialTimeSlots,
  sysModalShow,
  showConfirmation,
  isSubmitting,
  showAuditModal,
  isEditing,
  isEditingSession,
  showRecycleBin,
  shouldRenderEntry,
  isAdmin
}: UseAppEffectsProps) => {
  /**
   * 副作用 1：當購買份數改變時，自動校正遊玩人數
   */
  useEffect(() => {
    const qty = parseInt(formData.quantity) || 1;
    const players = parseInt(formData.players) || 0;
    const maxPlayers = qty * 4;

    if (players > maxPlayers || players === 0) {
      setFormData((prev) => ({ ...prev, players: '1' }));
    }
  }, [formData.quantity, formData.players, setFormData]);

  /**
   * 副作用 2：計算總金額
   */
  useEffect(() => {
    const qty = parseInt(formData.quantity) || 0;
    let price = 0;

    if (sessionType !== '') {
      // 1. 先從場次清單找出目前選擇場次的物件
      const sessionObj = sessions.find((s) => s.name === formData.session);
      const basePrice = sessionObj ? sessionObj.price : 650;

      // 2. 判斷是否選中了特殊身分優待價
      // 若為「一般民眾」或身分功能未開啟，則使用場次原價
      if (formData.identityType === '一般民眾') {
        price = basePrice;
      } else {
        const matchedIdentity = identityPricings.find(
          (ip) => ip.enabled && ip.name === formData.identityType
        );
        // 如果選了特殊身分但找不到對應費率（例如剛新增），則回退到場次原價，確保不為 0
        price = matchedIdentity ? matchedIdentity.price : basePrice;
      }
    }

    setCalculatedTotal(qty * price);
  }, [
    formData.quantity,
    formData.session,
    formData.identityType,
    sessions,
    sessionType,
    identityPricings,
    setCalculatedTotal
  ]);

  /**
   * 副作用 3：即時校正因設定變更而變為「不開放」的日期
   * 確保使用者在管理員儲存設定的瞬間，若已選取該日，會自動跳轉至下一天，防止預約衝突。
   */
  useEffect(() => {
    if (!formData.pickupTime) return;

    const currentSelected = new Date(formData.pickupTime.replace(/-/g, '/'));
    if (isNaN(currentSelected.getTime())) return;

    // 檢查目前選取的日期是否已被管理員關閉
    if (isDateClosed(currentSelected, closedDaysConfig)) {
      console.log('⚠️ 偵測到目前選取日期已關閉，正在自動校正...');
      const selectedSession = sessions.find((s) => s.name === formData.session);
      const nextAvailable = adjustSelectedDate(
        currentSelected,
        selectedSession,
        sessionType,
        timeslotConfig,
        generalTimeSlots,
        specialTimeSlots,
        closedDaysConfig
      );

      setFormData((prev) => ({
        ...prev,
        pickupTime: formatDateTimeMinute(nextAvailable)
      }));
    }
  }, [
    closedDaysConfig,
    formData.session,
    sessionType,
    timeslotConfig,
    generalTimeSlots,
    specialTimeSlots,
    setFormData
  ]);

  /**
   * 副作用 4：當彈窗顯示時，禁止背景滑動 (排除純資料載入狀態)
   */
  useEffect(() => {
    // 關鍵修正：管理員登入後，不應受 EntryAnimation (shouldRenderEntry) 影響而鎖死捲動
    const isAnyModalOpen =
      sysModalShow ||
      showConfirmation ||
      isSubmitting ||
      showAuditModal ||
      isEditing ||
      isEditingSession ||
      showRecycleBin ||
      (!isAdmin && shouldRenderEntry);

    if (isAnyModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [
    sysModalShow,
    showConfirmation,
    isSubmitting,
    showAuditModal,
    isEditing,
    isEditingSession,
    showRecycleBin,
    shouldRenderEntry,
    isAdmin
  ]);
};
