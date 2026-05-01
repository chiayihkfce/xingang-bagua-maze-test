export type Lang = 'zh' | 'en';
export type Theme = 'dark' | 'light';

export interface AdminAccount {
  id: string;
  username: string;
  password?: string;
  lineUid?: string; // 新增：用於 LINE 一鍵登入
  nickname?: string;
  role: 'super' | 'admin';
  lastLogin?: string;
}

export interface Session {
  id?: string;
  name: string;
  price: number;
  fixedDate?: string;
  fixedTime?: string;
  isSpecial?: boolean;
  enName?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'inPerson' | 'bank' | 'linepay' | 'other';
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  link?: string;
  instructions?: string;
}

export interface PlayerInfo {
  name: string;
  email: string;
}

export interface FormData {
  email: string;
  name: string;
  countryCode: string;
  phone: string;
  contactEmail: string;
  session: string;
  quantity: string;
  players: string;
  playerList: PlayerInfo[]; // 新增：儲存所有玩家的個人資訊
  totalAmount: string;
  paymentMethod: string;
  bankLast5: string;
  pickupTime: string;
  pickupLocation: string;
  referral: string[];
  notes: string;
  hp_field: string;
  identityType: string; // 新增：身分類型
}

export interface IdentityPricing {
  id: string;
  enabled: boolean;
  name: string;
  price: number;
}

export interface FormErrors {
  email: string;
  phone: string;
  name: string;
}

export interface TimeslotConfig {
  generalStart: string;
  generalEnd: string;
  generalInterval: number;
  specialStart: string;
  specialEnd: string;
  specialInterval: number;
}

export interface DashboardStats {
  pendingCount: number;
  totalRevenue: number;
  todayKits: number;
  todayPlayers: number;
}

export type SealType =
  | 'full-yang'
  | 'full-yin'
  | 'zh-vert-rl-yang'
  | 'zh-vert-rl-yin'
  | 'zh-vert-lr-yang'
  | 'zh-vert-lr-yin'
  | 'zh-horiz-lr-yang'
  | 'zh-horiz-lr-yin';

export interface SealConfig {
  activeSeal: SealType;
}

export type ClosedDaysMode = 'preset-all' | 'preset-holidays' | 'custom';

export interface ClosedDaysConfig {
  mode: ClosedDaysMode;
  excludeWeekends: boolean;
  excludeHolidays: boolean;
  manualClosedDates: string[]; // 格式: YYYY-MM-DD
  holidayDates: string[]; // 系統預設或手動維護的國定假日列表
}
