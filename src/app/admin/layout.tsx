'use client';
import { usePathname } from 'next/navigation';
import AdminPortalLayout from '@/app/admin/PortalLayout';
import { useAuth } from '@/contexts/AuthProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, roleLoaded, isAdmin } = useAuth();
  const pathname = usePathname();

  const isAuthPage =
    pathname === '/admin/login' || pathname === '/admin/forgot-password';

  // For auth pages, render them standalone without the portal sidebar.
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Wait until authentication status is fully resolved to prevent flickers
  if (loading || !roleLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Checking access...</p>
      </div>
    );
  }

  // If we are on a protected page but the user is not a logged-in admin,
  // the middleware should have already redirected. This is a client-side safeguard.
  // We render null to avoid showing the portal layout briefly before redirection.
  if (!user || !isAdmin) {
    return null;
  }

  // For all other protected admin pages, show the full portal layout.
  return <AdminPortalLayout>{children}</AdminPortalLayout>;
}
