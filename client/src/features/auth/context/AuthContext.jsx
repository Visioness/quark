import { createContext, useContext, useEffect, useState } from 'react';
import {
  logIn,
  logOut,
  logOutAllSessions,
  refreshToken,
  signUp,
} from '@/services/auth.service';
import { LoadingPage } from '@/pages';

const AuthContext = createContext({
  user: {},
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
  signUp: () => {},
  logIn: () => {},
  logOut: () => {},
  logOutAllSessions: () => {},
  refreshToken: () => {},
});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    accessToken: null,
    user: null,
  });
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const [result] = await Promise.all([
          refreshToken(),
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ]);

        setAuth({
          accessToken: result.accessToken,
          user: result.user,
        });
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await logIn(credentials);

      setAuth({
        accessToken: result.accessToken,
        user: result.user,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logOut();

    setAuth({
      accessToken: null,
      user: null,
    });
  };

  const logoutallsessions = async () => {
    await logOutAllSessions();

    setAuth({
      accessToken: null,
      user: null,
    });
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const result = await signUp(userData);

      setAuth({
        accessToken: result.accessToken,
        user: result.user,
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshtoken = async () => {
    setLoading(true);
    try {
      const result = await refreshToken();

      setAuth({
        accessToken: result.accessToken,
        user: result.user,
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user: auth.user,
    accessToken: auth.accessToken,
    isAuthenticated: !!auth.user && !!auth.accessToken,
    isInitialized,
    loading,
    signup,
    login,
    logout,
    logoutallsessions,
    refreshtoken,
  };

  if (!isInitialized) {
    return <LoadingPage />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
