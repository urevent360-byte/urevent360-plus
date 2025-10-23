'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import AppPortalLayout from '@/app/app/PortalLayout';
import { SidebarProvider } from '@/components/ui/sidebar';

const hostAuthRoutes = ['/app/login', '/app/register', '/app/forgot-password'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, roleLoaded, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const onAuthPage = hostAuthRoutes.includes(pathname);

  useEffect(() => {
    // Wait for auth and role to be resolved
    if (loading || !roleLoaded) return;

    // If user is an admin and not on an auth page, redirect them away from the host portal
    if (user && role === 'admin' && !onAuthPage) {
      router.replace('/admin/dashboard');
    }
  }, [loading, roleLoaded, user, role, onAuthPage, router, pathname]);

  // For host-specific auth pages, don't render the main portal layout
  if (onAuthPage) {
    return <>{children}</>;
  }
  
  // For all other pages in the host portal, render the standard layout
  return (
    <SidebarProvider>
      <AppPortalLayout>{children}</AppPortalLayout>
    </SidebarProvider>
  );
}
