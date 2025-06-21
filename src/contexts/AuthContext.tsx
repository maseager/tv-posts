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

  // Create demo user data based on username
  const createDemoUser = (username: string): AuthUser => {
    return {
      email: 'demo@example.com',
      username: username,
      persona: {
        moodProfile: "Dark, Intense, Morally Complex",
        tags: ["Thriller", "Anti-heroes", "Plot Twists"],
        tvTwin: "@plot_master_77"
      },
      watchlist: [
        { id: '1', name: 'Stranger Things', platform: 'Netflix' },
        { id: '2', name: 'The Boys', platform: 'Amazon Prime' },
        { id: '3', name: 'The Witcher', platform: 'Netflix' },
        { id: '4', name: 'Silicon Valley', platform: 'HBO' }
      ]
    };
  };

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
    // If no username provided, create demo user
    const finalUserData = userData.username ? userData : createDemoUser('Demo');
    setUser(finalUserData);
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