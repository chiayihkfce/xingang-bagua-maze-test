/**
 * 報名資料排序工具函數
 * @param data 不含標題列的原始資料陣列
 * @param index 要排序的欄位索引
 * @param direction 排序方向 'asc' | 'desc'
 */
export const sortSubmissions = (
  data: any[][],
  index: number,
  direction: 'asc' | 'desc'
): any[][] => {
  return [...data].sort((a, b) => {
    let valA = a[index];
    let valB = b[index];

    // 1. 日期排序 (索引 0 為報名時間)
    if (index === 0) {
      const dateA = new Date(valA).getTime();
      const dateB = new Date(valB).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

    // 2. 數值排序
    const numA = Number(valA);
    const numB = Number(valB);
    if (
      !isNaN(numA) &&
      !isNaN(numB) &&
      typeof valA !== 'boolean' &&
      typeof valB !== 'boolean'
    ) {
      return direction === 'asc' ? numA - numB : numB - numA;
    }

    // 3. 字串排序
    valA = String(valA).toLowerCase();
    valB = String(valB).toLowerCase();
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * 計算儀表板動態統計數據 (針對篩選日期進行精確計算)
 */
export const calculateDashboardStats = (
  submissions: any[][],
  adminFilterDate: Date | null,
  dashboardStats: any
) => {
  const baseStats = dashboardStats || {
    pendingCount: 0,
    totalRevenue: 0,
    todayKits: 0,
    todayPlayers: 0
  };

  // 如果沒有選日期，直接顯示從 Firebase 監聽到的全域統計 (包含今日數據)
  if (!adminFilterDate) {
    return baseStats;
  }

  // 當有選特定日期時，必須「精確計算」該日清單
  let kits = 0;
  let players = 0;

  const formattedFilterDate = `${adminFilterDate.getFullYear()}-${String(adminFilterDate.getMonth() + 1).padStart(2, '0')}-${String(adminFilterDate.getDate()).padStart(2, '0')}`;

  // 從索引 1 開始 (跳過標題列)
  for (let i = 1; i < submissions.length; i++) {
    const rowPickupTime = String(submissions[i][11] || '');
    // 只有當該列的預約日期與篩選日期相符時才計入
    if (rowPickupTime.startsWith(formattedFilterDate)) {
      kits += parseInt(submissions[i][6]) || 0;
      players += parseInt(submissions[i][7]) || 0;
    }
  }

  return {
    ...baseStats,
    todayKits: kits,
    todayPlayers: players
  };
};

/**
 * 根據關鍵字過濾報名資料 (模糊搜尋姓名、電話、Email)
 */
export const filterSubmissions = (data: any[][], keyword: string): any[][] => {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return data;

  return data.filter(
    (row) =>
      String(row[2] || '')
        .toLowerCase()
        .includes(kw) ||
      String(row[3] || '').includes(kw) ||
      String(row[4] || '')
        .toLowerCase()
        .includes(kw)
  );
};

/**
 * 取得視覺化分析所需的數據
 */
export const getAnalyticsData = (submissions: any[][]) => {
  const data = submissions.slice(1); // 跳過標題
  const referralMap: Record<string, number> = {};
  const sessionMap: Record<string, number> = {};
  const trendMap: Record<string, number> = {};
  const quantityMap: Record<string, number> = {};
  const paymentMap: Record<string, number> = {};

  data.forEach((row) => {
    // 1. 得知管道分析 (索引 13)
    const referralRaw = row[13] || '其他';
    const referrals = String(referralRaw)
      .split(/[,,、\s]/)
      .filter(Boolean);
    referrals.forEach((ref) => {
      referralMap[ref] = (referralMap[ref] || 0) + 1;
    });

    // 2. 場次熱度分析 (索引 5)
    const session = row[5] || '未定';
    sessionMap[session] = (sessionMap[session] || 0) + 1;

    // 3. 報名趨勢分析 (索引 0 報名時間: "2024/04/17 12:00:00")
    const datePart = String(row[0] || '').split(' ')[0] || '未知';
    trendMap[datePart] = (trendMap[datePart] || 0) + 1;

    // 4. 份數分佈 (索引 6)
    const qty = String(row[6] || '1');
    const qtyKey = `${qty} 份`;
    quantityMap[qtyKey] = (quantityMap[qtyKey] || 0) + 1;

    // 5. 付款方式佔比 (索引 9)
    const pay = row[9] || '其他';
    paymentMap[pay] = (paymentMap[pay] || 0) + 1;
  });

  const referralData = Object.entries(referralMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const sessionData = Object.entries(sessionMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const trendData = Object.entries(trendMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.name.localeCompare(b.name)); // 依日期正序

  const quantityData = Object.entries(quantityMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));

  const paymentData = Object.entries(paymentMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return { referralData, sessionData, trendData, quantityData, paymentData };
};
