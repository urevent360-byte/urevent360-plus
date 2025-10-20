'use client';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout portalType="app">{children}</AuthLayout>;
}