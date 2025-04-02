# AV18 Blog - Astro 版本

這是使用 Astro 框架重構的 AV18 Blog 網站。

## 技術棧

- [Astro](https://astro.build/) - 靜態網站生成器
- [React](https://reactjs.org/) - UI 組件
- [Tailwind CSS](https://tailwindcss.com/) - 樣式
- [i18next](https://www.i18next.com/) - 國際化

## 功能

- 多語言支持 (繁體中文、簡體中文、英文)
- 影片分類瀏覽
- 影片詳情頁面
- 響應式設計

## 開發

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 部署

本項目使用 Cloudflare Pages 進行部署。

```bash
# 部署到 Cloudflare Pages
npm run deploy
```

## 項目結構

```
/
├── public/             # 靜態資源
├── src/
│   ├── api/            # API 客戶端
│   ├── assets/         # 圖片和其他資源
│   ├── components/     # React 組件
│   ├── layouts/        # 頁面布局
│   ├── pages/          # 頁面
│   ├── utils/          # 工具函數
│   └── i18n.js         # 國際化配置
├── functions/          # Cloudflare Functions
└── package.json        # 項目配置
