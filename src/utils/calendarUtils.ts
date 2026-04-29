/**
 * 產生 Google Calendar 連結
 */
export const generateGoogleCalendarUrl = (data: {
  title: string;
  startTime: string; // yyyy-MM-dd HH:mm
  location: string;
  details: string;
}) => {
  // 將 yyyy-MM-dd HH:mm 轉換為 Date 對象
  // 處理 Safari 相容性，將 '-' 換成 '/'
  const start = new Date(data.startTime.replace(/-/g, '/'));
  if (isNaN(start.getTime())) return '';

  const end = new Date(start.getTime() + 180 * 60 * 1000); // 延長至 3 小時

  // 格式化為 Google 要求的本地時間格式 (YYYYMMDDTHHMMSS)
  const format = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${y}${m}${d}T${h}${min}${s}`;
  };

  const url = new URL('https://www.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', data.title);
  url.searchParams.append('dates', `${format(start)}/${format(end)}`);
  url.searchParams.append('details', data.details);
  url.searchParams.append('location', data.location);

  return url.toString();
};

/**
 * 產生並下載 iCal (.ics) 檔案
 */
export const downloadIcalFile = (data: {
  title: string;
  startTime: string;
  location: string;
  details: string;
}) => {
  const start = new Date(data.startTime.replace(/-/g, '/'));
  if (isNaN(start.getTime())) return;

  const end = new Date(start.getTime() + 180 * 60 * 1000);

  // iCal 本地時間格式 (YYYYMMDDTHHMMSS)
  const format = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${y}${m}${d}T${h}${min}${s}`;
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'PROID:-//Xingang Bagua Maze//NONSGML v1.0//EN',
    'BEGIN:VEVENT',
    `DTSTART:${format(start)}`,
    `DTEND:${format(end)}`,
    `SUMMARY:${data.title}`,
    `LOCATION:${data.location}`,
    `DESCRIPTION:${data.details.replace(/\n/g, '\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'xingang-bagua-maze.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
