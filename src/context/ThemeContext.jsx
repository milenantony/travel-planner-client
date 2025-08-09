// client/src/context/ThemeContext.jsx

import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(null);

export default function ThemeContextProvider({ children }) {
  // Default to 'light' theme, but check localStorage and system preference
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // This effect runs whenever the theme changes
  useEffect(() => {
    // 1. Save the theme preference to localStorage
    localStorage.setItem('theme', theme);
    // 2. Add or remove the 'dark' class from the main <html> element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = { theme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}