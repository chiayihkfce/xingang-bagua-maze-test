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
  adminTab: string;
  adminFilterDate: Date | null;
  adminSearchKeyword: string;
  setIsDataLoading: (val: boolean) => void;
}

/**
 * 處理管理員後台資料的即時監聽 (報名、回收桶、日誌、統計)
 */
export const useAdminData = ({
  isAdmin,
  adminTab,
  adminFilterDate,
  adminSearchKeyword,
  setIsDataLoading
}: UseAdminDataProps) => {
  const [submissions, setSubmissions] = useState<any[][]>([]);
  const [rawSubmissions, setRawSubmissions] = useState<any[][]>([]);
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

  // 1. 統計數據監聽 (全域需要，但優化查詢)
  useEffect(() => {
    if (!isAdmin) return;

    const todayStr = new Date().toISOString().split('T')[0];

    let pending = 0;
    let revenue = 0;
    let kits = 0;
    let players = 0;

    const updateStats = () => {
      setDashboardStats({
        pendingCount: pending,
        totalRevenue: revenue,
        todayKits: kits,
        todayPlayers: players
      });
    };

    // 1a. 待審核數量
    const qPending = query(
      collection(db, 'registrations'),
      where('status', '==', '待審核')
    );
    const unsubPending = onSnapshot(qPending, (snap) => {
      pending = snap.size;
      updateStats();
    });

    // 1b. 今日統計 (僅限今日資料)
    const qToday = query(
      collection(db, 'registrations'),
      where('pickupTime', '>=', todayStr),
      where('pickupTime', '<=', todayStr + '\uf8ff')
    );
    const unsubToday = onSnapshot(qToday, (snap) => {
      let tKits = 0,
        tPlayers = 0;
      snap.docs.forEach((doc) => {
        const d = doc.data();
        tKits += Number(d.quantity) || 0;
        tPlayers += Number(d.players) || 0;
      });
      kits = tKits;
      players = tPlayers;
      updateStats();
    });

    // 1c. 總成交金額
    const qRevenue = query(
      collection(db, 'registrations'),
      where('status', '==', '通過')
    );
    const unsubRevenue = onSnapshot(qRevenue, (snap) => {
      revenue = snap.docs.reduce(
        (acc, doc) => acc + (Number(doc.data().totalAmount) || 0),
        0
      );
      updateStats();
    });

    return () => {
      unsubPending();
      unsubToday();
      unsubRevenue();
    };
  }, [isAdmin]);

  // 2. 報名資料監聽 (僅在切換分頁或更換日期過濾時重新載入)
  // 注意：這裡移除了 adminSearchKeyword 依賴，避免打字時重啟監聽
  useEffect(() => {
    if (!isAdmin || (adminTab !== 'submissions' && adminTab !== 'analytics')) {
      if (isAdmin) setIsDataLoading(false);
      return;
    }

    setIsDataLoading(true);

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
          Array.isArray(d.referral)
            ? d.referral.join('、')
            : (d.referral || '').replace(/,\s*/g, '、'),
          d.notes,
          playerNamesStr,
          d.checkedIn || false,
          doc.id,
          d.createdAt,
          d.certSent,
          d.playerList
        ];
      });

      setRawSubmissions(data);
      setIsDataLoading(false);
    });

    // 回收桶
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
          Array.isArray(d.referral)
            ? d.referral.join('、')
            : (d.referral || '').replace(/,\s*/g, '、'),
          d.notes,
          playerNamesStr,
          d.checkedIn || false,
          doc.id,
          d.createdAt,
          d.certSent,
          d.playerList
        ];
      });
      setDeletedSubmissions(data);
    });

    return () => {
      unsubSubmissions();
      unsubBin();
    };
  }, [isAdmin, adminTab, adminFilterDate, setIsDataLoading]);

  // 2a. 前端即時搜尋與欄位處理
  useEffect(() => {
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

    let data = [...rawSubmissions];
    
    // 執行搜尋
    if (adminSearchKeyword.trim()) {
      data = filterSubmissions(data, adminSearchKeyword);
    }

    setSubmissions([header, ...data]);
    setTotalRows(data.length);
  }, [rawSubmissions, adminSearchKeyword]);

  // 3. 操作日誌監聽 (僅在 logs 分頁載入)
  useEffect(() => {
    if (!isAdmin || adminTab !== 'logs') return;

    setIsDataLoading(true);
    const qLogs = query(
      collection(db, 'logs'),
      orderBy('timestamp', 'desc'),
      limit(300)
    );
    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      const logHeader = ['時間', '操作類型', '操作者', '詳細內容'];
      
      // 效能優化：預先解析日期，避免在 sort 中重複運算 (N log N -> N)
      const parseDateToMs = (dateStr: string) => {
        if (!dateStr) return 0;
        let cleanStr = dateStr.replace(/\//g, '-');
        const isPM = cleanStr.includes('下午');
        const isAM = cleanStr.includes('上午');
        cleanStr = cleanStr.replace(/[上下]午/g, ' ').trim();
        
        const d = new Date(cleanStr);
        let time = d.getTime();
        if (isNaN(time)) return 0;
        
        // 補正上午/下午的毫秒數以確保排序絕對正確
        if (isPM && d.getHours() < 12) time += 12 * 3600000;
        if (isAM && d.getHours() === 12) time -= 12 * 3600000;
        
        return time;
      };

      const mappedData = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          row: [d.timestamp, d.type, d.operator || '系統', d.details],
          timeMs: parseDateToMs(String(d.timestamp))
        };
      });

      // 執行排序
      mappedData.sort((a, b) => b.timeMs - a.timeMs);

      const finalData = mappedData.map(item => item.row);
      setLogs([logHeader, ...finalData]);
      setIsDataLoading(false);
    });

    return () => unsubLogs();
  }, [isAdmin, adminTab]);

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
