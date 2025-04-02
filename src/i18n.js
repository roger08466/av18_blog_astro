import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 導入翻譯文件
import translationTW from './locales/tw/translation.json';
import translationCN from './locales/cn/translation.json';
import translationEN from './locales/en/translation.json';

// 檢測是否在服務器端環境
const isServer = typeof window === 'undefined';

// 翻譯資源
const resources = {
  tw: {
    translation: translationTW
  },
  'zh-TW': {
    translation: translationTW
  },
  cn: {
    translation: translationCN
  },
  'zh-CN': {
    translation: translationCN
  },
  en: {
    translation: translationEN
  }
};

// 基本配置
const i18nConfig = {
  resources,
  fallbackLng: 'tw', // 默認語言
  debug: process.env.NODE_ENV === 'development',

  interpolation: {
    escapeValue: false // 不需要 React 已經處理了
  },

  // 語言映射，將標準語言代碼映射到我們的簡短代碼
  load: 'languageOnly', // 只加載語言部分，忽略地區

  // 語言別名，將標準語言代碼映射到我們的簡短代碼
  languageMapping: {
    'zh-TW': 'tw',
    'zh-CN': 'cn',
    'zh': 'tw',
    'en-US': 'en',
    'en-GB': 'en'
  }
};

// 客戶端特定配置
if (!isServer) {
  i18nConfig.detection = {
    // 檢測順序
    order: ['localStorage', 'navigator'],
    // 緩存用戶語言選擇
    caches: ['localStorage'],
    // 本地存儲的鍵名
    lookupLocalStorage: 'i18nextLng'
  };
}

// 初始化 i18next
const i18nInstance = i18n.createInstance();

// 根據環境使用不同的插件
if (!isServer) {
  i18nInstance.use(LanguageDetector);
}

i18nInstance
  .use(initReactI18next)
  .init(i18nConfig);

export default i18nInstance;
