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

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90">
      {pending ? (
        <>Sending...</>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Send Inquiry
        </>
      )}
    </Button>
  );
}

export default function ContactPage() {
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
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success!',
          description: 'Inquiry sent successfully! We will get in touch with you soon.',
        });
        reset();
      }
    }
  }, [state, toast, reset]);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <Card className="max-w-2xl mx-auto shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
            Request an Inquiry
          </CardTitle>
          <CardDescription className="text-lg">
            Have a question or want to start planning your event? Fill out the form below and we'll get back to you shortly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="languagePreference" value="en" />
            
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="John Doe"
                aria-invalid={!!errors.name}
              />
              {(errors.name || state.errors?.name) && (
                <p className="text-sm text-destructive">{errors.name?.message || state.errors?.name?.[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john.doe@example.com"
                aria-invalid={!!errors.email}
              />
              {(errors.email || state.errors?.email) && (
                <p className="text-sm text-destructive">{errors.email?.message || state.errors?.email?.[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                {...register('message')}
                placeholder="Tell us about your event..."
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
