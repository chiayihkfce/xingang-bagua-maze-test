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

    // A. 處理姓名 (同步更新隊員 1)
    if (name === 'name') {
      const filteredValue = formatName(value);
      setFormData(prev => {
        const newList = [...prev.playerList];
        if (newList.length > 0) {
          newList[0] = { ...newList[0], name: filteredValue };
        } else {
          newList.push({ name: filteredValue, email: prev.email });
        }
        return { ...prev, name: filteredValue, playerList: newList };
      });
      validateField(name, filteredValue);
      return;
    }

    // B. 處理 Email (同步更新隊員 1)
    if (name === 'email') {
      setFormData(prev => {
        const newList = [...prev.playerList];
        if (newList.length > 0) {
          newList[0] = { ...newList[0], email: value };
        } else {
          newList.push({ name: prev.name, email: value });
        }
        return { ...prev, email: value, playerList: newList };
      });
      validateField(name, value);
      return;
    }

    // C. 處理遊玩人數 (初始化隊員名單時自動帶入隊長資訊)
    if (name === 'players') {
      const numPlayers = parseInt(value) || 1;
      setFormData(prev => {
        const newList = [...prev.playerList];
        
        if (numPlayers > newList.length) {
          // 增加人數
          for (let i = newList.length; i < numPlayers; i++) {
            newList.push({ name: '', email: '' });
          }
        } else if (numPlayers < newList.length) {
          // 減少人數
          newList.length = numPlayers;
        }
        
        // 關鍵：確保第一位永遠跟隨目前的主要聯繫人
        if (newList.length > 0) {
          newList[0] = { name: prev.name, email: prev.email };
        }

        return { ...prev, players: value, playerList: newList };
      });
      return;
    }

    // D. 處理購買份數 (連動場次建議)
    if (name === 'quantity') {
      const qty = parseInt(value) || 0;
      setFormData(prev => {
        let updatedSession = prev.session;
        // 關鍵修正：只有在身分是「一般民眾」時，才根據份數自動切換場次
        if (sessionType === '一般預約' && prev.identityType === '一般民眾') {
          const filtered = sessions.filter(s => !s.isSpecial);
          if (qty >= 5) updatedSession = filtered.find(s => s.name.includes('團體優惠'))?.name || filtered[0]?.name || '';
          else updatedSession = filtered.find(s => s.name.includes('單人') || s.name.includes('個人') || s.name.includes('一般'))?.name || filtered[0]?.name || '';
        }
        return { ...prev, quantity: value, session: updatedSession };
      });
      return;
    }

    // E. 其餘欄位處理
    if (name === 'bankLast5') {
      const filteredValue = formatBankLast5(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
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
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlayerInfoChange = (index: number, field: 'name' | 'email', value: string) => {
    setFormData(prev => {
      const newList = [...prev.playerList];
      newList[index] = { ...newList[index], [field]: value };
      
      // 同步更新主要報名人的資訊 (如果修改的是第一個位子)
      let extraUpdates = {};
      if (index === 0) {
        extraUpdates = { [field]: value };
      }
      
      return { ...prev, ...extraUpdates, playerList: newList };
    });
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
    handlePlayerInfoChange, // 新增回傳
    handleDateChange,
    handleCheckboxChange,
    validateField
  };
};
