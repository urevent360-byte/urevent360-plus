import { AuthLayout } from '@/components/layout/AuthLayout';

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout portalType="admin">{children}</AuthLayout>;
}
