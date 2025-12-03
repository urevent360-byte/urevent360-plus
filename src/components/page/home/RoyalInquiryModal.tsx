
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
import { useTranslation } from '@/hooks/useTranslation';

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
  const { t } = useTranslation();

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
          title: t('royalInquiryModal.toast.success.title'),
          description: t('royalInquiryModal.toast.success.description'),
        });
        form.reset();
        setOpen(false);
      } else {
        throw new Error(result.message || 'An unexpected error occurred.');
      }
    } catch (error: any) {
      toast({
        title: t('royalInquiryModal.toast.error.title'),
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
          <DialogTitle>{t('royalInquiryModal.title')}</DialogTitle>
          <DialogDescription>
            {t('royalInquiryModal.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('royalInquiryModal.eventType.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('royalInquiryModal.eventType.placeholder')} {...field} />
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
                    <FormLabel>{t('royalInquiryModal.guestCount.label')}</FormLabel>
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
                    <FormLabel>{t('royalInquiryModal.zipCode.label')}</FormLabel>
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
                  <FormLabel>{t('royalInquiryModal.phone.label')}</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder={t('royalInquiryModal.phone.placeholder')} {...field} />
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
                  <FormLabel>{t('royalInquiryModal.notes.label')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('royalInquiryModal.notes.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t('royalInquiryModal.cancelButton')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('royalInquiryModal.submittingButton') : t('royalInquiryModal.submitButton')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
