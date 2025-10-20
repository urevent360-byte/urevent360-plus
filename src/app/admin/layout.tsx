
'use client';
import AdminPortalLayout from '@/app/admin/PortalLayout';
import { usePathname } from 'next/navigation';

const adminAuthRoutes = ['/admin/login', '/admin/forgot-password'];

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? '';
  const isAuthPage = adminAuthRoutes.includes(pathname);

  return isAuthPage ? <>{children}</> : <AdminPortalLayout>{children}</AdminPortalLayout>;
}
