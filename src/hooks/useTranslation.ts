'use client';

import { useLanguage } from '@/contexts/LanguageProvider';
import { getTranslation } from '@/lib/i18n';

export function useTranslation() {
  const { language } = useLanguage();

  function t(key: string) {
    return getTranslation(language, key);
  }

  return { t, language };
}
