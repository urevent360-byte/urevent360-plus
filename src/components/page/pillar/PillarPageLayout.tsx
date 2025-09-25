'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, CheckCircle, Quote, Star } from 'lucide-react';
import servicesCatalog from '@/lib/services-catalog.json';
import { useOpenInquiryModal } from '@/components/page/home/InquiryModal';

type FAQItem = {
  question: string;
  answer: string;
};

type Testimonial = {
  text: string;
  author: string;
  event: string;
};

type Step = {
  title: string;
  description: string;
};

type PillarPageLayoutProps = {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  planningSteps: Step[];
  recommendedServiceIds: string[];
  faqItems: FAQItem[];
  testimonials: Testimonial[];
};

function FAQPageSchema({ items }: { items: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}


export function PillarPageLayout({
  heroTitle,
  heroSubtitle,
  heroImageUrl,
  planningSteps,
  recommendedServiceIds,
  faqItems,
  testimonials,
}: PillarPageLayoutProps) {

  const { setOpen: setInquiryOpen } = useOpenInquiryModal();

  const recommendedServices = servicesCatalog.services.filter(s => recommendedServiceIds.includes(s.id));
  
  return (
    <div className="flex flex-col">
       <FAQPageSchema items={faqItems} />

      {/* Hero Section */}
      <section className="relative flex h-[50vh] w-full items-center justify-center text-center text-white md:h-[60vh]">
        <Image
          src={heroImageUrl}
          alt={heroTitle}
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="relative z-10 mx-auto max-w-4xl p-4">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl">
            {heroTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white drop-shadow-sm md:text-xl">
            {heroSubtitle}
          </p>
          <Button size="lg" className="mt-8 bg-accent font-bold text-accent-foreground hover:bg-accent/90" onClick={() => setInquiryOpen(true)}>
            Check Availability
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* How We Plan It */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
              How We Plan Your Perfect Event
            </h2>
            <p className="mx-auto mt-2 max-w-3xl text-lg text-foreground/80">
              Our simple, collaborative process ensures a seamless experience from start to finish.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {planningSteps.map((step, index) => (
              <Card key={index} className="text-center p-6 border-0 shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-primary">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Services */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
              Recommended Services
            </h2>
             <p className="mx-auto mt-2 max-w-3xl text-lg text-foreground/80">
              Popular choices to elevate your event.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedServices.map((service) => (
              <Card key={service.id} className="group overflow-hidden border-0 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
                <Link href={`/services/${service.slug}`} className="block">
                  <div className="relative h-64 w-full">
                    <Image src={service.heroImage} alt={service.title} fill className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="font-headline text-xl font-semibold text-primary">{service.title}</h3>
                    <p className="mt-2 text-gray-700 h-16">{service.shortDescription}</p>
                    <div className="mt-4 text-accent font-semibold flex items-center">
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
       <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                    What Our Clients Say
                </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                <Card key={index} className="flex flex-col justify-between text-left shadow-lg border-0 bg-white p-6">
                    <div>
                    <Quote className="h-10 w-10 text-primary/20" />
                    <p className="mt-4 text-gray-700 italic">
                        "{testimonial.text}"
                    </p>
                    </div>
                    <div className="mt-6">
                    <p className="font-semibold text-primary">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.event}</p>
                    </div>
                </Card>
                ))}
            </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">
            Ready to Create an Unforgettable Event?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
            Let's discuss your vision and make it a reality. Contact us today for a personalized quote and check our availability.
          </p>
          <Button size="lg" className="mt-8 bg-white text-primary hover:bg-white/90 font-bold" onClick={() => setInquiryOpen(true)}>
            Get Your Free Quote
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

    </div>
  );
}
