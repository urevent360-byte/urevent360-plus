'use client';

import { usePathname } from 'next/navigation';
import AdminPortalLayout from '@/app/admin/PortalLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';

  // Páginas de autenticación: se muestran sin sidebar
  const isAuthPage =
    pathname === '/admin/login' || pathname === '/admin/forgot-password';

  if (isAuthPage) {
    return <>{children}</>;
  }

  // Todas las demás rutas /admin/* usan el portal completo
  return <AdminPortalLayout>{children}</AdminPortalLayout>;
}
