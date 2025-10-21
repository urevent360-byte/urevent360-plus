'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import AdminPortalLayout from '@/app/admin/PortalLayout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';

const adminAuthRoutes = ['/admin/login', '/admin/forgot-password'];

export default function RootAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const { user, loading, isAdmin } = useAuth();
  
  const isAuthPage = adminAuthRoutes.includes(pathname);

  useEffect(() => {
    if (loading || isAuthPage) return;

    if (!user) {
      router.replace('/admin/login');
      return;
    }
    if (!isAdmin) {
      router.replace('/app/home'); // No-admins al portal de host
    }
  }, [loading, user, isAdmin, router, isAuthPage]);

  // Si es una página de login/registro, no se necesita el layout del portal
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  // Muestra un loader mientras se verifica la sesión o si el usuario no es admin
  if (loading || !user || !isAdmin) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Checking admin access…</span>
            </div>
        </div>
    );
  }

  // Si es admin, renderiza el portal
  return (
    <SidebarProvider>
      <AdminPortalLayout>{children}</AdminPortalLayout>
    </SidebarProvider>
  );
}
