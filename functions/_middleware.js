/**
 * Cloudflare Pages Functions中間件
 * 用於處理路由和資源請求
 * 
 * 主要功能：
 * 1. 處理 Sitemap 請求
 * 2. 跳過處理 API 請求和靜態資源
 * 3. 處理 404 頁面重定向
 */

export async function onRequest(context) {
  try {
    const request = context.request;
    const url = new URL(request.url);
    
    // 檢查是否是CF頁面網址，如果是則重定向到Javplay.tv
    const cfRedirect = handleCfRedirect(url);
    if (cfRedirect) {
      return cfRedirect;
    }
    
    // 處理根路徑重定向，根據用戶的語言偏好
    if (url.pathname === '/') {
      return handleRootPathRedirect(request, url);
    }
    
    // 處理舊路徑重定向，根據用戶的語言偏好
    const oldPathRedirect = handleOldPathRedirect(request, url);
    if (oldPathRedirect) {
      return oldPathRedirect;
    }
    
    // 處理 Sitemap 請求
    if (isSitemapRequest(url.pathname)) {
      return handleSitemapRequest(context);
    }
    
    // 跳過處理 API 請求、靜態資源和 Cloudflare Insights
    if (isStaticResource(url.pathname) || url.hostname === 'static.cloudflareinsights.com') {
      return context.next();
    }
    
    // 獲取響應並檢查是否是 404 頁面
    const response = await context.next();
    
    // 處理 404 頁面
    if (await is404Page(response)) {
      return handle404Redirect(url);
    }
    
    // 返回原始響應
    return response;
  } catch (error) {
    console.error('中間件處理錯誤:', error);
    return context.next();
  }
}

/**
 * 檢查是否是 Sitemap 請求
 */
function isSitemapRequest(pathname) {
  return pathname === '/sitemap.xml' || 
         /^\/sitemap-[a-z]{2}(-videos|-categories)?\.xml$/.test(pathname);
}

/**
 * 處理 Sitemap 請求
 */
async function handleSitemapRequest(context) {
  const { onRequest: handleSitemap } = await import('./sitemap.js');
  return handleSitemap(context);
}

/**
 * 檢查是否是靜態資源
 */
function isStaticResource(pathname) {
  return pathname.endsWith('.json') || 
         pathname.endsWith('.txt') || 
         pathname.includes('beacon.min.js');
}

/**
 * 檢查是否是 404 頁面
 */
async function is404Page(response) {
  const clonedResponse = response.clone();
  
  return response.status === 404 || 
         (response.headers.get('content-type')?.includes('text/html') && 
          (await clonedResponse.text()).includes('page-not-found'));
}

/**
 * 處理 404 頁面重定向
 */
function handle404Redirect(url) {
  // 檢查是否是無效路徑但包含語言前綴
  const langMatch = url.pathname.match(/^\/(tw|cn|en)\/(.+)/);
  
  if (langMatch) {
    // 重定向到該語言的 404 頁面
    const currentLanguage = langMatch[1];
    return Response.redirect(`${url.origin}/${currentLanguage}/404`, 307);
  } else {
    // 重定向到默認語言的主頁
    const currentLanguage = detectLanguageFromUrl(url.pathname) || 'en';
    return Response.redirect(`${url.origin}/${currentLanguage}?redirected=true`, 307);
  }
}

/**
 * 從 URL 檢測語言
 */
function detectLanguageFromUrl(pathname) {
  const match = pathname.match(/^\/(tw|cn|en)\//);
  return match ? match[1] : 'en'; // 默認返回 'en'
}

/**
 * 處理根路徑重定向，根據用戶的語言偏好
 */
function handleRootPathRedirect(request, url) {
  // 獲取用戶偏好語言
  const targetLang = detectPreferredLanguage(request);
  
  // 重定向到目標語言
  return Response.redirect(`${url.origin}/${targetLang}`, 302);
}

/**
 * 處理舊路徑重定向，根據用戶的語言偏好
 */
function handleOldPathRedirect(request, url) {
  const pathname = url.pathname;
  
  // 定義舊路徑模式和對應的新路徑生成函數
  const oldPathPatterns = [
    { pattern: /^\/video\/(.+)$/, getNewPath: (match, lang) => `/${lang}/video/${match[1]}` },
    { pattern: /^\/category$/, getNewPath: (_, lang) => `/${lang}/category` },
    { pattern: /^\/category\/tag\/(.+)$/, getNewPath: (match, lang) => `/${lang}/category/tag/${match[1]}` },
    { pattern: /^\/category\/manufacturer\/(.+)$/, getNewPath: (match, lang) => `/${lang}/category/manufacturer/${match[1]}` },
    { pattern: /^\/category\/actor\/(.+)$/, getNewPath: (match, lang) => `/${lang}/category/actor/${match[1]}` },
    { pattern: /^\/category\/search\/(.+)$/, getNewPath: (match, lang) => `/${lang}/category/search/${match[1]}` }
  ];
  
  // 檢查是否匹配任何舊路徑模式
  for (const { pattern, getNewPath } of oldPathPatterns) {
    const match = pathname.match(pattern);
    if (match) {
      // 獲取用戶偏好語言
      const targetLang = detectPreferredLanguage(request);
      
      // 生成新路徑並重定向
      const newPath = getNewPath(match, targetLang);
      return Response.redirect(`${url.origin}${newPath}`, 302);
    }
  }
  
  // 如果不匹配任何舊路徑模式，返回 null
  return null;
}

/**
 * 檢測用戶偏好語言
 */
function detectPreferredLanguage(request) {
  // 獲取 Accept-Language 頭部
  const acceptLanguage = request.headers.get('Accept-Language') || '';
  
  // 根據 Accept-Language 頭部決定語言
  let targetLang = 'en'; // 默認語言為英文
  
  // 檢查是否包含中文
  if (acceptLanguage.includes('zh-TW') || acceptLanguage.includes('zh-HK')) {
    targetLang = 'tw';
  } else if (acceptLanguage.includes('zh-CN')) {
    targetLang = 'cn';
  } else if (acceptLanguage.includes('zh')) {
    // 其他中文變體默認使用繁體
    targetLang = 'tw';
  }
  // 其他語言默認使用英文 (en)
  
  return targetLang;
}

/**
 * 處理CF頁面網址重定向到Javplay.tv
 * 
 * 主要功能：
 * 1. 檢測是否是CF頁面網址
 * 2. 如果是，則301重定向到Javplay.tv，保持相同的路徑
 * 3. 防止無限重定向循環
 */
function handleCfRedirect(url) {
  // 主網址Javplay.tv（不進行重定向）
  const mainDomain = 'javplay.tv';
  
  // 檢查當前域名是否是CF頁面網址
  const isCfDomain = url.hostname.endsWith('.pages.dev') && 
                     !url.hostname.includes(mainDomain);
  
  // 特別匹配用戶提供的域名模式
  const isSpecificCfDomain = url.hostname === 'cloudflare-video-site.pages.dev' || 
                             /^[a-f0-9]+\.cloudflare-video-site\.pages\.dev$/.test(url.hostname);
  
  // 如果是CF頁面網址或特定CF域名，則重定向到Javplay.tv
  if (isCfDomain || isSpecificCfDomain) {
    // 構建目標URL（保持相同的路徑和查詢參數）
    const targetUrl = new URL(url.pathname + url.search, 'https://javplay.tv');
    
    // 檢查目標URL是否與當前URL相同，避免無限重定向
    if (targetUrl.toString() !== url.toString()) {
      // 使用301永久重定向
      return Response.redirect(targetUrl.toString(), 301);
    }
  }
  
  // 如果不是CF頁面網址或目標URL與當前URL相同，則返回null
  return null;
}
