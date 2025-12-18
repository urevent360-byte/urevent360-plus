
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { HeroContent } from '@/components/page/home/HeroContent';
import placeholderImages from '@/lib/placeholder-images.json';
import brandingData from '@/lib/branding.json';

const useAssetUrl = (url?: string | null) => {
    const [assetSrc, setAssetSrc] = useState({ src: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', unoptimized: true });

    useEffect(() => {
        let finalUrl = url;
        let unoptimized = false;

        if (!finalUrl) {
            const heroPlaceholder = placeholderImages.placeholderImages.find(p => p.id === 'hero');
            finalUrl = heroPlaceholder?.imageUrl || 'https://picsum.photos/seed/default-hero/1920/1080';
        }

        if (!/^https?:\/\//i.test(finalUrl)) {
            const path = finalUrl.startsWith('/') ? finalUrl : `/${finalUrl}`;
            finalUrl = `${window.location.origin}${path}`;
            if (path.startsWith('/uploads/')) {
                unoptimized = true;
            }
        }
        
        setAssetSrc({ src: finalUrl, unoptimized });

    }, [url]);

    return assetSrc;
};


export function HeroSection() {
    const imageUrl = (brandingData as any)?.heroImageUrl ?? placeholderImages.placeholderImages.find(p => p.id === 'hero')?.imageUrl;
    const { src: heroSrc, unoptimized } = useAssetUrl(imageUrl);
    
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
