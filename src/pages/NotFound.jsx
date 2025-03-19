import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <Link to="/" className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-opacity-90">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;