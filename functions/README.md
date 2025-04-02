# Cloudflare Pages Functions for SEO優化

這個目錄包含用於SEO優化的Cloudflare Pages Functions。這些Functions可以檢測搜索引擎爬蟲並為它們提供增強的HTML內容，從而改善網站的SEO表現。

## 文件說明

- `_middleware.js`: 中間件函數，用於檢測搜索引擎爬蟲並提供增強的HTML內容
- `test.js`: 簡單的測試端點，用於確認Functions是否正常工作

## 工作原理

1. 當搜索引擎爬蟲訪問網站時，`_middleware.js`會檢測User-Agent並識別它是爬蟲
2. 對於爬蟲請求，中間件會獲取原始HTML並進行增強：
   - 添加適當的頁面標題和描述
   - 添加結構化數據（JSON-LD）
   - 添加多語言支持的hreflang標記
   - 添加其他SEO相關的元數據
3. 對於普通用戶，中間件不會進行任何修改，直接返回原始頁面

## 部署說明

這些Functions會在部署Cloudflare Pages時自動部署。您不需要額外的配置。

```bash
# 在前端目錄中構建項目
cd frontend
npm run build

# 部署到Cloudflare Pages
npm run deploy
```

## 測試方法

部署後，您可以使用以下方法測試Functions是否正常工作：

1. 訪問`https://your-site.pages.dev/`，應該看到正常的網站
2. 訪問`https://your-site.pages.dev/test`，應該看到一個JSON響應，確認Functions正常工作
3. 使用curl模擬爬蟲請求：

```bash
curl -A "Googlebot" https://your-site.pages.dev/
```

4. 使用Google Search Console的「檢查URL」功能，查看Google如何渲染您的頁面

## 自定義

如果您需要自定義SEO增強邏輯，可以修改`_middleware.js`文件：

- 修改頁面標題和描述的生成邏輯
- 更新結構化數據
- 添加更多的SEO元數據

## 注意事項

- 這些Functions只影響搜索引擎爬蟲，不會影響普通用戶的體驗
- 確保增強的HTML內容與實際用戶看到的內容一致，避免搜索引擎懲罰
- 定期檢查Search Console，確保搜索引擎正確索引您的網站
