'use client';

import { AuthProvider } from '@/contexts/AuthProvider';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  // We just wrap the children with the provider.
  // The specific portal layouts will be handled by their respective layout.tsx files.
  return <AuthProvider>{children}</AuthProvider>;
}
