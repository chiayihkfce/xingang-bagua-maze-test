---
name: superpowers-zh
description: 提供 TDD、除錯、軟體工程方法論與繁體中文標準規範的技能。當需要進行高品質開發、複雜問題排查或確保程式碼符合業界中文格式規範時使用。
---

# Superpowers-ZH (繁體中文軟體工程增強)

本技能旨在提升 Gemini CLI 的開發品質與工程標準，特別針對繁體中文開發環境優化。

## 核心方法論

### 1. 測試驅動開發 (TDD)
當接到開發任務時，應遵循：
- **紅燈 (Red)**: 先撰寫失敗的測試案例。
- **綠燈 (Green)**: 撰寫最少量的程式碼使測試通過。
- **重構 (Refactor)**: 在測試保護下優化程式碼結構。

### 2. 系統化除錯 (Systematic Debugging)
遇到 Bug 時，應採取：
- **重現 (Reproduce)**: 建立最小可重現範例 (MRE)。
- **假設 (Hypothesize)**: 提出可能的錯誤原因。
- **驗證 (Verify)**: 使用 Log 或測試驗證假設。
- **修復與測試 (Fix & Test)**: 套用修復並確保測試通過。

### 3. 業界格式規範 (Industry Standards)
所有輸出與變更應符合以下規範：
- **語言**: 嚴格使用繁體中文進行註釋、對話與提交訊息。
- **Git 提交格式**: 遵循 `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:` 前綴。
  - 範例: `feat: 新增報名表單驗證功能`
- **程式碼風格**: 遵循專案既有的 Lint 與格式規範（如 Prettier, ESLint）。

## 實踐指南

- **自動化檢查**: 修改後應執行 `npm run lint` 或相關指令。
- **檔案操作**: 嚴格使用 `replace` 進行手術式更新，禁止全量覆蓋大型檔案。
- **模組化**: 保持 `main` 檔案精簡，將邏輯抽離至專屬組件或工具函式。

## 參考資源
- [tdd-patterns.md](references/tdd-patterns.md): 詳細的 TDD 模式與範例。
- [chinese-conventions.md](references/chinese-conventions.md): 繁體中文技術寫作與命名建議。
