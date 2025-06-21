import React from 'react';
import { Sparkles, Brain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PersonalizedFeedMessage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-[#2a9fd8]/20 to-[#77d4fc]/20 border border-[#77d4fc]/30 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-[#2a9fd8] to-[#77d4fc] rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#77d4fc]" />
            <h3 className="text-base font-bold text-white">Your Personalized Feed</h3>
          </div>
          
          {/* Condensed insights */}
          <div className="space-y-2 mb-3">
            <p className="text-sm text-gray-300">
              <span className="text-[#77d4fc] font-medium">You enjoy shows that are:</span> {user.persona.moodProfile.toLowerCase()}
            </p>
            <p className="text-sm text-gray-300">
              <span className="text-[#77d4fc] font-medium">Your fan match:</span> {user.persona.tvTwin}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedFeedMessage;