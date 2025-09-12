'use client';

import { create } from 'zustand';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/hooks/use-toast';
import { submitHeroInquiryAction } from '@/app/actions/inquiry';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageProvider';

type InquiryModalStore = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

export const useOpenInquiryModal = create<InquiryModalStore>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
}));

const services = [
  '360 Photo Booth',
  'Magic Mirror',
  'La Hora Loca',
  'Cold Sparklers',
  'DJ Services',
  'Other',
];

const inquiryFormSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  email: z.string().email({ message: 'A valid email is required.' }),
  phone: z.string().optional(),
  eventType: z.string().min(2, { message: 'Event type is required.' }),
  eventDate: z.date({ required_error: 'Please select a date.' }),
  eventLocation: z.string().min(2, { message: 'Location is required.' }),
  services: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one service.',
  }),
});

type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit Inquiry'}
    </Button>
  );
}

export function InquiryModal() {
  const { isOpen, setOpen } = useOpenInquiryModal();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      eventType: '',
      eventLocation: '',
      services: [],
    },
  });

  async function onSubmit(data: InquiryFormValues) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'eventDate' && value instanceof Date) {
            formData.append(key, value.toISOString());
        } else if (key === 'services' && Array.isArray(value)) {
            value.forEach(service => formData.append('services', service));
        } else if (value) {
            formData.append(key, value as string);
        }
    });

    const result = await submitHeroInquiryAction(formData);

    if (result.success) {
      toast({
        title: 'Inquiry Submitted!',
        description:
          'Thank you for your interest. We will get back to you shortly.',
      });
      form.reset();
      setOpen(false);
    } else {
      setFormError(result.message || 'An unexpected error occurred.');
    }
  }

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setFormError(null);
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Request an Inquiry</DialogTitle>
          <DialogDescription>
            Tell us about your event and we'll get back to you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="eventType"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Type of Event</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Wedding" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                        <FormItem className='flex flex-col pt-2'>
                             <FormLabel className='mb-2'>Event Date</FormLabel>
                            <DatePicker date={field.value} onDateChange={field.onChange} />
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="eventLocation"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Event Location</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., Miami, FL" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            
            <FormField
              control={form.control}
              name="services"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Services of Interest</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                  {services.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="services"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />


            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <SubmitButton />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
