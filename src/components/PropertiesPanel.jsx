
import React from 'react';
import { Maximize2, RotateCw } from 'lucide-react';

const PropertiesPanel = () => {
  return (
    <div className="w-72 border-l border-gray-200 p-4 bg-white">
      <h2 className="text-xl font-medium mb-6">Properties</h2>
      
      <div className="space-y-8">
        {/* Scale */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium">Scale:</label>
            <span>100 %</span>
          </div>
          <div className="relative w-full">
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              defaultValue="100"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="absolute top-0 left-0 h-2 bg-teal-500 rounded-lg" style={{ width: '50%' }}></div>
          </div>
        </div>
        
        {/* Opacity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium">Opacity:</label>
            <span>50 %</span>
          </div>
          <div className="relative w-full">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              defaultValue="50"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="absolute top-0 left-0 h-2 bg-teal-500 rounded-lg" style={{ width: '50%' }}></div>
          </div>
        </div>
        
        {/* Rotation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium">Rotation:</label>
            <div className="flex items-center gap-2">
              <span>0°</span>
              <button className="p-1 bg-gray-100 rounded">
                <Maximize2 size={16} />
              </button>
              <button className="p-1 bg-gray-100 rounded">
                <RotateCw size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Position */}
        <div>
          <h3 className="font-medium mb-4">Position</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm block mb-1">X</label>
              <input 
                type="text" 
                value="0.0" 
                readOnly
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded text-center"
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Y</label>
              <input 
                type="text" 
                value="0.0" 
                readOnly
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded text-center"
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Z</label>
              <input 
                type="text" 
                value="0.0" 
                readOnly
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded text-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;