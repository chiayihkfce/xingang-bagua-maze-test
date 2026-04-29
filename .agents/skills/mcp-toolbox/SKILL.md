---
name: mcp-toolbox
description: Model Context Protocol (MCP) 工具箱技能。用於整合外部工具、資料庫（Firestore）以及各種雲端服務。當需要操作資料庫、執行外部腳本或整合第三方 API 時使用。
---

# MCP Toolbox (工具整合箱)

本技能旨在擴展 Gemini CLI 的能力，使其能與外部系統（如資料庫、雲端服務、本地指令）進行深度互動。

## 支援範圍

### 1. 資料庫操作 (Databases)
- **Firestore**: 查詢、新增、更新與刪除資料。支援複雜的索引建議與安全性規則審查。
- **PostgreSQL/MySQL**: 透過 MCP Server 進行資料存取。

### 2. 第三方 API 整合 (External APIs)
- 透過 `web_fetch` 或專用的 MCP 伺服器獲取外部資訊。
- 支援 LINE Bot 腳本管理與 Firebase Cloud Functions 的部署流程。

### 3. 本地工具自動化 (Local Tooling)
- 整合 Linting、格式化（Prettier）與打包工具（Vite/Webpack）。
- 支援自動化證書生成（如 `scripts/sendCertificates.js`）的排程與執行。

## 最佳實踐
- **安全性**: 絕對禁止將 API Keys、Secrets 寫入程式碼。使用 `.env` 檔案管理。
- **錯誤處理**: 所有的外部互動必須包含錯誤捕捉（try-catch）與友善的錯誤提示。
- **Token 效率**: 僅讀取必要的資料欄位，避免拉取整個大型 Collections。

## 參考資源
- [firestore-guide.md](references/firestore-guide.md): Firestore 操作指令集。
- [mcp-configuration.md](references/mcp-configuration.md): 如何新增新的 MCP Server 連結。
