
import * as React from 'react';
import PhotoUploadClient from './client';

export default function PhotoUploadPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = React.use(params);
    return <PhotoUploadClient eventId={eventId} />;
}
