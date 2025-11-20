'use client';

export default function AppDashboardLayout({ children }: { children: React.ReactNode }) {
  // El guard y el PortalLayout ya los maneja src/app/app/layout.tsx
  return <>{children}</>;
}
