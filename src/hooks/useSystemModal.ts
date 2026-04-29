import { useState } from 'react';

/**
 * 處理系統層級的自訂彈窗狀態 (Alert 與 Confirm)
 */
export const useSystemModal = () => {
  const [sysModal, setSysModal] = useState<{
    show: boolean;
    type: 'alert' | 'confirm';
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    show: false,
    type: 'alert',
    title: '提示',
    message: '',
    onConfirm: () => {}
  });

  const showAlert = (
    message: string,
    title = '提示',
    onConfirm?: () => void,
    confirmText = '確定'
  ) => {
    setSysModal({
      show: true,
      type: 'alert',
      title,
      message,
      confirmText,
      onConfirm: () => {
        setSysModal((prev) => ({ ...prev, show: false }));
        if (onConfirm) onConfirm();
      }
    });
  };

  const showConfirm = (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    title = '確認動作'
  ) => {
    setSysModal({
      show: true,
      type: 'confirm',
      title,
      message,
      onConfirm: () => {
        setSysModal((prev) => ({ ...prev, show: false }));
        onConfirm();
      },
      onCancel: () => {
        setSysModal((prev) => ({ ...prev, show: false }));
        if (onCancel) onCancel();
      }
    });
  };

  return {
    sysModal,
    showAlert,
    showConfirm
  };
};
