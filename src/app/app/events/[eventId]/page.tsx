// src/app/admin/events/[eventId]/page.tsx
import EventDetailClient from './client';

// Usamos "any" para evitar el problema con PageProps durante el build
export default function AdminEventDetailPage({ params }: any) {
  const eventId = params?.eventId as string;
  return <EventDetailClient eventId={eventId} />;
}
