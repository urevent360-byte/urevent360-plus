'use client';

import { usePathname } from 'next/navigation';
import AppPortalLayout from '@/app/app/PortalLayout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';

  // Páginas de autenticación del host portal
  const isAuthPage =
    pathname === '/app/login' ||
    pathname === '/app/register' ||
    pathname === '/app/forgot-password';

  // Las páginas de login/register/forgot se muestran SIN sidebar
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Para todas las demás rutas /app/*, mostramos el portal completo
  // La seguridad (que sea host, etc.) la maneja el middleware + AuthProvider
  return <AppPortalLayout>{children}</AppPortalLayout>;
}
