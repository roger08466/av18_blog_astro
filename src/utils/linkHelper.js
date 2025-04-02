// 檢測是否在服務器端環境
const isServer = typeof window === 'undefined';

/**
 * 獲取本地化的鏈接
 * @param {string} path - 路徑，不包含語言前綴
 * @param {string} language - 語言代碼
 * @returns {string} - 本地化的鏈接
 */
export const localizedLink = (path, language) => {
  // 確保語言代碼有效
  const validLanguage = language || 'tw';
  
  // 處理路徑
  const cleanPath = path ? (path.startsWith('/') ? path.substring(1) : path) : '';
  
  // 構建本地化鏈接
  return `/${validLanguage}${cleanPath ? `/${cleanPath}` : ''}`;
};

/**
 * 獲取語言版本的路徑
 * @param {string} path - 當前路徑
 * @param {string} language - 目標語言
 * @returns {string} - 新的路徑
 */
export const getLanguageVersionPath = (path, language) => {
  // 確保語言代碼有效
  const validLanguage = language || 'tw';
  
  // 從路徑中提取語言代碼和路徑部分
  const pathMatch = path.match(/^\/([a-z]{2})(\/.*)?$/);
  
  // 構建新路徑
  if (pathMatch) {
    // 如果當前路徑已經包含語言代碼，替換它
    return `/${validLanguage}${pathMatch[2] || ''}`;
  } else {
    // 如果當前路徑不包含語言代碼，添加它
    return `/${validLanguage}${path === '/' ? '' : path}`;
  }
};

/**
 * 從 URL 中獲取語言
 * @param {string} url - URL
 * @returns {string} - 語言代碼
 */
export const getLanguageFromUrl = (url) => {
  // 從 URL 中提取語言代碼
  const langMatch = url.match(/^\/([a-z]{2})(\/|$)/);
  
  // 如果找到語言代碼，返回它
  if (langMatch && ['tw', 'cn', 'en'].includes(langMatch[1])) {
    return langMatch[1];
  }
  
  // 否則返回默認語言
  return 'tw';
};

/**
 * 從 localStorage 或 URL 中獲取當前語言
 * @param {string} url - URL (僅在服務器端使用)
 * @returns {string} - 語言代碼
 */
export const getCurrentLanguage = (url) => {
  // 在服務器端，從 URL 中獲取語言
  if (isServer && url) {
    return getLanguageFromUrl(url);
  }
  
  // 在客戶端，從 localStorage 中獲取語言
  if (!isServer) {
    try {
      const storedLang = localStorage.getItem('i18nextLng');
      
      // 將標準語言代碼映射到我們的簡短代碼
      if (storedLang) {
        if (storedLang.startsWith('zh-TW') || storedLang === 'zh-Hant') {
          return 'tw';
        } else if (storedLang.startsWith('zh-CN') || storedLang === 'zh-Hans' || storedLang === 'zh') {
          return 'cn';
        } else if (storedLang.startsWith('en')) {
          return 'en';
        }
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
  }
  
  // 默認語言
  return 'tw';
};

/**
 * 檢查是否為服務器端環境
 * @returns {boolean} - 是否為服務器端環境
 */
export const checkIsServer = () => {
  return isServer;
};
