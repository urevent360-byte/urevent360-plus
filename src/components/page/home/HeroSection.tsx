
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { HeroContent } from '@/components/page/home/HeroContent';
import placeholderImages from '@/lib/placeholder-images.json';
import brandingData from '@/lib/branding.json';

function resolveAssetUrl(url?: string | null): { src: string; unoptimized: boolean } {
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        // This ensures the code only runs on the client, where window is available
        setBaseUrl(window.location.origin);
    }, []);

    if (!url) {
        // Provide a default or handle the case where the URL is missing
        const heroPlaceholder = placeholderImages.placeholderImages.find(p => p.id === 'hero');
        const fallbackUrl = heroPlaceholder?.imageUrl || 'https://picsum.photos/seed/default-hero/1920/1080';
        return { src: fallbackUrl, unoptimized: false };
    }

    // If it's already a full URL, use it directly
    if (/^https?:\/\//i.test(url)) {
        return { src: url, unoptimized: false };
    }

    // For relative paths, construct the full URL on the client
    if (!baseUrl) {
        // Return a temporary placeholder or an empty string while waiting for the client to mount
        // This prevents a hydration mismatch.
        return { src: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', unoptimized: true };
    }

    const path = url.startsWith('/') ? url : `/${url}`;
    const isLocalUpload = path.startsWith('/uploads/');
    return { src: `${baseUrl}${path}`, unoptimized: isLocalUpload };
}

export function HeroSection() {
    const imageUrl = (brandingData as any)?.heroImageUrl ?? placeholderImages.placeholderImages.find(p => p.id === 'hero')?.imageUrl;
    const { src: heroSrc, unoptimized } = resolveAssetUrl(imageUrl);
    
    return (
        <section className="relative flex h-[60vh] w-full items-center justify-center text-center text-white md:h-[80vh]">
            <Image
                src={heroSrc}
                alt="A vibrant event with confetti falling on a joyful crowd."
                fill
                priority
                className="object-cover brightness-50"
                data-ai-hint="event celebration"
                unoptimized={unoptimized}
            />
            <div className="relative z-10 mx-auto max-w-4xl p-4">
                <HeroContent />
            </div>
        </section>
    );
}
