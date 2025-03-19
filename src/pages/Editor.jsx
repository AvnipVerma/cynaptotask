import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import WaveformTrack from '../components/WaveformTrack';
import VideoControls from '../components/VideoControls';
import PropertiesPanel from '../components/PropertiesPanel';
import { ArrowLeft, Maximize2, Play, ZoomIn, ZoomOut, SkipBack, SkipForward } from 'lucide-react';
import { Link } from 'react-router-dom';
import video from "../assets/video.mp4";

const Editor = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120); // 2 minutes sample duration
  const videoRef = useRef(null);
  
  // Use the imported video directly
  const videoUrl = video;
  
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };
  
  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const updateTime = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handleVideoEnd = () => {
      setIsPlaying(false);
    };
    
    const handleMetadata = () => {
      setDuration(video.duration);
    };
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('loadedmetadata', handleMetadata);
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('loadedmetadata', handleMetadata);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Section */}
      <div className="flex items-center">
        <Link to="/" className="p-4">
          <ArrowLeft />
        </Link>
        <Header showSearch={false} />
        <button className="ml-auto mr-4 bg-teal-500 text-white px-6 py-2 rounded hover:bg-opacity-90">
          Export
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Assets */}
        <div className="w-72 border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-medium mb-4">Assets</h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="relative aspect-video bg-black rounded overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center">
                <Play size={20} className="text-white" />
              </div>
              <span className="text-xs mt-1 block">Project001.mp3</span>
            </div>
            <div className="relative aspect-video bg-black rounded overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center">
                <Play size={20} className="text-white" />
              </div>
              <span className="text-xs mt-1 block">Project002.mpg</span>
            </div>
          </div>
          
          <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center mt-4">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <span className="text-sm text-gray-500">Upload your files</span>
          </div>
        </div>
        
        {/* Center Panel - Video Preview and Timeline */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Preview */}
          <div className="flex-1 bg-black flex items-center justify-center p-4">
            <video 
              ref={videoRef}
              src={videoUrl}
              className="max-h-full max-w-full"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
          
          {/* Video Controls */}
          <div className="p-2 border-t border-b border-gray-200">
            <VideoControls 
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              duration={duration}
              currentTime={currentTime}
              onSeek={handleSeek}
            />
          </div>
          
          {/* Timeline/Tracks */}
          <div className="h-64 overflow-y-auto">
            <div className="flex">
              <div className="w-full">
                <WaveformTrack 
                  videoTime={currentTime}
                  videoDuration={duration}
                  videoUrl={videoUrl}
                  isPlaying={isPlaying}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Properties */}
        <PropertiesPanel />
      </div>
    </div>
  );
};

export default Editor;