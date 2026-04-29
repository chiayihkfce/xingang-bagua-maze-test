# 八卦美學特效與遊戲工程規範

## 1. 探照燈特效 (The Bagua Lens)
*   **機制**：利用 `radial-gradient` 遮罩與全螢幕 `.lens-mode` 結合。
*   **實作細節**：
    *   `z-index`：自定義鼠標必須設為 `2147483647` (最大值)。
    *   `pointer-events`：遮罩層必須設為 `none` 確保不影響點擊。
    *   **手機支援**：必須同時監聽 `mousemove` 與 `touchmove`。

## 2. 3D 寶盒系統 (Bagua Box)
*   **結構**：盒身（漆木色）+ 盒蓋（帶八卦圖）。
*   **動畫**：盒蓋應使用 `rotateX` 翻轉開啟。
*   **穩定性**：道具顯現後必須移除浮動動畫，保持絕對靜止的肅穆感。

## 3. 全域鼠標 (Custom Cursor)
*   **位置**：必須在 `App.tsx` 的最外層掛載，且在 `AppContent` 之後。
*   **規則**：嚴格禁止在全域使用 `* { cursor: auto !important; }`，這會殺死所有自製鼠標。

## 4. 道具連動 (Item Linkage)
*   **路徑**：`MiniGames` (過關) -> `hasFlashlight` -> `isFlashlightOn` -> 照射 `hidden-clue` -> `hasPoetrySlip` -> 閱讀 `hidden-clue` -> 最終彩蛋。
