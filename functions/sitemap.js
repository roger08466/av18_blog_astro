// Cloudflare Pages 函數 - 處理 sitemap 請求
import { handleSitemapRequest } from '../frontend/src/utils/sitemapHandler';

export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 檢查是否是sitemap請求
    if (path.endsWith('.xml') && path.includes('sitemap')) {
      console.log(`接收到sitemap請求: ${path}`);
      
      try {
        // 處理sitemap請求
        const { content, contentType } = await handleSitemapRequest(path);
        
        // 返回sitemap內容
        return new Response(content, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, no-store, must-revalidate', // 禁用緩存
            'Pragma': 'no-cache', // 兼容HTTP/1.0
            'Expires': '0', // 兼容舊瀏覽器
            'Access-Control-Allow-Origin': '*' // 允許跨域訪問
          }
        });
      } catch (error) {
        console.error(`處理sitemap請求時出錯:`, error);
        console.error(error.stack);
        
        // 返回404錯誤
        return new Response(`Sitemap not found: ${error.message}`, {
          status: 404,
          headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }
    
    // 如果不是sitemap請求，繼續處理其他請求
    return context.next();
  } catch (error) {
    console.error(`處理請求時出錯:`, error);
    console.error(error.stack);
    
    // 返回500錯誤
    return new Response(`Internal Server Error: ${error.message}`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
