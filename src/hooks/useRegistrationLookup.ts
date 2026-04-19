import { useState } from 'react';
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export const useRegistrationLookup = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const lookupRegistration = async (keyword: string) => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const registrationsRef = collection(db, "registrations");
      const rawKeyword = keyword.trim();
      let cleanKeyword = rawKeyword.replace(/[\s-]/g, '');

      // 準備查詢集合 (使用 Set 避免重複條件)
      const queryList = new Set<string>();
      queryList.add(rawKeyword);   // 原始輸入 (可能帶空格)
      queryList.add(cleanKeyword); // 100% 清洗版

      // 智慧校正台灣格式
      if (cleanKeyword.startsWith('+88609')) {
        queryList.add('+886' + cleanKeyword.substring(5)); // 修正版
      } else if (/^09\d{8}$/.test(cleanKeyword)) {
        queryList.add('+886' + cleanKeyword.substring(1)); // 國碼版
        queryList.add('+8860' + cleanKeyword.substring(1)); // 容錯版 (帶零國碼)
      } else if (/^9\d{8}$/.test(cleanKeyword)) {
        queryList.add('+886' + cleanKeyword);
      }

      // 1. 準備 Email 與所有電話變體的查詢條件
      const queries = [
        query(registrationsRef, where("email", "==", cleanKeyword), limit(5)),
        ...Array.from(queryList).map(val => query(registrationsRef, where("phone", "==", val), limit(5)))
      ];

      // 2. 執行並行查詢
      const snapshots = await Promise.all(queries.map(q => getDocs(q)));

      const found: any[] = [];
      const seenIds = new Set();

      snapshots.forEach(snapshot => {
        snapshot.docs.forEach(doc => {
          if (!seenIds.has(doc.id)) {
            const data = doc.data();
            // 只抓取非敏感、且未被刪除的資料
            if (data.deleted !== true) {
              found.push({ id: doc.id, ...data });
              seenIds.add(doc.id);
            }
          }
        });
      });

      if (found.length === 0) {
        setError('查無資料，請確認輸入的 Email 或電話是否正確。');
      } else {
        // 按時間排序
        found.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
        setResults(found);
      }
    } catch (err) {
      console.error("Lookup Error:", err);
      setError('查詢發生錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  return { lookupRegistration, loading, results, error, setResults };
};
