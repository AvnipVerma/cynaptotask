import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/timeline/index.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/regions/index.js';
import { Eye, Lock } from 'lucide-react';

const regionData = [
  { start: 1.8, end: 3.5, content: 'Good afternoon.', id: 'region-person-1' },
  { start: 3.6, end: 5.2, content: 'My name is Russell.', id: 'region-person-1' },
  { start: 5.3, end: 8.4, content: 'I am a wilderness explorer in tribe 54.', id: 'region-person-1' },
  { start: 8.7, end: 10.1, content: 'Sweat lodge 12.', id: 'region-person-1' }
];

const DialogueModal = ({ isOpen, onClose, onSave }) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Add Dialogue</h3>
        <textarea
          className="w-full h-32 p-2 border rounded mb-4 text-black"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter dialogue text..."
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              onSave(text);
              setText('');
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

const WaveformTrack = ({
  videoTime = 0,
  videoDuration = 0,
  videoUrl = null,
  isPlaying = false
}) => {
  const waveformRef = useRef(null);
  const timelineRef = useRef(null);
  const wavesurferRef = useRef(null);
  const regionsPluginRef = useRef(null);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [isCreatingRegion, setIsCreatingRegion] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempRegion, setTempRegion] = useState(null);

  useEffect(() => {
    if (waveformRef.current) {
      waveformRef.current.innerHTML = '';
    }
    if (timelineRef.current) {
      timelineRef.current.innerHTML = '';
    }

    const initializeWaveSurfer = async () => {
      const videoElement = document.querySelector('video');
      if (!videoElement) return;

      const timeline = TimelinePlugin.create({
        container: timelineRef.current,
        height: 15,
        timeInterval: 0.1,
        primaryLabelInterval: 1,
        secondaryLabelInterval: 5,
        primaryColor: '#fff',
        secondaryColor: '#666',
        primaryFontColor: '#fff',
        secondaryFontColor: '#fff'
      });

      const regions = RegionsPlugin.create();
      regionsPluginRef.current = regions;

      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4A90E2',
        progressColor: '#57BAB6',
        cursorColor: '#fff',
        cursorWidth: 2,
        barWidth: 3,
        barGap: 1,
        height: 80,
        normalize: true,
        interact: true,
        fillParent: false,
        hideScrollbar: false,
        media: videoElement,
        plugins: [timeline, regions],
        minPxPerSec: 200,
        autoScroll: true,
        scrollAnimation: true
      });

      wavesurfer.on('ready', () => {
        wavesurfer.zoom(50);

        regionData.forEach(region => {
          const wavesurferRegion = regions.addRegion({
            start: region.start,
            end: region.end,
            color: 'rgba(255, 255, 255, 0.9)', // White background
            drag: false,
            resize: false,
            id: region.id,
            content: region.content
          });
        
          if (wavesurferRegion.element) {
            wavesurferRegion.element.setAttribute('data-content', region.content);
            wavesurferRegion.element.classList.add(
              'mt-', // Equivalent to margin-top: 20px
              'bg-white',
              'text-black',
              'font-bold',
              'h-[10px]',
              'flex',
              'items-center',
              'justify-center',
              'rounded-md',
              'border',
              'border-black'
            );
          }
        });
        

        const style = document.createElement('style');
        style.textContent = `
          .wavesurfer-region {
            --region-color: rgba(255, 99, 71, 0.3) !important;
            background-color: var(--region-color) !important;
          }
          .wavesurfer-region::after {
            content: attr(data-content);
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            padding: 4px 8px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            font-size: 12px;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            pointer-events: none;
            border-radius: 4px;
            margin-top: 4px;
          }
        `;
        wavesurfer.getWrapper().appendChild(style);
      });

      wavesurferRef.current = wavesurfer;
    };

    const timer = setTimeout(() => {
      initializeWaveSurfer();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setCurrentTime(formatTime(videoTime));
  }, [videoTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleVideoPlayback = (shouldPlay) => {
    const video = document.querySelector('video');
    if (video) {
      if (shouldPlay) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const handleCreateRegion = () => {
    if (!isCreatingRegion && wavesurferRef.current && regionsPluginRef.current) {
      setIsCreatingRegion(true);
      toggleVideoPlayback(false);
      
      const tempRegion = regionsPluginRef.current.addRegion({
        start: videoTime,
        end: videoTime + 2,
        color: 'rgba(0, 255, 0, 0.2)',
        drag: false,
        resize: true,
        id: 'temp-region'
      });

      setTempRegion(tempRegion);

      tempRegion.on('update-end', () => {
        setIsModalOpen(true);
      });
    }
  };

  const handleSaveDialogue = (content) => {
    if (tempRegion && regionsPluginRef.current) {
      const finalRegion = regionsPluginRef.current.addRegion({
        start: tempRegion.start,
        end: tempRegion.end,
        color: 'rgba(255, 99, 71, 0.3)',
        drag: false,
        resize: false,
        id: `region-${Date.now()}`
      });

      if (finalRegion.element) {
        finalRegion.element.setAttribute('data-content', content);
      }

      tempRegion.remove();
      setTempRegion(null);
    }

    setIsModalOpen(false);
    setIsCreatingRegion(false);
    toggleVideoPlayback(true);
  };

  const handleCancelDialogue = () => {
    if (tempRegion) {
      tempRegion.remove();
      setTempRegion(null);
    }
    setIsModalOpen(false);
    setIsCreatingRegion(false);
    toggleVideoPlayback(true);
  };

  return (
    <>
      <style>
        {`
          #waveform ::part(cursor) {
            height: 100%;
            border-radius: 4px;
            border: 1px solid #fff;
            z-index: 5;
          }
          .timeline {
            color: white !important;
          }
          .timeline canvas {
            opacity: 0.8;
          }
          .wavesurfer-container {
            overflow-x: auto !important;
            scroll-behavior: smooth;
            position: relative;
            height: 150px !important;
            padding-bottom: 30px;
          }
          .wavesurfer-container::-webkit-scrollbar {
            height: 15px;
            background: #333;
            margin-top: 2rem;
          }
          .wavesurfer-container::-webkit-scrollbar-thumb {
            background: #666;
            height: 2px;
            border: 5px solid #333;
            border-radius: 10px;
          }
          .create-region-btn {
            position: absolute;
            top: 4px;
            right: 4px;
            background: #57BAB6;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            z-index: 20;
            transition: background-color 0.2s;
          }
          .create-region-btn:hover {
            background: #4a9e9a;
          }
          .create-region-btn.active {
            background: #45918e;
          }
        `}
      </style>
      
      <div className="flex h-48 border-b border-gray-200">
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
        <div className="flex-1 flex flex-col relative bg-black wavesurfer-container" id="waveform">
          <button
            className={`create-region-btn ${isCreatingRegion ? 'active' : ''}`}
            onClick={handleCreateRegion}
            disabled={isCreatingRegion}
          >
            {isCreatingRegion ? 'Creating Region...' : 'Create Region'}
          </button>

          <div ref={timelineRef} className="h-6 border-b border-gray-700 timeline" />
          <div ref={waveformRef} className="flex-1" />

          <div className="absolute bottom-2 right-2 bg-gray-700 text-white px-2 py-1 text-xs rounded">
            {currentTime} / {formatTime(videoDuration)}
          </div>
        </div>
      </div>

      <DialogueModal
        isOpen={isModalOpen}
        onClose={handleCancelDialogue}
        onSave={handleSaveDialogue}
      />
    </>
  );
};

export default WaveformTrack;