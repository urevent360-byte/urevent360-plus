import { AuthLayout } from '@/components/layout/AuthLayout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout portalType="admin">{children}</AuthLayout>;
}
