'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import AppPortalLayout from '@/app/app/PortalLayout';

export default function AppDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Si no hay usuario → login host
    if (!user) {
      router.replace('/app/login');
      return;
    }

    // Si es admin, que no use el portal host → mándalo al admin
    if (isAdmin) {
      router.replace('/admin/dashboard');
      return;
    }
  }, [loading, user, isAdmin, router]);

  if (loading || !user || isAdmin) {
    return null;
  }

  return <AppPortalLayout>{children}</AppPortalLayout>;
}
