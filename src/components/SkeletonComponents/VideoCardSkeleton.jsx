import React from 'react';

const VideoCardSkeleton = () => {
  return (
    <div className="video-card animate-pulse">
      <div className="video-thumbnail bg-gray-300 aspect-video rounded"></div>
      <div className="video-info mt-2">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="mt-2 flex space-x-2">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;
