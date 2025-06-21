import React from 'react';
import { Trash2, Plus, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const WatchlistWidget: React.FC = () => {
  const { user, removeFromWatchlist } = useAuth();

  if (!user || !user.watchlist.length) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center mb-5">
        <h2 className="text-lg font-bold text-white">Watchlist</h2>
        <Info className="w-4 h-4 text-gray-400 hover:text-white transition-colors duration-200 ml-2 cursor-pointer" />
      </div>

      <div className="space-y-3">
        {user.watchlist.map((show) => (
          <div key={show.id} className="flex items-center justify-between group">
            <div className="flex items-center space-x-3 flex-1">
              {show.name === 'Stranger Things' ? (
                <img
                  src="/eleven-avatar.png"
                  alt="Stranger Things"
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-[#2a9fd8] to-[#77d4fc] rounded-full flex items-center justify-center flex-shrink-0">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-medium text-xs hover:text-[#77d4fc] transition-colors duration-200 cursor-pointer truncate">
                  {show.name}
                </h3>
                <p className="text-gray-400 text-[10px]">{show.platform}</p>
              </div>
            </div>
            <button
              onClick={() => removeFromWatchlist(show.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all duration-200 flex-shrink-0"
              title="Remove from watchlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button className="w-full mt-5 text-gray-400 hover:text-white transition-colors text-xs">
        View all recommendations
      </button>
    </div>
  );
};

export default WatchlistWidget;