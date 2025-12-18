

import * as React from 'react';
import PhotoUploadClient from './client';

type Props = {
  params: { eventId: string };
};

export default async function PhotoUploadPage({ params }: { params: Promise<any> }) {
    const { eventId } = await params;
    return <PhotoUploadClient eventId={eventId as string} />;
}
