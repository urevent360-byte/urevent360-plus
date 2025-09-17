import AppEventDetailClient from './client';

export default async function AppEventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  return <AppEventDetailClient eventId={eventId} />;
}
