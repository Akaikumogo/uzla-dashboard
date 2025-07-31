// src/context/AppContext.tsx
import { ConfigProvider, theme as antTheme } from 'antd';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
export type Lang = 'uz' | 'en' | 'ru';

interface AppContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const getInitialValue = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const saved = localStorage.getItem(key);
  return saved ? (saved as T) : defaultValue;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() =>
    getInitialValue('theme', 'light')
  );
  const [lang, setLangState] = useState<Lang>(() =>
    getInitialValue('lang', 'uz')
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
  };

  return (
    <AppContext.Provider value={{ theme, setTheme, lang, setLang }}>
      <ConfigProvider
        theme={{
          algorithm:
            theme === 'dark'
              ? antTheme.darkAlgorithm
              : antTheme.defaultAlgorithm
        }}
      ></ConfigProvider>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
