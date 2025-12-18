
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createLeadAction } from './actions';
import { useAuth } from '@/contexts/AuthProvider';
import servicesCatalog from '@/lib/services-catalog.json';

const allServices = servicesCatalog.services.map(s => ({
    id: s.id,
    title: s.label,
}));

const formSchema = z.object({
  name: z.string().min(2, 'Event name is required'),
  type: z.string().min(2, 'Event type is required'),
  guestCount: z.coerce.number().min(1, 'Must be at least 1'),
  date: z.date(),
  timeWindow: z.string().min(1, 'Time window is required'),
  timeZone: z.string().optional(),
  venueName: z.string().min(2, 'Venue name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(5, 'ZIP code is required'),
  onsiteContactName: z.string().min(2, 'Contact name is required'),
  onsiteContactPhone: z.string().min(10, 'A valid phone number is required'),
  notes: z.string().optional(),
  requestedServices: z.array(z.object({
      serviceId: z.string(),
      title: z.string(),
      qty: z.number(),
      notes: z.string().optional(),
  })).min(1, 'Please select at least one service'),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
    { id: 'event-details', title: 'Event Details', fields: ['name', 'type', 'guestCount'] },
    { id: 'date-time', title: 'Date & Time', fields: ['date', 'timeWindow', 'timeZone'] },
    { id: 'venue', title: 'Venue', fields: ['venueName', 'address', 'city', 'state', 'zip'] },
    { id: 'contact', title: 'On-site Contact', fields: ['onsiteContactName', 'onsiteContactPhone'] },
    { id: 'services', title: 'Services', fields: ['requestedServices'] },
    { id: 'review', title: 'Review & Submit', fields: ['notes'] },
];

export default function NewEventPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            guestCount: 100,
            requestedServices: [],
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
    });

    const { register, handleSubmit, trigger, getValues, watch } = form;
    const watchedServices = watch('requestedServices');

    const nextStep = async () => {
        const fields = steps[currentStep].fields;
        const output = await trigger(fields as any, { shouldFocus: true });
        if (!output) return;

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        const result = await createLeadAction({
            ...data,
            hostId: user?.uid,
            hostEmail: user?.email || '',
        });
        
        if (result.success) {
            toast({
                title: 'Inquiry Sent!',
                description: "We've received your event details and will be in touch soon with a quote."
            });
            // router.push('/app/my-events');
        } else {
            toast({
                title: 'Error',
                description: result.message || 'There was a problem submitting your inquiry.',
                variant: 'destructive'
            });
        }
        setIsSubmitting(false);
    };
    
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold tracking-tight">Create a New Event Inquiry</h1>
                <p className="text-muted-foreground">Fill out the details below to get a quote for your event.</p>
            </div>

            <Card>
                <CardHeader>
                    <Progress value={progress} className="mb-4" />
                    <CardTitle>{steps[currentStep].title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {currentStep === 0 && (
                             <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Event Name</Label>
                                    <Input {...register('name')} placeholder="e.g., Jane's Sweet 16" />
                                    {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Event Type</Label>
                                    <Input {...register('type')} placeholder="e.g., Quinceañera, Wedding, Corporate" />
                                    {form.formState.errors.type && <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>}
                                </div>
                                 <div className="space-y-2">
                                    <Label>Estimated Guest Count</Label>
                                    <Input type="number" {...register('guestCount')} />
                                    {form.formState.errors.guestCount && <p className="text-sm text-destructive">{form.formState.errors.guestCount.message}</p>}
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-4">
                                 <div className="space-y-2">
                                    <Label>Event Date</Label>
                                    <DatePicker date={getValues('date')} onDateChange={(date) => form.setValue('date', date!, { shouldValidate: true })} />
                                     {form.formState.errors.date && <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Time Window</Label>
                                    <Input {...register('timeWindow')} placeholder="e.g., 7 PM - 11 PM" />
                                     {form.formState.errors.timeWindow && <p className="text-sm text-destructive">{form.formState.errors.timeWindow.message}</p>}
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                             <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Venue Name</Label>
                                    <Input {...register('venueName')} placeholder="e.g., The Grand Hall" />
                                    {form.formState.errors.venueName && <p className="text-sm text-destructive">{form.formState.errors.venueName.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Venue Address</Label>
                                    <Input {...register('address')} placeholder="123 Main Street" />
                                     {form.formState.errors.address && <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>}
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>City</Label>
                                        <Input {...register('city')} placeholder="Orlando" />
                                        {form.formState.errors.city && <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>State</Label>
                                        <Input {...register('state')} placeholder="FL" />
                                        {form.formState.errors.state && <p className="text-sm text-destructive">{form.formState.errors.state.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ZIP Code</Label>
                                        <Input {...register('zip')} placeholder="32801" />
                                        {form.formState.errors.zip && <p className="text-sm text-destructive">{form.formState.errors.zip.message}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>On-site Contact Person</Label>
                                    <Input {...register('onsiteContactName')} placeholder="Name of person in charge on event day" />
                                     {form.formState.errors.onsiteContactName && <p className="text-sm text-destructive">{form.formState.errors.onsiteContactName.message}</p>}
                                </div>
                                 <div className="space-y-2">
                                    <Label>On-site Contact Phone</Label>
                                    <Input type="tel" {...register('onsiteContactPhone')} placeholder="(123) 456-7890" />
                                     {form.formState.errors.onsiteContactPhone && <p className="text-sm text-destructive">{form.formState.errors.onsiteContactPhone.message}</p>}
                                </div>
                            </div>
                        )}

                         {currentStep === 4 && (
                            <div>
                                <Label>Requested Services</Label>
                                <p className="text-sm text-muted-foreground mb-2">Select all services you are interested in.</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {allServices.map(service => (
                                        <div key={service.id} className="flex items-center space-x-2 border p-3 rounded-md">
                                            <Checkbox
                                                id={service.id}
                                                checked={watchedServices.some(s => s.serviceId === service.id)}
                                                onCheckedChange={(checked) => {
                                                    const currentServices = getValues('requestedServices');
                                                    if (checked) {
                                                        form.setValue('requestedServices', [...currentServices, { serviceId: service.id, title: service.title, qty: 1 }]);
                                                    } else {
                                                        form.setValue('requestedServices', currentServices.filter(s => s.serviceId !== service.id));
                                                    }
                                                }}
                                            />
                                            <label htmlFor={service.id} className="text-sm font-medium leading-none">
                                                {service.title}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {form.formState.errors.requestedServices && <p className="text-sm text-destructive mt-2">{form.formState.errors.requestedServices.message}</p>}
                            </div>
                        )}
                        
                        {currentStep === 5 && (
                            <div className="space-y-4">
                                <p>You&apos;re almost done! Please review the details on the previous pages. Add any additional notes below.</p>
                                <div className="space-y-2">
                                    <Label>Additional Notes</Label>
                                    <Textarea {...register('notes')} placeholder="Is there anything else we should know?" />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between mt-8">
                            {currentStep > 0 && (
                                <Button type="button" variant="outline" onClick={prevStep}>
                                    <ArrowLeft className="mr-2" /> Previous
                                </Button>
                            )}
                            <div />
                            {currentStep < steps.length - 1 && (
                                <Button type="button" onClick={nextStep}>
                                    Next <ArrowRight className="ml-2" />
                                </Button>
                            )}
                             {currentStep === steps.length - 1 && (
                                <Button type="submit" disabled={isSubmitting}>
                                     {isSubmitting ? 'Submitting...' : 'Submit Inquiry'} <Send className="ml-2" />
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
