# 新港八卦迷宮專案開發規範 (GEMINI.md)

本文件定義了新港八卦迷宮專案的架構規範、程式碼風格及開發流程。所有 AI 代理與開發者均須嚴格遵守。

## 1. 核心架構原則 (Clean Architecture)

- **模組化第一優先**：禁止在單一檔案中撰寫超過 500 行代碼。
- **元件拆解規範**：
  - 大型頁面（如 `RegistrationPage`, `AdminPage`）僅負責資料獲取與頂層狀態。
  - 核心邏輯應拆分為職責單一的子組件（如 `RegistrationSessionFields`, `BagModal`）。
  - 放置路徑：`src/components/[Module]/[ComponentName].tsx`。
- **邏輯抽離**：非 UI 邏輯（Firebase 互動、複雜計算）應抽離至 `src/hooks/` 或 `src/utils/`。

## 2. React 最佳實踐

- **純潔性 (Purity)**：
  - 禁止在渲染期間調用 `Math.random()`, `Date.now()` 或外部副作用。
  - 必須使用 `useState(() => ...)` 或 `useMemo` 進行延遲初始化。
- **副作用管理**：
  - 避免在 `useEffect` 中進行同步 `setState` 調用以防止串聯渲染。
  - 使用函數式更新 `setState(prev => ...)` 來處理依賴前一狀態的變更。
- **效能優化**：大型列表渲染應考慮 Memoization，複雜元件應使用 `React.lazy` 進行程式碼分割。

## 3. 程式碼風格與工具

- **語言規範**：嚴格使用**繁體中文**進行註解、對話、提交訊息與使用者介面文字。
- **型別安全**：嚴格執行 `npx tsc` 檢查。禁止濫用 `any`。
- **Linting**：遵循 `.eslintrc.cjs` 定義的規則。提交前必須執行 `npm run lint`。
- **Git 提交格式**：
  - `feat`: 新增功能
  - `fix`: 修復錯誤
  - `refactor`: 程式碼重構（無功能變更）
  - `style`: 格式調整
  - `docs`: 文件更新

## 4. 專家工具鏈 (Agent Skills)

專案已整合以下核心技能，開發時應優先調用：

- `superpowers-zh`: 中文規範與 TDD。
- `arxitect`: 架構與設計模式審查。
- `chrome-devtools-mcp`: 瀏覽器自動化與除錯。
- `firebase-agent-skills`: Firebase 專家指南。

## 5. 修改檔案強制令

- **禁止全量覆蓋**：修改現有檔案時，必須嚴格使用 `replace` 工具進行局部手術式更新，嚴禁使用 `write_file` 覆蓋現有原始碼。

---

最後更新日期：2026-04-29
