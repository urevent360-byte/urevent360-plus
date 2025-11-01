
'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, LogIn, Eye, EyeOff, Home, Loader2, User } from 'lucide-react';
import { auth } from '@/lib/firebase/authClient';
import { useAuth } from '@/contexts/AuthProvider';

const formSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(6, 'At least 6 characters.'),
});
type FormValues = z.infer<typeof formSchema>;

export default function AdminLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: 'info@urevent360.com', password: '' },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // The AuthProvider will handle the redirect upon successful auth state change.
      toast({ title: 'Login successful!', description: 'Checking credentials and redirecting...' });

    } catch (error: any) {
      let description = 'An unexpected error occurred.';
      switch (error?.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          description = 'Incorrect email or password.'; break;
        case 'auth/too-many-requests':
          description = 'Too many attempts. Please try again later.'; break;
        case 'auth/network-request-failed':
          description = 'Network error. Check your connection.'; break;
        default:
          description = error?.message || description; break;
      }
      toast({ title: 'Login Failed', description, variant: 'destructive' });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div id="recaptcha-container" />
      <Card className="max-w-md w-full shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary pt-8">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-lg">
            Access the UREVENT 360 PLUS dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="admin@urevent360.com"
                {...register('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/admin/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  aria-invalid={!!errors.password}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-full px-3"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting || loading} className="w-full">
              {isSubmitting || loading ? <Loader2 className="mr-2 animate-spin" /> : <Mail className="mr-2" />}
              {isSubmitting || loading ? 'Logging in…' : 'Login with Email'}
            </Button>
          </form>
          <div className="mt-6 text-center space-y-2">
            <Button variant="link" asChild>
              <Link href="/">
                <Home className="mr-2" />
                Go back to landing page
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
