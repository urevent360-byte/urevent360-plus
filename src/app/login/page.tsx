'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageProvider';
import { translations } from '@/lib/translations';
import { loginAction, socialLoginAction } from './actions';
import { Mail, LogIn } from 'lucide-react';
import { GoogleIcon, FacebookIcon } from '@/components/shared/icons';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof formSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  const { language } = useLanguage();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>{language === 'en' ? 'Logging in...' : 'Iniciando sesión...'}</>
      ) : (
        <>
          <Mail className="mr-2" />
          {translations.auth.loginButton[language]}
        </>
      )}
    </Button>
  );
}

export default function LoginPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  
  const [state, formAction] = useFormState(loginAction, {
    message: '',
    errors: {},
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (state.message) {
      if (Object.keys(state.errors).length > 0) {
        toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success!',
          description: state.message,
        });
        router.push('/dashboard');
      }
    }
  }, [state, toast, router]);
  
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    const error = await socialLoginAction(provider);
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    } else {
       router.push('/dashboard');
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
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{translations.auth.emailLabel[language]}</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                aria-invalid={!!errors.email || !!state.errors?.email}
              />
              {(errors.email || state.errors?.email) && (
                <p className="text-sm text-destructive">{errors.email?.message || state.errors?.email?.[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{translations.auth.passwordLabel[language]}</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                aria-invalid={!!errors.password || !!state.errors?.password}
              />
              {(errors.password || state.errors?.password) && (
                <p className="text-sm text-destructive">{errors.password?.message || state.errors?.password?.[0]}</p>
              )}
            </div>
            
            <SubmitButton />
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
