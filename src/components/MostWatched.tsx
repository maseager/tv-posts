import React from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

interface Show {
  id: string;
  name: string;
  platform: string;
  viewers: string;
  avatar: string;
}

const MostWatched: React.FC = () => {
  const shows: Show[] = [
    {
      id: '1',
      name: 'Stranger Things',
      platform: 'Netflix',
      viewers: '500,153',
      avatar: '/eleven-avatar.png'
    },
    {
      id: '2',
      name: 'Squid Game',
      platform: 'Netflix',
      viewers: '347,861',
      avatar: '/squidgame-avatar.png'
    },
    {
      id: '3',
      name: 'The Office',
      platform: 'Peacock',
      viewers: '190,001',
      avatar: '/office-avatar.png'
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center mb-5">
        <h2 className="text-lg font-bold text-white">Most Watched</h2>
        <Info className="w-4 h-4 text-gray-400 hover:text-white transition-colors duration-200 ml-2 cursor-pointer" />
      </div>

      <div className="space-y-3">
        {shows.map((show) => (
          <div key={show.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={show.avatar}
                alt={show.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <h3 className="text-white font-medium text-sm hover:text-[#77d4fc] transition-colors duration-200 cursor-pointer">{show.name}</h3>
                <p className="text-gray-400 text-xs">{show.platform}</p>
              </div>
            </div>
            <div className="text-right ml-3 flex-shrink-0">
              <div className="text-[11px] text-gray-400">
                {show.viewers}
              </div>
              <div className="text-[10px] text-gray-500">
              <Link 
                to={`/tv/${show.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-white font-medium text-sm hover:text-[#77d4fc] transition-colors duration-200 cursor-pointer"
              >
                {show.name}
              </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-5 text-gray-400 hover:text-white transition-colors text-sm">
        View all
      </button>
    </div>
  );
};

export default MostWatched;