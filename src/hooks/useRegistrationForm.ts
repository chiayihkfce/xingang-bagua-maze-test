import { useState } from 'react';
import { FormData, FormErrors, Session, TimeslotConfig } from '../types';
import { validateFieldLogic } from '../utils/validationUtils';
import { formatName, formatBankLast5, formatPhone } from '../utils/formatUtils';
import { formatDateTimeMinute, findEarliestSlot, adjustSelectedDate } from '../utils/dateUtils';

interface UseRegistrationFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  sessions: Session[];
  timeslotConfig: TimeslotConfig;
  generalTimeSlots: string[];
  specialTimeSlots: string[];
  t: any;
}

export const useRegistrationForm = ({
  formData,
  setFormData,
  sessions,
  timeslotConfig,
  generalTimeSlots,
  specialTimeSlots,
  t
}: UseRegistrationFormProps) => {
  const [sessionType, setSessionType] = useState<'一般預約' | '特別預約' | ''>('');

  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: '',
    phone: '',
    name: ''
  });

  const validateField = (name: string, value: string, code?: string) => {
    const error = validateFieldLogic(name, value, code || formData.countryCode, t);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'name') {
      const filteredValue = formatName(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
      validateField(name, filteredValue);
      return;
    }
    if (name === 'bankLast5') {
      const filteredValue = formatBankLast5(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
      return;
    }
    if (name === 'quantity') {
      const qty = parseInt(value) || 0;
      setFormData(prev => {
        let updatedSession = prev.session;
        if (sessionType === '一般預約') {
          const filtered = sessions.filter(s => !s.isSpecial);
          if (qty >= 5) updatedSession = filtered.find(s => s.name.includes('團體優惠'))?.name || filtered[0]?.name || '';
          else updatedSession = filtered.find(s => s.name.includes('單人') || s.name.includes('個人') || s.name.includes('一般'))?.name || filtered[0]?.name || '';
        }
        return { ...prev, quantity: value, session: updatedSession };
      });
      return;
    }
    if (name === 'session') {
      const selectedSession = sessions.find(s => s.name === value);
      let newPickupTime = ''; 
      
      if (selectedSession?.fixedDate) {
        const times = selectedSession.fixedTime ? selectedSession.fixedTime.split(',').sort() : [];
        let timeToUse = times.length > 0 ? times[0] : timeslotConfig.generalStart;
        if (timeToUse.length === 4 && timeToUse.includes(':')) timeToUse = '0' + timeToUse;
        newPickupTime = `${selectedSession.fixedDate} ${timeToUse}`;
      } else {
        newPickupTime = findEarliestSlot(sessions, timeslotConfig, generalTimeSlots, specialTimeSlots, value);
      }
      
      setFormData(prev => ({ ...prev, session: value, pickupTime: newPickupTime }));
      return;
    }
    if (name === 'countryCode') {
      setFormData(prev => ({ ...prev, [name]: value }));
      validateField('phone', formData.phone, value);
      return;
    }
    if (name === 'phone') {
      const filteredValue = formatPhone(value, formData.countryCode);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
      validateField(name, filteredValue);
      return;
    }
    if (name === 'email') {
      setFormData(prev => ({ ...prev, [name]: value }));
      validateField(name, value);
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const day = date.getDay();
      if (day === 1 || day === 2) return;
      
      const selectedSession = sessions.find(s => s.name === formData.session);
      const adjustedDate = adjustSelectedDate(
        date, 
        selectedSession, 
        sessionType, 
        timeslotConfig, 
        generalTimeSlots, 
        specialTimeSlots
      );
      
      setFormData(prev => ({ ...prev, pickupTime: formatDateTimeMinute(adjustedDate) }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const newReferral = checked ? [...prev.referral, value] : prev.referral.filter(item => item !== value);
      return { ...prev, referral: newReferral };
    });
  };

  return {
    sessionType,
    setSessionType,
    formErrors,
    setFormErrors,
    handleInputChange,
    handleDateChange,
    handleCheckboxChange,
    validateField
  };
};
