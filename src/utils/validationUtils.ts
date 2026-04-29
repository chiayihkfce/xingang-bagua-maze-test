/**
 * 欄位驗證純邏輯函數
 * 返回錯誤訊息字串，若無錯誤則返回空字串
 */
export const validateFieldLogic = (
  name: string,
  value: string,
  countryCode: string,
  t: any
): string => {
  let error = '';

  if (name === 'email') {
    if (value && !value.includes('@')) {
      error = t.errorEmail;
    }
  } else if (name === 'phone') {
    if (value) {
      const rules: { [key: string]: number[] } = {
        '+886': [9, 10],
        '+852': [8],
        '+853': [8],
        '+60': [9, 10, 11],
        '+65': [8],
        landline: [9, 10]
      };
      const allowedLengths = rules[countryCode] || [6, 15];
      if (
        !allowedLengths.includes(value.length) ||
        (countryCode === 'landline' && !value.startsWith('0'))
      ) {
        error = t.errorPhone;
      }
    }
  } else if (name === 'name') {
    if (value && value.length < 2) {
      error = t.errorName;
    }
  }

  return error;
};
