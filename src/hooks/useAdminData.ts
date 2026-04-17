import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  where, 
  limit 
} from "firebase/firestore";
import { db } from "../firebase";
import { DashboardStats } from '../types';
import { filterSubmissions } from '../utils/dataUtils';

interface UseAdminDataProps {
  isAdmin: boolean;
  adminFilterDate: Date | null;
  adminSearchKeyword: string;
  setIsDataLoading: (val: boolean) => void;
}

/**
 * 處理管理員後台資料的即時監聽 (報名、回收桶、日誌、統計)
 */
export const useAdminData = ({ 
  isAdmin, 
  adminFilterDate, 
  adminSearchKeyword, 
  setIsDataLoading 
}: UseAdminDataProps) => {
  const [submissions, setSubmissions] = useState<any[][]>([]);
  const [deletedSubmissions, setDeletedSubmissions] = useState<any[][]>([]);
  const [logs, setLogs] = useState<any[][]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [totalRows, setTotalRows] = useState(0);

  const [visibleColumns, setVisibleColumns] = useState<number[]>(() => {
    const saved = localStorage.getItem('visibleColumns');
    return saved ? JSON.parse(saved) : [];
  });

  /**
   * 欄位切換邏輯 (加入持久化)
   */
  const toggleColumn = (index: number) => {
    setVisibleColumns(prev => {
      const newList = prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index].sort((a, b) => a - b);
      localStorage.setItem('visibleColumns', JSON.stringify(newList));
      return newList;
    });
  };

  useEffect(() => {
    if (!isAdmin) return;

    setIsDataLoading(true);
    const header = ["報名時間", "狀態", "姓名", "電話", "Email", "場次名稱", "購買份數", "遊玩人數", "總金額", "付款方式", "末五碼", "預約日期時間", "取件地點", "得知管道", "備註"];
    
    setSubmissions([header]);
    setTotalRows(0);

    // 1. 報名資料查詢 (現在直接監聽整個 registrations 集合)
    let qSub;
    if (adminFilterDate) {
      const formattedDate = `${adminFilterDate.getFullYear()}-${String(adminFilterDate.getMonth() + 1).padStart(2, '0')}-${String(adminFilterDate.getDate()).padStart(2, '0')}`;
      qSub = query(
        collection(db, "registrations"), 
        where("pickupTime", ">=", formattedDate),
        where("pickupTime", "<=", formattedDate + "\uf8ff"),
        orderBy("pickupTime", "desc")
      );
    } else {
      qSub = query(
        collection(db, "registrations"), 
        orderBy("createdAt", "desc"),
        limit(200)
      );
    }

    const unsubSubmissions = onSnapshot(qSub, (snapshot) => {
      let data = snapshot.docs.map(doc => {
        const d = doc.data();
        return [
          d.timestamp, d.status, d.name, d.phone, d.email, d.session, d.quantity, 
          d.players, d.totalAmount, d.paymentMethod, d.bankLast5, d.pickupTime, 
          d.pickupLocation, d.referral, d.notes, doc.id, d.createdAt
        ];
      });

      if (adminFilterDate) {
        const formattedDate = `${adminFilterDate.getFullYear()}-${String(adminFilterDate.getMonth() + 1).padStart(2, '0')}-${String(adminFilterDate.getDate()).padStart(2, '0')}`;
        data = data.filter(row => String(row[11] || '').startsWith(formattedDate));
      }

      if (adminSearchKeyword.trim()) {
        data = filterSubmissions(data, adminSearchKeyword);
      }

      setSubmissions([header, ...data]);
      setTotalRows(data.length);
      setIsDataLoading(false);
    });

    // 2. 監聽回收桶 (使用 timestamp 排序以相容缺少 createdAt 的舊資料)
    const qBin = query(collection(db, "registrations_deleted"), orderBy("timestamp", "desc"), limit(100));
    const unsubBin = onSnapshot(qBin, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        return [
          d.timestamp, d.status, d.name, d.phone, d.email, d.session, d.quantity, 
          d.players, d.totalAmount, d.paymentMethod, d.bankLast5, d.pickupTime, 
          d.pickupLocation, d.referral, d.notes, doc.id, d.createdAt
        ];
      });
      setDeletedSubmissions(data);
    });

    // 3. 監聽操作日誌
    const qLogs = query(collection(db, "logs"), orderBy("createdAt", "desc"), limit(50));
    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      const logHeader = ["時間", "操作類型", "操作者", "詳細內容"];
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        return [d.timestamp, d.type, d.operator || '未知', d.details];
      });
      setLogs([logHeader, ...data]);
    });

    // 4. 監聽統計數據 (統計數據依然從活躍報名中計算)
    const qStats = query(collection(db, "registrations"));
    const unsubStats = onSnapshot(qStats, (snapshot) => {
      let kits = 0, players = 0, revenue = 0, pending = 0;
      const todayStr = new Date().toISOString().split('T')[0];
      snapshot.docs.forEach(doc => {
        const d = doc.data();
        if (d.status === '待審核') pending++;
        if (d.status === '通過') revenue += Number(d.totalAmount) || 0;
        if (d.pickupTime && d.pickupTime.startsWith(todayStr)) {
          kits += Number(d.quantity) || 0;
          players += Number(d.players) || 0;
        }
      });
      setDashboardStats({ pendingCount: pending, totalRevenue: revenue, todayKits: kits, todayPlayers: players });
    });

    return () => {
      unsubSubmissions(); unsubBin(); unsubLogs(); unsubStats();
    };
  }, [isAdmin, adminFilterDate, adminSearchKeyword, setIsDataLoading]);

  return {
    submissions,
    setSubmissions,
    deletedSubmissions,
    logs,
    dashboardStats,
    totalRows,
    visibleColumns,
    setVisibleColumns,
    toggleColumn
  };
};
