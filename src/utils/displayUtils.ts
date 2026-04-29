import { Session } from '../types';

/**
 * 取得場次顯示名稱 (中/英)
 */
export const getSessionDisplayName = (
  chineseName: string,
  lang: string,
  sessions: Session[]
) => {
  if (lang === 'zh') return chineseName;
  const session = sessions.find((s) => s.name === chineseName);
  return session?.enName || chineseName;
};

/**
 * 取得取件地點顯示名稱 (中/英)
 */
export const getPickupLocationDisplay = (
  location: string,
  lang: string,
  t: any
) => {
  if (lang === 'zh') return location;
  if (location.includes('新港文教基金會')) return t.locFoundation;
  if (location.includes('培桂堂')) return t.locPeiGui;
  return location;
};

/**
 * 取得付款方式顯示名稱 (中/英)
 */
export const getPaymentMethodDisplay = (
  method: string,
  lang: string,
  t: any
) => {
  if (lang === 'zh') return method.split(' (')[0];
  if (method.includes('現金支付')) return t.payInPerson;
  if (method.includes('銀行轉帳')) return t.bankTransfer;
  if (method.includes('電子支付')) return 'Digital Payment';
  return method;
};

/**
 * 產生列印用的今日簽到表 HTML 內容
 */
export const generatePrintContent = (data: any[][]) => {
  const today = new Date().toLocaleDateString('zh-TW');

  const rowsHtml = data
    .map(
      (row, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${row[2]}</td>
      <td>${row[3]}</td>
      <td>${row[11]?.split(' ')[1] || '全天'}</td>
      <td>${row[6]}</td>
      <td>${row[7]}</td>
      <td style="width: 150px;"></td>
    </tr>
    `
    )
    .join('');

  return `
    <html>
      <head>
        <title>今日簽到表 - ${today}</title>
        <style>
          body { font-family: "Microsoft JhengHei", sans-serif; padding: 20px; }
          h1 { text-align: center; color: #333; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #333; padding: 12px 8px; text-align: center; }
          th { background-color: #f2f2f2; }
          tr { page-break-inside: avoid; }
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h1>活動當日簽到表 (${today})</h1>
        <table>
          <thead>
            <tr>
              <th style="width: 40px;">序</th>
              <th style="width: 100px;">姓名</th>
              <th style="width: 150px;">電話</th>
              <th style="width: 100px;">預約時間</th>
              <th style="width: 60px;">份數</th>
              <th style="width: 60px;">人數</th>
              <th>簽到欄</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
    </html>
    `;
};

/**
 * 複製文字到剪貼簿
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('無法複製文字: ', err);
    return false;
  }
};
