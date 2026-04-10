import React from 'react';
import { translateOption } from '../../utils/translateOptions';

interface ConfirmationModalProps {
  t: any;
  lang: string;
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  formData: any;
  calculatedTotal: number;
  handleConfirmSubmit: () => void;
  isSubmitting: boolean;
  getSessionDisplayName: (name: string) => string;
  getPickupLocationDisplay: (loc: string) => string;
  getPaymentMethodDisplay: (method: string) => string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
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
}) => {
  if (!showConfirmation) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content form-card" style={{ maxWidth: '600px', width: '95%' }}>
        <div className="modal-header" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 className="form-section-title" style={{ margin: 0 }}>{t.confirmTitle}</h2>
        </div>
        
        <div className="modal-body" style={{ padding: '2rem', overflowY: 'auto' }}>
          <div className="confirmation-details" style={{ textAlign: 'left', lineHeight: '1.8' }}>
            <p><strong>{t.registrant}</strong> {formData.name}</p>
            <p><strong>{t.phone}</strong> {formData.countryCode} {formData.phone}</p>
            <p><strong>{t.email}</strong> {formData.email}</p>
            <p><strong>{t.session}</strong> {translateOption(getSessionDisplayName(formData.session), lang)}</p>
            <p><strong>{t.qty}</strong> {formData.quantity} {t.kitVal}</p>
            <p><strong>{t.playerCount}</strong> {formData.players} {t.playersVal}</p>
            <p><strong>{t.expectedTime}</strong> {formData.pickupTime}</p>
            <p><strong>{t.pickupLoc}</strong> {translateOption(getPickupLocationDisplay(formData.pickupLocation), lang)}</p>
            <p><strong>{t.paymentMethod}</strong> {translateOption(getPaymentMethodDisplay(formData.paymentMethod), lang)}</p>
            <p><strong>{t.total}</strong> <span style={{color: 'var(--primary-gold)', fontWeight: 'bold', fontSize: '1.2rem'}}>NT$ {calculatedTotal}</span></p>
            {formData.notes && <p><strong>{t.notes}</strong> {formData.notes}</p>}
          </div>
        </div>

        <div className="modal-actions admin-login-actions">
          <button type="button" onClick={() => setShowConfirmation(false)} className="cancel-btn">
            {t.backToEdit}
          </button>
          <button type="button" onClick={handleConfirmSubmit} className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? t.submitting : t.confirmSubmit}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
