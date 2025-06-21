import React from 'react';
import { Sparkles, Brain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PersonalizedFeedMessage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-[#2a9fd8]/20 to-[#77d4fc]/20 border border-[#77d4fc]/30 rounded-lg p-6 mb-8">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-[#2a9fd8] to-[#77d4fc] rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-[#77d4fc]" />
            <h3 className="text-lg font-bold text-white">Your Personalized Feed</h3>
          </div>
          <p className="text-gray-300 mb-3">
            This feed was generated just for you based on your answers
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="bg-gray-800 border border-gray-600 rounded-full px-3 py-1">
              <span className="text-xs text-gray-300">Mood: </span>
              <span className="text-xs text-[#77d4fc] font-medium">{user.persona.moodProfile}</span>
            </div>
            <div className="bg-gray-800 border border-gray-600 rounded-full px-3 py-1">
              <span className="text-xs text-gray-300">TV Twin: </span>
              <span className="text-xs text-[#77d4fc] font-medium">{user.persona.tvTwin}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {user.persona.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#77d4fc]/20 text-[#77d4fc] px-2 py-1 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedFeedMessage;