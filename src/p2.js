import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import { Eye, Lock, X } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

const regionData = [
  { start: 1.8, end: 3.5, content: 'Good afternoon.', id: 'region-person-1' },
  { start: 3.6, end: 5.2, content: 'My name is Russell.', id: 'region-person-1' },
  { start: 5.3, end: 8.4, content: 'I am a wilderness explorer in tribe 54.', id: 'region-person-1' },
  { start: 8.7, end: 10.1, content: 'Sweat lodge 12.', id: 'region-person-1' }
];

// Initial Modal for Text and Color
const RegionModal = ({ isOpen, onClose, onSave }) => {
  const [text, setText] = useState('');
  const [color, setColor] = useState('#ff6347');
  const [opacity, setOpacity] = useState(0.3);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[480px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Region</h3>
          <button onClick={onClose}>×</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex gap-4">
              <HexColorPicker color={color} onChange={setColor} />
              <div className="space-y-2 flex-1">
                <div>
                  <label className="block text-sm">Opacity: {opacity}</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div
                  className="w-full h-20 rounded border"
                  style={{
                    backgroundColor: color,
                    opacity: opacity
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({ text, color, opacity });
              setText('');
              setColor('#ff6347');
              setOpacity(0.3);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!text.trim()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

// Time Selection Modal
const TimeSelectionModal = ({ isOpen, type, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-1">
          {type === 'start' ? 'Select Start Time' : 'Select End Time'}
        </h3>
        <p className="text-sm opacity-90">
          Click on the waveform to set the {type} time
        </p>
      </div>
    </div>
  );
};

// Success Modal
const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h3 className="text-xl font-semibold mb-2">Region Added Successfully!</h3>
          <p className="text-gray-600 mb-4">Your region has been created with the specified settings.</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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
  const [isInitialModalOpen, setIsInitialModalOpen] = useState(false);
  const [isTimeSelectionModalOpen, setIsTimeSelectionModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [timeSelectionType, setTimeSelectionType] = useState(null);
  const [pendingRegionData, setPendingRegionData] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [regions, setRegions] = useState([]);
  const activeRegionRef = useRef(null);
  const clickHandlerRef = useRef(null);

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

      const regions = RegionsPlugin.create({
        dragSelection: false  // Disable drag selection
      });
      regionsPluginRef.current = regions;

      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#A8A8A8',
        progressColor: '#4a5568',
        cursorColor: '#4a5568',
        barWidth: 3,
        barRadius: 3,
        cursorWidth: 1,
        height: 128,
        barGap: 3,
        minPxPerSec: 100,
        normalize: true,
        responsive: true,
        plugins: [
          timeline,
          regions
        ],
        media: videoElement
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
        
        // Add region click handler
        wavesurfer.on('region-click', handleRegionClick);

        const style = document.createElement('style');
        style.textContent = `
          .wavesurfer-region {
            --region-color: rgba(16, 80, 255, 0.3) !important;
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

        // // Set up region creation events
        // regions.enableDragSelection({
        //   color: 'rgba(46, 79, 210, 0.3)'
        // });

        // Handle region creation
        regions.on('region-created', (region) => {
          if (isInitialModalOpen) {
            setPendingRegionData(region);
            setIsInitialModalOpen(true);
          }
        });
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

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
    setIsInitialModalOpen(true);
  };

  const handleInitialModalSave = (data) => {
    setIsInitialModalOpen(false);
    setPendingRegionData(data);
    setTimeSelectionType('start');
    setIsTimeSelectionModalOpen(true);
  };

  const handleWaveformClick = (e) => {
    if (!timeSelectionType || !pendingRegionData) return;

    const rect = waveformRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const duration = wavesurferRef.current.getDuration();
    const time = (x / rect.width) * duration;

    if (timeSelectionType === 'start') {
      setStartPoint(time);
      setTimeSelectionType('end');
    } else {
      const start = Math.min(startPoint, time);
      const end = Math.max(startPoint, time);

      const region = regionsPluginRef.current.addRegion({
        start,
        end,
        color: `rgba(${parseInt(pendingRegionData.color.slice(1, 3), 16)}, 
                    ${parseInt(pendingRegionData.color.slice(3, 5), 16)}, 
                    ${parseInt(pendingRegionData.color.slice(5, 7), 16)}, 
                    ${pendingRegionData.opacity})`,
        drag: false,
        resize: true,
        id: `region-${Date.now()}`
      });

      if (region && region.element) {
        const textDiv = document.createElement('div');
        textDiv.className = 'region-text';
        textDiv.textContent = pendingRegionData.text;
        region.element.appendChild(textDiv);
      }

      setIsTimeSelectionModalOpen(false);
      setIsSuccessModalOpen(true);
      resetRegionCreation();
    }
  };

  const resetRegionCreation = () => {
    setTimeSelectionType(null);
    setStartPoint(null);
    setPendingRegionData(null);
    document.body.style.cursor = 'default';
  };

  useEffect(() => {
    const waveformElement = waveformRef.current;
    if (waveformElement && timeSelectionType) {
      waveformElement.addEventListener('click', handleWaveformClick);
      return () => waveformElement.removeEventListener('click', handleWaveformClick);
    }
  }, [timeSelectionType, startPoint]);

  const handleRegionClick = (region) => {
    setIsInitialModalOpen(true);
    setPendingRegionData({
      id: region.id,
      text: region.element.getAttribute('data-content'),
      color: region.color
    });
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (clickHandlerRef.current && waveformRef.current) {
        waveformRef.current.removeEventListener('click', clickHandlerRef.current);
      }
      document.body.style.cursor = 'default';
    };
  }, []);

  // Add styles for regions
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .wavesurfer-region {
        position: relative !important;
      }
      .region-text {
        position: absolute;
        bottom: -20px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 12px;
        color: black;
        background: white;
        padding: 2px;
        border-radius: 3px;
        pointer-events: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        z-index: 5;
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const handleDownloadSubtitles = () => {
    const allRegions = Object.values(regionsPluginRef.current.getRegions())
      .sort((a, b) => a.start - b.start)
      .map(region => ({
        start: formatTime(region.start),
        end: formatTime(region.end),
        color: region.color,
        text: region.element?.querySelector('.region-text')?.textContent || ''
      }));

    const csvContent = [
      ['Start Time', 'End Time', 'Color', 'Dialogue'],
      ...allRegions.map(region => [
        region.start,
        region.end,
        region.color,
        region.text
      ])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'subtitles.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prevent region creation when clicking waveform without being in creation mode
  useEffect(() => {
    const preventRegionCreation = (e) => {
      if (!isInitialModalOpen) {
        e.stopPropagation();
      }
    };

    const waveformElement = waveformRef.current;
    if (waveformElement) {
      waveformElement.addEventListener('mousedown', preventRegionCreation);
      waveformElement.addEventListener('touchstart', preventRegionCreation);
    }

    return () => {
      if (waveformElement) {
        waveformElement.removeEventListener('mousedown', preventRegionCreation);
        waveformElement.removeEventListener('touchstart', preventRegionCreation);
      }
    };
  }, [isInitialModalOpen]);

  // Add this function to handle region updates
  const updateRegion = (region, start, end) => {
    region.update({
      start: start,
      end: end,
      color: region.color,
      drag: false,
      resize: true
    });
  };

  // Add event listeners for region interactions
  useEffect(() => {
    if (!regionsPluginRef.current) return;

    const handleRegionUpdated = (region) => {
      if (region.element) {
        // Ensure text stays visible after region update
        const textDiv = region.element.querySelector('.region-text');
        if (!textDiv) {
          const newTextDiv = document.createElement('div');
          newTextDiv.className = 'region-text';
          newTextDiv.textContent = region.element.getAttribute('data-content') || '';
          region.element.appendChild(newTextDiv);
        }
      }
    };

    regionsPluginRef.current.on('region-updated', handleRegionUpdated);

    return () => {
      regionsPluginRef.current?.un('region-updated', handleRegionUpdated);
    };
  }, []);

  return (
    <div className="relative">
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
            padding: 8px 16px;
            background-color: #4a5568;
            color: white;
            border-radius: 4px;
            margin: 8px;
            cursor: pointer;
          }
          .create-region-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          .create-region-btn.active {
            background-color: #48bb78;
          }
          .cancel-btn {
            padding: 8px 16px;
            background-color: #e53e3e;
            color: white;
            border-radius: 4px;
            font-weight: 500;
            transition: all 0.2s;
          }
          .cancel-btn:hover {
            background-color: #c53030;
          }
          .download-btn {
            padding: 8px 16px;
            background-color: #2563eb;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .download-btn:hover {
            background-color: #1d4ed8;
          }
          .flex {
            display: flex;
          }
          .gap-2 {
            gap: 0.5rem;
          }
          .mt-4 {
            margin-top: 1rem;
          }
          .waveform-container {
            background: #f7f7f7;
            border-radius: 4px;
            padding: 20px;
            margin: 10px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow-x: auto;
          }
          .timeline {
            margin-bottom: 10px;
            height: 30px;
          }
          .relative {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
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
          <div ref={timelineRef} className="h-6 border-b border-gray-700 timeline" />
          <div ref={waveformRef} className="flex-1" />

          <div className="absolute bottom-2 right-2 bg-gray-700 text-white px-2 py-1 text-xs rounded">
            {currentTime} / {formatTime(videoDuration)}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          className={`create-region-btn ${isInitialModalOpen ? 'active' : ''}`}
          onClick={handleCreateRegion}
          disabled={isInitialModalOpen}
        >
          {isInitialModalOpen ? 'Creating region...' : 'Create Region'}
        </button>

        <button
          className="download-btn"
          onClick={handleDownloadSubtitles}
        >
          Download Subtitles
        </button>
      </div>

      <RegionModal
        isOpen={isInitialModalOpen}
        onClose={() => setIsInitialModalOpen(false)}
        onSave={handleInitialModalSave}
      />

      <TimeSelectionModal
        isOpen={isTimeSelectionModalOpen}
        type={timeSelectionType}
        onClose={() => {
          setIsTimeSelectionModalOpen(false);
          resetRegionCreation();
        }}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      {/* Visual feedback overlay */}
      {isInitialModalOpen && (
        <div 
          className="fixed top-0 left-0 w-full h-full pointer-events-none"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.1)',
            zIndex: 1000 
          }}
        >
          <div className="text-center mt-4 text-lg font-semibold text-blue-600">
            {timeSelectionType === 'start' ? 'Click on the waveform to set start point' : 'Click on the waveform to set end point'}
          </div>
        </div>
      )}
    </div>
  );
};

export default WaveformTrack; 