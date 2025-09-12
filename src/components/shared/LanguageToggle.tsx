'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageProvider';
import { translations } from '@/lib/translations';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage}>
      <Languages className="h-4 w-4 mr-2" />
      {translations.languageToggle[language]}
    </Button>
  );
}
