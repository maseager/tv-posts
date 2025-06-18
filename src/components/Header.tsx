import React, { useState } from 'react';
import { Search, Sun, Moon, User, Globe } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a 
            href="/" 
            className="flex items-center space-x-2 flex-shrink-0 ml-8 group cursor-pointer transition-transform duration-200 hover:scale-105"
          >
            <img src="/tv-no-background.png" alt="TV Posts" className="w-8 h-8"/>
            <div className="text-white font-bold text-base leading-tight transition-colors duration-300 group-hover:text-[#77d4fc] relative">
              <div className="-mb-1 tracking-tight">TV</div>
              <div className="tracking-tight">POSTS</div>
            </div>
          </a>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search TV Posts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Auth Buttons */}
            <div className="flex items-center space-x-2">
              <button className="px-4 py-1.5 text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-md font-medium transition-colors">
                Login
              </button>
              <button className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                Register
              </button>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-300 hover:text-white transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;