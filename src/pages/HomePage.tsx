import React from 'react';
import WelcomeSection from '../components/WelcomeSection';
import PostFeed from '../components/PostFeed';
import MostWatched from '../components/MostWatched';
import SidebarFooter from '../components/SidebarFooter';

const HomePage: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <WelcomeSection />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <PostFeed />
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <MostWatched />
            <SidebarFooter />
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;