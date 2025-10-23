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
  const { user, loading, roleLoaded, role } = useAuth();   // <— usa roleLoaded y role

  const onAuthPage = adminAuthRoutes.includes(pathname);

  useEffect(() => {
    // Espera SIEMPRE hasta que auth y rol estén resueltos
    if (loading || !roleLoaded) return;

    // Sin sesión → a login si no estamos ya allí
    if (!user) {
      if (!onAuthPage) router.replace('/admin/login');
      return;
    }

    // Con sesión y rol HOST → sácalo del área admin
    if (role === 'host') {
      router.replace('/app/login');
      return;
    }

    // Si es admin y está en una página de auth, llévalo al dashboard
    if (role === 'admin' && onAuthPage) {
      router.replace('/admin/dashboard');
    }
  }, [loading, roleLoaded, user, role, onAuthPage, router, pathname]);

  // Páginas de auth (login/forgot) no usan el layout con sidebar
  if (onAuthPage) {
    return <>{children}</>;
  }

  // No pintes el portal hasta confirmar que de verdad es admin
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
