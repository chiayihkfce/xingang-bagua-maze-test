import React, { useState } from 'react';
import {
  Session,
  FormData,
  FormErrors,
  TimeslotConfig,
  PaymentMethod,
  IdentityPricing
} from '../../types';
import { translations } from '../../locales/translations';
import StatusLookupModal from './StatusLookupModal';
import RegistrationEntry from './RegistrationEntry';
import RegistrationPersonalFields from './RegistrationPersonalFields';
import RegistrationSessionFields from './RegistrationSessionFields';
import RegistrationPaymentFields from './RegistrationPaymentFields';
import BagModal from './BagModal';
import { useAppContext } from '../../context/AppContext';
// import { useEasterEggs } from '../../hooks/useEasterEggs';

interface RegistrationFormProps {
  t: any;
  lang: string;
  formData: FormData;
  formErrors: FormErrors;
  sessionType: string;
  setSessionType: (type: any) => void;
  sessions: Session[];
  timeslotConfig: TimeslotConfig;
  generalTimeSlots: string[];
  specialTimeSlots: string[];
  handleInputChange: (e: any) => void;
  handlePlayerInfoChange: (
    index: number,
    field: 'name' | 'email',
    value: string
  ) => void;
  handleCheckboxChange: (e: any) => void;
  handleDateChange: (date: Date | null) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  calculatedTotal: number;
  getSessionDisplayName: (name: string) => string;
  paymentMethods: PaymentMethod[];
  identityPricings: IdentityPricing[];
  showAlert: (
    message: string,
    title?: string,
    onConfirm?: () => void,
    confirmText?: string
  ) => void;
  setShowGames: (show: boolean) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  t,
  lang,
  formData,
  formErrors,
  sessionType,
  setSessionType,
  sessions,
  timeslotConfig,
  generalTimeSlots,
  specialTimeSlots,
  handleInputChange,
  handlePlayerInfoChange,
  handleCheckboxChange,
  handleDateChange,
  handleSubmit,
  isSubmitting,
  calculatedTotal,
  getSessionDisplayName,
  paymentMethods,
  identityPricings,
  showAlert,
  setShowGames
}) => {
  const {
    isFlashlightOn,
    setIsFlashlightOn,
    isLookupOpen,
    setIsLookupOpen,
    isBagOpen,
    setIsBagOpen,
    hasFlashlight,
    hasPoetrySlip,
    hasTigerSeal,
    hasDuckSoup,
    hasCandy,
    triggerBaguaBox
  } = useAppContext();

  const [viewMode, setViewMode] = useState<'choice' | 'form'>('choice');
  const [isScrollOpen, setIsScrollOpen] = useState(false);

  // 渲染邏輯
  return (
    <>
      {viewMode === 'choice' ? (
        <RegistrationEntry
          t={t}
          lang={lang}
          isFlashlightOn={isFlashlightOn}
          setViewMode={setViewMode}
          setShowGames={setShowGames}
        />
      ) : (
        <section className="registration-section">
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={() => setViewMode('choice')}
              style={{
                background: 'none',
                border: 'none',
                color: '#d4af37',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {t.backToChoice}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="reg-form">
            <div style={{ display: 'none' }} aria-hidden="true">
              <input
                type="text"
                name="hp_field"
                value={formData.hp_field}
                onChange={handleInputChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <RegistrationPersonalFields
              t={t}
              formData={formData}
              formErrors={formErrors}
              handleInputChange={handleInputChange}
            />

            <RegistrationSessionFields
              t={t}
              lang={lang}
              formData={formData}
              sessionType={sessionType}
              setSessionType={setSessionType}
              sessions={sessions}
              handleInputChange={handleInputChange}
              handlePlayerInfoChange={handlePlayerInfoChange}
              identityPricings={identityPricings}
              getSessionDisplayName={getSessionDisplayName}
              showAlert={showAlert}
            />

            {sessionType !== '' && (
              <>
                <RegistrationPaymentFields
                  t={t}
                  lang={lang}
                  formData={formData}
                  sessionType={sessionType}
                  sessions={sessions}
                  paymentMethods={paymentMethods}
                  handleInputChange={handleInputChange}
                  handleDateChange={handleDateChange}
                  timeslotConfig={timeslotConfig}
                  generalTimeSlots={generalTimeSlots}
                  specialTimeSlots={specialTimeSlots}
                />

                <div className="form-card">
                  <h3 className="form-section-title">{t.other}</h3>
                  <div className="form-group">
                    <label>{t.referralLabel}</label>
                    <div className="checkbox-grid">
                      {t.referrals.map((item: string, index: number) => {
                        const stableKey = translations.zh.referrals[index];
                        return (
                          <label key={stableKey}>
                            <input
                              type="checkbox"
                              value={stableKey}
                              checked={formData.referral.includes(stableKey)}
                              onChange={handleCheckboxChange}
                            />
                            {item}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{t.notesLabel}</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                    ></textarea>
                  </div>
                </div>

                <div className="submit-container">
                  <div className="total-display">
                    <span>{t.total}</span>
                    <span className="amount">NT$ {calculatedTotal}</span>
                  </div>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t.submitting : t.submitBtn}
                  </button>
                </div>
              </>
            )}
          </form>
        </section>
      )}

      {/* 統一彈窗渲染層 */}
      <BagModal
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        hasFlashlight={hasFlashlight}
        hasPoetrySlip={hasPoetrySlip}
        hasTigerSeal={hasTigerSeal}
        hasDuckSoup={hasDuckSoup}
        hasCandy={hasCandy}
        isFlashlightOn={isFlashlightOn}
        onToggleFlashlight={() => {
          const nextState = !isFlashlightOn;
          setIsFlashlightOn(nextState);
          if (nextState) setIsBagOpen(false);
        }}
        showMysticScroll={() => setIsScrollOpen(true)}
        triggerBaguaBox={triggerBaguaBox}
      />

      <StatusLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        lang={lang}
      />

      {isScrollOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 200000 }}
          onClick={() => setIsScrollOpen(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0f0f0a',
              border: '2px solid var(--primary-gold)',
              padding: '50px 30px',
              borderRadius: '8px',
              textAlign: 'center',
              maxWidth: '450px',
              width: '85%',
              boxShadow:
                '0 0 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.2)',
              position: 'relative',
              backgroundImage:
                'radial-gradient(circle at center, #1a1a12 0%, #0a0a05 100%)'
            }}
          >
            <div
              style={{
                color: 'var(--primary-gold)',
                fontSize: '1.6rem',
                marginBottom: '35px',
                letterSpacing: '8px',
                fontWeight: 'bold'
              }}
            >
              📜 神祕詩籤 📜
            </div>
            <div
              style={{
                color: '#ececec',
                fontSize: '1.25rem',
                lineHeight: '2.8',
                letterSpacing: '5px',
                marginBottom: '40px',
                fontFamily: "'Noto Serif TC', serif"
              }}
            >
              <p>新港街頭八卦生</p>
              <p>培桂堂前影自橫</p>
              <p>乾位尋真坤位引</p>
              <p>萬象歸宗見太平</p>
            </div>
            <button
              className="submit-btn"
              onClick={() => setIsScrollOpen(false)}
              style={{
                background: 'transparent',
                border: '1px solid var(--primary-gold)',
                color: 'var(--primary-gold)',
                padding: '10px 40px',
                borderRadius: '25px'
              }}
            >
              領悟
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RegistrationForm;
