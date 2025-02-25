// src/Components/Loading.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate a "reload" delay (e.g., 2 seconds)
    const timer = setTimeout(() => {
      // After the delay, navigate to the home page
      navigate('/home');
    }, 2000); // Adjust this time to control the duration of the loading screen

    // Cleanup timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <img
          src="/path/to/your/logo.png"
          alt="Logo"
          className="w-32 h-32 mb-6 animate-bounce"
        />
        <div className="text-xl font-semibold">Please wait...</div>
        <div className="mt-4">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
