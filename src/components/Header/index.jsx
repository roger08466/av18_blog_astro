import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// 引入 logo
import logo from '../../assets/images/logo.png';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 監聽滾動事件
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 切換語言
  const changeLanguage = (lng) => {
    setIsLangMenuOpen(false);

    // 先更改語言設定
    i18n.changeLanguage(lng);

    // 儲存當前語言到 localStorage，確保刷新後仍然使用正確的語言
    localStorage.setItem('i18nextLng', lng);

    // 獲取當前路徑
    const currentPath = window.location.pathname;
    
    // 從路徑中提取語言代碼和路徑部分
    const pathMatch = currentPath.match(/^\/([a-z]{2})(\/.*)?$/);
    
    // 構建新路徑
    let newPath;
    if (pathMatch) {
      // 如果當前路徑已經包含語言代碼，替換它
      newPath = `/${lng}${pathMatch[2] || ''}`;
    } else {
      // 如果當前路徑不包含語言代碼，添加它
      newPath = `/${lng}${currentPath === '/' ? '' : currentPath}`;
    }

    // 使用 window.location 強制刷新頁面
    window.location.href = newPath;
  };

  // 獲取當前語言
  const currentLanguage = i18n.language || 'tw';

  return (
    <>
      <header className={`bg-secondary-900 text-white shadow-md ${scrolled ? 'shadow-lg' : ''} fixed top-0 left-0 right-0 z-50 h-16`}>
        <div className="container h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <a href={`/${currentLanguage}`} className="flex items-center">
              <img src={logo} alt="Logo" className="h-10 w-auto my-1 ml-1" />
            </a>

            <div className="flex items-center ml-auto space-x-8">
              {/* 移動端分類觀看 - 靠右顯示 */}
              <a
                href={`/${currentLanguage}/category`}
                className="font-medium text-gold-400 md:hidden"
                data-i18n="nav.categories"
              >
                {t('nav.categories')}
              </a>

              {/* 移動端漢堡菜單按鈕 - 只用於語言切換 */}
              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <span className="mr-1" data-i18n={`languages.${currentLanguage}`}>{t(`languages.${currentLanguage}`)}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* 桌面端導航 */}
            <nav className="hidden md:flex items-center space-x-6 ml-auto">
              <a
                href={`/${currentLanguage}`}
                className="hover:text-primary-300"
                data-i18n="nav.home"
              >
                {t('nav.home')}
              </a>
              <a
                href={`/${currentLanguage}/category`}
                className="hover:text-primary-300"
                data-i18n="nav.categories"
              >
                {t('nav.categories')}
              </a>

              {/* 語言切換 */}
              <div className="relative">
                <button
                  className="flex items-center space-x-1 hover:text-primary-300"
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                >
                  <span data-i18n={`languages.${currentLanguage}`}>{t(`languages.${currentLanguage}`)}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* 語言下拉菜單 */}
                {isLangMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${currentLanguage === 'tw' ? 'bg-gold-100 text-gold-800' : 'text-secondary-700 hover:bg-primary-50'}`}
                        onClick={() => {
                          changeLanguage('tw');
                          setIsMenuOpen(false);
                        }}
                        data-i18n="languages.tw"
                      >
                        {t('languages.tw')}
                      </button>
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${currentLanguage === 'cn' ? 'bg-gold-100 text-gold-800' : 'text-secondary-700 hover:bg-primary-50'}`}
                        onClick={() => {
                          changeLanguage('cn');
                          setIsMenuOpen(false);
                        }}
                        data-i18n="languages.cn"
                      >
                        {t('languages.cn')}
                      </button>
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${currentLanguage === 'en' ? 'bg-gold-100 text-gold-800' : 'text-secondary-700 hover:bg-primary-50'}`}
                        onClick={() => {
                          changeLanguage('en');
                          setIsMenuOpen(false);
                        }}
                        data-i18n="languages.en"
                      >
                        {t('languages.en')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* 移動端語言選單 - 只包含語言切換選項 */}
      {isMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bg-secondary-700 text-white shadow-md z-40 md:hidden">
          <div className="container py-2">
            <p className="text-sm text-gold-400 mb-2" data-i18n="common.selectLanguage">{t('common.selectLanguage')}:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`py-2 px-3 rounded-md text-center transition-colors ${
                  currentLanguage === 'tw'
                    ? 'bg-gold-600 text-white font-medium'
                    : 'bg-secondary-800 text-white hover:bg-gold-700 hover:text-white'
                }`}
                onClick={() => {
                  changeLanguage('tw');
                  setIsMenuOpen(false);
                }}
                data-i18n="languages.tw"
              >
                {t('languages.tw')}
              </button>
              <button
                className={`py-2 px-3 rounded-md text-center transition-colors ${
                  currentLanguage === 'cn'
                    ? 'bg-gold-600 text-white font-medium'
                    : 'bg-secondary-800 text-white hover:bg-gold-700 hover:text-white'
                }`}
                onClick={() => {
                  changeLanguage('cn');
                  setIsMenuOpen(false);
                }}
                data-i18n="languages.cn"
              >
                {t('languages.cn')}
              </button>
              <button
                className={`py-2 px-3 rounded-md text-center transition-colors ${
                  currentLanguage === 'en'
                    ? 'bg-gold-600 text-white font-medium'
                    : 'bg-secondary-800 text-white hover:bg-gold-700 hover:text-white'
                }`}
                onClick={() => {
                  changeLanguage('en');
                  setIsMenuOpen(false);
                }}
                data-i18n="languages.en"
              >
                {t('languages.en')}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 添加一個空白div來補償固定定位導致的內容被覆蓋 */}
      <div className="h-16"></div>
    </>
  );
};

export default Header;
