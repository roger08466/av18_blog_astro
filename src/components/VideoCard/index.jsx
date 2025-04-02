import React from 'react';
import { useTranslation } from 'react-i18next';

const VideoCard = ({ video, priority = false }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language || 'tw';

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // 格式化標籤
  const formatTags = (tagsString) => {
    if (!tagsString) return [];

    // 直接按逗號分割，並修剪每個標籤
    let tags = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);

    // 排除特定標籤
    tags = tags.filter(tag => {
      const lowerTag = tag.toLowerCase();
      return !lowerTag.includes('av女優片') &&
             !lowerTag.includes('av女优片') &&
             !lowerTag.includes('av actress') &&
             !lowerTag.includes('720p') &&
             !lowerTag.includes('hd') &&
             !lowerTag.includes('4k');
    });

    return tags;
  };

  // 格式化演員
  const formatActors = (actorsString) => {
    if (!actorsString) return [];

    // 如果已經是陣列，直接返回
    if (Array.isArray(actorsString)) {
      return actorsString;
    }

    // 檢查是否是 JSON 字符串格式（以 [ 開頭和 ] 結尾）
    if (typeof actorsString === 'string' && actorsString.trim().startsWith('[') && actorsString.trim().endsWith(']')) {
      try {
        const actors = JSON.parse(actorsString);
        return Array.isArray(actors) ? actors : [actorsString];
      } catch (e) {
        // JSON 解析失敗，視為普通字符串
        return [actorsString];
      }
    }

    // 如果是普通字符串，直接返回包含該字符串的陣列
    return [actorsString];
  };

  return (
    <div className="video-card">
      <a href={`/${currentLanguage}/video/${video.barcode || video.hid}`}>
        <div className="video-thumbnail">
          <img
            src={video.thumbnail_large || video.thumbnail_small || 'https://via.placeholder.com/320x180?text=No+Image'}
            alt={video.title}
            loading={priority ? "eager" : "lazy"}
            fetchpriority={priority ? "high" : "auto"}
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="video-info">
          <h3 className="video-title">{video.title || t('common.noResults')}</h3>
          <div className="video-meta">
            {video.actors && (
              <p className="mb-1"><span className="font-semibold">{t('video.actors')}:</span> {formatActors(video.actors).join(' ')}</p>
            )}
            {video.barcode && (
              <p className="mb-1 text-sm">
                <span className="font-semibold">{t('video.code')}:</span> {video.barcode}
              </p>
            )}
            {video.manufacturer && (
              <p className="mb-1 text-sm">
                <span className="font-semibold">{t('video.manufacturer')}:</span> {video.manufacturer}
              </p>
            )}
            {video.upload_date && (
              <p className="text-sm text-gold-600">
                <span className="font-semibold">{t('video.uploadDate')}:</span> {formatDate(video.upload_date)}
              </p>
            )}
          </div>
          {video.tags && (
            <div className="mt-2 flex flex-wrap">
              {formatTags(video.tags).slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
              {formatTags(video.tags).length > 3 && (
                <span className="tag">+{formatTags(video.tags).length - 3}</span>
              )}
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

export default VideoCard;
