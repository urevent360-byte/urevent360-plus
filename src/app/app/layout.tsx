
'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import AppPortalLayout from '@/app/app/PortalLayout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';

const hostAuthRoutes = ['/app/login', '/app/register', '/app/forgot-password'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, roleLoaded, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const onAuthPage = hostAuthRoutes.includes(pathname);

  useEffect(() => {
    // Wait for auth and role to be resolved
    if (loading || !roleLoaded) return;
    
    // Redirect non-logged-in users to login if not on auth page
    if (!user && !onAuthPage) {
        router.replace('/app/login');
        return;
    }

    // If user is an admin, redirect them away from the host portal
    if (user && role === 'admin') {
      router.replace('/admin/dashboard');
      return;
    }
    
    // If a logged-in host lands on an auth page, redirect them to their home
    if (user && role === 'host' && onAuthPage) {
        router.replace('/app/home');
    }

  }, [loading, roleLoaded, user, role, onAuthPage, router, pathname]);

  // For host-specific auth pages, don't render the main portal layout
  if (onAuthPage) {
    return <>{children}</>;
  }
  
  // Prevent rendering the portal until we know it's a host
  const canRenderHost = !loading && roleLoaded && !!user && role === 'host';
  if (!canRenderHost) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Verifying access…</span>
            </div>
        </div>
      );
  }
  
  // For all other pages in the host portal, render the standard layout
  return (
    <SidebarProvider>
      <AppPortalLayout>{children}</AppPortalLayout>
    </SidebarProvider>
  );
}
