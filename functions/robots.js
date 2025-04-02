// Cloudflare Pages 函數 - 處理 robots.txt 請求
import { updateRobotsTxt } from '../frontend/src/utils/sitemapHandler';

export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 檢查是否是robots.txt請求
    if (path === '/robots.txt') {
      console.log(`接收到robots.txt請求`);
      
      try {
        // 獲取原始robots.txt內容
        const response = await context.next();
        const originalRobotsTxt = await response.text();
        
        // 更新robots.txt內容，添加sitemap引用
        const updatedRobotsTxt = updateRobotsTxt(originalRobotsTxt);
        
        // 返回更新後的robots.txt內容
        return new Response(updatedRobotsTxt, {
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=86400' // 緩存24小時
          }
        });
      } catch (error) {
        console.error(`處理robots.txt請求時出錯:`, error);
        
        // 如果出錯，繼續處理原始請求
        return context.next();
      }
    }
    
    // 如果不是robots.txt請求，繼續處理其他請求
    return context.next();
  } catch (error) {
    console.error(`處理請求時出錯:`, error);
    
    // 返回500錯誤
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}
