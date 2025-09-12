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
import Link from 'next/link';
import { Mail, Tag, ShoppingCart, Video } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const placeholderServicesData: any = {
    '360-photo-booth': {
        slug: '360-photo-booth',
        name: { en: '360 Photo Booth', es: 'Cabina de Fotos 360' },
        longDescription: { en: 'Ultra-realistic photo of a glamorous quinceañera party with a group of friends standing on a modern 360 photo booth platform. Camera capturing them mid-dance, with confetti in the air, LED lights glowing around the booth. Guests smiling and posing while the rotating arm records. Elegant ballroom background with balloons and luxury decorations.', es: 'Foto ultra realista de una glamorosa fiesta de quinceañera con un grupo de amigos en una moderna plataforma de cabina de fotos 360. La cámara los captura en medio del baile, con confeti en el aire y luces LED brillando alrededor de la cabina. Los invitados sonríen y posan mientras el brazo giratorio graba. Fondo elegante de salón de baile con globos y decoraciones de lujo.' },
        images: [
            'https://picsum.photos/seed/service1-1/800/600',
            'https://picsum.photos/seed/service1-2/800/600',
            'https://picsum.photos/seed/service1-3/800/600',
        ],
        videos: [
            { url: 'https://www.youtube.com/embed/5_v634-9W3E', alt: '360 Photo Booth Sample Video' }
        ],
        keywords: ['360 photo booth', 'video booth', 'quinceañera', 'event entertainment', 'social media booth'],
    },
    'photo-booth-printer': {
        slug: 'photo-booth-printer',
        name: { en: 'Photo Booth Printer', es: 'Impresora para Cabina de Fotos' },
        longDescription: { en: 'Wedding reception scene with guests receiving glossy printed photo strips from a sleek photo booth printer. Close-up of a guest holding the photo smiling, showing the custom wedding logo on the print. Warm fairy lights and flowers in the background.', es: 'Escena de recepción de boda con invitados recibiendo tiras de fotos brillantes impresas desde una elegante impresora de cabina de fotos. Primer plano de un invitado sonriendo sosteniendo la foto, mostrando el logo de boda personalizado en la impresión. Luces cálidas y flores en el fondo.' },
        images: [
            'https://picsum.photos/seed/service2-1/800/600',
            'https://picsum.photos/seed/service2-2/800/600',
        ],
        keywords: ['photo printer', 'instant prints', 'wedding souvenirs', 'custom photos'],
    },
     'magic-mirror': {
        slug: 'magic-mirror',
        name: { en: 'Magic Mirror', es: 'Espejo Mágico' },
        longDescription: { en: 'Elegant event with a tall Magic Mirror photo booth glowing with golden animations. Guests interacting with the mirror, touching the screen with bright effects appearing. Reflection of people smiling in the mirror. Luxury ballroom background with chandeliers.', es: 'Evento elegante con una alta cabina de fotos Magic Mirror brillando con animaciones doradas. Invitados interactuando con el espejo, tocando la pantalla con efectos brillantes apareciendo. Reflejo de personas sonriendo en el espejo. Fondo de salón de baile de lujo con candelabros.' },
        images: [
            'https://picsum.photos/seed/service3-1/800/600',
            'https://picsum.photos/seed/service3-2/800/600',
        ],
        keywords: ['magic mirror', 'selfie mirror', 'photo booth', 'interactive entertainment'],
    },
    'la-hora-loca-led-robot': {
        slug: 'la-hora-loca-led-robot',
        name: { en: 'La Hora Loca with LED Robot', es: 'La Hora Loca con Robot LED' },
        longDescription: { en: 'Epic party photo of a giant LED robot dancing in the middle of a packed dance floor, surrounded by excited guests holding LED sticks. Robot glowing in vibrant neon lights, CO2 smoke jets shooting in the air. Samba dancers in colorful costumes join the show.', es: 'Foto épica de fiesta de un robot LED gigante bailando en medio de una pista de baile llena, rodeado de invitados emocionados sosteniendo varas de LED. El robot brilla con luces de neón vibrantes, chorros de humo de CO2 disparándose al aire. Bailarines de samba con trajes coloridos se unen al espectáculo.' },
        images: [
            'https://picsum.photos/seed/service4-1/800/600',
            'https://picsum.photos/seed/service4-2/800/600',
        ],
        keywords: ['la hora loca', 'LED robot', 'party entertainment', 'samba dancers', 'CO2 jets'],
    },
    'cold-sparklers': {
        slug: 'cold-sparklers',
        name: { en: 'Cold Sparklers', es: 'Chispas Frías' },
        longDescription: { en: 'Romantic wedding photo of bride and groom’s first dance with golden cold sparklers shooting dramatically around them. Slow exposure effect with sparkling trails glowing in the air. Guests clapping in the background, elegant ballroom setting with soft lighting.', es: 'Foto romántica de boda del primer baile de los novios con chispas frías doradas disparándose dramáticamente a su alrededor. Efecto de exposición lenta con estelas brillantes en el aire. Invitados aplaudiendo en el fondo, elegante salón de baile con iluminación suave.' },
        images: [
            'https://picsum.photos/seed/service5-1/800/600',
            'https://picsum.photos/seed/service5-2/800/600',
        ],
        keywords: ['cold sparklers', 'wedding first dance', 'special effects', 'indoor fireworks'],
    },
    'dance-on-the-clouds': {
        slug: 'dance-on-the-clouds',
        name: { en: 'Dance on the Clouds', es: 'Baile en las Nubes' },
        longDescription: { en: 'Cinematic wedding photo of a bride and groom dancing surrounded by a thick dreamy cloud effect covering the floor. Couple illuminated by soft spotlights above, giving the impression they are floating. Elegant ballroom background with guests watching in awe.', es: 'Foto cinematográfica de boda de un novio y una novia bailando rodeados de un espeso y soñador efecto de nube que cubre el suelo. La pareja está iluminada por focos suaves desde arriba, dando la impresión de que están flotando. Fondo de salón de baile elegante con invitados observando con asombro.' },
        images: [
            'https://picsum.photos/seed/service6-1/800/600',
            'https://picsum.photos/seed/service6-2/800/600',
        ],
        keywords: ['dance on clouds', 'dry ice effect', 'wedding first dance', 'magical atmosphere'],
    },
    'projector-slideshows-videos': {
        slug: 'projector-slideshows-videos',
        name: { en: 'Projector (Slideshows & Videos)', es: 'Proyector (Presentaciones y Videos)' },
        longDescription: { en: 'Wedding reception image showing a large projector screen with a slideshow of bride and groom’s childhood photos. Guests seated at elegant tables smiling and reacting emotionally. Warm lighting, elegant ballroom decoration.', es: 'Imagen de recepción de boda que muestra una gran pantalla de proyector con una presentación de diapositivas de fotos de la infancia de los novios. Invitados sentados en mesas elegantes sonriendo y reaccionando emocionalmente. Iluminación cálida, decoración elegante de salón de baile.' },
        images: [
            'https://picsum.photos/seed/service7-1/800/600',
            'https://picsum.photos/seed/service7-2/800/600',
        ],
        keywords: ['projector rental', 'slideshow', 'video projection', 'event visuals'],
    },
    'monogram-projector': {
        slug: 'monogram-projector',
        name: { en: 'Monogram Projector', es: 'Proyector de Monograma' },
        longDescription: { en: 'Photo of a luxury wedding dance floor with a glowing custom monogram projection on the floor in gold and white light. Initials of bride and groom with elegant floral patterns. Cinematic angle showing guests admiring it.', es: 'Foto de una lujosa pista de baile de boda con una brillante proyección de monograma personalizado en el suelo con luz dorada y blanca. Iniciales de los novios con elegantes patrones florales. Ángulo cinematográfico que muestra a los invitados admirándolo.' },
        images: [
            'https://picsum.photos/seed/service8-1/800/600',
            'https://picsum.photos/seed/service8-2/800/600',
        ],
        keywords: ['monogram projection', 'gobo', 'wedding lighting', 'custom logo'],
    },
    'led-screens-wall': {
        slug: 'led-screens-wall',
        name: { en: 'LED Screens Wall', es: 'Pared de Pantallas LED' },
        longDescription: { en: 'Grand wedding stage setup with a massive LED screen wall showing vibrant visuals and the couple’s names in glowing animated letters. Guests dancing in front of the screen, silhouettes lit by colorful lights.', es: 'Gran montaje de escenario de boda con una enorme pared de pantallas LED que muestra visuales vibrantes y los nombres de la pareja en letras animadas y brillantes. Invitados bailando frente a la pantalla, siluetas iluminadas por luces de colores.' },
        images: [
            'https://picsum.photos/seed/service9-1/800/600',
            'https://picsum.photos/seed/service9-2/800/600',
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
        addToCart: { en: 'Add to Cart', es: 'Añadir al Carrito' },
        keywords: { en: 'Keywords', es: 'Palabras Clave' },
        videosTitle: { en: 'See It In Action', es: 'Míralo en Acción' },
    };

    const handleAddToCart = () => {
        addToCart({
            slug: service.slug,
            name: service.name.en,
            image: service.images[0]
        });
        toast({
            title: 'Added to cart!',
            description: `${service.name[language]} has been added to your inquiry cart.`,
        });
    }

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                     <Carousel className="w-full">
                        <CarouselContent>
                            {service.images.map((img: string, index: number) => (
                            <CarouselItem key={index}>
                                <div className="relative aspect-video">
                                <Image
                                    src={img}
                                    alt={`${service.name[language]} - Image ${index + 1}`}
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
