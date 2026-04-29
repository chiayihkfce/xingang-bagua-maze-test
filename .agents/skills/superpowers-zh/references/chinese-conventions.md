# 繁體中文技術寫作與命名建議

## 標點符號
- 在中文與英文/數字之間加上半形空格。
  - 錯誤：`這個功能有10個優點`
  - 正確：`這個功能有 10 個優點`
- 使用全形標點符號：`，` `。` `？` `！` `：` `；` `（` `）`。

## 術語一致性
- 使用台灣習慣的資訊術語：
  - 資料 (Data), 變數 (Variable), 函式 (Function), 專案 (Project), 物件 (Object)。

## 變數與函式命名
- 程式碼內部仍以英文命名，遵循 camelCase 或 PascalCase。
- 在 JSDoc 或註釋中提供清晰的中文說明。
  ```typescript
  /**
   * 計算報名費用
   * @param count 報名人數
   * @returns 總金額
   */
  function calculateTotal(count: number): number { ... }
  ```

## Git 提交訊息
- 格式：`<type>: <描述>`
- 描述應簡潔明瞭，動詞開頭。
- 範例：
  - `feat: 實作新港八卦迷宮報名表單`
  - `fix: 修復 RegistrationForm.tsx 的語法錯誤`
  - `docs: 更新 README 中的部署流程`
