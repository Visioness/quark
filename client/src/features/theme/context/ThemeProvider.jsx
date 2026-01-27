import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children, defaultTheme = 'system' }) {
  // 1. Initialize state from localStorage or default
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('vite-ui-theme') || defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // 2. Remove old classes
    root.classList.remove('light', 'dark');

    // 3. Handle "System" preference
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    // 4. Handle Manual preference
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme) => {
      localStorage.setItem('vite-ui-theme', theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
