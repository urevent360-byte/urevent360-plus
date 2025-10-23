
'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, LogIn, Eye, EyeOff, Home, Loader2 } from 'lucide-react';
import { GoogleIcon, FacebookIcon } from '@/components/shared/icons';
import { auth } from '@/lib/firebase/authClient';
import { useAuth } from '@/contexts/AuthProvider';

const formSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(6, 'At least 6 characters.'),
});
type FormValues = z.infer<typeof formSchema>;

export default function HostLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, isAdmin, loading } = useAuth();

  // Redirect once auth context resolves if a user is already logged in
  useEffect(() => {
    if (loading) return;
    if (!user) return;
  
    if (isAdmin) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/app/home');
    }
  }, [loading, user, isAdmin, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });
  
  const handleSuccessfulLogin = async (userCredential: UserCredential) => {
    const idTokenResult = await userCredential.user.getIdTokenResult();
    const isUserAdmin = !!idTokenResult.claims.admin;
    
    if (isUserAdmin) {
        toast({ title: 'Admin Login Success', description: 'Redirecting to your admin dashboard…' });
        router.replace('/admin/dashboard');
    } else {
        toast({ title: 'Success', description: 'Redirecting to your portal…' });
        router.replace('/app/home');
    }
  };

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      await handleSuccessfulLogin(userCredential);
    } catch (error: any) {
      let description = 'An unexpected error occurred.';
      switch (error?.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
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

  async function handleSocialLogin(kind: 'google' | 'facebook') {
    setIsSubmitting(true);
    try {
      const provider =
        kind === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await handleSuccessfulLogin(userCredential);

    } catch (error: any) {
      let description = error?.message || 'Social login failed.';
      switch (error?.code) {
        case 'auth/popup-closed-by-user':
          description = 'Login popup closed.'; break;
        case 'auth/cancelled-popup-request':
          description = 'Popup cancelled. Try again.'; break;
        case 'auth/account-exists-with-different-credential':
          description = 'Email already exists with another provider.'; break;
        case 'auth/configuration-not-found':
          description = `The ${kind} provider is not enabled in Firebase.`; break;
      }
      toast({ title: 'Error', description, variant: 'destructive' });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary pt-8">
            <LogIn className="inline-block mr-2" /> Host Portal
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
                autoComplete="username"
                inputMode="email"
                placeholder="you@example.com"
                {...register('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/app/forgot-password" className="text-sm font-medium text-primary hover:underline">
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
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting || loading} className="w-full">
              {isSubmitting || loading ? <Loader2 className="mr-2 animate-spin" /> : <Mail className="mr-2" />}
              {isSubmitting || loading ? 'Logging in…' : 'Login'}
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
            <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('google')} disabled={isSubmitting || loading}>
              <GoogleIcon className="mr-2" /> Continue with Google
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('facebook')} disabled={isSubmitting || loading}>
              <FacebookIcon className="mr-2" /> Continue with Facebook
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/app/register" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>

          <div className="mt-6 text-center">
            <Button variant="link" asChild>
              <Link href="/"><Home className="mr-2" /> Go back to landing page</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
