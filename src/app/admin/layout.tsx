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
  const { user, loading, isAdmin, roleLoaded } = useAuth();

  const onAuthPage = adminAuthRoutes.includes(pathname);

  useEffect(() => {
    // Espera SIEMPRE a que terminen auth + rol
    if (loading) return;

    if (!user) {
      if (!onAuthPage) router.replace('/admin/login');
      return;
    }

    // Solo decide “no admin” cuando roleLoaded esté listo
    if (isAdmin === false && roleLoaded) {
      router.replace('/app/home');
      return;
    }

    if (isAdmin === true && onAuthPage) {
      router.replace('/admin/dashboard');
    }
  }, [loading, roleLoaded, user, isAdmin, onAuthPage, router, pathname]);

  if (onAuthPage) {
    return <>{children}</>;
  }

  const canRender = !loading && roleLoaded && !!user && isAdmin === true;
  if (!canRender) {
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
