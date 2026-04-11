import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import api from '../api';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const prefs = user && user.preferences ? user.preferences : {};

  // Initialize with the logged-in User's database preferences
  const [theme, setTheme] = useState(prefs.theme || 'dark');
  const [font, setFont] = useState(prefs.font || 'sans');
  const [background, setBackground] = useState(prefs.background || 'default');
  const [aiModel, setAiModel] = useState(prefs.aiModel || 'gemini-2.5-flash');

  const isInitialMount = useRef(true);

  useEffect(() => {
    // 1. Physically apply styling attributes to the global document object
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }

    document.body.classList.remove('font-sans', 'font-serif', 'font-monospace');
    document.body.classList.add(`font-${font}`);

    if (background !== 'default') {
      document.body.style.backgroundImage = `url(${background})`;
      // Ensure the background scales seamlessly globally
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
    }

    // 2. Synchronize states with the secure database tracking system
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const syncPreferences = async () => {
        try {
          // Push securely to backend Route
          await api.put('/auth/preferences', { theme, font, background, aiModel });
          
          // Resave updated user payload safely to local tracker string 
          // (Ensures rapid navigation/refreshes work without making constant GET requests)
          if (user) {
            user.preferences = { theme, font, background, aiModel };
            localStorage.setItem('user', JSON.stringify(user));
          }
        } catch (err) {
          console.error("Failed to sync structural preferences securely", err);
        }
      };
      
      // We only execute network syncs if the user is truly authorized locally
      if (user) {
        syncPreferences();
      }
    }
  }, [theme, font, background, aiModel]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, font, setFont, background, setBackground, aiModel, setAiModel }}>
      {children}
    </ThemeContext.Provider>
  );
};
