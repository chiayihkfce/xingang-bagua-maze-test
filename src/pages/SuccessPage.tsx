import React from 'react';
import CustomCursor from '../components/UI/CustomCursor';
import SuccessScreen from '../components/Registration/SuccessScreen';
import SystemModal from '../components/UI/SystemModal';
import { FormData, PaymentMethod } from '../types';

interface SuccessPageProps {
  t: any;
  lang: string;
  formData: FormData;
  calculatedTotal: number;
  paymentMethods: PaymentMethod[];
  lastSubmissionId: string | null;
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
  handleCopyAccount: (accountNumber?: string) => Promise<void>;
  getSessionDisplayName: (chineseName: string) => string;
  getPaymentMethodDisplay: (method: string) => string;
  handleUpdateBankLast5: (id: string, last5: string) => Promise<boolean>;
  resetForm: () => void;
  showAlert: (message: string) => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({
  t,
  lang,
  formData,
  calculatedTotal,
  paymentMethods,
  lastSubmissionId,
  sysModal,
  handleCopyAccount,
  getSessionDisplayName,
  getPaymentMethodDisplay,
  handleUpdateBankLast5,
  resetForm,
  showAlert
}) => {
  return (
    <>
      <CustomCursor />
      <SuccessScreen 
        {...{ 
          t, 
          formData, 
          calculatedTotal, 
          handleCopyAccount, 
          getSessionDisplayName, 
          getPaymentMethodDisplay, 
          resetForm, 
          paymentMethods, 
          lang, 
          lastSubmissionId, 
          handleUpdateBankLast5, 
          showAlert 
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

export default SuccessPage;
