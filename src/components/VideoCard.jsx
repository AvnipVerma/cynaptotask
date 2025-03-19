
import React from 'react';
import { Play } from 'lucide-react';

const VideoCard = ({ title, index }) => {
  return (
    <div className="flex flex-col">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group cursor-pointer mb-2">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
            <Play fill="white" className="text-white ml-1" />
          </div>
        </div>
      </div>
      <span className="text-sm font-medium">{title} {index}</span>
    </div>
  );
};

export default VideoCard;