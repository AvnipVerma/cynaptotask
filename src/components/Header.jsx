import React from 'react';
import { User } from 'lucide-react';

const Header = ({ showSearch = true }) => {
  return (
    <div className="flex items-center justify-between p-4">
      {showSearch ? (
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white border border-gray-200 rounded-full py-2 px-4 pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      ) : (
        <div className="text-xl font-medium">Assets</div>
      )}
      
      <div className="flex items-center">
       
      </div>
    </div>
  );
};

export default Header;