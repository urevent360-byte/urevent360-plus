
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitInquiryAction } from './actions';
import { Send } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useTranslation();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90">
      {pending ? (
        <>{t('contact.submittingButton')}</>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          {t('contact.submitButton')}
        </>
      )}
    </Button>
  );
}

export default function ContactPage() {
  const { toast } = useToast();
  const { t, language } = useTranslation();
  
  const [state, formAction] = useFormState(submitInquiryAction, {
    message: '',
    errors: {},
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (state.message) {
      if (Object.keys(state.errors).length > 0 || state.message.startsWith('An unexpected')) {
        toast({
          title: t('contact.toast.error.title'),
          description: state.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('contact.toast.success.title'),
          description: t('contact.toast.success.description'),
        });
        reset();
      }
    }
  }, [state, toast, reset, t]);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <Card className="max-w-2xl mx-auto shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
            {t('contact.title')}
          </CardTitle>
          <CardDescription className="text-lg">
            {t('contact.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="languagePreference" value={language} />
            
            <div className="space-y-2">
              <Label htmlFor="name">{t('contact.nameLabel')}</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder={t('contact.namePlaceholder')}
                aria-invalid={!!errors.name}
              />
              {(errors.name || state.errors?.name) && (
                <p className="text-sm text-destructive">{errors.name?.message || state.errors?.name?.[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('contact.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder={t('contact.emailPlaceholder')}
                aria-invalid={!!errors.email}
              />
              {(errors.email || state.errors?.email) && (
                <p className="text-sm text-destructive">{errors.email?.message || state.errors?.email?.[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{t('contact.messageLabel')}</Label>
              <Textarea
                id="message"
                {...register('message')}
                placeholder={t('contact.messagePlaceholder')}
                className="min-h-[150px]"
                aria-invalid={!!errors.message}
              />
              {(errors.message || state.errors?.message) && (
                <p className="text-sm text-destructive">{errors.message?.message || state.errors?.message?.[0]}</p>
              )}
            </div>
            
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
