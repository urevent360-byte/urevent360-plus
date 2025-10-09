"use client";
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, LogIn, Eye, EyeOff, Shield } from 'lucide-react';
import { GoogleIcon, FacebookIcon } from '@/components/shared/icons';
import { auth } from '@/lib/firebase/authClient';
import { useAuth } from '@/contexts/AuthProvider';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof formSchema>;


export default function HostLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, isAdmin, loading } = useAuth();
  
  useEffect(() => {
    if (user && !loading) {
        if (isAdmin) {
            // This should ideally not happen if an admin uses the correct login page,
            // but as a safeguard, we redirect them to the admin portal.
            router.push('/admin/home');
        } else {
            router.push('/app/home'); 
        }
    }
  }, [user, loading, router, isAdmin]);


  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "client@urevent360.com",
      password: "password"
    }
  });
  
  const handleLoginSuccess = (email: string | null) => {
    toast({
        title: 'Success!',
        description: 'Login successful! Redirecting to your portal...',
      });
  }

  async function onSubmit(data: FormValues) {
    router.push('/app/home');
  }
  
  const handleSocialLogin = async (providerName: 'google' | 'facebook') => {
    const provider = providerName === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        handleLoginSuccess(result.user.email);
    } catch (error: any) {
      if (error.code === 'auth/configuration-not-found') {
        toast({
          title: 'Configuration Error',
          description: `The ${providerName} sign-in provider is not enabled. Please enable it in your Firebase console under Authentication > Sign-in method.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || `An unexpected error occurred during ${providerName} login.`,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary pt-8">
            <LogIn className="inline-block mr-2" />
            Host Portal
          </CardTitle>
          <CardDescription className="text-lg">
            Access your portal to manage your events.
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

            <div className="space-y-2">
               <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/app/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
               <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  aria-invalid={!!errors.password}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-full px-3"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password?.message}</p>
              )}
            </div>
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>Logging in...</>
              ) : (
                <>
                  <Mail className="mr-2" />
                  Login
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">OR</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('google')}>
              <GoogleIcon className="mr-2" />
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('facebook')}>
              <FacebookIcon className="mr-2" />
              Continue with Facebook
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/app/register" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
