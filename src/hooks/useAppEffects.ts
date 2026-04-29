import { useEffect } from 'react';
import { FormData, Session, IdentityPricing } from '../types';

interface UseAppEffectsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  sessions: Session[];
  sessionType: string;
  setCalculatedTotal: (total: number) => void;
  identityPricings: IdentityPricing[];
  sysModalShow: boolean;
  showConfirmation: boolean;
  isSubmitting: boolean;
  isDataLoading: boolean;
  showAuditModal: boolean;
  isEditing: boolean;
  isEditingSession: boolean;
  showRecycleBin: boolean;
  shouldRenderEntry: boolean;
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
  sysModalShow,
  showConfirmation,
  isSubmitting,
  isDataLoading,
  showAuditModal,
  isEditing,
  isEditingSession,
  showRecycleBin,
  shouldRenderEntry
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
   * 副作用 3：當彈窗或載入畫面顯示時，禁止背景滑動
   */
  useEffect(() => {
    const isAnyModalOpen =
      sysModalShow ||
      showConfirmation ||
      isSubmitting ||
      isDataLoading ||
      showAuditModal ||
      isEditing ||
      isEditingSession ||
      showRecycleBin ||
      shouldRenderEntry;

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
    isDataLoading,
    showAuditModal,
    isEditing,
    isEditingSession,
    showRecycleBin,
    shouldRenderEntry
  ]);
};
