'use client';

import React from 'react';
import AppPortalLayout from '@/app/app/PortalLayout';

export default function AppDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Aquí ya NO hacemos useAuth ni useRouter.
  // El middleware + AuthProvider se encargan de la seguridad.
  return <AppPortalLayout>{children}</AppPortalLayout>;
}
