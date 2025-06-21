import React from 'react';
import { Sparkles, Brain, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PersonalizedFeedMessage: React.FC = () => {
  const { user } = useAuth();
  const [showTooltip, setShowTooltip] = React.useState(false);

  // Close tooltip when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.feed-info-tooltip-container')) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className="bg-gradient-to-r from-[#2a9fd8]/20 to-[#77d4fc]/20 border border-[#77d4fc]/30 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-[#2a9fd8] to-[#77d4fc] rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1 relative">
            <Sparkles className="w-4 h-4 text-[#77d4fc]" />
            <h3 className="text-base font-bold text-white">Your Personalized Feed</h3>
            
            {/* Info tooltip container */}
            <div className="feed-info-tooltip-container relative">
              <Info 
                className="w-4 h-4 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer" 
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              />
              
              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute top-6 left-0 z-50 w-72 bg-gray-900 border border-gray-600 rounded-lg p-3 shadow-lg animate-fade-in">
                  <div className="text-sm text-gray-300 leading-relaxed">
                    This home feed was AI-generated just for you based on your onboarding answers.
                  </div>
                  {/* Arrow pointing up */}
                  <div className="absolute -top-1 left-3 w-2 h-2 bg-gray-900 border-l border-t border-gray-600 transform rotate-45"></div>
                </div>
              )}
            </div>
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