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
    // 1) No redirigir mientras aún se resuelve la sesión/rol.
    if (loading) return;

    // 2) Sin sesión → a login (si no estamos ya allí).
    if (!user) {
      if (!onAuthPage) router.replace('/admin/login');
      return;
    }

    // 3) Con sesión pero NO admin → sácalo del área admin.
    if (isAdmin === false) {
      router.replace('/app/home');
      return;
    }
    
    // 4) Si es admin y está en una página de login, llévalo al dashboard.
    if (isAdmin === true && onAuthPage) {
      router.replace('/admin/dashboard');
    }

  }, [loading, user, isAdmin, onAuthPage, router, pathname]);

  // Si es una página de autenticación, no necesita el layout del portal.
  if (onAuthPage) {
    return <>{children}</>;
  }

  // Evita pintar contenido admin hasta confirmar que de verdad es admin.
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

  // Si es admin y no está en una página de autenticación, renderiza el portal.
  return (
    <SidebarProvider>
      <AdminPortalLayout>{children}</AdminPortalLayout>
    </SidebarProvider>
  );
}
