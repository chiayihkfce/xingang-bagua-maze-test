/**
 * 表單輸入格式化工具
 */

/**
 * 格式化姓名：移除數字並限制最大長度
 */
export const formatName = (value: string, maxLength: number = 20): string => {
  const filtered = value.replace(/[0-9]/g, '');
  return filtered.slice(0, maxLength);
};

/**
 * 格式化銀行末五碼：僅保留數字並限制 5 碼
 */
export const formatBankLast5 = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 5);
};

/**
 * 格式化電話：僅保留數字並根據國碼限制長度
 */
export const formatPhone = (value: string, countryCode: string): string => {
  const filtered = value.replace(/\D/g, '');
  const rules: { [key: string]: number } = { 
    '+886': 10, 
    '+852': 8, 
    '+853': 8, 
    '+60': 11, 
    '+65': 8, 
    'landline': 10 
  };
  const maxLen = rules[countryCode] || 15;
  return filtered.slice(0, maxLen);
};

/**
 * 將國碼與電話號碼組合為存入資料庫的格式 (強化標準化處理)
 */
export const formatPhoneForDB = (countryCode: string, phone: string): string => {
  if (countryCode === 'landline') return `市內電話${phone}`;
  
  let cleanPhone = phone.trim();
  // 針對台灣手機號碼進行去零標準化 (+886 09... -> +8869...)
  if (countryCode === '+886' && cleanPhone.startsWith('0')) {
    cleanPhone = cleanPhone.substring(1);
  }
  
  return `${countryCode}${cleanPhone}`;
};

