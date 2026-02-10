import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  logIn,
  logOut,
  logOutAllSessions,
  refreshToken as refreshTokenRequest,
  signUp,
} from '@/services/auth.service';
import { configureApiAuth } from '@/services/api';
import { LoadingPage } from '@/pages';

const REFRESH_BUFFER_MS = 60 * 1000;
const MIN_REFRESH_DELAY_MS = 5 * 1000;

const getAccessTokenExpiryMs = (accessToken) => {
  try {
    const [, payload] = accessToken.split('.');
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const normalized = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    );
    const decoded = JSON.parse(atob(normalized));

    return decoded.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

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
  const refreshTimerRef = useRef(null);
  const refreshInFlightRef = useRef(null);

  useEffect(() => {
    configureApiAuth({
      getAccessToken: () => auth.accessToken,
      onAuthRefresh: ({ accessToken, user }) => {
        setAuth((prev) => ({
          accessToken,
          user: user ?? prev.user,
        }));
      },
    });
  }, [auth.accessToken]);

  const refreshtoken = useCallback(async ({ silent = false } = {}) => {
    if (refreshInFlightRef.current) {
      return refreshInFlightRef.current;
    }

    if (!silent) {
      setLoading(true);
    }

    const refreshPromise = (async () => {
      try {
        const result = await refreshTokenRequest();

        setAuth({
          accessToken: result.accessToken,
          user: result.user,
        });

        return result;
      } finally {
        if (!silent) {
          setLoading(false);
        }

        refreshInFlightRef.current = null;
      }
    })();

    refreshInFlightRef.current = refreshPromise;
    return refreshPromise;
  }, []);

  useEffect(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    if (!auth.accessToken) {
      return;
    }

    const expiresAtMs = getAccessTokenExpiryMs(auth.accessToken);
    if (!expiresAtMs) {
      return;
    }

    const refreshDelay = Math.max(
      expiresAtMs - Date.now() - REFRESH_BUFFER_MS,
      MIN_REFRESH_DELAY_MS
    );

    refreshTimerRef.current = setTimeout(() => {
      refreshtoken({ silent: true }).catch(() => {});
    }, refreshDelay);

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [auth.accessToken, refreshtoken]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await Promise.all([
          refreshtoken({ silent: true }).catch(() => {}),
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ]);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [refreshtoken]);

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
