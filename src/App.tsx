import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import OnboardingWizard from './components/OnboardingWizard';
import HomePage from './pages/HomePage';
import TVShowPage from './pages/TVShowPage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Listen for onboarding trigger from header
  React.useEffect(() => {
    const handleOpenOnboarding = () => {
      setShowOnboarding(true);
    };

    window.addEventListener('openOnboarding', handleOpenOnboarding);
    return () => window.removeEventListener('openOnboarding', handleOpenOnboarding);
  }, []);

  return (
    <AuthProvider>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tv/:showSlug" element={<TVShowPage />} />
          <Route path="/user/:username" element={<UserProfilePage />} />
        </Routes>
        
        {/* Onboarding Wizard - Rendered at root level */}
        <OnboardingWizard 
          isOpen={showOnboarding} 
          onClose={() => setShowOnboarding(false)} 
        />
      </div>
    </AuthProvider>
  );
}

export default App;