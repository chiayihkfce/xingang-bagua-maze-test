import { Session, TimeslotConfig } from '../types'

// 手動定義繁體中文語系資料 (避免依賴外部未安裝的庫)
export const zhTW = {
  localize: {
    month: (n: number) => ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'][n],
    day: (n: number) => ['日','一','二','三','四','五','六'][n],
    ordinalNumber: (n: any) => n,
    era: (n: any) => ['西元前', '西元'][n],
    quarter: (n: any) => ['第一季', '第二季', '第三季', '第四季'][n],
    dayPeriod: (n: any) => n < 12 ? '上午' : '下午'
  },
  formatLong: {
    date: () => 'yyyy/MM/dd',
    time: () => 'HH:mm',
    dateTime: () => 'yyyy/MM/dd HH:mm'
  }
};

export const pad = (n: number) => String(n).padStart(2, '0');

// 終極安全解析日期 (處理 Google Sheets 的各種奇怪在地化格式)
export const parseDateSafely = (dateStr: any) => {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr;

  // 如果是數字 (Excel 序號格式)
  if (typeof dateStr === 'number') return new Date(dateStr);

  let str = String(dateStr).trim();
  if (!str || str === 'NaN' || str === 'undefined') return new Date();

  // 1. 嘗試原生產解析
  let d = new Date(str);
  if (!isNaN(d.getTime())) return d;

  // 2. 針對「下午/上午」進行預處理
  let isPM = str.includes('下午');
  let isAM = str.includes('上午');

  // 移除中文字並統一分隔符
  let cleanStr = str.replace(/[上下]午/g, ' ')
                    .replace(/\//g, '-')
                    .replace(/\s+/g, ' ')
                    .trim();

  // 3. 手動拆解 YYYY-MM-DD HH:mm:ss
  try {
    const parts = cleanStr.split(/[- :]/);
    if (parts.length >= 3) {
      let year = parseInt(parts[0]);
      let month = parseInt(parts[1]) - 1;
      let day = parseInt(parts[2]);
      let hour = parts[3] ? parseInt(parts[3]) : 0;
      let min = parts[4] ? parseInt(parts[4]) : 0;
      let sec = parts[5] ? parseInt(parts[5]) : 0;

      if (isPM && hour < 12) hour += 12;
      if (isAM && hour === 12) hour = 0;

      d = new Date(year, month, day, hour, min, sec);
      if (!isNaN(d.getTime())) return d;
    }
  } catch (e) {
    console.error('日期手動拆解失敗:', str);
  }

  return new Date(); // 真的不行就回傳當前時間，避免 NaN
};

export const formatFullDateTime = (date: any) => {
  const d = parseDateSafely(date);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

export const formatDateTimeMinute = (date: any) => {
  const d = parseDateSafely(date);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

/**
 * 尋找最早可用場次的邏輯
 */
export const findEarliestSlot = (
  currentSessions: Session[], 
  timeslotConfig: TimeslotConfig, 
  generalTimeSlots: string[], 
  specialTimeSlots: string[], 
  targetSessionName?: string,
  currentSessionName?: string,
  sessionType?: '一般預約' | '特別預約' | ''
) => {
  let checkDate = new Date();
  const selectedSession = currentSessions.find(s => s.name === (targetSessionName || currentSessionName));
  
  // 修正：優先從時段陣列抓取第一個值，而非全域設定的開始時間
  const fallbackSlots = (selectedSession?.isSpecial || sessionType === '特別預約') ? specialTimeSlots : generalTimeSlots;
  const defaultStart = fallbackSlots.length > 0 ? fallbackSlots[0] : timeslotConfig.generalStart;

  let startH = parseInt(defaultStart.split(':')[0]);
  let startM = parseInt(defaultStart.split(':')[1]);
  let endH = parseInt(timeslotConfig.generalEnd.split(':')[0]);
  let endM = parseInt(timeslotConfig.generalEnd.split(':')[1]);

  if (selectedSession?.fixedTime) {
    const times = selectedSession.fixedTime.split(',').sort();
    const firstParts = times[0].split(':');
    const lastParts = times[times.length - 1].split(':');
    startH = parseInt(firstParts[0]);
    startM = parseInt(firstParts[1]);
    endH = parseInt(lastParts[0]);
    endM = parseInt(lastParts[1]);
  }

  if (checkDate.getHours() > endH || (checkDate.getHours() === endH && checkDate.getMinutes() > endM)) {
    checkDate.setDate(checkDate.getDate() + 1);
    // 跳過週一(1)與週二(2)
    while (checkDate.getDay() === 1 || checkDate.getDay() === 2) {
      checkDate.setDate(checkDate.getDate() + 1);
    }
    checkDate.setHours(startH, startM, 0, 0);
  } else if (checkDate.getHours() < startH || (checkDate.getHours() === startH && checkDate.getMinutes() < startM)) {
    checkDate.setHours(startH, startM, 0, 0);
  } else {
    const mins = checkDate.getMinutes();
    if (mins > 0 && mins <= 30) {
      checkDate.setMinutes(30, 0, 0);
    } else if (mins > 30) {
      checkDate.setHours(checkDate.getHours() + 1, 0, 0, 0);
    }
  }

  for (let i = 0; i < 1440; i++) { 
    const day = checkDate.getDay();
    if (day === 1 || day === 2) {
      checkDate.setDate(checkDate.getDate() + (day === 1 ? 2 : 1));
      checkDate.setHours(startH, startM, 0, 0);
      continue;
    }

    const hours = checkDate.getHours();
    const mins = checkDate.getMinutes();
    if (hours > endH || (hours === endH && mins > 0)) {
      checkDate.setDate(checkDate.getDate() + 1);
      checkDate.setHours(startH, startM, 0, 0);
      continue;
    }

    const dateStr = `${checkDate.getFullYear()}-${pad(checkDate.getMonth() + 1)}-${pad(checkDate.getDate())}`;
    const timeStr = `${pad(checkDate.getHours())}:${pad(checkDate.getMinutes())}`;
    
    const isTakenBySpecial = currentSessions.some(s => {
      let sDate = s.fixedDate || '';
      if (sDate.includes('T')) sDate = sDate.split('T')[0];
      return sDate === dateStr;
    });

    const allowedSlots = selectedSession?.fixedTime 
      ? selectedSession.fixedTime.split(',') 
      : (isTakenBySpecial ? specialTimeSlots : generalTimeSlots);
    
    if (!allowedSlots.includes(timeStr)) {
      checkDate.setMinutes(checkDate.getMinutes() + 30);
      continue;
    }

    const hasConflict = currentSessions.some(s => {
      let sDate = s.fixedDate || '';
      if (sDate.includes('T')) sDate = sDate.split('T')[0];
      return sDate === dateStr && s.fixedTime?.split(',').includes(timeStr);
    });

    if (!hasConflict) {
      return formatDateTimeMinute(checkDate);
    }

    checkDate.setMinutes(checkDate.getMinutes() + 30);
  }
  return '';
};

/**
 * 根據起始、結束時間與間隔生成時間數組 (HH:mm)
 */
export const generateTimeSlots = (start: string, end: string, interval: number) => {
  const slots = [];
  let current = new Date(`2026-01-01T${start}:00`);
  const last = new Date(`2026-01-01T${end}:00`);
  while (current <= last) {
    slots.push(`${pad(current.getHours())}:${pad(current.getMinutes())}`);
    current.setMinutes(current.getMinutes() + interval);
  }
  return slots;
};
