'use client';

import { AuthProvider } from '@/contexts/AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
