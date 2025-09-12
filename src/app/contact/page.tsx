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
import { useLanguage } from '@/contexts/LanguageProvider';
import { translations } from '@/lib/translations';
import { submitInquiryAction } from './actions';
import { Send } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  const { language } = useLanguage();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90">
      {pending ? (
        <>{language === 'en' ? 'Sending...' : 'Enviando...'}</>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          {translations.contactPage.submitButton[language]}
        </>
      )}
    </Button>
  );
}

export default function ContactPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  
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
          title: language === 'en' ? 'Error' : 'Error',
          description: state.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: language === 'en' ? 'Success!' : '¡Éxito!',
          description: translations.contactPage.successMessage[language],
        });
        reset();
      }
    }
  }, [state, toast, language, reset]);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <Card className="max-w-2xl mx-auto shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
            {translations.contactPage.title[language]}
          </CardTitle>
          <CardDescription className="text-lg">
            {translations.contactPage.description[language]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="languagePreference" value={language} />
            
            <div className="space-y-2">
              <Label htmlFor="name">{translations.contactPage.nameLabel[language]}</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder={translations.contactPage.namePlaceholder[language]}
                aria-invalid={!!errors.name}
              />
              {(errors.name || state.errors?.name) && (
                <p className="text-sm text-destructive">{errors.name?.message || state.errors?.name?.[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{translations.contactPage.emailLabel[language]}</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder={translations.contactPage.emailPlaceholder[language]}
                aria-invalid={!!errors.email}
              />
              {(errors.email || state.errors?.email) && (
                <p className="text-sm text-destructive">{errors.email?.message || state.errors?.email?.[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{translations.contactPage.messageLabel[language]}</Label>
              <Textarea
                id="message"
                {...register('message')}
                placeholder={translations.contactPage.messagePlaceholder[language]}
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
