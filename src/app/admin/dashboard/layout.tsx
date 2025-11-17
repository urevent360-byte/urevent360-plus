import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | UREVENT 360 PLUS',
  description: 'Manage services, bookings, and content for UREVENT 360 PLUS.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
