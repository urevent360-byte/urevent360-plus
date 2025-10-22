'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import AdminPortalLayout from '@/app/admin/PortalLayout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';

const adminAuthRoutes = ['/admin/login', '/admin/forgot-password'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAdmin } = useAuth();

  const onAuthPage = adminAuthRoutes.includes(pathname);

  useEffect(() => {
    // 1) Do nothing while we resolve session and role
    if (loading) return;

    // 2) No session → go to login (unless we are already there)
    if (!user) {
      if (!onAuthPage) router.replace('/admin/login');
      return;
    }
    
    // 3) If the user is logged in but IS NOT an admin, get them out of the admin area
    if (user && isAdmin === false) {
      router.replace('/app/home');
      return;
    }

    // 4) If the user is an admin and is on a login page, send them to the dashboard
    if (user && isAdmin && onAuthPage) {
      router.replace('/admin/dashboard');
    }

  }, [loading, user, isAdmin, onAuthPage, router, pathname]);

  // If it is a login/register page, it doesn't need the portal layout
  if (onAuthPage) {
    return <>{children}</>;
  }

  // Show a loader while session is being verified or if the user is not an admin
  const canRenderAdmin = !loading && !!user && isAdmin === true;

  if (!canRenderAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Checking admin access…</span>
          </div>
      </div>
    );
  }

  // If admin and not on an auth page, render the portal
  return (
    <SidebarProvider>
      <AdminPortalLayout>{children}</AdminPortalLayout>
    </SidebarProvider>
  );
}
