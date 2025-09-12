'use client';

import { useLanguage, Language } from '@/contexts/LanguageProvider';

type ClientWrapperProps = {
  children: (props: { language: Language }) => React.ReactNode;
};

export function ClientWrapper({ children }: ClientWrapperProps) {
  const { language } = useLanguage();
  return <>{children({ language })}</>;
}
