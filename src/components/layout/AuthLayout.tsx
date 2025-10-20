'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthProvider';
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

  // 🔹 Envolvemos TODO con AuthProvider para que onAuthStateChanged funcione incluso en login
  return (
    <AuthProvider>
      {portalType === 'admin' ? (
        adminAuthRoutes.includes(pathname) ? (
          <>{children}</>
        ) : (
          <AdminPortalLayout>{children}</AdminPortalLayout>
        )
      ) : portalType === 'app' ? (
        appAuthRoutes.includes(pathname) ? (
          <>{children}</>
        ) : (
          <AppPortalLayout>{children}</AppPortalLayout>
        )
      ) : (
        <>{children}</>
      )}
    </AuthProvider>
  );
}
