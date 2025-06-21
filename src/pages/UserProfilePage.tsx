import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users, AlertCircle, UserPlus } from 'lucide-react';
import Post from '../components/Post';
import { getUserData, getUserPosts, UserProfile, PostData } from '../services/userService';

const UserProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!username) return;
      
      setLoading(true);
      try {
        const userData = getUserData(username);
        if (userData) {
          setUserProfile(userData);
          const initialPosts = getUserPosts(username, 0, 10);
          setPosts(initialPosts);
          setHasMore(initialPosts.length === 10);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [username]);

  const loadMorePosts = async () => {
    if (!username || loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newPosts = getUserPosts(username, posts.length, 10);
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
  }, [loadingMore, hasMore, posts.length, username]);

  const handleFollowClick = () => {
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

  if (!userProfile) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">User Not Found</h1>
          <p className="text-gray-400">The user you're looking for doesn't exist.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-lg p-8 mb-8 border border-gray-700">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={userProfile.avatar}
              alt={userProfile.username}
              className={`w-24 h-24 rounded-full object-cover ${
                userProfile.isAI ? 'ring-4 ring-purple-500' : 'ring-4 ring-gray-600'
              }`}
            />
          </div>
          
          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h1 className={`text-2xl font-bold mb-2 ${
                  userProfile.isAI ? 'text-purple-400' : 'text-white'
                }`}>
                  {userProfile.username}
                  {userProfile.isAI && (
                    <span className="ml-3 text-sm bg-purple-500 text-white px-3 py-1 rounded-full">
                      AI Character
                    </span>
                  )}
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed mb-4">
                  {userProfile.bio}
                </p>
              </div>
              
              {/* Follow Button */}
              <div className="flex flex-col items-center sm:items-end">
                <button
                  onClick={handleFollowClick}
                  className="flex items-center space-x-2 bg-[#2a9fd8] hover:bg-[#77d4fc] text-white hover:text-black px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Follow</span>
                </button>
                
                {/* Follower/Following counts */}
                <div className="flex items-center space-x-4 mt-3 text-gray-400">
                  <div className="text-center">
                    <div className="font-bold text-white">{userProfile.followers.toLocaleString()}</div>
                    <div className="text-xs">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white">{userProfile.following.toLocaleString()}</div>
                    <div className="text-xs">Following</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Stats */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
              <div className="flex items-center space-x-1">
                <span className="font-medium text-white">{userProfile.totalPosts}</span>
                <span>Posts</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>Joined {userProfile.joinedDate}</span>
              </div>
            </div>
            
            {/* Favorite Genres */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Favorite Genres</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.favoriteGenres.map((genre) => (
                  <span
                    key={genre}
                    className="bg-[#77d4fc]/20 text-[#77d4fc] px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            
            {/* User's AI-generated tags (only show for current user) */}
            {userProfile.username === 'Demo' && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">AI-Generated Profile Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['Thriller', 'Anti-heroes', 'Plot Twists'].map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium border border-purple-500/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Prompt */}
      {showLoginPrompt && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-lg z-50 animate-fade-in">
          <div className="flex items-center space-x-2 text-[#77d4fc]">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Log in to follow your favorite TV fans</span>
          </div>
        </div>
      )}

      {/* Posts Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">
          Posts by {userProfile.username}
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
              <p className="text-gray-400">You've reached the end of {userProfile.username}'s posts</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Users className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p>{userProfile.username} hasn't posted anything yet.</p>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserProfilePage;