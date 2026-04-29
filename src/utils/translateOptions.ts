/**
 * 智慧翻譯工具 (免 API 版)
 * 專門處理資料庫動態名稱的翻譯組合。
 */

const translationMap: { [key: string]: string } = {
  // --- 故事背景與標題 ---
  '光緒 x 昭和': 'Qing Dynasty x Showa Era',
  '【新港八卦謎蹤】': '【Xingang Bagua: The Mystery Trail】',
  '實境解謎 活動報名': 'Immersive Mystery Game Registration',
  故事背景: 'The Story',
  '昭和九年。一場疫病肆虐新港。':
    'The year is 1934 (Showa 9). A mysterious shadow falls over the town of Xingang as an unknown plague begins to spread.',
  '診療所裡人滿為患，哀嚎與咳嗽聲交織成一片不安。':
    'Clinics overflow with the afflicted, their cries and heavy coughs echoing through the restless air.',
  '——然而這一切，對白鸞卿來說，都不該存在。':
    '—Yet for Bai Luan-qing, this is a world that shouldn’t exist.',
  '身為清朝縣丞，他原在勘查新港水脈與風水。卻在卦相異動之際，頭暈目眩——':
    'A Qing Dynasty official tasked with surveying the town’s ley lines, he was suddenly struck by a wave of dizziness as the Bagua shifted—plunging him into the unknown.',
  '醒來時，已置身七十餘年後的日治時期。陌生的年號、陌生的語言、陌生的疫病。他看到印著不明政策的公文，聽到祈求平安的廟宇喧囂。':
    'He awoke over seventy years in the future, trapped in the peak of the Japanese Colonial Era. A world of foreign tongues, enigmatic decrees, and a terrifying disease. Through the haze, he hears the clamor of local temples where thousands pray for salvation.',
  '他發現——新港的卦象錯亂，守護神失蹤。八卦動盪，時空重疊，光緒與昭和，交錯於此。':
    'The spiritual alignment of Xingang is in turmoil; the town’s guardian deity has vanished. History has fractured, weaving the Guangxu and Showa eras into a single, unstable reality.',
  '若不修正卦象，他將永遠困在這個不屬於他的年代；若不找出疫病源頭，百姓將持續凋零。':
    'Unless the Bagua is mended, he will be lost in time forever. Unless the source of the plague is found, the people of Xingang will continue to wither away.',
  '你，能協助他找出真相嗎？': 'Can you help him uncover the truth?',

  // --- 活動內容 ---
  活動內容: 'Event Details',
  '準備好踏上一場神秘又刺激的冒險了嗎？這場解謎將帶你穿梭在新港的巷弄間，解開織進文化與歷史中的謎團。':
    'Are you ready for an immersive adventure? Navigate the historic back-alleys of Xingang and unravel the secrets woven into the town’s cultural and spiritual tapestry.',
  '► 解謎包定價': '► Puzzle Kit Price',
  配合活動享優惠: 'Special discounts available',
  '► 建議人數': '► Group Size',
  '1份解謎包 1-4 人使用': '1 kit recommended for 1-4 players',
  '► 遊玩時間': '► Est. Duration',
  '約 2 小時': 'Approx. 2 hours',
  '► 內容物': '► Kit Contents',
  '解謎道具、特製伴手禮': 'Puzzle tools and exclusive local souvenirs',

  // --- 表單標題與標籤 ---
  基本資料: 'Primary Contact',
  '報名人 姓名': 'Full Name',
  請輸入姓名: 'Enter your name',
  '聯絡電話(手機為主)': 'Phone Number (Mobile preferred)',
  'Email (會寄送行前通知)': 'Email Address (For pre-event notifications)',
  您的電子郵件: 'email@example.com',
  報名資訊: 'Booking Details',
  '【場次類型】': '【Booking Type】',
  '一般預約 (自由選擇遊玩時段)': 'General Booking (Flexible schedule)',
  '【詳細場次】': '【Available Sessions】',
  '系統已自動選定：': 'System Assigned:',
  '★ 優惠提醒：一般預約滿 5 份(含)以上可享有團體優惠價唷!!!!!!':
    '★ Group Discount: Special rates apply for orders of 5 or more kits!',
  份數: 'Number of Kits',
  '當天遊玩人數 (每份解謎包建議 1-4 人)':
    'Total Players (1-4 players per kit recommended)',
  人: 'people',

  // --- 場次關鍵字 ---
  市集沉浸場: 'Market Immersive Session',
  特別場: 'Special Session',
  NPC互動: 'NPC Interaction',
  劇情演繹: 'Theatrical Performance',
  '（一）': '(Mon)',
  '（二）': '(Tue)',
  '（三）': '(Wed)',
  '（四）': '(Thu)',
  '（五）': '(Fri)',
  '（六）': '(Sat)',
  '（日）': '(Sun)',
  個人購買特惠價: 'Individual Special Price',
  隨買隨玩: 'Play anytime',
  '建議1-4人遊玩': '1-4 players recommended',
  遊戲體感較佳: 'best experience',
  團體優惠價: 'Group Discount Price',
  購買5包起: '5+ kits',
  可享此優惠: 'special rate applies',
  並附贈引路人隨行: 'includes a guide',
  一般預約: 'General Booking',
  特別預約: 'Special Booking',
  團體優惠: 'Group Discount',
  解謎包: 'Puzzle Kit',
  單人: 'Single',
  個人: 'Individual',
  含: 'incl.',
  預約: 'Booking',
  場次: 'Session',
  迷宮: 'Maze',
  八卦: 'Bagua',
  新港: 'Hsinkang',

  // --- 繳費與取件 ---
  繳費與取件: 'Payment & Pickup',
  繳費方式: 'Payment Method',
  'Line Pay': 'Line Pay',
  電子支付說明: 'Digital Payment Instructions',
  '送出報名後，系統將提供專屬支付連結進行付款':
    'After submitting the registration, the system will provide a dedicated payment link.',
  親至新港文教基金會繳費: 'Pay in person at Hsinkang Foundation (Reading Room)',
  新港鄉農會: "Hsinkang Township Farmers' Association",
  代碼: 'Code',
  匯款銀行: 'Bank',
  帳號: 'Account',
  戶名: 'Account Name',
  電子支付: 'Digital Payment',
  現金支付: 'Cash Payment',
  銀行轉帳: 'Bank Transfer',
  ATM: 'ATM',
  現場繳費: 'Pay in Person',
  '預計遊玩日期 & 時間 (開放日 09:00-15:00，週一二不開放)':
    'Preferred Pickup Date & Time (Open Wed-Sun, 09:00-15:00)',
  領取地點: 'Pickup Location',
  '新港文教基金會(閱讀館)':
    'Hsinkang Foundation of Culture and Education Office (Reading Room)',
  '培桂堂(建議選此處，此處為解謎起點)':
    'Pei-Gui Hall (Recommended - the starting point for the game)',

  // --- 其他 ---
  其他: 'Other',
  '如何得知本活動內容? (可多選)':
    'How did you hear about us? (Select all that apply)',
  基金會FB: 'Foundation Facebook',
  基金會LINE: 'Foundation LINE',
  基金會電子報: 'Email Newsletter',
  活動現場: 'At an Event',
  親友介紹: 'Friends/Family',
  其他FB社團: 'Other Facebook Groups',
  '海報/摺頁': 'Poster/Flyer',
  '其他/備註': 'Additional Remarks / Requests',
  '估計總額：': 'Grand Total: ',

  // --- 其他關鍵字 ---
  新港文教基金會: 'Hsinkang Cultural and Educational Foundation',
  閱讀館: 'Reading Room',
  培桂堂: 'Pei-Gui Hall',
  解謎起點: 'starting point for puzzle solving'
};

export const translateOption = (text: string, lang: string): string => {
  if (lang !== 'en' || !text) return text;
  if (translationMap[text]) return translationMap[text];

  let result = text;
  const keywords = Object.keys(translationMap).sort(
    (a, b) => b.length - a.length
  );
  keywords.forEach((key) => {
    if (result.includes(key)) {
      result = result.split(key).join(translationMap[key]);
    }
  });
  return result.replace(/\s+/g, ' ').trim();
};
