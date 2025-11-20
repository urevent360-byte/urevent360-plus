'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import AdminPortalLayout from '@/app/admin/PortalLayout';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/admin/login');
      return;
    }

    if (!isAdmin) {
      router.replace('/app/dashboard');
      return;
    }
  }, [loading, user, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return null;
  }

  return <AdminPortalLayout>{children}</AdminPortalLayout>;
}
