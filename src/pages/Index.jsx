import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProjectButton from '../components/ProjectButton';
import VideoCard from '../components/VideoCard';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="flex h-screen bg-blue-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Project Buttons */}
          <div className="flex gap-4 mb-8">
            <ProjectButton icon="create" title="Create Project" to="/editor" />
            <ProjectButton icon="record" title="Record Video" />
          </div>
          
          {/* Recent Videos Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Recent videos</h2>
              <Link to="/" className="text-blue-500 hover:underline">All Videos &gt;</Link>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((index) => (
                <VideoCard key={index} title={`Project`} index={index} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;