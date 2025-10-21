
'use client';

import { create } from 'zustand';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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
import { submitHeroInquiryAction } from '@/lib/actions/inquiry';
import { useCart } from '@/hooks/use-cart';
import { X } from 'lucide-react';

type InquiryModalStore = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

export const useOpenInquiryModal = create<InquiryModalStore>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
}));


const inquiryFormSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  email: z.string().email({ message: 'A valid email is required.' }),
  phone: z.string().optional(),
  eventType: z.string().min(2, { message: 'Event type is required.' }),
  eventDate: z.date({ required_error: 'Please select a date.' }),
  eventLocation: z.string().min(2, { message: 'Location is required.' }),
  services: z.array(z.string()).refine((value) => value.length > 0, {
    message: 'Your cart is empty.',
  }),
});

type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

export function InquiryModal() {
  const { isOpen, setOpen } = useOpenInquiryModal();
  const { toast } = useToast();
  const { items: cartItems, removeFromCart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    // Sync cart items with the form's 'services' field
    form.setValue('services', cartItems.map(item => item.slug));
  }, [cartItems, form]);

  async function onSubmit(data: InquiryFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'eventDate' && value instanceof Date) {
            formData.append(key, value.toISOString());
        } else if (key === 'services' && Array.isArray(value)) {
            value.forEach(serviceId => formData.append('services', serviceId));
        } else if (value) {
            formData.append(key, value as string);
        }
    });

    const result = await submitHeroInquiryAction(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Inquiry Submitted!',
        description:
          'Thank you for your interest. We will get back to you shortly.',
      });
      form.reset();
      clearCart();
      setOpen(false);
    } else {
      toast({
        title: 'Error',
        description: result.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>
            Send us the details of your event and we’ll get back to you shortly.
          </DialogDescription>
        </DialogHeader>

        {cartItems.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
                <p>Your inquiry cart is empty.</p>
                <Button variant="link" className="text-primary" onClick={() => setOpen(false)}>Browse Services</Button>
            </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="space-y-3">
                <h4 className="font-medium">Selected Services</h4>
                <div className="space-y-2 rounded-md border p-3 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.slug} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md object-cover" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFromCart(item.slug)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
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
                render={({ field }) => (
                    <FormItem className="hidden">
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                         <FormMessage />
                    </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
