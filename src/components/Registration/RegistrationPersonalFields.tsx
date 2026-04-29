import React from 'react';
import { FormData, FormErrors } from '../../types';

interface RegistrationPersonalFieldsProps {
  t: any;
  formData: FormData;
  formErrors: FormErrors;
  handleInputChange: (e: any) => void;
}

const RegistrationPersonalFields: React.FC<RegistrationPersonalFieldsProps> = ({
  t,
  formData,
  formErrors,
  handleInputChange
}) => {
  return (
    <div className="form-card">
      <h3 className="form-section-title">{t.basicInfo}</h3>
      <div className="form-group">
        <label>
          {t.nameLabel}
          <span className="required-mark">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleInputChange}
          placeholder={t.namePlaceholder}
        />
        {formErrors.name && (
          <span className="error-msg">{formErrors.name}</span>
        )}
      </div>
      <div className="form-group">
        <label>
          {t.phoneLabel}
          <span className="required-mark">*</span>
        </label>
        <div
          style={{
            display: 'flex',
            width: '100%',
            background: 'var(--input-bg)',
            border: '1px solid var(--input-border)',
            borderRadius: '8px',
            transition: 'all .3s ease',
            boxSizing: 'border-box'
          }}
        >
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleInputChange}
            style={{
              width: 'auto',
              minWidth: '130px',
              flexShrink: 0,
              background: 'transparent',
              border: 'none',
              borderRight: '1px solid var(--input-border)',
              color: 'var(--input-text)',
              padding: '1rem',
              cursor: 'pointer',
              fontSize: '16px',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none'
            }}
          >
            <option
              value="+886"
              style={{
                color: 'var(--text-light)',
                background: 'var(--card-bg)'
              }}
            >
              {t.countryNames['+886']}
            </option>
            <option
              value="+852"
              style={{
                color: 'var(--text-light)',
                background: 'var(--card-bg)'
              }}
            >
              {t.countryNames['+852']}
            </option>
            <option
              value="+853"
              style={{
                color: 'var(--text-light)',
                background: 'var(--card-bg)'
              }}
            >
              {t.countryNames['+853']}
            </option>
            <option
              value="+65"
              style={{
                color: 'var(--text-light)',
                background: 'var(--card-bg)'
              }}
            >
              {t.countryNames['+65']}
            </option>
            <option
              value="+60"
              style={{
                color: 'var(--text-light)',
                background: 'var(--card-bg)'
              }}
            >
              {t.countryNames['+60']}
            </option>
            <option
              value="landline"
              style={{
                color: 'var(--text-light)',
                background: 'var(--card-bg)'
              }}
            >
              {t.countryNames['landline']}
            </option>
          </select>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleInputChange}
            placeholder={(() => {
              const placeholders: { [key: string]: string } = {
                '+886': '0912345678',
                '+852': '91234567',
                '+853': '61234567',
                '+65': '91234567',
                '+60': '0123456789',
                landline: '053745074'
              };
              return placeholders[formData.countryCode] || t.phonePlaceholder;
            })()}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              padding: '1rem',
              color: 'var(--input-text)',
              fontSize: '16px',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>
        {formErrors.phone && (
          <span className="error-msg">{formErrors.phone}</span>
        )}
      </div>
      <div className="form-group">
        <label>
          {t.emailLabel}
          <span className="required-mark">*</span>
        </label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          placeholder={t.emailPlaceholder}
        />
        {formErrors.email && (
          <span className="error-msg">{formErrors.email}</span>
        )}
      </div>
    </div>
  );
};

export default RegistrationPersonalFields;
