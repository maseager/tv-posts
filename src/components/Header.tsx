import React, { useState } from 'react';
import { Sun, Moon, User } from 'lucide-react';
import { SearchWithTypeahead } from './SearchWithTypeahead';
import type { SearchSuggestion } from '../services/openai';
import type { SearchResult } from '../services/searchService';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    console.log('Selected suggestion:', suggestion);
    // Handle suggestion selection logic here
  };

  const handleSearchResults = (results: SearchResult[]) => {
    console.log('Search results:', results);
    // Handle search results logic here
  };

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
          <SearchWithTypeahead
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSuggestionSelect={handleSuggestionSelect}
            onSearchResults={handleSearchResults}
          />

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