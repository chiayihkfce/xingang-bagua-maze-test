import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
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
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [totalRows, setTotalRows] = useState(0);

  const [visibleColumns, setVisibleColumns] = useState<number[]>(() => {
    const saved = localStorage.getItem('visibleColumns');
    return saved ? JSON.parse(saved) : [];
  });

  /**
   * 欄位切換邏輯 (加入持久化)
   */
  const toggleColumn = (index: number) => {
    setVisibleColumns((prev) => {
      const newList = prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index].sort((a, b) => a - b);
      localStorage.setItem('visibleColumns', JSON.stringify(newList));
      return newList;
    });
  };

  useEffect(() => {
    if (!isAdmin) return;

    setIsDataLoading(true);
    const header = [
      '報名時間',
      '狀態',
      '姓名',
      '電話',
      'Email',
      '場次名稱',
      '購買份數',
      '遊玩人數',
      '總金額',
      '付款方式',
      '末五碼',
      '預約日期時間',
      '取件地點',
      '得知管道',
      '備註',
      '隊員名單',
      '報到'
    ];

    setSubmissions([header]);
    setTotalRows(0);

    // 1. 報名資料查詢 (監聽活躍報名)
    let qSub;
    if (adminFilterDate) {
      const formattedDate = `${adminFilterDate.getFullYear()}-${String(adminFilterDate.getMonth() + 1).padStart(2, '0')}-${String(adminFilterDate.getDate()).padStart(2, '0')}`;
      qSub = query(
        collection(db, 'registrations'),
        where('pickupTime', '>=', formattedDate),
        where('pickupTime', '<=', formattedDate + '\uf8ff'),
        orderBy('pickupTime', 'desc')
      );
    } else {
      qSub = query(
        collection(db, 'registrations'),
        orderBy('createdAt', 'desc'),
        limit(300)
      );
    }

    const unsubSubmissions = onSnapshot(qSub, (snapshot) => {
      let data = snapshot.docs.map((doc) => {
        const d = doc.data();
        // 格式化隊員名單為字串
        const playerNamesStr = (d.playerList || [])
          .map((p: any, i: number) => `${i + 1}.${p.name}(${p.email})`)
          .join(', ');

        return [
          d.timestamp,
          d.status,
          d.name,
          d.phone,
          d.email,
          d.session,
          d.quantity,
          d.players,
          d.totalAmount,
          d.paymentMethod,
          d.bankLast5,
          d.pickupTime,
          d.pickupLocation,
          d.referral,
          d.notes,
          playerNamesStr,
          d.checkedIn || false, // 16: 報到狀態
          doc.id, // 17: doc.id
          d.createdAt, // 18: createdAt
          d.certSent, // 19: certSent
          d.playerList // 20: playerList raw
        ];
      });

      // 移除原本錯誤的 row[18] 過濾，確保資料全數顯示

      if (adminFilterDate) {
        const formattedDate = `${adminFilterDate.getFullYear()}-${String(adminFilterDate.getMonth() + 1).padStart(2, '0')}-${String(adminFilterDate.getDate()).padStart(2, '0')}`;
        data = data.filter((row) =>
          String(row[11] || '').startsWith(formattedDate)
        );
      }

      if (adminSearchKeyword.trim()) {
        data = filterSubmissions(data, adminSearchKeyword);
      }

      setSubmissions([header, ...data]);
      setTotalRows(data.length);
      setIsDataLoading(false);
    });

    // 2. 監聽回收桶 (使用 registrations_deleted 集合)
    const qBin = query(
      collection(db, 'registrations_deleted'),
      orderBy('timestamp', 'desc'),
      limit(100)
    );
    const unsubBin = onSnapshot(qBin, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        const playerNamesStr = (d.playerList || [])
          .map((p: any, i: number) => `${i + 1}.${p.name}(${p.email})`)
          .join(', ');
        return [
          d.timestamp,
          d.status,
          d.name,
          d.phone,
          d.email,
          d.session,
          d.quantity,
          d.players,
          d.totalAmount,
          d.paymentMethod,
          d.bankLast5,
          d.pickupTime,
          d.pickupLocation,
          d.referral,
          d.notes,
          playerNamesStr,
          d.checkedIn || false, // 16: 報到狀態
          doc.id, // 17: doc.id
          d.createdAt, // 18: createdAt
          d.certSent, // 19: certSent
          d.playerList // 20: playerList raw
        ];
      });
      setDeletedSubmissions(data);
    });

    // 3. 監聽操作日誌 (提升至 1000 筆，支援前端分頁與強制排序)
    const qLogs = query(
      collection(db, 'logs'),
      orderBy('timestamp', 'desc'),
      limit(1000)
    );
    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      const logHeader = ['時間', '操作類型', '操作者', '詳細內容'];
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return [d.timestamp, d.type, d.operator || '系統', d.details];
      });

      // 強制前端二次排序：確保絕對的時間倒序 (由新到舊)
      data.sort((a, b) => {
        const parseDate = (dateStr: string) => {
          if (!dateStr) return 0;
          // 處理 Line Bot 的「上午/下午」格式並轉為 Date 能識別的格式
          let cleanStr = dateStr.replace(/\//g, '-');
          if (cleanStr.includes('上午')) {
            cleanStr = cleanStr.replace('上午', ' ').trim();
          } else if (cleanStr.includes('下午')) {
            cleanStr = cleanStr.replace('下午', ' ').trim();
            // 這裡不需手動加 12，因為 new Date() 在多數瀏覽器能識別 24 小時制或帶上午下午的格式
            // 但為了保險，我們只做基本的清洗，交給 Date 物件
          }
          const d = new Date(cleanStr);
          return isNaN(d.getTime()) ? 0 : d.getTime();
        };

        return parseDate(String(b[0])) - parseDate(String(a[0]));
      });

      setLogs([logHeader, ...data]);
    });

    // 4. 監聽統計數據 (統計數據依然從活躍報名中計算)
    const qStats = query(collection(db, 'registrations'));
    const unsubStats = onSnapshot(qStats, (snapshot) => {
      let kits = 0,
        players = 0,
        revenue = 0,
        pending = 0;
      const todayStr = new Date().toISOString().split('T')[0];
      snapshot.docs.forEach((doc) => {
        const d = doc.data();
        if (d.status === '待審核') pending++;
        if (d.status === '通過') revenue += Number(d.totalAmount) || 0;
        if (d.pickupTime && d.pickupTime.startsWith(todayStr)) {
          kits += Number(d.quantity) || 0;
          players += Number(d.players) || 0;
        }
      });
      setDashboardStats({
        pendingCount: pending,
        totalRevenue: revenue,
        todayKits: kits,
        todayPlayers: players
      });
    });

    return () => {
      unsubSubmissions();
      unsubBin();
      unsubLogs();
      unsubStats();
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
