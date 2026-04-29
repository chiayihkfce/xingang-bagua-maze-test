import React from 'react';
// import CustomCursor from '../components/UI/CustomCursor';
import SuccessScreen from '../components/Registration/SuccessScreen';
import SystemModal from '../components/UI/SystemModal';

import { useAppContext } from '../context/AppContext';

const SuccessPage: React.FC = () => {
  const {
    t,
    lang,
    formData,
    calculatedTotal,
    paymentMethods,
    sealConfig,
    lastSubmissionId,
    sysModal,
    handleCopyAccount,
    getSessionDisplayName,
    getPaymentMethodDisplay,
    handleUpdateBankLast5,
    resetForm,
    showAlert
  } = useAppContext();
  return (
    <>
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
          sealConfig,
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
