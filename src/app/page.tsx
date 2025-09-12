import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';
import { ClientWrapper } from '@/components/shared/ClientWrapper';

const heroImage = placeholderImages.placeholderImages.find(p => p.id === 'hero');
const experienceImages = placeholderImages.placeholderImages.filter(p => p.id.startsWith('experience-'));

const experiences = [
  {
    title: { en: "Weddings & Anniversaries", es: "Bodas y Aniversarios" },
    description: { en: "Crafting magical moments for your special day.", es: "Creando momentos mágicos para tu día especial." },
    image: experienceImages[0],
  },
  {
    title: { en: "Corporate Events", es: "Eventos Corporativos" },
    description: { en: "Professional and seamless events that impress.", es: "Eventos profesionales e impecables que impresionan." },
    image: experienceImages[1],
  },
  {
    title: { en: "Parties & Celebrations", es: "Fiestas y Celebraciones" },
    description: { en: "Unforgettable parties for any occasion.", es: "Fiestas inolvidables para cualquier ocasión." },
    image: experienceImages[2],
  },
  {
    title: { en: "Festivals & Concerts", es: "Festivales y Conciertos" },
    description: { en: "Large-scale events managed with expertise.", es: "Eventos a gran escala gestionados con pericia." },
    image: experienceImages[3],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            priority
            className="object-cover brightness-50"
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <ClientWrapper>
            {({ language }) => (
              <>
                <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-lg">
                  {language === 'en'
                    ? 'Unforgettable Events, Perfectly Planned.'
                    : 'Eventos Inolvidables, Perfectamente Planeados.'}
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-sm">
                  {language === 'en'
                    ? "UREVENT 360 PLUS brings your vision to life with passion, creativity, and precision. Let's create memories together."
                    : 'UREVENT 360 PLUS hace realidad tu visión con pasión, creatividad y precisión. Creemos recuerdos juntos.'}
                </p>
                <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                  <Link href="/contact">
                    {language === 'en' ? 'Request an Inquiry' : 'Solicitar Información'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </>
            )}
          </ClientWrapper>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <ClientWrapper>
            {({ language }) => (
              <div className="text-center mb-12">
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
                  {language === 'en' ? 'Our Experiences' : 'Nuestras Experiencias'}
                </h2>
                <p className="mt-2 text-lg text-foreground/80 max-w-3xl mx-auto">
                  {language === 'en'
                    ? 'From intimate gatherings to grand celebrations, we specialize in creating bespoke events that reflect your unique style.'
                    : 'Desde reuniones íntimas hasta grandes celebraciones, nos especializamos en crear eventos a medida que reflejan tu estilo único.'}
                </p>
              </div>
            )}
          </ClientWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {experiences.map((exp, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-500 ease-in-out group">
                <CardContent className="p-0">
                  <div className="relative h-64 w-full">
                    {exp.image && (
                      <Image
                        src={exp.image.imageUrl}
                        alt={exp.image.description}
                        fill
                        className="object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-110"
                        data-ai-hint={exp.image.imageHint}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    )}
                  </div>
                  <div className="p-6 bg-card">
                    <ClientWrapper>
                      {({ language }) => (
                        <>
                          <h3 className="font-headline text-xl font-semibold text-primary">{exp.title[language]}</h3>
                          <p className="mt-2 text-foreground/80">{exp.description[language]}</p>
                        </>
                      )}
                    </ClientWrapper>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
