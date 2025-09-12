'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageProvider';
import { translations } from '@/lib/translations';
import { Mail, LogIn } from 'lucide-react';
import { GoogleIcon, FacebookIcon } from '@/components/shared/icons';
import { auth } from '@/lib/firebase/client';
import { useAuth } from '@/contexts/AuthProvider';

const ADMIN_EMAIL = 'admin@example.com';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof formSchema>;


export default function LoginPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  
  const handleLoginSuccess = (email: string | null) => {
    toast({
        title: 'Success!',
        description: 'Login successful!',
      });
    
    if (email === ADMIN_EMAIL) {
      router.push('/admin/leads');
    } else {
      router.push('/dashboard');
    }
  }

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      handleLoginSuccess(data.email);
    } catch (error: any) {
       toast({
          title: 'Error',
          description: error.message || 'Login failed. Please check your credentials.',
          variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  const handleSocialLogin = async (providerName: 'google' | 'facebook') => {
    const provider = providerName === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        handleLoginSuccess(result.user.email);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `An unexpected error occurred during ${providerName} login.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex items-center justify-center">
      <Card className="max-w-md w-full shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
            <LogIn className="inline-block mr-2" />
            {translations.auth.loginTitle[language]}
          </CardTitle>
          <CardDescription className="text-lg">
            {translations.auth.loginDescription[language]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{translations.auth.emailLabel[language]}</Label>
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
              <Label htmlFor="password">{translations.auth.passwordLabel[language]}</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password?.message}</p>
              )}
            </div>
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>{language === 'en' ? 'Logging in...' : 'Iniciando sesión...'}</>
              ) : (
                <>
                  <Mail className="mr-2" />
                  {translations.auth.loginButton[language]}
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">{translations.auth.orSeparator[language]}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('google')}>
              <GoogleIcon className="mr-2" />
              {translations.auth.googleLoginButton[language]}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('facebook')}>
              <FacebookIcon className="mr-2" />
              {translations.auth.facebookLoginButton[language]}
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {translations.auth.noAccount[language]}{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              {translations.auth.signUp[language]}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
