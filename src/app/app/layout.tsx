'use client';
import AppPortalLayout from '@/app/app/PortalLayout';
import { useAuth } from '@/contexts/AuthProvider';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, roleLoaded, isAdmin } = useAuth();
  const pathname = usePathname();

  const isAuthPage =
    pathname === '/app/login' ||
    pathname === '/app/register' ||
    pathname === '/app/forgot-password';

  // For auth pages, render them standalone without the portal layout.
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  // Wait until authentication status is fully resolved to prevent flickers
  if (loading || !roleLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading portal...</p>
      </div>
    );
  }

  // If we are on a protected page but the user is not a logged-in host,
  // the middleware should have already redirected. This is a client-side safeguard.
  // We render null to avoid showing the portal layout briefly before redirection.
  if (!user || isAdmin) {
    return null;
  }

  // For all other protected app pages, show the full portal layout.
  return <AppPortalLayout>{children}</AppPortalLayout>;
}
