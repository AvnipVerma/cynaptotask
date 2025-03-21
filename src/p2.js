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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Create New Region</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="modal-body">
          <div className="input-group">
            <label>Enter Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text for the region..."
              rows={3}
            />
          </div>

          <div className="input-group">
            <label>Choose Color</label>
            <div className="color-picker-container">
              <HexColorPicker color={color} onChange={setColor} />
              <div className="color-preview">
                <div>
                  <label>Opacity: {opacity}</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  />
                </div>
                <div 
                  className="color-sample"
                  style={{
                    backgroundColor: color,
                    opacity: opacity
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            onClick={onClose}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (text.trim()) {
                onSave({ text, color, opacity });
              }
            }}
            disabled={!text.trim()}
            className="save-btn"
          >
            Create
          </button>
        </div>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            border-radius: 8px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .modal-header {
            padding: 16px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .modal-header h3 {
            margin: 0;
            font-size: 18px;
            color: #1f2937;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            color: #6b7280;
            cursor: pointer;
            padding: 0;
          }

          .modal-body {
            padding: 16px;
          }

          .input-group {
            margin-bottom: 16px;
          }

          .input-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: #4b5563;
            font-weight: 500;
          }

          textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            resize: vertical;
          }

          .color-picker-container {
            display: flex;
            gap: 16px;
          }

          .color-preview {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .color-preview label {
            font-size: 12px;

            color: #6b7280;
          }

          input[type="range"] {
            width: 100%;
          }

          .color-sample {
            flex: 1;
            border-radius: 4px;
            border: 1px solid #d1d5db;
          }

          .modal-footer {
            padding: 16px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: flex-end;
            gap: 8px;
          }

          .cancel-btn, .save-btn {
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }

          .cancel-btn {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            color: #4b5563;
          }

          .cancel-btn:hover {
            background: #e5e7eb;
          }

          .save-btn {
            background: #3b82f6;
            border: none;
            color: white;
          }

          .save-btn:hover {
            background: #2563eb;
          }

          .save-btn:disabled {
            background: #93c5fd;
            cursor: not-allowed;
          }
        `}</style>
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
   

    const initializeWaveSurfer = async () => {
      const videoElement = document.querySelector('video');
      if (!videoElement) return;

    

      const regions = RegionsPlugin.create({
        dragSelection: false,
        color: 'rgba(255, 99, 71, 0.3)', // Default region color
        handleStyle: {
          left: {
            width: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            cursor: 'ew-resize'
          },
          right: {
            width: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            cursor: 'ew-resize'
          }
        }
      });
      regionsPluginRef.current = regions;

      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#9ca3af',
        progressColor: '#4b5563',
        cursorColor: '#6b7280',
        barWidth: 3,
        barRadius: 3,
        cursorWidth: 1,
        height: 80,
        barGap: 3,
        minPxPerSec: 100,
        normalize: true,
        responsive: true,
        backgroundColor: '#1f2937',
        plugins: [
          TimelinePlugin.create({
            height: 20,
            insertPosition: 'beforebegin',
            timeInterval: 0.2,
            primaryLabelInterval: 1,
            secondaryLabelInterval: 1,
            style: {
              fontSize: '12px',
              color: 'grey',
            },
          }),
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
    if (!timeSelectionType || !pendingRegionData || !wavesurferRef.current) return;

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

      createRegion(
        regionsPluginRef.current,
        start,
        end,
        `rgba(${parseInt(pendingRegionData.color.slice(1, 3), 16)}, 
              ${parseInt(pendingRegionData.color.slice(3, 5), 16)}, 
              ${parseInt(pendingRegionData.color.slice(5, 7), 16)}, 
              ${pendingRegionData.opacity})`,
        pendingRegionData.text
      );

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
        bottom: -16px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 11px;
        color: #e5e7eb;
        background: #374151;
        padding: 2px 6px;
        border-radius: 2px;
        pointer-events: none;
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
    <div className="waveform-track-container ">
      <div className="button-container">
        <button
          className="action-btn create-btn"
          onClick={handleCreateRegion}
          disabled={timeSelectionType !== null}
        >
          Add Region
        </button>
        <button
          className="action-btn download-btn"
          onClick={handleDownloadSubtitles}
        >
          Download
        </button>
      </div>

      <div className="waveform-wrapper">
        <div 
          ref={waveformRef} 
          className={`waveform-container ${timeSelectionType ? 'selecting-time' : ''}`}
        ></div>
        {/* <div id="timeline" className="timeline"></div> */}
      </div>

      <RegionModal
        isOpen={isInitialModalOpen}
        onClose={() => {
          setIsInitialModalOpen(false);
          resetRegionCreation();
        }}
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

      <style jsx>{`
        .waveform-track-container {
          position: relative;
          width: 100%;
          padding: 20px;
          background: #111827;
          border-radius: 8px;
        }

        .button-container {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .action-btn {
          padding: 4px 12px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          height: 24px;
          line-height: 1;
        }

        .create-btn {
          background: #3b82f6;
          color: white;
        }

        .create-btn:hover {
          background: #2563eb;
        }

        .download-btn {
          background: #10b981;
          color: white;
        }

        .download-btn:hover {
          background: #059669;
        }

        .waveform-wrapper {
          display: flex;
          flex-direction: column-reverse; // Reverse the order to put timeline on top
          background: #1f2937;
          border-radius: 4px;
          border: 1px solid #374151;
        }

        .timeline {
          height: 30px;
          background: #1f2937;
          border-radius: 4px 4px 0 0;
          border-bottom: 1px solid #374151;
        }

        .waveform-container {
          height: 80px;
          background: #1f2937;
          border-radius: 0 0 4px 4px;
          position: relative;
          padding: 10px;
          margin-bottom: 20px; /* Add space for region labels */
        }

        .waveform-container.selecting-time {
          cursor: crosshair;
          box-shadow: 0 0 0 2px #3b82f6;
        }

        /* Region styles */
        :global(.wavesurfer-region) {
          border-radius: 2px !important;
          transition: background-color 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        :global(.wavesurfer-region:hover) {
          opacity: 0.8;
        }

        :global(.wavesurfer-region::before),
        :global(.wavesurfer-region::after) {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 4px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        :global(.wavesurfer-region::before) {
          left: 0;
          cursor: ew-resize;
        }

        :global(.wavesurfer-region::after) {
          right: 0;
          cursor: ew-resize;
        }

        :global(.wavesurfer-region:hover::before),
        :global(.wavesurfer-region:hover::after) {
          opacity: 1;
        }

        :global(.region-text) {
          position: absolute;
          bottom: -20px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 11px;
          color: #e5e7eb;
          background: #374151;
          padding: 2px 6px;
          border-radius: 3px;
          pointer-events: none;
          z-index: 5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: calc(100% - 10px);
          margin: 0 5px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        :global(.wavesurfer-handle) {
          width: 4px !important;
          background-color: rgba(255, 255, 255, 0.5) !important;
          cursor: ew-resize !important;
        }

        :global(.wavesurfer-handle:hover) {
          background-color: rgba(255, 255, 255, 0.8) !important;
        }

        /* Timeline styles */
        :global(.wavesurfer-timeline-notch) {
          border-color: #ffffff !important; // White notches
        }

        :global(.wavesurfer-timeline-label) {
          color: #ffffff !important; // White text
          font-weight: 500; // Make text slightly bolder for better visibility
        }
      `}</style>
    </div>
  );
};

// Add this helper function to your component
const createRegion = (regionsPlugin, start, end, color, text) => {
  const region = regionsPlugin.addRegion({
    start,
    end,
    color,
    drag: true,
    resize: true,
  });

  if (region && region.element) {
    const textDiv = document.createElement('div');
    textDiv.className = 'region-text';
    textDiv.textContent = text;
    region.element.appendChild(textDiv);
  }

  return region;
};

export default WaveformTrack;