
import * as React from 'react';
import ServiceDetailClient from './client';

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    return <ServiceDetailClient slug={slug} />;
}
