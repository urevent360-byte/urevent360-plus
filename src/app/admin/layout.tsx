'use client';
import AdminPortalLayout from '@/app/admin/PortalLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // No client-side redirects here; the middleware handles access by role.
  return <AdminPortalLayout>{children}</AdminPortalLayout>;
}
