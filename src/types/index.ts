export type Lang = 'zh' | 'en';
export type Theme = 'dark' | 'light';

export interface AdminAccount {
  id: string;
  username: string;
  password?: string;
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

export interface FormData {
  email: string;
  name: string;
  countryCode: string;
  phone: string;
  contactEmail: string;
  session: string;
  quantity: string;
  players: string;
  totalAmount: string;
  paymentMethod: string;
  bankLast5: string;
  pickupTime: string;
  pickupLocation: string;
  referral: string[];
  notes: string;
  hp_field: string;
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
