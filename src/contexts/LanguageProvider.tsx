'use client';
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'es' : 'en'));
  }, []);
  
  const setLanguageCallback = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage: setLanguageCallback }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
