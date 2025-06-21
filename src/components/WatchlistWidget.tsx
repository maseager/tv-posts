import React, { useState } from 'react';
import { Trash2, Plus, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const WatchlistWidget: React.FC = () => {
  const { user, removeFromWatchlist } = useAuth();
  const [activeTab, setActiveTab] = useState<'watchlist' | 'ai-recommended'>('watchlist');
  const [showTooltip, setShowTooltip] = useState(false);

  if (!user || !user.watchlist.length) {
    return null;
  }

  // Mock AI-recommended shows data
  const aiRecommendedShows = [
    { id: 'ai-1', name: 'Dark', platform: 'Netflix' },
    { id: 'ai-2', name: 'Westworld', platform: 'HBO' },
    { id: 'ai-3', name: 'Black Mirror', platform: 'Netflix' },
    { id: 'ai-4', name: 'Mr. Robot', platform: 'Amazon Prime' }
  ];

  const currentShows = activeTab === 'watchlist' ? user.watchlist : aiRecommendedShows;

  const handleInfoClick = () => {
    setShowTooltip(!showTooltip);
  };

  // Close tooltip when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.info-tooltip-container')) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
      {/* Header with title */}
      <div className="flex items-center mb-3 relative">
        <h2 className="text-lg font-bold text-white">Watchlist</h2>
        <div className="info-tooltip-container relative">
          <Info 
            className="w-4 h-4 text-gray-400 hover:text-white transition-colors duration-200 ml-2 cursor-pointer" 
            onClick={handleInfoClick}
          />
          
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute top-6 left-0 z-50 w-64 bg-gray-900 border border-gray-600 rounded-lg p-3 shadow-lg animate-fade-in">
              <div className="text-sm text-gray-300 leading-relaxed">
                Your initial watchlist is AI-generated based on your answers. Remove shows by clicking the delete icon.
              </div>
              {/* Arrow pointing up */}
              <div className="absolute -top-1 left-3 w-2 h-2 bg-gray-900 border-l border-t border-gray-600 transform rotate-45"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Full-width tabs below title */}
      <div className="flex bg-gray-700/30 rounded-lg p-0.5 mb-4">
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
            activeTab === 'watchlist'
              ? 'bg-[#77d4fc] text-black'
              : 'text-gray-300 hover:text-white hover:bg-gray-600/30'
          }`}
        >
          My List
        </button>
        <button
          onClick={() => setActiveTab('ai-recommended')}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
            activeTab === 'ai-recommended'
              ? 'bg-[#77d4fc] text-black'
              : 'text-gray-300 hover:text-white hover:bg-gray-600/30'
          }`}
        >
          AI Picks
        </button>
      </div>

      {/* Show list */}
      <div className="space-y-2">
        {currentShows.map((show) => (
          <div 
            key={show.id} 
            className="flex items-center justify-between py-2 px-1 rounded-md hover:bg-gray-700/30 transition-colors duration-150 group"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {show.name === 'Stranger Things' ? (
                <img
                  src="/eleven-avatar.png"
                  alt="Stranger Things"
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-7 h-7 bg-gradient-to-br from-[#2a9fd8] to-[#77d4fc] rounded-full flex items-center justify-center flex-shrink-0">
                  <Plus className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-medium text-sm hover:text-[#77d4fc] transition-colors duration-200 cursor-pointer truncate">
                  {show.name}
                </h3>
                <p className="text-gray-500 text-xs">{show.platform}</p>
              </div>
            </div>
            
            {/* Action button - appears on hover */}
            {activeTab === 'watchlist' ? (
              <button
                onClick={() => removeFromWatchlist(show.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-400 transition-all duration-200 flex-shrink-0"
                title="Remove from watchlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-[#77d4fc] transition-all duration-200 flex-shrink-0"
                title="Add to watchlist"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Subtle divider */}
      <div className="border-t border-gray-700/50 mt-4 pt-4">
        <button className="text-xs text-gray-400 hover:text-[#77d4fc] transition-colors duration-200 font-medium">
          View all →
        </button>
      </div>
    </div>
  );
};

export default WatchlistWidget;