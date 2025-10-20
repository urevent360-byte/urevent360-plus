
'use client';
import AppPortalLayout from '@/app/app/PortalLayout';
import { usePathname } from 'next/navigation';

const appAuthRoutes = ['/app/login', '/app/register', '/app/forgot-password'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const isAuthPage = appAuthRoutes.includes(pathname);

  return (
      isAuthPage ? <>{children}</> : <AppPortalLayout>{children}</AppPortalLayout>
  );
}
