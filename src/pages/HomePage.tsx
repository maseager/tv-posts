import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import WelcomeSection from '../components/WelcomeSection';
import PersonalizedFeedMessage from '../components/PersonalizedFeedMessage';
import PostFeed from '../components/PostFeed';
import MostWatched from '../components/MostWatched';
import WatchlistWidget from '../components/WatchlistWidget';
import SidebarFooter from '../components/SidebarFooter';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {!isAuthenticated && <WelcomeSection />}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar - Watchlist (only for authenticated users) */}
        {isAuthenticated && (
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 pt-8">
              <WatchlistWidget />
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className={`${isAuthenticated ? 'lg:col-span-2 order-1 lg:order-2' : 'lg:col-span-3'} pt-8`}>
          <PersonalizedFeedMessage />
          <PostFeed />
        </div>
        
        {/* Sidebar */}
        <div className={`lg:col-span-1 order-3 ${isAuthenticated ? 'lg:order-3' : ''}`}>
          <div className="sticky top-24 pt-8">
            <MostWatched />
            <SidebarFooter />
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;