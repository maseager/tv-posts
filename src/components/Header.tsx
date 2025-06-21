import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SearchWithTypeahead } from './SearchWithTypeahead';
import type { SearchSuggestion } from '../services/openai';
import type { SearchResult } from '../services/searchService';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    console.log('Selected suggestion:', suggestion);
    // Handle suggestion selection logic here
  };

  const handleSearchResults = (results: SearchResult[]) => {
    console.log('Search results:', results);
    // Handle search results logic here
  };

  const handleRegisterClick = () => {
    // Dispatch custom event to trigger onboarding
    window.dispatchEvent(new CustomEvent('openOnboarding'));
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
            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Text-based avatar */}
                <div className="w-8 h-8 bg-gradient-to-br from-[#2a9fd8] to-[#77d4fc] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <Link 
                  to={`/user/${user?.username?.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm font-medium text-white hover:text-[#77d4fc] transition-colors cursor-pointer hover:underline"
                >
                  {user?.username}
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button className="px-4 py-1.5 text-sm text-gray-300 hover:text-[#77d4fc] border border-gray-600 hover:border-gray-500 rounded-md font-medium transition-colors">
                  Login
                </button>
                <button 
                  onClick={handleRegisterClick}
                  className="px-4 py-1.5 text-sm bg-[#2a9fd8] hover:bg-[#77d4fc] text-white hover:text-black rounded-md font-medium transition-colors"
                >
                  Register
                </button>
              </div>
            )}
            
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