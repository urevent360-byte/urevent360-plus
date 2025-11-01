'use client';
import AppPortalLayout from '@/app/app/PortalLayout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // No client-side redirects here; the middleware handles access by role.
  return <AppPortalLayout>{children}</AppPortalLayout>;
}
