import axios from 'axios';

// 檢測是否在服務器端環境
const isServer = typeof window === 'undefined';

// 安全地獲取環境變量
const getEnvVar = (name, defaultValue) => {
  try {
    return typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]
      ? import.meta.env[name]
      : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// 安全地獲取localStorage
const getFromLocalStorage = (key, defaultValue) => {
  if (isServer) return defaultValue;

  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) || defaultValue : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// API 基礎 URL
const API_BASE_URL = getEnvVar('PUBLIC_API_URL', 'https://video-platform-api.roger08466-5e8.workers.dev');

// 是否使用緩存
const USE_CACHE = getEnvVar('PUBLIC_USE_CACHE', 'true') === 'true';

// 創建 axios 實例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 請求攔截器
api.interceptors.request.use(
  (config) => {
    // 獲取當前語言
    let language = 'tw'; // 默認語言

    // 從 URL 路徑中提取語言參數（用於 SSR/SSG）
    if (isServer && config.url && config.ssrContext && config.ssrContext.url) {
      const urlPath = config.ssrContext.url;
      const langMatch = urlPath.match(/^\/([a-z]{2})(\/|$)/);
      if (langMatch && ['tw', 'cn', 'en'].includes(langMatch[1])) {
        language = langMatch[1];
      }
    } else {
      // 客戶端從 localStorage 獲取語言
      language = getFromLocalStorage('i18nextLng', 'tw');
    }

    // 將標準語言代碼映射到我們的簡短代碼
    // 確保 API 請求中使用正確的語言代碼
    if (language.startsWith('zh-TW') || language === 'zh-Hant') {
      language = 'tw';
    } else if (language.startsWith('zh-CN') || language === 'zh-Hans' || language === 'zh') {
      language = 'cn';
    } else if (language.startsWith('en')) {
      language = 'en';
    } else if (language.startsWith('ja')) {
      language = 'ja';
    }

    // 添加語言參數到所有請求
    if (config.params) {
      config.params.language = language;
    } else {
      config.params = { language };
    }

    // 添加緩存控制參數
    if (config.params) {
      config.params.use_cache = USE_CACHE;
    } else {
      config.params = { use_cache: USE_CACHE };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 為 SSR/SSG 設置上下文
export const setSSRContext = (url) => {
  api.defaults.ssrContext = { url };
};

// API 方法
export const videoApi = {
  // 獲取影片列表
  getVideos: (params = {}) => {
    return api.get('/api/videos', { params });
  },

  // 獲取最新影片
  getLatestVideos: (limit = 10) => {
    return api.get('/api/videos/latest', { params: { limit } });
  },

  // 獲取影片詳情
  getVideoDetail: (hid) => {
    return api.get(`/api/videos/${hid}`);
  },

  // 按標籤獲取影片
  getVideosByTag: (tag, params = {}) => {
    // 對標籤進行編碼
    const encodedTag = encodeURIComponent(tag);
    return api.get(`/api/videos/by-tag/${encodedTag}`, { params });
  },

  // 按片商獲取影片
  getVideosByManufacturer: (manufacturer, params = {}) => {
    // 對片商進行編碼
    const encodedManufacturer = encodeURIComponent(manufacturer);
    return api.get(`/api/videos/by-manufacturer/${encodedManufacturer}`, { params });
  },

  // 獲取所有標籤
  getTags: () => {
    return api.get('/api/tags');
  },

  // 獲取所有片商
  getManufacturers: () => {
    return api.get('/api/manufacturers');
  },

  // 獲取所有演員
  getActors: () => {
    return api.get('/api/actors');
  },

  // 按演員獲取影片
  getVideosByActor: (actor, params = {}) => {
    // 對演員進行編碼
    const encodedActor = encodeURIComponent(actor);
    return api.get(`/api/videos/by-actor/${encodedActor}`, { params });
  },

  // 搜索影片
  searchVideos: (query, params = {}) => {
    // 確保所有語言（包括日文）都能正確編碼
    const encodedQuery = encodeURIComponent(query);
    return api.get(`/api/videos/search/${encodedQuery}`, { params });
  }
};

export default api;
