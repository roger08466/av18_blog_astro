// 檢測是否在服務器端環境
export const isServer = typeof window === 'undefined';

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
 * 獲取當前頁面的路徑（不包含語言前綴）
 * @param {string} url - URL
 * @returns {string} - 路徑
 */
export const getPathWithoutLanguage = (url) => {
  // 從 URL 中提取語言代碼和路徑部分
  const pathMatch = url.match(/^\/([a-z]{2})(\/.*)?$/);
  
  // 如果找到語言代碼，返回路徑部分
  if (pathMatch && ['tw', 'cn', 'en'].includes(pathMatch[1])) {
    return pathMatch[2] || '/';
  }
  
  // 否則返回原始 URL
  return url;
};

/**
 * 獲取所有語言版本的 URL
 * @param {string} url - 當前 URL
 * @returns {Object} - 所有語言版本的 URL
 */
export const getAllLanguageVersions = (url) => {
  // 獲取不包含語言前綴的路徑
  const path = getPathWithoutLanguage(url);
  
  // 返回所有語言版本的 URL
  return {
    tw: `/tw${path === '/' ? '' : path}`,
    cn: `/cn${path === '/' ? '' : path}`,
    en: `/en${path === '/' ? '' : path}`
  };
};

/**
 * 檢查是否為有效的語言代碼
 * @param {string} lang - 語言代碼
 * @returns {boolean} - 是否為有效的語言代碼
 */
export const isValidLanguage = (lang) => {
  return ['tw', 'cn', 'en'].includes(lang);
};

/**
 * 獲取默認語言
 * @returns {string} - 默認語言代碼
 */
export const getDefaultLanguage = () => {
  return 'tw';
};
