'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Send, PartyPopper, Calendar, Users, MapPin } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import servicesCatalog from '@/lib/services-catalog.json';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { createLeadAction } from '@/app/app/events/new/actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const planSchema = z.object({
  eventType: z.string().min(2, 'Event type is required'),
  eventDate: z.date({ required_error: 'An event date is required.' }),
  guestCount: z.coerce.number().min(1, 'At least one guest is required'),
  location: z.string().min(2, 'City or ZIP code is required'),
  venue: z.string().optional(),
  name: z.string().min(2, 'Your full name is required'),
  email: z.string().email('A valid email is required'),
  phone: z.string().optional(),
});

type PlanFormValues = z.infer<typeof planSchema>;

const steps = [
  { id: 1, title: 'Event Basics', icon: <PartyPopper />, fields: ['eventType', 'guestCount'] },
  { id: 2, title: 'Date & Location', icon: <Calendar />, fields: ['eventDate', 'location', 'venue'] },
  { id: 3, title: 'Your Contact Info', icon: <Users />, fields: ['name', 'email', 'phone'] },
];

const recommendedServices = servicesCatalog.services.filter(s => ['360-photo-booth', 'magic-mirror', 'led-tunnel-neon-tubes', 'la-hora-loca-led-robot'].includes(s.id));

const faqItems = [
  {
    question: "What happens after I submit my plan?",
    answer: "Our team will review your event details and the services you're interested in. We'll then contact you via email with a personalized quote and confirmation of our availability for your date. There's no commitment until you approve the quote."
  },
  {
    question: "Can I change my requested services later?",
    answer: "Absolutely! The services you select here are just to give us an idea of what you're looking for. We can always add, remove, or change services when we finalize your booking."
  },
  {
    question: "Is the quote free?",
    answer: "Yes, the quote is completely free and there is no obligation to book. It's our way of helping you understand the options and budget for your perfect event."
  }
];

function FAQPageSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
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


export default function PlanMyEventPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      guestCount: 100
    }
  });

  const { trigger, getValues, control, handleSubmit } = form;

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const isValid = await trigger(fields as (keyof PlanFormValues)[]);
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: PlanFormValues) => {
    setIsSubmitting(true);
    
    // Convert form data to what createLeadAction expects
    const leadData = {
        hostEmail: data.email,
        name: `${data.name}'s ${data.eventType}`,
        type: data.eventType,
        guestCount: data.guestCount,
        date: data.eventDate,
        timeWindow: 'To be determined',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        venueName: data.venue || data.location,
        address: data.location,
        city: data.location.split(',')[0] || data.location,
        state: data.location.split(',')[1]?.trim() || '',
        zip: '',
        onsiteContactName: data.name,
        onsiteContactPhone: data.phone || '',
        notes: `Lead generated from "Plan My Event" wizard. Venue: ${data.venue || 'Not specified'}.`,
        requestedServices: recommendedServices.map(s => ({
            serviceId: s.id,
            title: s.label,
            qty: 1,
            notes: 'Recommended from wizard'
        }))
    };

    const result = await createLeadAction(leadData);

    if (result.success) {
        toast({
            title: "Plan Submitted!",
            description: "We've received your event plan and will be in touch with a quote shortly."
        });
        setCurrentStep(prev => prev + 1); // Move to a final "Thank You" step
    } else {
        toast({
            title: "Submission Failed",
            description: result.message || "There was an error submitting your plan. Please try again.",
            variant: "destructive"
        });
    }

    setIsSubmitting(false);
  };
  
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <FAQPageSchema />
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
          Plan My Event in Orlando
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          Let's build the perfect package for your special occasion. Follow these simple steps and we'll send you a personalized quote.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="flex items-center gap-2">
            {steps[currentStep]?.icon}
            {steps[currentStep]?.title || 'Review Your Plan'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 0 && (
                <div className="space-y-4">
                  <Label>What type of event are you planning?</Label>
                  <Input {...form.register('eventType')} placeholder="e.g., Wedding, Quinceañera, Corporate Gala" />
                  {form.formState.errors.eventType && <p className="text-sm text-destructive">{form.formState.errors.eventType.message}</p>}

                  <Label>How many guests are you expecting?</Label>
                  <Input type="number" {...form.register('guestCount')} />
                  {form.formState.errors.guestCount && <p className="text-sm text-destructive">{form.formState.errors.guestCount.message}</p>}
                </div>
            )}
            {currentStep === 1 && (
                <div className="space-y-4">
                  <Controller
                    control={control}
                    name="eventDate"
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label>When is the big day?</Label>
                        <DatePicker date={field.value} onDateChange={field.onChange} />
                        {form.formState.errors.eventDate && <p className="text-sm text-destructive">{form.formState.errors.eventDate.message}</p>}
                      </div>
                    )}
                  />
                  <Label>What city or ZIP code is your event in?</Label>
                  <Input {...form.register('location')} placeholder="Orlando, FL or 32801" />
                   {form.formState.errors.location && <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>}

                  <Label>Venue Name (optional)</Label>
                  <Input {...form.register('venue')} placeholder="e.g., The Grand Ballroom" />
                </div>
            )}
            {currentStep === 2 && (
                 <div className="space-y-4">
                    <Label>Your Full Name</Label>
                    <Input {...form.register('name')} placeholder="John Doe" />
                    {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}

                    <Label>Your Email Address</Label>
                    <Input type="email" {...form.register('email')} placeholder="you@example.com" />
                    {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
                    
                    <Label>Phone Number (optional)</Label>
                    <Input type="tel" {...form.register('phone')} placeholder="(555) 123-4567" />
                 </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Plan Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2"><PartyPopper className="text-muted-foreground"/><strong>Event:</strong> {getValues('eventType')}</div>
                        <div className="flex items-center gap-2"><Users className="text-muted-foreground"/><strong>Guests:</strong> ~{getValues('guestCount')}</div>
                        <div className="flex items-center gap-2"><Calendar className="text-muted-foreground"/><strong>Date:</strong> {getValues('eventDate')?.toLocaleDateString()}</div>
                        <div className="flex items-center gap-2"><MapPin className="text-muted-foreground"/><strong>Location:</strong> {getValues('location')}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recommended Services</CardTitle>
                        <CardDescription>Based on your event, here are some popular services. We'll include these in your initial quote.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {recommendedServices.map(service => (
                            <Link href={`/services/${service.slug}`} key={service.id} target="_blank">
                                <Card className="h-full hover:shadow-md transition-shadow">
                                    <Image src={service.heroImage} alt={service.label} width={200} height={150} className="rounded-t-lg object-cover aspect-video w-full" />
                                    <p className="text-xs font-semibold p-2 text-center">{service.label}</p>
                                </Card>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
              </div>
            )}
            
             {currentStep === 4 && (
                <div className="text-center py-12">
                    <PartyPopper className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Thank You!</h2>
                    <p className="text-muted-foreground mt-2">Your event plan has been submitted. Our team will contact you shortly with a personalized quote.</p>
                    <Button asChild className="mt-6">
                        <Link href="/services">Explore More Services</Link>
                    </Button>
                </div>
            )}


            <div className="flex justify-between mt-8">
              {currentStep > 0 && currentStep <= steps.length && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2" /> Previous
                </Button>
              )}
              {currentStep < steps.length -1 && (
                <Button type="button" onClick={nextStep}>
                  Next <ArrowRight className="ml-2" />
                </Button>
              )}
               {currentStep === steps.length && (
                 <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Get My Quote'} <Send className="ml-2"/>
                 </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      
      <section className="py-16 md:py-24 max-w-3xl mx-auto">
        <h2 className="text-center font-headline text-3xl font-bold text-primary md:text-4xl mb-8">
          Planning FAQ
        </h2>
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
    </section>
    </div>
  );
}
