'use client';

import { usePathname } from 'next/navigation';
import AdminPortalLayout from '@/app/admin/PortalLayout';
import AppPortalLayout from '@/app/app/PortalLayout';

const adminAuthRoutes = ['/admin/login', '/admin/forgot-password'];
const appAuthRoutes   = ['/app/login', '/app/register', '/app/forgot-password'];

export function AuthLayout({
  children,
  portalType,
}: {
  children: React.ReactNode;
  portalType: 'admin' | 'app';
}) {
  const pathname = usePathname() ?? '';

  if (portalType === 'admin') {
    return adminAuthRoutes.includes(pathname) ? (
      <>{children}</>
    ) : (
      <AdminPortalLayout>{children}</AdminPortalLayout>
    );
  }

  if (portalType === 'app') {
    return appAuthRoutes.includes(pathname) ? (
      <>{children}</>
    ) : (
      <AppPortalLayout>{children}</AppPortalLayout>
    );
  }

  return <>{children}</>;
}
