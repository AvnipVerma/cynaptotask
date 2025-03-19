import React from 'react';
import { ArrowLeft, Maximize2, Play, Pause, Volume2, SkipBack, SkipForward, ZoomIn, ZoomOut, Scissors, Copy, Layers } from 'lucide-react';

const VideoControls = ({
  onPlay,
  onPause,
  isPlaying,
  duration = 100,
  currentTime = 0,
  onSeek
}) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value) => {
    onSeek(value);
  };

  // New functions for skip forward/backward
  const handleSkipForward = () => {
    const newTime = Math.min(currentTime + 5, duration);
    handleSeek(newTime);
  };

  const handleSkipBackward = () => {
    const newTime = Math.max(currentTime - 5, 0);
    handleSeek(newTime);
  };

  return (
    <div className="flex flex-col ">
      <div className="flex items-center w-full justify-center gap-4 py-2">
        <button className="p-1 rounded-full hover:bg-gray-100">
          <Scissors size={18} />
        </button>
        <button className="p-1 rounded-full hover:bg-gray-100">
          <Copy size={18} />
        </button>
        <button className="p-1 rounded-full hover:bg-gray-100">
          <Layers size={18} />
        </button>
        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={handleSkipBackward}
        >
          <SkipBack size={20} />
        </button>

        <button
          className="p-3 bg-teal-500 text-white rounded-full hover:bg-opacity-90"
          onClick={isPlaying ? onPause : onPlay}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={handleSkipForward}
        >
          <SkipForward size={20} />
        </button>

        <div className="flex-1 flex items-center gap-2 mx-4">
          <div className="w-full">
            <input
              type="range"
              min="0"
              max={duration}
              step="0.1"
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="whitespace-nowrap text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="flex items-center space-x-1 ml-4">
          <button className="p-1 rounded-full hover:bg-gray-100">
            <ZoomOut size={18} />
          </button>
          <div className="w-24 h-2 bg-teal-500 rounded-full"></div>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <ZoomIn size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;