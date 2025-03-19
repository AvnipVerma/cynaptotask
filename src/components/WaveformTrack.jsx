import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import { Eye } from 'lucide-react';

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
        // Wait for video element to be available
        const videoElement = document.querySelector('video');
        if (!videoElement) {
          console.error('Video element not found');
          return;
        }

        // Create a Regions plugin instance
        const wsRegions = RegionsPlugin.create();
        regionsRef.current = wsRegions;

        wavesurfer = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: [
            'rgba(187,68,238,1)',
            'rgba(68,136,238,1)',
            'rgba(68,221,170,1)',
            'rgba(136,238,68,1)'
          ],
          progressColor: 'rgba(255, 255, 255, 0.5)',
          cursorColor: '#57BAB6',
          cursorWidth: 4,
          barWidth: 2,
          barRadius: 2,
          barGap: 1,
          height: 80,
          normalize: true,
          fillParent: true,
          minPxPerSec: 100,
          splitChannels: false,
          interact: true,
          hideScrollbar: false,
          autoCenter: true,
          plugins: [wsRegions],
          media: videoElement
        });

        wavesurfer.on('ready', () => {
          setIsReady(true);
          setDuration(formatTime(videoDuration));
          
          // Initial sync with video time
          if (videoTime > 0) {
            wavesurfer.setTime(videoTime);
          }
        });

        wavesurfer.on('audioprocess', () => {
          if (wavesurfer.isDestroyed) return;
          setCurrentTime(formatTime(videoTime));
        });

        wavesurferRef.current = wavesurfer;
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
      <div className="flex h-24 border-b border-gray-700 bg-gray-900">
        <div className="track-label flex items-center justify-between bg-gray-800 w-32 px-4">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-gray-400" />
            <span className="text-white text-sm">Track 1</span>
          </div>
        </div>
        <div className="flex-1 relative" id="waveform">
          <div ref={waveformRef} className="h-full" />
          <div className="absolute bottom-2 right-2 bg-gray-800 text-white px-2 py-1 text-xs rounded">
            {currentTime} / {formatTime(videoDuration)}
          </div>
        </div>
      </div>
    </>
  );
};

export default WaveformTrack;