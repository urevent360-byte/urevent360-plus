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
  // En algunos setups usePathname() puede ser string | null, así que hacemos fallback:
  const pathname = usePathname() ?? '';

  if (portalType === 'admin') {
    if (adminAuthRoutes.includes(pathname)) {
      return <>{children}</>;
    }
    return <AdminPortalLayout>{children}</AdminPortalLayout>;
  }

  if (portalType === 'app') {
    if (appAuthRoutes.includes(pathname)) {
      return <>{children}</>;
    }
    return <AppPortalLayout>{children}</AppPortalLayout>;
  }

  return <>{children}</>;
}