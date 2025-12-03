'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthProvider';
import { LanguageProvider } from '@/contexts/LanguageProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>{children}</AuthProvider>
    </LanguageProvider>
  );
}
