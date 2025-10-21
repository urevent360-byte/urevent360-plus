'use client';
import AppPortalLayout from '@/app/app/PortalLayout';
import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';

const appAuthRoutes = ['/app/login', '/app/register', '/app/forgot-password'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const isAuthPage = appAuthRoutes.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppPortalLayout>{children}</AppPortalLayout>
    </SidebarProvider>
  );
}
