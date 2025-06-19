import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Star, Calendar, Users, AlertCircle } from 'lucide-react';
import Post from '../components/Post';
import MostWatched from '../components/MostWatched';
import { getTVShowData, getTVShowPosts, TVShow, PostData } from '../services/tvShowService';

const TVShowPage: React.FC = () => {
  const { showSlug } = useParams<{ showSlug: string }>();
  const [tvShow, setTVShow] = useState<TVShow | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadTVShowData = async () => {
      if (!showSlug) return;
      
      setLoading(true);
      try {
        const showData = getTVShowData(showSlug);
        if (showData) {
          setTVShow(showData);
          const initialPosts = getTVShowPosts(showSlug, 0, 10);
          setPosts(initialPosts);
          setHasMore(initialPosts.length === 10);
        }
      } catch (error) {
        console.error('Error loading TV show data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTVShowData();
  }, [showSlug]);

  const loadMorePosts = async () => {
    if (!showSlug || loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newPosts = getTVShowPosts(showSlug, posts.length, 10);
      if (newPosts.length > 0) {
        setPosts(prev => [...prev, ...newPosts]);
        setHasMore(newPosts.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        if (!loadingMore && hasMore) {
          loadMorePosts();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, posts.length, showSlug]);

  const handleWatchClick = () => {
    setShowLoginPrompt(true);
    setTimeout(() => setShowLoginPrompt(false), 3000);
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </main>
    );
  }

  if (!tvShow) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Show Not Found</h1>
          <p className="text-gray-400">The TV show you're looking for doesn't exist.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Show Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto lg:mx-0">
            <img
              src={tvShow.poster}
              alt={tvShow.title}
              className="w-48 h-72 object-cover rounded-lg shadow-lg"
            />
          </div>
          
          {/* Show Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {tvShow.title}
                </h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-gray-300 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{tvShow.year}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{tvShow.rating}</span>
                  </div>
                  <div className="bg-[#77d4fc]/20 text-[#77d4fc] px-3 py-1 rounded-full text-sm font-medium">
                    {tvShow.network}
                  </div>
                </div>
              </div>
              
              {/* Watch Button */}
              <div className="flex flex-col items-center lg:items-end">
                <button
                  onClick={handleWatchClick}
                  className="flex items-center space-x-2 bg-[#2a9fd8] hover:bg-[#77d4fc] text-white hover:text-black px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  <span>Watch</span>
                </button>
                <div className="flex items-center space-x-1 mt-2 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">{tvShow.watchers.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              {tvShow.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {tvShow.genres.map((genre) => (
                <span
                  key={genre}
                  className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Login Prompt */}
      {showLoginPrompt && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-lg z-50 animate-fade-in">
          <div className="flex items-center space-x-2 text-[#77d4fc]">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Log in to add this show - your watchlist is waiting</span>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Posts Feed */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              Latest Posts about {tvShow.title}
            </h2>
            <div className="h-px bg-gradient-to-r from-[#77d4fc] to-transparent"></div>
          </div>
          
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <Post key={post.id} {...post} />
              ))}
              
              {loadingMore && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
              )}
              
              {!hasMore && posts.length > 10 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">You've reached the end of the posts</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Users className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p>Be the first to start a discussion about {tvShow.title}!</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <MostWatched />
          </div>
        </div>
      </div>
    </main>
  );
};

export default TVShowPage;