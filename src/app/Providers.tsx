
'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthProvider';
import { LanguageProvider } from '@/contexts/LanguageProvider';
import { AppLayoutClient } from '@/components/layout/AppLayoutClient';

export default function Providers({ 
  children,
  logoUrl
}: { 
  children: React.ReactNode,
  logoUrl: string | null 
}) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppLayoutClient logoUrl={logoUrl}>
          {children}
        </AppLayoutClient>
      </AuthProvider>
    </LanguageProvider>
  );
}
