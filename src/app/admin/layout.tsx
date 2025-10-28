
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
  const { user, loading, roleLoaded, role } = useAuth();

  useEffect(() => {
    // 1) Wait for auth and role resolution to finish
    if (loading || !roleLoaded) return;

    const onAuthPage = adminAuthRoutes.includes(pathname);

    // 2) Not authenticated -> send to login (if not already there)
    if (!user) {
      if (!onAuthPage) router.replace('/admin/login');
      return;
    }

    // 3) Authenticated host (not admin) -> get them out of the admin portal
    if (role === 'host') {
      router.replace('/app/login');
      return;
    }

    // 4) Authenticated admin on an auth page -> send to dashboard
    if (role === 'admin' && onAuthPage) {
      router.replace('/admin/dashboard');
    }
  }, [loading, roleLoaded, user, role, pathname, router]);

  const onAuthPage = adminAuthRoutes.includes(pathname);

  // Auth pages (login/forgot) don't use the sidebar layout
  if (onAuthPage) {
    return <>{children}</>;
  }

  // Don't render the portal until we confirm it's really an admin
  const canRenderAdmin = !loading && roleLoaded && !!user && role === 'admin';
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

  return (
    <SidebarProvider>
      <AdminPortalLayout>{children}</AdminPortalLayout>
    </SidebarProvider>
  );
}
