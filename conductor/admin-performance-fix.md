# 管理員後台效能優化計畫 (Admin Performance Optimization)

## 背景與動機 (Background & Motivation)
使用者反映在登入或進入「管理後台」頁面時，會出現短暫的畫面凍結或無法操作的狀況。
經分析發現，原因在於 `useAdminData.ts` 在管理員登入後，會「同時」向 Firebase 發起多個資料量龐大的即時監聽（Snapshots），並在主執行緒（Main Thread）進行大量的陣列轉換與排序：
1. 查詢近 300 筆報名資料。
2. 查詢 1000 筆操作日誌，並進行複雜的日期字串解析與排序。
3. **最嚴重的是**：發起對 `registrations` 集合的「全量查詢」以計算儀表板的統計數據（待審核、今日領取等），這會隨著報名人數增加而導致嚴重的效能瓶頸。

## 影響範圍 (Scope & Impact)
*   **檔案**：`src/hooks/useAdminData.ts`, `src/hooks/useAppController.ts`
*   **影響**：提升管理員後台的載入速度，消除凍結現象，並大幅減少不必要的 Firebase 讀取次數（降低成本）。

## 解決方案 (Proposed Solution)

### 1. 實作延遲載入 (Lazy Loading)
將目前「一登入就全部載入」的邏輯，改為「切換到該分頁時才載入」。
*   修改 `useAdminData` 接收 `adminTab` 參數。
*   只有當 `adminTab === 'submissions'` 時，才掛載報名清單與回收桶的監聽器。
*   只有當 `adminTab === 'logs'` 時，才掛載操作日誌的監聽器。

### 2. 優化統計數據查詢 (Optimize Stats Query)
停止使用全量掃描 `query(collection(db, 'registrations'))` 來計算統計數據。
*   將統計拆分為精準的獨立查詢（例如只查詢 `status == '待審核'` 的文件來取得待審核數量，以及只查詢 `pickupTime` 為今天的資料來計算今日份數與人數）。
*   若考量實作複雜度，亦可透過 `getDocs` 取代 `onSnapshot`，或使用 `count()` 聚合查詢（若 Firebase SDK 支援）來降低傳輸量。

### 3. 優化日誌排序演算法 (Optimize Log Sorting)
*   目前日誌排序使用正則表達式與字串替換來解析日期。將改用更輕量的比較方式，或直接依賴 Firestore 的 `timestamp` 進行排序，減少前端的運算負擔。

## 實作步驟 (Implementation Steps)
1.  **修改 `useAppController.ts`**：傳遞 `adminTab` 狀態給 `useAdminData` Hook。
2.  **重構 `useAdminData.ts`**：
    *   將單一的龐大 `useEffect` 拆分為多個獨立的 `useEffect`，並加入 `adminTab` 作為依賴與執行條件。
    *   重寫 `qStats` 的邏輯，改用條件限縮的查詢，避免全表掃描。
    *   優化 `logs` 的 `sort` 函式。

## 驗證方式 (Verification)
1.  登入管理後台，觀察畫面是否不再出現明顯凍結。
2.  切換到「操作日誌」分頁，確認日誌能正常載入且排序正確。
3.  切換到「報名清單」分頁，確認資料正常載入。
4.  檢查頂部的儀表板統計數據是否正確顯示。