import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('vestywinbox-theme');
    return (saved as Theme) || 'system';
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const root = document.documentElement;
      let darkMode = false;

      if (theme === 'system') {
        darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        darkMode = theme === 'dark';
      }

      setIsDark(darkMode);
      root.classList.toggle('dark', darkMode);
      root.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    };

    updateTheme();
    localStorage.setItem('vestywinbox-theme', theme);

    // Écouter les changements de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 