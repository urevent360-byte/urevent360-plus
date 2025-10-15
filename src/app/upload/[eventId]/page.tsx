
import * as React from 'react';
import PhotoUploadClient from './client';

type Props = {
  params: { eventId: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function PhotoUploadPage({ params }: Props) {
    const { eventId } = params;
    return <PhotoUploadClient eventId={eventId} />;
}
