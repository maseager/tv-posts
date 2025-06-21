import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles, Mail, User, Lock, CheckCircle } from 'lucide-react';
import { useAuth, UserPersona, WatchlistShow } from '../contexts/AuthContext';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OnboardingAnswers {
  emotionalMoment: string;
  cliffhangerFeeling: string;
  bestFriendCharacter: string;
  email: string;
  username: string;
  password: string;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    emotionalMoment: '',
    cliffhangerFeeling: '',
    bestFriendCharacter: '',
    email: '',
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    {
      id: 'emotional-moment',
      title: 'Tell us about a show moment that made you cry or laugh',
      subtitle: 'Help us understand what moves you',
      type: 'textarea' as const,
      field: 'emotionalMoment' as keyof OnboardingAnswers,
      placeholder: 'Describe a TV moment that really got to you...',
      icon: <Sparkles className="w-6 h-6 text-[#77d4fc]" />
    },
    {
      id: 'cliffhangers',
      title: 'How do you feel about cliffhangers?',
      subtitle: 'This helps us understand your viewing style',
      type: 'multiple-choice' as const,
      field: 'cliffhangerFeeling' as keyof OnboardingAnswers,
      options: [
        { value: 'love', label: 'Love them! The suspense is thrilling' },
        { value: 'hate', label: 'Hate them! I need closure immediately' },
        { value: 'mixed', label: 'Mixed feelings - depends on the show' },
        { value: 'avoid', label: 'I avoid shows with cliffhangers' }
      ],
      icon: <Sparkles className="w-6 h-6 text-[#77d4fc]" />
    },
    {
      id: 'best-friend',
      title: 'Who\'s a character you\'d want as a best friend?',
      subtitle: 'Tell us about your ideal TV companion',
      type: 'textarea' as const,
      field: 'bestFriendCharacter' as keyof OnboardingAnswers,
      placeholder: 'Which TV character would make the perfect best friend and why?',
      icon: <Sparkles className="w-6 h-6 text-[#77d4fc]" />
    },
    {
      id: 'registration',
      title: 'Create your account',
      subtitle: 'Almost done! Just need a few details',
      type: 'registration' as const,
      icon: <User className="w-6 h-6 text-[#77d4fc]" />
    }
  ];

  const currentStepData = steps[currentStep];

  const handleInputChange = (field: keyof OnboardingAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    const currentField = currentStepData.field;
    if (currentStepData.type === 'registration') {
      return answers.email && answers.username && answers.password;
    }
    return currentField && answers[currentField].trim().length > 0;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const generatePersonaAndWatchlist = (): { persona: UserPersona; watchlist: WatchlistShow[] } => {
    // Hardcoded demo persona based on any answers
    const persona: UserPersona = {
      moodProfile: "Dark, Intense, Morally Complex",
      tags: ["Thriller", "Anti-heroes", "Plot Twists"],
      tvTwin: "@plot_master_77"
    };

    // Hardcoded watchlist shows
    const watchlist: WatchlistShow[] = [
      { id: '1', name: 'Stranger Things', platform: 'Netflix' },
      { id: '2', name: 'The Boys', platform: 'Amazon Prime' },
      { id: '3', name: 'The Witcher', platform: 'Netflix' },
      { id: '4', name: 'Silicon Valley', platform: 'HBO' }
    ];

    return { persona, watchlist };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { persona, watchlist } = generatePersonaAndWatchlist();
    
    const userData = {
      email: answers.email,
      username: answers.username,
      persona,
      watchlist
    };

    login(userData);
    setIsSubmitting(false);
    
    // Reset form for next use
    setCurrentStep(0);
    setAnswers({
      emotionalMoment: '',
      cliffhangerFeeling: '',
      bestFriendCharacter: '',
      email: '',
      username: '',
      password: ''
    });
    
    onClose();
  };

  // Disable body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
    {/* Modal Backdrop */}
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#77d4fc]/20 rounded-lg flex items-center justify-center">
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI-Powered Onboarding</h2>
                <p className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-900">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#2a9fd8] to-[#77d4fc] h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div 
            className="p-6 flex flex-col min-h-[400px] max-h-[calc(90vh-200px)] overflow-y-auto"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                {currentStepData.title}
              </h3>
              <p className="text-gray-400">
                {currentStepData.subtitle}
              </p>
            </div>

            <div className="flex-1">
              {currentStepData.type === 'textarea' && (
                <textarea
                  value={answers[currentStepData.field!]}
                  onChange={(e) => handleInputChange(currentStepData.field!, e.target.value)}
                  placeholder={currentStepData.placeholder}
                  className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#77d4fc] focus:border-transparent resize-none"
                />
              )}

              {currentStepData.type === 'multiple-choice' && (
                <div className="space-y-3">
                  {currentStepData.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange(currentStepData.field!, option.value)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        answers[currentStepData.field!] === option.value
                          ? 'border-[#77d4fc] bg-[#77d4fc]/10 text-[#77d4fc]'
                          : 'border-gray-600 bg-gray-700 text-white hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          answers[currentStepData.field!] === option.value
                            ? 'border-[#77d4fc] bg-[#77d4fc]'
                            : 'border-gray-400'
                        }`}>
                          {answers[currentStepData.field!] === option.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50" />
                          )}
                        </div>
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {currentStepData.type === 'registration' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={answers.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#77d4fc] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Username
                    </label>
                    <input
                      type="text"
                      value={answers.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="your_username"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#77d4fc] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Password
                    </label>
                    <input
                      type="password"
                      value={answers.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#77d4fc] focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center space-x-2 bg-[#2a9fd8] hover:bg-[#77d4fc] text-white hover:text-black px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="flex items-center space-x-2 bg-[#2a9fd8] hover:bg-[#77d4fc] text-white hover:text-black px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating your profile...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete Setup</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
    </div>
    </>
  );
};

export default OnboardingWizard;