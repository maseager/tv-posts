import React from 'react';
import { Sparkles, Brain, Quote } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PersonalizedFeedMessage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-[#2a9fd8]/20 to-[#77d4fc]/20 border border-[#77d4fc]/30 rounded-lg p-6 mb-8 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4">
          <Sparkles className="w-8 h-8 text-[#77d4fc]" />
        </div>
        <div className="absolute bottom-4 left-4">
          <Brain className="w-6 h-6 text-[#77d4fc]" />
        </div>
      </div>
      
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-[#2a9fd8] to-[#77d4fc] rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-[#77d4fc]" />
            <h3 className="text-lg font-bold text-white">Your Personalized Feed</h3>
          </div>
          <p className="text-gray-300 mb-4 leading-relaxed">
            This home feed was AI-generated just for you based on your onboarding answers. We've curated content that matches your viewing preferences and discussion style.
          </p>
          
          {/* Enhanced insights section */}
          <div className="space-y-3 mb-4">
            {/* Viewing preference insight */}
            <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3">
              <div className="flex items-start space-x-3">
                <Quote className="w-4 h-4 text-[#77d4fc] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300 mb-1">
                    <span className="text-[#77d4fc] font-medium">You enjoy shows that are:</span> {user.persona.moodProfile.toLowerCase()}
                  </p>
                  <p className="text-xs text-gray-400">
                    Based on your emotional responses and viewing preferences
                  </p>
                </div>
              </div>
            </div>
            
            {/* Community match insight */}
            <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3">
              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 bg-gradient-to-br from-[#2a9fd8] to-[#77d4fc] rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">
                    <span className="text-[#77d4fc] font-medium">Your fan match:</span> {user.persona.tvTwin}
                  </p>
                  <p className="text-xs text-gray-400">
                    They love complex narratives and aren't afraid of emotional plot twists
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Genre tags */}
          <div className="flex flex-wrap gap-2">
            {user.persona.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#77d4fc]/20 text-[#77d4fc] px-3 py-1 rounded-full text-xs font-medium border border-[#77d4fc]/30 hover:bg-[#77d4fc]/30 transition-colors cursor-pointer"
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