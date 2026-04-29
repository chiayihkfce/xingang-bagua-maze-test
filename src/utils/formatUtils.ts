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
  let clean = value.trim();

  // 針對台灣國碼的處理：如果使用者貼上了帶國碼的號碼，幫他把國碼去掉，以免超出 10 碼限制
  if (countryCode === '+886') {
    if (clean.startsWith('+886')) {
      clean = clean.slice(4);
    } else if (clean.startsWith('886')) {
      clean = clean.slice(3);
    }

    // 如果去掉後變成 00 開頭 (例如原為 +88609...)，則去掉一個 0
    if (clean.startsWith('00')) {
      clean = clean.slice(1);
    }
  }

  // 僅保留數字
  const filtered = clean.replace(/\D/g, '');

  const rules: { [key: string]: number } = {
    '+886': 10,
    '+852': 8,
    '+853': 8,
    '+60': 11,
    '+65': 8,
    landline: 10
  };
  const maxLen = rules[countryCode] || 15;
  return filtered.slice(0, maxLen);
};

/**
 * 將國碼與電話號碼組合為存入資料庫的格式 (強化標準化處理)
 */
export const formatPhoneForDB = (
  countryCode: string,
  phone: string
): string => {
  if (countryCode === 'landline') return `市內電話${phone}`;

  const cleanPhone = phone.trim();

  // 針對台灣號碼的特別處理：不存國碼，且在存檔前補 0
  if (countryCode === '+886') {
    if (cleanPhone.startsWith('0')) {
      return cleanPhone;
    } else if (cleanPhone.startsWith('9')) {
      // 在這裡才補 0
      return `0${cleanPhone}`;
    }
    return cleanPhone;
  }

  return `${countryCode}${cleanPhone}`;
};
