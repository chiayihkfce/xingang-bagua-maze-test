import React from 'react';
import DatePicker from 'react-datepicker';
import {
  Session,
  FormData,
  PaymentMethod,
  TimeslotConfig
} from '../../types';
import { translateOption } from '../../utils/translateOptions';
import { useAppContext } from '../../context/AppContext';
import { isDateClosed } from '../../utils/dateUtils';

interface RegistrationPaymentFieldsProps {
  t: any;
  lang: string;
  formData: FormData;
  sessionType: string;
  sessions: Session[];
  paymentMethods: PaymentMethod[];
  handleInputChange: (e: any) => void;
  handleDateChange: (date: Date | null) => void;
  timeslotConfig: TimeslotConfig;
  generalTimeSlots: string[];
  specialTimeSlots: string[];
}

const RegistrationPaymentFields: React.FC<RegistrationPaymentFieldsProps> = ({
  t,
  lang,
  formData,
  sessionType,
  sessions,
  paymentMethods,
  handleInputChange,
  handleDateChange,
  timeslotConfig,
  generalTimeSlots,
  specialTimeSlots
}) => {
  const selectedPaymentDetail = (paymentMethods || []).find(
    (m) => m.name === formData.paymentMethod
  );
  const pad = (n: number) => String(n).padStart(2, '0');

  const { closedDaysConfig } = useAppContext();

  return (
    <div className="form-card">
      <h3 className="form-section-title">{t.paymentCard}</h3>
      <div className="form-group">
        <label>
          {t.paymentMethodLabel}
          <span className="required-mark">*</span>
        </label>
        <div className="radio-group">
          {paymentMethods.map((m) => (
            <label key={m.id}>
              <input
                type="radio"
                name="paymentMethod"
                value={m.name}
                checked={formData.paymentMethod === m.name}
                onChange={handleInputChange}
              />{' '}
              {translateOption(m.name, lang)}
            </label>
          ))}
        </div>
      </div>

      {selectedPaymentDetail?.type === 'bank' && (
        <div
          className="form-group bank-info"
          style={{
            background: 'rgba(212, 175, 55, 0.05)',
            padding: '1.2rem',
            borderRadius: '12px',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }}
        >
          <p
            style={{
              color: 'var(--primary-gold)',
              fontWeight: 'bold',
              marginBottom: '0.8rem',
              fontSize: '1.1rem'
            }}
          >
            {t.bankInfo || '匯款資訊:'}
          </p>
          <p
            style={{
              fontSize: '0.95rem',
              marginBottom: '0.5rem',
              color: 'var(--text-light)'
            }}
          >
            {lang === 'en'
              ? 'Bank account details and payment verification will be provided on the next page after you submit this form.'
              : '匯款帳號資訊與轉帳核對將於送出報名表後的成功頁面顯示。'}
          </p>
        </div>
      )}

      {selectedPaymentDetail?.type === 'linepay' && (
        <div
          className="form-group linepay-info"
          style={{
            background: 'rgba(52, 152, 219, 0.05)',
            padding: '1.2rem',
            borderRadius: '12px',
            border: '1px solid rgba(52, 152, 219, 0.3)'
          }}
        >
          <p
            style={{
              color: '#3498db',
              fontWeight: 'bold',
              marginBottom: '0.8rem',
              fontSize: '1.1rem'
            }}
          >
            {t.digitalPayInfo}
          </p>
          <p
            style={{
              fontSize: '0.95rem',
              marginBottom: '1rem',
              color: 'var(--text-light)'
            }}
          >
            {t.digitalPayDesc}
          </p>
          {selectedPaymentDetail.instructions && (
            <p
              style={{
                fontSize: '0.9rem',
                whiteSpace: 'pre-wrap',
                opacity: 0.8,
                overflowWrap: 'anywhere'
              }}
            >
              {selectedPaymentDetail.instructions}
            </p>
          )}
        </div>
      )}

      {selectedPaymentDetail?.type === 'other' &&
        selectedPaymentDetail.instructions && (
          <div
            className="instructions-info"
            style={{
              padding: '1.2rem',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              border: '1px solid var(--input-border)'
            }}
          >
            <p
              style={{
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                fontSize: '1.1rem'
              }}
            >
              付款說明:
            </p>
            <p style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
              {selectedPaymentDetail.instructions}
            </p>
          </div>
        )}

      <div className="form-group" style={{ marginTop: '1.5rem' }}>
        <label>
          {(() => {
            const selectedSession = sessions.find(
              (s) => s.name === formData.session
            );
            if (selectedSession?.fixedTime) {
              const times = selectedSession.fixedTime.split(',').sort();
              return t.expectedDate(times[0], times[times.length - 1]);
            }
            const fallbackSlots =
              sessionType === '特別預約' ? specialTimeSlots : generalTimeSlots;
            const start =
              fallbackSlots.length > 0
                ? fallbackSlots[0]
                : timeslotConfig.generalStart;
            const end =
              fallbackSlots.length > 0
                ? fallbackSlots[fallbackSlots.length - 1]
                : timeslotConfig.generalEnd;
            return t.expectedDate(start, end);
          })()}
          <span className="required-mark">*</span>
        </label>

        {(() => {
          const selectedSession = sessions.find(
            (s) => s.name === formData.session
          );
          const currentDateStr = formData.pickupTime.split(' ')[0];

          if (
            selectedSession?.isSpecial &&
            (selectedSession?.fixedDate || selectedSession?.fixedTime)
          ) {
            let displayDate = selectedSession.fixedDate || '不限日期';
            if (displayDate.includes('T'))
              displayDate = displayDate.split('T')[0];
            return (
              <div className="fixed-session-hint">
                {t.fixedSessionHint(
                  displayDate,
                  selectedSession.fixedTime
                    ? selectedSession.fixedTime.replace(/,/g, '、')
                    : '全時段'
                )}
              </div>
            );
          }

          if (currentDateStr) {
            const conflicts = sessions.filter((s) => {
              let sDate = s.fixedDate || '';
              if (sDate.includes('T')) sDate = sDate.split('T')[0];
              return sDate === currentDateStr;
            });

            if (conflicts.length > 0) {
              const conflictTimes = conflicts
                .map((c) => c.fixedTime?.replace(/,/g, '、'))
                .filter(Boolean)
                .join(' ; ');
              if (conflictTimes) {
                return (
                  <div className="conflict-notice">
                    {t.conflictNotice(conflictTimes)}
                  </div>
                );
              }
            }
          }
          return null;
        })()}

        <DatePicker
          selected={
            formData.pickupTime
              ? new Date(formData.pickupTime.replace(/-/g, '/'))
              : null
          }
          onChange={handleDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={30}
          timeCaption={t.timeCaption}
          dateFormat="yyyy-MM-dd HH:mm"
          className="date-picker-input"
          placeholderText={t.datepickerPlaceholder}
          required
          locale={lang}
          minDate={(() => {
            const now = new Date();
            const selectedSession = sessions.find(
              (s) => s.name === formData.session
            );
            let endHourStr = timeslotConfig.generalEnd;

            if (selectedSession?.fixedTime) {
              const times = selectedSession.fixedTime.split(',').sort();
              endHourStr = times[times.length - 1];
            }

            const endHour = parseInt(endHourStr.split(':')[0]);
            if (now.getHours() >= endHour) {
              now.setDate(now.getDate() + 1);
            }
            return now;
          })()}
          maxDate={
            sessions.find((s) => s.name === formData.session)?.fixedDate
              ? new Date(
                  sessions.find((s) => s.name === formData.session)!.fixedDate!
                )
              : undefined
          }
          filterDate={(date) => {
            const selectedSession = sessions.find(
              (s) => s.name === formData.session
            );
            if (selectedSession?.fixedDate) {
              const fixedDate = new Date(selectedSession.fixedDate);
              return (
                date.getFullYear() === fixedDate.getFullYear() &&
                date.getMonth() === fixedDate.getMonth() &&
                date.getDate() === fixedDate.getDate()
              );
            }
            // 使用動態配置：一、二固定不開，其餘依據管理者設定
            return !isDateClosed(date, closedDaysConfig);
          }}
          minTime={(() => {
            const d = formData.pickupTime
              ? new Date(formData.pickupTime.replace(/-/g, '/'))
              : new Date();
            const selectedSession = sessions.find(
              (s) => s.name === formData.session
            );
            let startH = 0,
              startM = 0;

            if (selectedSession?.fixedTime) {
              const times = selectedSession.fixedTime.split(',').sort();
              const parts = times[0].split(':');
              startH = parseInt(parts[0]);
              startM = parseInt(parts[1]);
            } else {
              const fallbackSlots =
                sessionType === '特別預約'
                  ? specialTimeSlots
                  : generalTimeSlots;
              const defaultStart =
                fallbackSlots.length > 0
                  ? fallbackSlots[0]
                  : timeslotConfig.generalStart;
              const parts = defaultStart.split(':');
              startH = parseInt(parts[0]);
              startM = parseInt(parts[1]);
            }

            d.setHours(startH, startM, 0);
            return d;
          })()}
          maxTime={(() => {
            const d = formData.pickupTime
              ? new Date(formData.pickupTime.replace(/-/g, '/'))
              : new Date();
            const selectedSession = sessions.find(
              (s) => s.name === formData.session
            );
            let endH = 23,
              endM = 30;

            if (selectedSession?.fixedTime) {
              const times = selectedSession.fixedTime.split(',').sort();
              const parts = times[times.length - 1].split(':');
              endH = parseInt(parts[0]);
              endM = parseInt(parts[1]);
            } else {
              const fallbackSlots =
                sessionType === '特別預約'
                  ? specialTimeSlots
                  : generalTimeSlots;
              const defaultEnd =
                fallbackSlots.length > 0
                  ? fallbackSlots[fallbackSlots.length - 1]
                  : timeslotConfig.generalEnd;
              const parts = defaultEnd.split(':');
              endH = parseInt(parts[0]);
              endM = parseInt(parts[1]);
            }

            d.setHours(endH, endM, 0);
            return d;
          })()}
          filterTime={(time) => {
            const now = new Date();
            const selectedDate = formData.pickupTime
              ? new Date(formData.pickupTime.replace(/-/g, '/'))
              : new Date();

            if (selectedDate.toDateString() === now.toDateString()) {
              if (time.getTime() <= now.getTime()) {
                return false;
              }
            }

            const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}`;
            const selectedSession = sessions.find(
              (s) => s.name === formData.session
            );

            if (selectedSession?.fixedTime) {
              return selectedSession.fixedTime.split(',').includes(timeStr);
            }

            const allowedSlots =
              sessionType === '特別預約' ? specialTimeSlots : generalTimeSlots;
            if (!allowedSlots.includes(timeStr)) return false;

            if (sessionType === '一般預約') {
              const currentDateStr = formData.pickupTime.split(' ')[0];
              const isTakenByOtherSpecial = sessions.some((s) => {
                let sDate = s.fixedDate || '';
                if (sDate.includes('T')) sDate = sDate.split('T')[0];
                return (
                  sDate === currentDateStr &&
                  s.fixedTime?.split(',').includes(timeStr)
                );
              });
              if (isTakenByOtherSpecial) return false;
            }

            return true;
          }}
        />
      </div>
      <div className="form-group">
        <label>
          {t.pickupLocation}
          <span className="required-mark">*</span>
        </label>
        <select
          name="pickupLocation"
          value={formData.pickupLocation}
          onChange={handleInputChange}
        >
          <option value="新港文教基金會(閱讀館)">{t.locFoundation}</option>
          <option value="培桂堂(建議選此處，此處為解謎起點)">
            {t.locPeiGui}
          </option>
        </select>
      </div>
    </div>
  );
};

export default RegistrationPaymentFields;
