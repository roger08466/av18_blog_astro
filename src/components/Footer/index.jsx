import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const currentLanguage = i18n.language || 'tw';

  // 切換語言
  const changeLanguage = (lng) => {
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

    // 滾動到頁面頂部，增強用戶體驗
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-secondary-900 text-white py-8 border-t-4 border-gold-600">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 網站信息 */}
          <div>
            <h3 className="text-xl font-bold mb-4" data-i18n="common.appName">{t('common.appName')}</h3>
            <p className="text-primary-300 mb-4 flex items-center">
              <span className="text-gold-500 mr-1">©</span>
              {currentYear} {t('common.appName')}. <span data-i18n="footer.allRightsReserved">{t('footer.allRightsReserved')}</span>
            </p>
            {/* 社交平台圖標已隱藏 */}
          </div>

          {/* 快速鏈接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gold-500" data-i18n="footer.quickLinks">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <a href={`/${currentLanguage}`} className="text-primary-300 hover:text-gold-400" data-i18n="nav.home">
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a href={`/${currentLanguage}/category`} className="text-primary-300 hover:text-gold-400" data-i18n="nav.categories">
                  {t('nav.categories')}
                </a>
              </li>
              <li>
                <a href={`/${currentLanguage}/category`} className="text-primary-300 hover:text-gold-400" data-i18n="nav.latest">
                  {t('nav.latest')}
                </a>
              </li>
              {/* 熱門影片已隱藏 */}
            </ul>
          </div>

          {/* 語言選擇 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gold-500" data-i18n="nav.language">{t('nav.language')}</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => changeLanguage('tw')}
                  className="text-primary-300 hover:text-gold-400"
                  data-i18n="languages.tw"
                >
                  {t('languages.tw')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => changeLanguage('cn')}
                  className="text-primary-300 hover:text-gold-400"
                  data-i18n="languages.cn"
                >
                  {t('languages.cn')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => changeLanguage('en')}
                  className="text-primary-300 hover:text-gold-400"
                  data-i18n="languages.en"
                >
                  {t('languages.en')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary-800 text-center text-sm">
          <p className="text-gold-400 mb-2" data-i18n="footer.disclaimer">{t('footer.disclaimer')}</p>
          <p className="text-primary-300" data-i18n="footer.adultContent">{t('footer.adultContent')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
