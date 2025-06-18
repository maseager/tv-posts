import React from 'react';

const WelcomeSection: React.FC = () => {
  return (
    <div className="text-center py-12 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Welcome to <span className="text-[#77d4fc]">TV Posts</span>
      </h1>
      <p className="text-xl text-gray-300 mb-8">
        Connect with TV show fans around the world!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
          Login
        </button>
        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          Register
        </button>
      </div>
    </div>
  );
};

export default WelcomeSection;