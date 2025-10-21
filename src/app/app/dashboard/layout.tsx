import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | UREVENT 360 PLUS',
  description: 'Panel del cliente para gestionar reservas, pagos y mensajes.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
