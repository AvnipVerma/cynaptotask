import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import { Eye, Lock } from 'lucide-react';

const WaveformTrack = ({
  videoTime = 0,
  videoDuration = 0,
  videoUrl = null,
  isPlaying = false
}) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const regionsRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  useEffect(() => {
    let wavesurfer = null;

    const initializeWaveSurfer = async () => {
      if (waveformRef.current && !wavesurferRef.current) {
        const videoElement = document.querySelector('video');
        if (!videoElement) {
          console.error('Video element not found');
          return;
        }
    
        const wsRegions = RegionsPlugin.create();
        regionsRef.current = wsRegions;
    
        wavesurferRef.current = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: '#4A90E2',  // Change to a simple color
          progressColor: '#57BAB6',  
          cursorColor: '#fff',
          cursorWidth: 2,
          barWidth: 3,
          barRadius: 2,
          barGap: 1,
          height: 100, // Increase height for visibility
          normalize: true,
          splitChannels: false,
          interact: true,
          hideScrollbar: true,
          autoCenter: true,
          plugins: [wsRegions],
        });
    
        wavesurferRef.current.load(videoUrl); // Load audio from the video
    
        wavesurferRef.current.on('ready', () => {
          setIsReady(true);
          setDuration(formatTime(wavesurferRef.current.getDuration()));
        });
    
        wavesurferRef.current.on('audioprocess', () => {
          if (wavesurferRef.current.isDestroyed) return;
          setCurrentTime(formatTime(wavesurferRef.current.getCurrentTime()));
        });
      }
    };
    

    // Wait for a short moment to ensure video element is mounted
    setTimeout(() => {
      initializeWaveSurfer().catch(console.error);
    }, 100);

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
      if (regionsRef.current) {
        regionsRef.current = null;
      }
    };
  }, []);

  // Sync with video playback
  useEffect(() => {
    if (wavesurferRef.current && isReady && !wavesurferRef.current.isDestroyed) {
      wavesurferRef.current.setTime(videoTime);
    }
  }, [videoTime, isPlaying, isReady]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <style>
        {`
          #waveform ::part(cursor) {
            height: 100%;
            border-radius: 4px;
            border: 1px solid #fff;
          }

          #waveform ::part(region) {
            background-color: rgba(0, 0, 100, 0.25) !important;
          }

          #waveform ::part(region-handle-right) {
            border-right-width: 4px !important;
            border-right-color: #fff000 !important;
          }
        `}
      </style>
      <div className="flex h-24 border-b border-gray-200">
        <div className="track-label flex items-center w-32 px-4 bg-white border-r border-gray-200">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <span className="text-gray-700 text-sm font-bold">Track 1</span>
            </div>
            <div className='gap-10 flex flex-col'>
            <Eye className="text-black w-6 h-6" />

            <Lock size={16} className="text-black w-6 h-6" />
            </div>

          </div>
        </div>
        <div className="flex-1 relative bg-black" id="waveform">
          <div ref={waveformRef} className="h-full" />
          <div className="absolute bottom-2 right-2 bg-gray-700 text-white px-2 py-1 text-xs rounded">
            {currentTime} / {formatTime(videoDuration)}
          </div>
        </div>
      </div>
    </>
  );
};

export default WaveformTrack;