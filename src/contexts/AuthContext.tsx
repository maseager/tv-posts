import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserPersona {
  moodProfile: string;
  tags: string[];
  tvTwin: string;
}

export interface AuthUser {
  email: string;
  username: string;
  persona: UserPersona;
  watchlist: WatchlistShow[];
}

export interface WatchlistShow {
  id: string;
  name: string;
  platform: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (userData: AuthUser) => void;
  logout: () => void;
  removeFromWatchlist: (showId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('tvposts_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('tvposts_user');
      }
    }
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem('tvposts_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tvposts_user');
    localStorage.removeItem('tvposts_onboarding');
  };

  const removeFromWatchlist = (showId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        watchlist: user.watchlist.filter(show => show.id !== showId)
      };
      setUser(updatedUser);
      localStorage.setItem('tvposts_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    removeFromWatchlist
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};