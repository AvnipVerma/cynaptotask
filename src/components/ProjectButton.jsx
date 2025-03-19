import React from 'react';
import { Scissors, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectButton = ({ icon, title, to = '/' }) => {
  return (
    <Link to={to} className="bg-white rounded-full py-3 px-6 flex items-center gap-3 shadow-sm hover:shadow transition-shadow">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${icon === 'create' ? 'bg-teal-500' : 'bg-blue-500'}`}>
        {icon === 'create' ? (
          <Scissors size={20} className="text-white" />
        ) : (
          <Video size={20} className="text-white" />
        )}
      </div>
      <span className="font-medium">{title}</span>
    </Link>
  );
};

export default ProjectButton;