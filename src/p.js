import React, { useRef, useEffect, useMemo } from 'react';
import { useWavesurfer } from '@wavesurfer/react';
import sampleVideo from './assets/sample3.mp4';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';

const regionData = [
  { start: 1.80, end: 3.5, content: 'Good afternoon.', id: 'region-person-1' },
  { start: 3.6, end: 5.2, content: 'My name is Russell', id: 'region-person-1' },
  { start: 5.3, end: 8.4, content: 'and I am a wilderness explorer in tribe 54.', id: 'region-person-1' },
  { start: 8.7, end: 10.1, content: 'sweat lodge 12', id: 'region-person-1' },
  { start: 10.5, end: 13.5, content: 'Are you in need of any assistance today, Sir?', id: 'region-person-1' },
  { start: 13.7, end: 14.2, content: 'No', id: 'region2' },
  { start: 14.3, end: 15, content: 'I could... ', id: 'region-person-1' },
  { start: 15.3, end: 16.9, content: 'help you cross the street! ', id: 'region-person-1' },
  { start: 17.2, end: 17.6, content: 'No', id: 'region2' },
  { start: 18, end: 19.5, content: 'I... could... ', id: 'region-person-1' },
  { start: 19.6, end: 21.3, content: 'help you cross your yard. ', id: 'region-person-1' },
  { start: 21.5, end: 21.8, content: 'No', id: 'region2' },
  { start: 22, end: 22.8, content: 'I... could...', id: 'region-person-1' },
  { start: 23, end: 24.2, content: ' help you cross...', id: 'region-person-1' },
  { start: 24.3, end: 25, content: ' your port.', id: 'region-person-1' },
  { start: 25, end: 25.3, content: ' No..', id: 'region2' },
  { start: 25.8, end: 26.2, content: ' Well... ', id: 'region-person-1' },
  { start: 26.3, end: 28.4, content: 'I got to help you cross something.', id: 'region-person-1' },
];

const App = () => {
  const containerRef = useRef(null);

  const regionsPlugin = useMemo(() => RegionsPlugin.create(), []);

  const timelinePlugin = useMemo(
    () =>
      TimelinePlugin.create({
        height: 15,
        insertPosition: 'beforebegin',
        timeInterval: 0.1,
        primaryLabelInterval: 1,
        secondaryLabelInterval: 5,
        color: '#b0b0b6',
        style: {
          zIndex: 9,
          color: '#9090909e',
          fontSize: '1rem',
        },
      }),
    []
  );

  const plugins = useMemo(
    () => [regionsPlugin, timelinePlugin],
    [regionsPlugin, timelinePlugin]
  );

  const { wavesurfer, isReady, isPlaying } = useWavesurfer({
    container: containerRef,
    height: 130,
    media: document.querySelector('video'),
    waveColor: 'transparent',
    progressColor: 'rgb(117, 117, 117)',
    minPxPerSec: 200,
    cursorColor: '#454848',
    cursorWidth: 3,
    plugins: plugins,
  });

  useEffect(() => {
    if (isReady) {
      regionData.forEach((region) => {
        regionsPlugin.addRegion({
          id: region.id,
          content: region.content,
          start: region.start,
          end: region.end,
          color: '#232328',
        });
      });

      const style = document.createElement('style');
      style.textContent = `::-webkit-scrollbar { background: #2C2C31;  height: 15px; margin-top: 2rem; } ::-webkit-scrollbar-thumb { background: #504f4f; height: 2px; border: 5px solid #2C2C31;   border-radius: 10px;  } ::-webkit-scrollbar-track { 
        ;}`;
      wavesurfer.getWrapper().appendChild(style);
    }
  }, [isReady]);

  return (
    <div className="flex flex-col justify-center bg-[#151519] h-screen">
      <div className=" ">
        <div className=" pb-10">
          <video
            className=" rounded-lg"
            src={sampleVideo}
            controls
            playsInline
            style={{
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto',
              display: 'block',
            }}
          />
        </div>

        <div ref={containerRef} className="bg-[#2C2C31]" id="waveform" />
      </div>
    </div>
  );
};

export default App;

//plus button will add new region jaha per cursor vo starting point end khud se decide krlo