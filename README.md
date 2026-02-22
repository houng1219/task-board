# 🎯 任務看板 Task Board

AI 任務管理系統，部署於 Vercel + Convex。

## 功能

- 📋 Kanban 風格任務看板
- 👤 任務分配（給「我」或「AI」）
- 🔄 即時狀態更新
- 📱 響應式設計

## 快速部署

### 1. Convex 設置

```bash
# 安裝 Convex CLI
npm install -g convex

# 登入 Convex
npx convex login

# 初始化專案
npx convex dev
```

### 2. Clerk 設置

1. 前往 [Clerk.com](https://clerk.com) 註冊
2. 創建新應用程式
3. 取得 Publishable Key 和 Secret Key
4. 填入 `.env.local`

### 3. Vercel 部署

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel
```

## 環境變數

建立 `.env.local`：

```
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

## 本地運行

```bash
npm run dev
```

## 專案結構

```
task-board/
├── convex/
│   ├── schema.ts       # 資料庫 Schema
│   └── tasks.ts       # API 函數
├── src/
│   ├── app/
│   │   ├── page.tsx   # 主頁面
│   │   └── layout.tsx # Layout
│   └── components/
│       ├── TaskBoard.tsx    # 任務看板
│       └── ConvexProvider.tsx # Convex Provider
└── convex.json
```

---

**注意**：這個看板需要你自行完成 Convex 和 Clerk 的帳號設定。
