import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import TVShowPage from './pages/TVShowPage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tv/:showSlug" element={<TVShowPage />} />
        <Route path="/user/:username" element={<UserProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;