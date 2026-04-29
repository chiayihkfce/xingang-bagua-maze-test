import React from 'react';
import EntryAnimation from './EntryAnimation';
import ConfirmationModal from './ConfirmationModal';
import SystemModal from '../UI/SystemModal';
import { FormData, Lang } from '../../types';

interface RegistrationOverlaysProps {
  t: any;
  lang: Lang;
  isEntryAnimating: boolean;
  shouldRenderEntry: boolean;
  showConfirmation: boolean;
  setShowConfirmation: (val: boolean) => void;
  formData: FormData;
  calculatedTotal: number;
  handleConfirmSubmit: () => Promise<void>;
  isSubmitting: boolean;
  getSessionDisplayName: (chineseName: string) => string;
  getPickupLocationDisplay: (location: string) => string;
  getPaymentMethodDisplay: (method: string) => string;
  sysModal: {
    show: boolean;
    type: 'alert' | 'confirm';
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
  };
}

const RegistrationOverlays: React.FC<RegistrationOverlaysProps> = ({
  t,
  lang,
  isEntryAnimating,
  shouldRenderEntry,
  showConfirmation,
  setShowConfirmation,
  formData,
  calculatedTotal,
  handleConfirmSubmit,
  isSubmitting,
  getSessionDisplayName,
  getPickupLocationDisplay,
  getPaymentMethodDisplay,
  sysModal
}) => {
  return (
    <>
      <EntryAnimation {...{ t, isEntryAnimating, shouldRenderEntry }} />
      <ConfirmationModal
        {...{
          t,
          lang,
          showConfirmation,
          setShowConfirmation,
          formData,
          calculatedTotal,
          handleConfirmSubmit,
          isSubmitting,
          getSessionDisplayName,
          getPickupLocationDisplay,
          getPaymentMethodDisplay
        }}
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
};

export default RegistrationOverlays;
