'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import AppPortalLayout from '@/app/app/PortalLayout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading, roleLoaded } = useAuth();
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

  // Mientras se resuelve el estado de auth/rol, mostramos un loader
  if (loading || !roleLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading portal...</p>
      </div>
    );
  }

  // Si no hay usuario o el rol no es "host", no pintamos el portal.
  // El AuthProvider + middleware se encargarán de redirigir.
  if (!user || role !== 'host') {
    return null;
  }

  // Para todas las demás rutas /app/*, mostramos el portal completo
  return <AppPortalLayout>{children}</AppPortalLayout>;
}
