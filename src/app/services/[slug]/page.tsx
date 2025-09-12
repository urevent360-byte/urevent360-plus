'use client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageProvider';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Mail, Tag, ShoppingCart, Video } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

// In a real app, this data would come from a CMS or database.
const placeholderServicesData: any = {
    '360-photo-booth': {
        slug: '360-photo-booth',
        name: { en: '360 Photo Booth', es: 'Cabina de Fotos 360' },
        longDescription: { en: "Step onto our platform and let our revolving camera capture you in a stunning 360-degree slow-motion video. It's the perfect way to create dynamic, shareable content that will make your event unforgettable. We provide a professional attendant, fun props, and instant sharing options so your guests can show off their amazing videos right away.", es: 'Sube a nuestra plataforma y deja que nuestra cámara giratoria te capture en un impresionante video en cámara lenta de 360 grados. Es la forma perfecta de crear contenido dinámico y compartible que hará que tu evento sea inolvidable. Ofrecemos un asistente profesional, accesorios divertidos y opciones para compartir al instante para que tus invitados puedan mostrar sus increíbles videos de inmediato.' },
        images: [
            { url: 'https://picsum.photos/seed/service1-1/800/600', alt: 'Guests enjoying the 360 photo booth at a quinceañera' },
            { url: 'https://picsum.photos/seed/service1-2/800/600', alt: 'Close-up of the 360 camera setup with lighting' },
            { url: 'https://picsum.photos/seed/service1-3/800/600', alt: 'A couple posing on the 360 photo booth platform' },
        ],
        videos: [
            { url: 'https://www.youtube.com/embed/5_v634-9W3E', alt: '360 Photo Booth Sample Video' }
        ],
        keywords: ['360 photo booth', 'video booth', 'quinceañera', 'event entertainment', 'social media booth'],
    },
    'photo-booth-printer': {
        slug: 'photo-booth-printer',
        name: { en: 'Photo Booth Printer', es: 'Impresora para Cabina de Fotos' },
        longDescription: { en: "Don't let memories stay digital. Our high-speed, professional-grade printers produce beautiful, glossy photo strips in seconds. We can customize the prints with your event's logo, date, or a special message, creating the perfect take-home souvenir for your guests.", es: 'No dejes que los recuerdos se queden en lo digital. Nuestras impresoras de alta velocidad y grado profesional producen hermosas y brillantes tiras de fotos en segundos. Podemos personalizar las impresiones con el logo de tu evento, la fecha o un mensaje especial, creando el recuerdo perfecto para que tus invitados se lleven a casa.' },
        images: [
            { url: 'https://picsum.photos/seed/service2-1/800/600', alt: 'Guests holding freshly printed photo strips at a wedding' },
            { url: 'https://picsum.photos/seed/service2-2/800/600', alt: 'A custom-branded photo strip with a wedding logo' },
        ],
        keywords: ['photo printer', 'instant prints', 'wedding souvenirs', 'custom photos', 'photo booth rental'],
    },
     'magic-mirror': {
        slug: 'magic-mirror',
        name: { en: 'Magic Mirror', es: 'Espejo Mágico' },
        longDescription: { en: "It's not just a photo booth, it's an experience. This full-length touch-screen mirror interacts with your guests through vibrant animations and voice guidance. They can sign their creations, add emojis, and get their photos printed instantly. It's a sleek and magical addition to any upscale event.", es: 'No es solo una cabina de fotos, es una experiencia. Este espejo de pantalla táctil de cuerpo entero interactúa con tus invitados a través de animaciones vibrantes y guía de voz. Pueden firmar sus creaciones, añadir emojis y obtener sus fotos impresas al instante. Es una adición elegante y mágica a cualquier evento de lujo.' },
        images: [
            { url: 'https://picsum.photos/seed/service3-1/800/600', alt: 'Guests interacting with the Magic Mirror at a corporate event' },
            { url: 'https://picsum.photos/seed/service3-2/800/600', alt: 'Colorful animations displayed on the Magic Mirror screen' },
        ],
        keywords: ['magic mirror', 'selfie mirror', 'photo booth', 'interactive entertainment', 'corporate events'],
    },
    'la-hora-loca-led-robot': {
        slug: 'la-hora-loca-led-robot',
        name: { en: 'La Hora Loca with LED Robot', es: 'La Hora Loca con Robot LED' },
        longDescription: { en: "Turn your party into an epic festival with La Hora Loca! We bring the energy with a towering LED Robot that dances with your guests, shoots CO2 cannons, and lights up the room. Accompanied by samba dancers and a host of party props, it's an hour of non-stop, high-octane fun that no one will ever forget.", es: '¡Convierte tu fiesta en un festival épico con La Hora Loca! Traemos la energía con un imponente Robot LED que baila con tus invitados, dispara cañones de CO2 e ilumina el lugar. Acompañado de bailarines de samba y una gran cantidad de accesorios de fiesta, es una hora de diversión sin parar y de alta energía que nadie olvidará jamás.' },
        images: [
            { url: 'https://picsum.photos/seed/service4-1/800/600', alt: 'Giant LED Robot dancing with guests during La Hora Loca' },
            { url: 'https://picsum.photos/seed/service4-2/800/600', alt: 'Samba dancers in full costume performing at a party' },
        ],
        keywords: ['la hora loca', 'LED robot', 'party entertainment', 'samba dancers', 'CO2 jets'],
    },
    'cold-sparklers': {
        slug: 'cold-sparklers',
        name: { en: 'Cold Sparklers', es: 'Chispas Frías' },
        longDescription: { en: "Create a breathtaking 'wow' moment with our cold sparkler fountains. These are completely safe for indoor use, with no smoke, heat, or fire hazard. They are perfect for a grand entrance, a romantic first dance, or a spectacular cake-cutting ceremony, adding a touch of Hollywood glamour to your event.", es: "Crea un momento 'wow' impresionante con nuestras fuentes de chispas frías. Son completamente seguras para uso en interiores, sin humo, calor ni riesgo de incendio. Son perfectas para una gran entrada, un primer baile romántico o una espectacular ceremonia de corte de pastel, añadiendo un toque de glamour de Hollywood a tu evento." },
        images: [
            { url: 'https://picsum.photos/seed/service5-1/800/600', alt: "Bride and groom's first dance surrounded by cold sparklers" },
            { url: 'https://picsum.photos/seed/service5-2/800/600', alt: 'A grand entrance at a party with cold sparkler fountains' },
        ],
        keywords: ['cold sparklers', 'wedding first dance', 'special effects', 'indoor fireworks', 'grand entrance'],
    },
    // Add other services with detailed descriptions and keywords
    'dance-on-the-clouds': {
        slug: 'dance-on-the-clouds',
        name: { en: 'Dance on the Clouds', es: 'Baile en las Nubes' },
        longDescription: { en: 'Create a truly magical first dance with our "Dance on the Clouds" effect. Using professional-grade dry ice machines, we create a thick, low-lying cloud that covers the dance floor, making it seem as if you are floating. It’s a breathtaking visual that will leave your guests in awe and create unforgettable photos.', es: 'Crea un primer baile verdaderamente mágico con nuestro efecto "Baile en las Nubes". Usando máquinas de hielo seco de grado profesional, creamos una nube espesa y baja que cubre la pista de baile, haciendo que parezca que estás flotando. Es una imagen impresionante que dejará a tus invitados asombrados y creará fotos inolvidables.' },
        images: [
            { url: 'https://picsum.photos/seed/service6-1/800/600', alt: 'Couple having their first dance on a cloud of dry ice' },
            { url: 'https://picsum.photos/seed/service6-2/800/600', alt: 'The low-lying cloud effect on a dance floor' },
        ],
        keywords: ['dance on clouds', 'dry ice effect', 'wedding first dance', 'magical atmosphere', 'event effects'],
    },
     'projector-slideshows-videos': {
        slug: 'projector-slideshows-videos',
        name: { en: 'Projector (Slideshows & Videos)', es: 'Proyector (Presentaciones y Videos)' },
        longDescription: { en: "Share your story with your guests. We provide high-definition projectors and large screens to display photo slideshows, love stories, or corporate presentations. It's a perfect way to add a personal and emotional touch to weddings, anniversaries, and corporate events.", es: 'Comparte tu historia con tus invitados. Ofrecemos proyectores de alta definición y pantallas grandes para mostrar presentaciones de fotos, historias de amor o presentaciones corporativas. Es una forma perfecta de añadir un toque personal y emocional a bodas, aniversarios y eventos corporativos.' },
        images: [
            { url: 'https://picsum.photos/seed/service7-1/800/600', alt: 'A photo slideshow playing on a large screen at a wedding reception' },
            { url: 'https://picsum.photos/seed/service7-2/800/600', alt: 'Guests watching a video presentation at a corporate event' },
        ],
        keywords: ['projector rental', 'slideshow', 'video projection', 'event visuals', 'presentation screen'],
    },
    'monogram-projector': {
        slug: 'monogram-projector',
        name: { en: 'Monogram Projector', es: 'Proyector de Monograma' },
        longDescription: { en: 'Personalize your venue with a custom monogram projection. We can project your initials, wedding date, or a custom design onto the dance floor, a wall, or the ceiling. This elegant lighting effect, also known as a gobo, adds a sophisticated and branded touch to your event space.', es: 'Personaliza tu lugar con una proyección de monograma a medida. Podemos proyectar tus iniciales, la fecha de tu boda o un diseño personalizado en la pista de baile, una pared o el techo. Este elegante efecto de iluminación, también conocido como gobo, añade un toque sofisticado y de marca a tu espacio de evento.' },
        images: [
            { url: 'https://picsum.photos/seed/service8-1/800/600', alt: 'A custom wedding monogram projected onto a dance floor' },
            { url: 'https://picsum.photos/seed/service8-2/800/600', alt: 'A corporate logo projected on a wall at an event' },
        ],
        keywords: ['monogram projection', 'gobo projection', 'wedding lighting', 'custom logo light', 'event branding'],
    },
    'led-screens-wall': {
        slug: 'led-screens-wall',
        name: { en: 'LED Screens Wall', es: 'Pared de Pantallas LED' },
        longDescription: { en: 'Make a massive impact with a stunning LED video wall. Perfect for stage backdrops, live camera feeds, or dynamic visual displays, our LED walls offer vibrant colors and seamless resolution. Elevate your concert, conference, or high-end wedding with this state-of-the-art visual centerpiece.', es: 'Causa un impacto masivo con una impresionante pared de video LED. Perfecta para fondos de escenario, transmisiones de cámara en vivo o exhibiciones visuales dinámicas, nuestras paredes LED ofrecen colores vibrantes y una resolución impecable. Eleva tu concierto, conferencia o boda de alto nivel con este centro de atención visual de última generación.' },
        images: [
            { url: 'https://picsum.photos/seed/service9-1/800/600', alt: 'A huge LED wall behind a DJ at a music festival' },
            { url: 'https://picsum.photos/seed/service9-2/800/600', alt: 'A corporate presentation on a seamless LED video wall' },
        ],
        keywords: ['LED wall', 'video wall', 'stage design', 'event production', 'visuals'],
    },
};


export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const { language } = useLanguage();
    const service = placeholderServicesData[params.slug];
    const { toast } = useToast();
    const { addToCart } = useCart();


    if (!service) {
        notFound();
    }
    
    const t = {
        addToCart: { en: 'Add to Inquiry', es: 'Añadir a Consulta' },
        keywords: { en: 'Keywords', es: 'Palabras Clave' },
        videosTitle: { en: 'See It In Action', es: 'Míralo en Acción' },
        addedToCart: { en: 'Added to inquiry cart!', es: '¡Añadido a la consulta!' },
        description: { en: (name: string) => `${name} has been added to your inquiry cart.`, es: (name: string) => `${name} ha sido añadido a tu carrito de consulta.` },
    };

    const handleAddToCart = () => {
        addToCart({
            slug: service.slug,
            name: service.name.en,
            image: service.images[0].url
        });
        toast({
            title: t.addedToCart[language],
            description: t.description(service.name[language])(service.name[language]),
        });
    }

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                     <Carousel className="w-full">
                        <CarouselContent>
                            {service.images.map((img: {url: string, alt: string}, index: number) => (
                            <CarouselItem key={index}>
                                <div className="relative aspect-video">
                                <Image
                                    src={img.url}
                                    alt={img.alt}
                                    fill
                                    className="object-cover rounded-lg shadow-lg"
                                />
                                </div>
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="ml-16" />
                        <CarouselNext className="mr-16" />
                    </Carousel>
                </div>
                <div>
                    <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">{service.name[language]}</h1>
                    <p className="mt-4 text-lg text-foreground/80">{service.longDescription[language]}</p>
                    
                    <div className="mt-8">
                        <h3 className="font-headline text-lg font-semibold flex items-center gap-2"><Tag /> {t.keywords[language]}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {service.keywords.map((keyword: string) => (
                                <span key={keyword} className="bg-secondary text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full">{keyword}</span>
                            ))}
                        </div>
                    </div>

                    <Button onClick={handleAddToCart} size="lg" className="mt-8 bg-accent font-bold text-accent-foreground hover:bg-accent/90">
                        {t.addToCart[language]}
                        <ShoppingCart className="ml-2" />
                    </Button>
                </div>
            </div>

            {service.videos && service.videos.length > 0 && (
                <div className="mt-16 md:mt-24">
                    <Separator />
                    <div className="text-center my-12">
                        <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl flex items-center justify-center gap-3">
                           <Video /> {t.videosTitle[language]}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {service.videos.map((video: {url: string, alt: string}, index: number) => (
                            <div key={index} className="aspect-video">
                                <iframe
                                    src={video.url}
                                    title={video.alt}
                                    className="w-full h-full rounded-lg shadow-lg"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
