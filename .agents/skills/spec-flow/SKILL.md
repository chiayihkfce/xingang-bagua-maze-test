---
name: spec-flow
description: 規格驅動開發 (Spec-Driven Development) 技能。當需要精確定義功能需求、API 規格或 UI 邏輯，並確保實作與規格一致時使用。
---

# Spec-Flow (規格驅動開發)

本技能旨在透過「先定義規格，後實作程式」的流程，減少溝通誤差並提升產出精確度。

## 工作流程

### 1. 規格定義 (Spec Definition)
在撰寫任何程式碼之前，先建立或確認規格。規格應包含：
- **目標 (Goal)**: 該功能要解決什麼問題。
- **輸入/輸出 (I/O)**: 資料結構、型別定義。
- **商務邏輯 (Business Logic)**: 具體的演算法或規則。
- **UI/UX 規範**: 畫面呈現、互動邏輯。

### 2. 規格審查 (Spec Review)
檢查規格是否完整且無歧義。確保邊界情況 (Edge Cases) 已考慮在內。

### 3. 同步實作 (Implementation)
根據規格撰寫程式碼。實作過程中若發現規格有誤，應先更新規格文件再繼續。

## 推薦實踐

- **Type-First**: 優先定義 TypeScript Interfaces 或 Types。
- **Markdown Specs**: 在專案中維護一份 `SPECS.md` 或在 `docs/` 下建立功能規格書。
- **自動化驗證**: 撰寫測試案例來驗證程式碼是否符合規格定義的 I/O 與邏輯。

## 參考資源
- [api-specs.md](references/api-specs.md): 如何撰寫清晰的 API 規格。
- [ui-logic.md](references/ui-logic.md): 複雜 UI 狀態與互動的規格描述。
