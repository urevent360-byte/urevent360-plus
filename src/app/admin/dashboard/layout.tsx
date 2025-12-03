'use client';

import React from 'react';
import AdminPortalLayout from '@/app/admin/PortalLayout';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Aquí ya NO hacemos useAuth ni useRouter.
  // El middleware + AuthProvider se encargan de la seguridad.
  return <AdminPortalLayout>{children}</AdminPortalLayout>;
}
