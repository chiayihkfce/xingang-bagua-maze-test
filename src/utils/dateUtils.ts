import { Session, TimeslotConfig, ClosedDaysConfig } from '../types';

// ... (zhTW, pad, parseDateSafely 保持不變)

/**
 * 判斷特定日期是否為不開放日
 */
export const isDateClosed = (date: Date, config: ClosedDaysConfig): boolean => {
  const day = date.getDay();
  // 1. 每週一(1)、二(2)固定不開放 (不可更改的基礎規則)
  if (day === 1 || day === 2) return true;

  const p = (n: number) => String(n).padStart(2, '0');
  const dateStr = `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;

  // 2. 依據模式判斷
  if (config.mode === 'preset-all') {
    // 排除週末 (0:日, 6:六)
    if (day === 0 || day === 6) return true;
    // 排除國定假日
    if ((config.holidayDates || []).includes(dateStr)) return true;
  } else if (config.mode === 'preset-holidays') {
    // 僅排除國定假日，週末照常
    if ((config.holidayDates || []).includes(dateStr)) return true;
  } else if (config.mode === 'custom') {
    if (config.excludeWeekends && (day === 0 || day === 6)) return true;
    if (
      config.excludeHolidays &&
      (config.holidayDates || []).includes(dateStr)
    ) {
      return true;
    }
  }

  // 3. 手動排除日期 (適用於所有模式，作為額外的活動衝突排除)
  if ((config.manualClosedDates || []).includes(dateStr)) return true;

  return false;
};

/**
 * 2026 台灣國定假日預設列表
 */
export const TAIWAN_HOLIDAYS_2026 = [
  '2026-01-01',
  '2026-02-16',
  '2026-02-17',
  '2026-02-18',
  '2026-02-19',
  '2026-02-20',
  '2026-02-21',
  '2026-02-28',
  '2026-04-03',
  '2026-04-04',
  '2026-05-01',
  '2026-06-19',
  '2026-09-25',
  '2026-10-09',
  '2026-10-10'
];

// 手動定義繁體中文語系資料 (避免依賴外部未安裝的庫)
export const zhTW = {
  localize: {
    month: (n: number) =>
      [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月'
      ][n],
    day: (n: number) => ['日', '一', '二', '三', '四', '五', '六'][n],
    ordinalNumber: (n: any) => n,
    era: (n: any) => ['西元前', '西元'][n],
    quarter: (n: any) => ['第一季', '第二季', '第三季', '第四季'][n],
    dayPeriod: (n: any) => (n < 12 ? '上午' : '下午')
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

  const str = String(dateStr).trim();
  if (!str || str === 'NaN' || str === 'undefined') return new Date();

  // 1. 嘗試原生產解析
  let d = new Date(str);
  if (!isNaN(d.getTime())) return d;

  // 2. 針對「下午/上午」進行預處理
  const isPM = str.includes('下午');
  const isAM = str.includes('上午');

  // 移除中文字並統一分隔符
  const cleanStr = str
    .replace(/[上下]午/g, ' ')
    .replace(/\//g, '-')
    .replace(/\s+/g, ' ')
    .trim();

  // 3. 手動拆解 YYYY-MM-DD HH:mm:ss
  try {
    const parts = cleanStr.split(/[- :]/);
    if (parts.length >= 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const day = parseInt(parts[2]);
      let hour = parts[3] ? parseInt(parts[3]) : 0;
      const min = parts[4] ? parseInt(parts[4]) : 0;
      const sec = parts[5] ? parseInt(parts[5]) : 0;

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
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  
  const ampm = hours < 12 ? '上午' : '下午';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  
  return `${year}/${month}/${day} ${ampm} ${displayHours}:${minutes}:${seconds}`;
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
  closedDaysConfig: ClosedDaysConfig,
  targetSessionName?: string,
  currentSessionName?: string,
  sessionType?: '一般預約' | '特別預約' | ''
) => {
  const checkDate = new Date();
  const selectedSession = currentSessions.find(
    (s) => s.name === (targetSessionName || currentSessionName)
  );

  const fallbackSlots =
    selectedSession?.isSpecial || sessionType === '特別預約'
      ? specialTimeSlots
      : generalTimeSlots;
  const defaultStart =
    fallbackSlots.length > 0 ? fallbackSlots[0] : timeslotConfig.generalStart;

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

  if (
    checkDate.getHours() > endH ||
    (checkDate.getHours() === endH && checkDate.getMinutes() > endM)
  ) {
    checkDate.setDate(checkDate.getDate() + 1);
    // 跳過不開放日
    while (isDateClosed(checkDate, closedDaysConfig)) {
      checkDate.setDate(checkDate.getDate() + 1);
    }
    checkDate.setHours(startH, startM, 0, 0);
  } else if (
    checkDate.getHours() < startH ||
    (checkDate.getHours() === startH && checkDate.getMinutes() < startM)
  ) {
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
    if (isDateClosed(checkDate, closedDaysConfig)) {
      checkDate.setDate(checkDate.getDate() + 1);
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

    const isTakenBySpecial = currentSessions.some((s) => {
      let sDate = s.fixedDate || '';
      if (sDate.includes('T')) sDate = sDate.split('T')[0];
      return sDate === dateStr;
    });

    const allowedSlots = selectedSession?.fixedTime
      ? selectedSession.fixedTime.split(',')
      : isTakenBySpecial
        ? specialTimeSlots
        : generalTimeSlots;

    if (!allowedSlots.includes(timeStr)) {
      checkDate.setMinutes(checkDate.getMinutes() + 30);
      continue;
    }

    const hasConflict = currentSessions.some((s) => {
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
export const generateTimeSlots = (
  start: string,
  end: string,
  interval: number
) => {
  const slots = [];
  const current = new Date(`2026-01-01T${start}:00`);
  const last = new Date(`2026-01-01T${end}:00`);
  while (current <= last) {
    slots.push(`${pad(current.getHours())}:${pad(current.getMinutes())}`);
    current.setMinutes(current.getMinutes() + interval);
  }
  return slots;
};

/**
 * 校正使用者選擇的預約日期與時間 (處理今日過期、週一二公休等邏輯)
 */
export const adjustSelectedDate = (
  date: Date,
  selectedSession: Session | undefined,
  sessionType: string,
  timeslotConfig: TimeslotConfig,
  generalTimeSlots: string[],
  specialTimeSlots: string[],
  closedDaysConfig: ClosedDaysConfig
): Date => {
  const adjusted = new Date(date);
  const now = new Date();
  const isToday =
    adjusted.getFullYear() === now.getFullYear() &&
    adjusted.getMonth() === now.getMonth() &&
    adjusted.getDate() === now.getDate();

  const fallbackSlots =
    selectedSession?.isSpecial || sessionType === '特別預約'
      ? specialTimeSlots
      : generalTimeSlots;
  const defaultStart =
    fallbackSlots.length > 0 ? fallbackSlots[0] : timeslotConfig.generalStart;
  const defaultEnd =
    fallbackSlots.length > 0
      ? fallbackSlots[fallbackSlots.length - 1]
      : timeslotConfig.generalEnd;

  let startH = parseInt(defaultStart.split(':')[0]);
  let startM = parseInt(defaultStart.split(':')[1]);
  let endH = parseInt(defaultEnd.split(':')[0]);
  let endM = parseInt(defaultEnd.split(':')[1]);

  if (selectedSession?.fixedTime) {
    const times = selectedSession.fixedTime.split(',').sort();
    const firstParts = times[0].split(':');
    const lastParts = times[times.length - 1].split(':');
    startH = parseInt(firstParts[0]);
    startM = parseInt(firstParts[1]);
    endH = parseInt(lastParts[0]);
    endM = parseInt(lastParts[1]);
  }

  // 2. 執行校正邏輯
  if (isToday) {
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const selectedHour = adjusted.getHours();
    const selectedMin = adjusted.getMinutes();

    let needsAdjustment = false;
    if (
      selectedHour < currentHour ||
      (selectedHour === currentHour && selectedMin < currentMin)
    ) {
      needsAdjustment = true;
    }
    if (
      selectedHour < startH ||
      (selectedHour === startH && selectedMin < startM)
    ) {
      needsAdjustment = true;
    }

    if (needsAdjustment) {
      if (
        currentHour < startH ||
        (currentHour === startH && currentMin < startM)
      ) {
        adjusted.setHours(startH, startM, 0, 0);
      } else if (
        currentHour > endH ||
        (currentHour === endH && currentMin >= endM)
      ) {
        adjusted.setDate(adjusted.getDate() + 1);
        while (isDateClosed(adjusted, closedDaysConfig)) {
          adjusted.setDate(adjusted.getDate() + 1);
        }
        adjusted.setHours(startH, startM, 0, 0);
      } else {
        if (currentMin < 30) {
          adjusted.setHours(currentHour, 30, 0, 0);
        } else {
          adjusted.setHours(currentHour + 1, 0, 0, 0);
        }
      }
    }
  } else {
    const hours = adjusted.getHours();
    const mins = adjusted.getMinutes();
    if (hours < startH || (hours === startH && mins < startM) || hours > endH) {
      adjusted.setHours(startH, startM, 0, 0);
    }
  }

  return adjusted;
};

/**
 * 清洗場次時間字串，統一轉為 HH:mm 格式並移除無效時段
 */
export const cleanSessionTimeFormat = (fixedTime: string): string => {
  return (fixedTime || '')
    .split(',')
    .map((t: string) => {
      const p = t.trim();
      if (p.includes('T')) return p.split('T')[1].substring(0, 5);
      if (p.length > 10) {
        const m = p.match(/(\d{2}:\d{2})/);
        return m ? m[1] : '';
      }
      return p;
    })
    .filter(
      (t: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(t) && t !== '23:30'
    )
    .join(',');
};

/**
 * 在逗號分隔的時間字串中切換特定的時間點 (加入或移除)，並保持排序
 */
export const toggleTimeInString = (
  timeString: string,
  timeToToggle: string
): string => {
  const currentTimes = timeString ? timeString.split(',').filter(Boolean) : [];
  const newTimes = currentTimes.includes(timeToToggle)
    ? currentTimes.filter((t) => t !== timeToToggle)
    : [...currentTimes, timeToToggle].sort();
  return newTimes.join(',');
};
