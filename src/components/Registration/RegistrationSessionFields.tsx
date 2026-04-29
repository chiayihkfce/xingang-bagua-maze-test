import React from 'react';
import { Session, FormData, IdentityPricing } from '../../types';
import { translateOption } from '../../utils/translateOptions';

interface RegistrationSessionFieldsProps {
  t: any;
  lang: string;
  formData: FormData;
  sessionType: string;
  setSessionType: (type: any) => void;
  sessions: Session[];
  handleInputChange: (e: any) => void;
  handlePlayerInfoChange: (
    index: number,
    field: 'name' | 'email',
    value: string
  ) => void;
  identityPricings: IdentityPricing[];
  getSessionDisplayName: (name: string) => string;
  showAlert: (
    message: string,
    title?: string,
    onConfirm?: () => void,
    confirmText?: string
  ) => void;
}

const RegistrationSessionFields: React.FC<RegistrationSessionFieldsProps> = ({
  t,
  lang,
  formData,
  sessionType,
  setSessionType,
  sessions,
  handleInputChange,
  handlePlayerInfoChange,
  identityPricings,
  getSessionDisplayName,
  showAlert
}) => {
  return (
    <div className="form-card">
      <h3 className="form-section-title">{t.regInfo}</h3>

      <div className="form-group">
        <label>
          {t.sessionType}
          <span className="required-mark">*</span>
        </label>
        <select
          value={sessionType}
          required
          onChange={(e) => {
            const newType = e.target.value as '一般預約' | '特別預約' | '';
            setSessionType(newType);

            if (newType === '') {
              handleInputChange({
                target: { name: 'session', value: '' }
              } as any);
              return;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const filtered = sessions.filter((s) => {
              const isTypeMatch =
                newType === '特別預約' ? s.isSpecial : !s.isSpecial;
              if (!isTypeMatch) return false;

              if (s.fixedDate) {
                const sessionDate = new Date(s.fixedDate.replace(/-/g, '/'));
                return sessionDate >= today;
              }
              return true;
            });

            if (filtered.length > 0) {
              let targetValue = filtered[0].name;
              if (newType === '一般預約') {
                const qty = parseInt(formData.quantity) || 0;
                if (qty >= 5) {
                  targetValue =
                    filtered.find((s) => s.name.includes('團體優惠'))?.name ||
                    targetValue;
                } else {
                  targetValue =
                    filtered.find(
                      (s) =>
                        s.name.includes('單人') ||
                        s.name.includes('個人') ||
                        s.name.includes('一般')
                    )?.name || targetValue;
                }
              }
              handleInputChange({
                target: { name: 'session', value: targetValue }
              } as any);
            }
          }}
        >
          <option value="" disabled>
            {t.sessionTypePlaceholder}
          </option>
          <option value="一般預約">{t.generalReg}</option>
          <option value="特別預約">{t.specialReg}</option>
        </select>
      </div>

      {sessionType === '一般預約' &&
        identityPricings.some((ip) => ip.enabled) && (
          <div className="form-group">
            <label>
              {lang === 'en' ? '【Identity Type】' : '【身分類型】'}
              <span className="required-mark">*</span>
            </label>
            <select
              name="identityType"
              value={formData.identityType}
              required
              onChange={(e) => {
                const val = e.target.value;
                handleInputChange(e);
                if (val !== '一般民眾') {
                  const msg =
                    lang === 'en'
                      ? 'Please bring relevant identification/proof on the day of the event for verification.'
                      : '【提醒】選擇此身分，請於遊玩當天攜帶相關證明文件以供查驗。';
                  showAlert(
                    msg,
                    lang === 'en' ? 'Reminder' : '提示',
                    undefined,
                    lang === 'en' ? 'I understand' : '我瞭解了'
                  );
                  handleInputChange({
                    target: { name: 'session', value: `優惠專案場次（${val}）` }
                  } as any);
                } else {
                  const qty = parseInt(formData.quantity) || 0;
                  const filtered = sessions.filter((s) => !s.isSpecial);
                  if (filtered.length > 0) {
                    let targetValue = filtered[0].name;
                    if (qty >= 5) {
                      targetValue =
                        filtered.find((s) => s.name.includes('團體優惠'))
                          ?.name || targetValue;
                    } else {
                      targetValue =
                        filtered.find(
                          (s) =>
                            s.name.includes('單人') ||
                            s.name.includes('個人') ||
                            s.name.includes('一般')
                        )?.name || targetValue;
                    }
                    handleInputChange({
                      target: { name: 'session', value: targetValue }
                    } as any);
                  }
                }
              }}
            >
              <option value="一般民眾">
                {lang === 'en' ? 'General Public' : '一般民眾'}
              </option>
              {identityPricings
                .filter((ip) => ip.enabled)
                .map((ip) => (
                  <option key={ip.id} value={ip.name}>
                    {ip.name}
                  </option>
                ))}
            </select>
          </div>
        )}

      {sessionType !== '' && (
        <>
          <div className="form-group">
            <label>
              {t.detailSession}
              <span className="required-mark">*</span>
            </label>
            {sessionType === '一般預約' ? (
              <div
                className="general-session-info"
                style={{
                  padding: '1rem',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid var(--primary-gold)',
                  borderRadius: '8px',
                  color: 'var(--primary-gold)',
                  fontSize: '0.95rem',
                  lineHeight: '1.6'
                }}
              >
                <p style={{ margin: 0, fontWeight: 'bold' }}>
                  {formData.identityType !== '一般民眾'
                    ? lang === 'en'
                      ? 'Special Project Price (No additional discounts)'
                      : '優惠專案價 (不參與其他折扣)'
                    : `${t.autoSelected} ${translateOption(getSessionDisplayName(formData.session), lang) || t.calculating}`}
                </p>
                {formData.identityType === '一般民眾' && (
                  <div
                    className="discount-hint"
                    style={{
                      marginTop: '0.5rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem'
                    }}
                  >
                    {t.discountHint}
                  </div>
                )}
              </div>
            ) : (
              <select
                name="session"
                value={formData.session}
                onChange={handleInputChange}
                required
              >
                {sessions.length > 0 ? (
                  sessions
                    .filter((s) => {
                      if (!s.isSpecial) return false;
                      if (!s.fixedDate) return true;
                      const sessionDate = new Date(
                        s.fixedDate.replace(/-/g, '/')
                      );
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return sessionDate >= today;
                    })
                    .map((s) => (
                      <option key={s.name} value={s.name}>
                        {lang === 'en'
                          ? s.enName || translateOption(s.name, lang)
                          : s.name}{' '}
                        (${s.price})
                      </option>
                    ))
                ) : (
                  <option disabled>{t.loading}</option>
                )}
              </select>
            )}
          </div>
          <div className="form-group">
            <label>
              {t.quantity}
              <span className="required-mark">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              min="1"
              required
              value={formData.quantity}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>
              {t.playersLabel}
              <span className="required-mark">*</span>
            </label>
            <select
              name="players"
              value={formData.players}
              onChange={handleInputChange}
            >
              {Array.from(
                { length: Number(formData.quantity) * 4 },
                (_, i) => i + 1
              ).map((num) => (
                <option key={num} value={num}>
                  {num} {t.playersVal}
                </option>
              ))}
            </select>
          </div>

          {Number(formData.players) > 1 && (
            <div
              className="player-list-section"
              style={{ marginTop: '1.5rem' }}
            >
              <p
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--primary-gold)',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  borderLeft: '3px solid var(--accent-orange)',
                  paddingLeft: '10px'
                }}
              >
                {lang === 'en' ? 'Player Details:' : '隊員名單資料:'}
              </p>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem',
                  paddingLeft: '13px'
                }}
              >
                {lang === 'en'
                  ? ' (Optional) Used for individual achievement certificates.'
                  : '（選填）此名單僅用於後續製作與領取個人成就證書使用。'}
              </p>
              {formData.playerList.map((player, index) => (
                <div
                  key={index}
                  className="player-input-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      {index === 0
                        ? lang === 'en'
                          ? 'Registrant (You)'
                          : '填表人 (您)'
                        : `${lang === 'en' ? 'Player' : '隊員'} ${index}`}{' '}
                      - {lang === 'en' ? 'Name' : '姓名'}
                    </label>
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) =>
                        handlePlayerInfoChange(index, 'name', e.target.value)
                      }
                      placeholder={t.namePlaceholder}
                      required={index === 0}
                      style={
                        index === 0
                          ? { opacity: 0.7, cursor: 'not-allowed' }
                          : {}
                      }
                      readOnly={index === 0}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      {lang === 'en' ? 'Email' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={player.email}
                      onChange={(e) =>
                        handlePlayerInfoChange(index, 'email', e.target.value)
                      }
                      placeholder={t.emailPlaceholder}
                      required={index === 0}
                      style={
                        index === 0
                          ? { opacity: 0.7, cursor: 'not-allowed' }
                          : {}
                      }
                      readOnly={index === 0}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RegistrationSessionFields;
