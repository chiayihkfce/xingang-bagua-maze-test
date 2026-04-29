---
name: conductor
description: 軟體功能編排與執行技能。用於指定、規劃並實作複雜的軟體功能。當需要進行多階段開發任務、架構設計或跨檔案的大型變更時使用。
---

# Conductor (功能編排員)

本技能旨在協調複雜的開發任務，從初步設想到最終實作的完整生命週期。

## 核心流程

### 1. 需求分析 (Requirement Analysis)
- 釐清使用者的核心目標。
- 定義功能的邊界與限制。

### 2. 規劃與架構 (Planning & Architecture)
- 使用 `enter_plan_mode` 建立詳細的設計文件。
- 確定涉及的檔案、元件以及資料流向。
- 評估對現有系統的影響（影響分析）。

### 3. 分階段實作 (Iterative Implementation)
- 將大任務分解為可管理的子任務。
- 每一階段完成後必須進行驗證（型別檢查、測試）。

### 4. 整合與驗證 (Integration & Validation)
- 確保所有模組協同工作。
- 執行全域掃描以確認無迴歸錯誤。

## 指引規範
- 優先考慮專案的模組化結構。
- 保持 `App.tsx` 或主要頁面檔案簡潔。
- 所有的變更應符合 `superpowers-zh` 的高品質標準。

## 參考資源
- [feature-planning.md](references/feature-planning.md): 如何撰寫功能規劃書。
- [implementation-strategies.md](references/implementation-strategies.md): 各種常見功能的實作策略範例。
