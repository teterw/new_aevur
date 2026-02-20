'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'th';

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  simulationMode: boolean;
  toggleSimulationMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Language) || 'th';
    }
    return 'th';
  });
  const [simulationMode, setSimulationMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const val = localStorage.getItem('simulationMode');
      return val === null ? true : val === 'true';
    }
    return true;
  });

  const toggleTheme = () =>
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') localStorage.setItem('theme', next);
      return next;
    });

  const toggleLanguage = () =>
    setLanguage((prev) => {
      const next = prev === 'en' ? 'th' : 'en';
      if (typeof window !== 'undefined') localStorage.setItem('language', next);
      return next;
    });

  const toggleSimulationMode = () =>
    setSimulationMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined')
        localStorage.setItem('simulationMode', String(next));
      return next;
    });

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        toggleLanguage,
        simulationMode,
        toggleSimulationMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
