
// src/app/admin/events/[eventId]/page.tsx
import EventDetailClient from './client';

// Usamos "any" para evitar el problema con PageProps durante el build
export default async function AdminEventDetailPage({ params }: { params: Promise<any> }) {
  const { eventId } = await params;
  return <EventDetailClient eventId={eventId as string} />;
}
