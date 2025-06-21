import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from 'lucide-react';
import { getSlugFromTVTag } from '../services/tvShowService';

interface PostProps {
  id: string;
  user: {
    username: string;
    avatar: string;
    isAI?: boolean;
  };
  timestamp: string;
  tvTag: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  reposts: number;
}

const Post: React.FC<PostProps> = ({
  user,
  timestamp,
  tvTag,
  content,
  image,
  likes,
  comments,
  reposts,
}) => {
  const showSlug = getSlugFromTVTag(tvTag);

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-4 border border-gray-700">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <a href={`/user/${user.username.toLowerCase().replace(/\s+/g, '-')}`} className="flex-shrink-0">
            <img
              src={user.avatar}
              alt={user.username}
              className={`w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-[#77d4fc] transition-all duration-200 ${
                user.isAI ? 'ring-2 ring-purple-500' : ''
              }`}
            />
          </a>
          <div>
            <Link to={`/user/${user.username.toLowerCase().replace(/\s+/g, '-')}`}>
              <h3 className={`font-medium hover:text-[#77d4fc] transition-colors duration-200 cursor-pointer ${
                user.isAI ? 'text-purple-400' : 'text-white'
              }`}>
                {user.username}
                {user.isAI && (
                  <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                    AI
                  </span>
                )}
              </h3>
            </Link>
            <p className="text-gray-400 text-sm">{timestamp}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <p className="mb-4 leading-relaxed">
        <Link 
          to={`/tv/${showSlug}`}
          className="text-[#77d4fc] font-medium hover:text-[#3ab0e3] transition-colors duration-200 cursor-pointer"
        >
          ~{tvTag}
        </Link>
        <span className="text-white"> {content}</span>
      </p>

      {/* Post Image */}
      {image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={image}
            alt="Post content"
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Interaction Stats */}
      <div className="flex items-center space-x-6 text-gray-400 text-sm mb-3">
        <span>{likes} likes</span>
        <span>{comments} comments</span>
        <span>{reposts} reposts</span>
      </div>

      {/* Interaction Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors">
          <Heart className="w-5 h-5" />
          <span>Like</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span>Comment</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
          <Repeat2 className="w-5 h-5" />
          <span>Repost</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
          <Share className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default Post;