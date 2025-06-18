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
    </div>
  );
};

export default WelcomeSection;