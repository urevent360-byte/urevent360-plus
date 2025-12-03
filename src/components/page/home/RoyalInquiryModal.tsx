
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
import { useToast } from '@/hooks/use-toast';
import { useOpenRoyalInquiryModal } from '@/hooks/use-royal-inquiry-modal';
import { Textarea } from '@/components/ui/textarea';

const royalInquirySchema = z.object({
  eventType: z.string().min(2, { message: 'Event type is required.' }),
  guestCount: z.coerce.number().min(1, 'Please enter a valid guest count.'),
  zipCode: z.string().regex(/^\d{5}$/, 'Please enter a valid 5-digit ZIP code.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  notes: z.string().optional(),
});

type RoyalInquiryFormValues = z.infer<typeof royalInquirySchema>;

export function RoyalInquiryModal() {
  const { isOpen, setOpen } = useOpenRoyalInquiryModal();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RoyalInquiryFormValues>({
    resolver: zodResolver(royalInquirySchema),
    defaultValues: {
      eventType: '',
      guestCount: 50,
      zipCode: '',
      phone: '',
      notes: '',
    },
  });

  async function onSubmit(data: RoyalInquiryFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/royal/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Inquiry Submitted!',
          description: "Thank you! We will be in touch shortly to discuss your Royal Celebration Jr. party.",
        });
        form.reset();
        setOpen(false);
      } else {
        throw new Error(result.message || 'An unexpected error occurred.');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Royal Celebration Jr. Inquiry</DialogTitle>
          <DialogDescription>
            Tell us a bit about the party you're planning, and we'll get in touch to discuss the details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Event</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Birthday, Graduation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Guests</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="32801" {...field} />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any specific themes, characters, or ideas you have in mind?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
