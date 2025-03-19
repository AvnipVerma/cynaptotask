import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-60 bg-white h-screen flex flex-col p-4 shadow-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Cynapto</h1>
      </div>
      
      <div className="mb-8">
        <button className="w-full bg-teal-500 text-white rounded-full py-3 px-4 flex items-center justify-between">
          <span className="font-medium">New Video</span>
          <span>+</span>
        </button>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="block py-2 font-medium text-black">
              Home
            </Link>
          </li>
          <li>
            <Link to="/" className="block py-2 font-medium text-black">
              Template
            </Link>
          </li>
          <li>
            <Link to="/" className="block py-2 font-medium text-black">
              All Videos
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="mt-auto pb-4">
        <button className="w-full bg-gray-200 text-gray-700 rounded-full py-3 px-4 flex items-center justify-center gap-2">
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;