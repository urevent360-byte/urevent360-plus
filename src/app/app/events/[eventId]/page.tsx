import AppEventDetailClient from './client';

export default async function AppEventDetailPage({ params }: { params: { eventId: string } }) {
  const { eventId } = params;
  return <AppEventDetailClient eventId={eventId} />;
}
