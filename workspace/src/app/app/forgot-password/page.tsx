"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import { forgotPasswordAction } from './actions';
import { auth } from '@/lib/firebase/authClient';

const formSchema = z.object({
  email: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;


export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('email', data.email);

    const result = await forgotPasswordAction(formData);
    
    if (result.success) {
        toast({
            title: 'Check Your Email',
            description: 'If an account exists for that email, a password reset link has been sent.',
        });
    } else {
        toast({
            title: 'Error',
            description: result.message,
            variant: 'destructive',
        });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
            <KeyRound className="inline-block mr-2" />
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-lg">
            Enter your email and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email?.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>Sending...</>
              ) : (
                <>
                  <Mail className="mr-2" />
                  Send Reset Link
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
             <Button variant="link" asChild>
                <Link href="/app/login">
                    <ArrowLeft className="mr-2" />
                    Back to Login
                </Link>
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
