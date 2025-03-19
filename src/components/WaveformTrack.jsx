import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Eye, Lock } from 'lucide-react';

const WaveformTrack = ({
  videoTime = 0,
  videoDuration = 0,
  videoUrl = null,
  isPlaying = false
}) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
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

        const wavesurfer = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: {
            gradient: ['rgba(187,68,238,1)', 'rgba(68,136,238,1)', 'rgba(68,221,170,1)', 'rgba(136,238,68,1)']
          },
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
          media: videoElement
        });

        wavesurfer.on('ready', () => {
          setIsReady(true);
          setDuration(formatTime(videoDuration));
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

    setTimeout(() => {
      initializeWaveSurfer().catch(console.error);
    }, 100);

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
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