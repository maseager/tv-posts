import React, { useState, useEffect } from 'react';
import Post from './Post';

interface PostData {
  id: string;
  user: {
    username: string;
    avatar: string;
  };
  timestamp: string;
  tvTag: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  reposts: number;
}

const PostFeed: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for posts
  const mockPosts: PostData[] = [
    {
      id: '1',
      user: {
        username: 'bingewatcher',
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
      },
      timestamp: '6d',
      tvTag: 'StrangerThings',
      content: 'Just finished watching the latest season and I\'m absolutely blown away! The character development and plot twists were incredible.',
      image: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnk0MjV5dTdscTMwdnhsdzZydDZmc2c1dnE0amZxYnlnNTQ3eHFxYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8L187BbF1yOq2PnLw0/giphy.gif?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      likes: 1,
      comments: 0,
      reposts: 0
    },
    {
      id: '2',
      user: {
        username: 'seaotter0111',
        avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
      },
      timestamp: '8d',
      tvTag: 'TheOffice',
      content: 'Rewatching The Office for the 10th time and it never gets old! Jim and Pam\'s relationship is still the best thing ever.',
      likes: 24,
      comments: 5,
      reposts: 2
    },
    {
      id: '3',
      user: {
        username: 'tvfanatic',
        avatar: 'https://images.pexels.com/photos/1040882/pexels-photo-1040882.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
      },
      timestamp: '1d',
      tvTag: 'SquidGame',
      content: 'The psychological thriller elements in Squid Game are masterfully crafted. Can\'t wait for season 2 part 2 lol!',
      likes: 156,
      comments: 23,
      reposts: 12
    },
    {
      id: '4',
      user: {
        username: 'couchpotato',
        avatar: 'https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
      },
      timestamp: '3h',
      tvTag: 'BreakingBad',
      content: 'Walter White\'s transformation throughout the series is one of the greatest character arcs in television history. What do you think?',
      likes: 89,
      comments: 34,
      reposts: 7
    }
  ];

  useEffect(() => {
    // Simulate loading posts
    setLoading(true);
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const loadMorePosts = () => {
    setLoading(true);
    // Simulate loading more posts
    setTimeout(() => {
      const newPosts = mockPosts.map(post => ({
        ...post,
        id: post.id + '_' + Date.now(),
        timestamp: Math.floor(Math.random() * 24) + 'h'
      }));
      setPosts(prev => [...prev, ...newPosts]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        if (!loading) {
          loadMorePosts();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
      
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      )}
    </div>
  );
};

export default PostFeed;