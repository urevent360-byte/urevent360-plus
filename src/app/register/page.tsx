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
import { registerAction } from './actions';
import { UserPlus } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string().min(6),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  const { language } = useLanguage();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>{language === 'en' ? 'Creating account...' : 'Creando cuenta...'}</>
      ) : (
        <>
          <UserPlus className="mr-2" />
          {translations.auth.registerButton[language]}
        </>
      )}
    </Button>
  );
}

export default function RegisterPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();

  const [state, formAction] = useFormState(registerAction, {
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

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex items-center justify-center">
      <Card className="max-w-md w-full shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
            {translations.auth.registerTitle[language]}
          </CardTitle>
          <CardDescription className="text-lg">
            {translations.auth.registerDescription[language]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{translations.auth.nameLabel[language]}</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder={language === 'en' ? 'John Doe' : 'Juan Pérez'}
                aria-invalid={!!errors.name || !!state.errors?.name}
              />
              {(errors.name || state.errors?.name) && (
                <p className="text-sm text-destructive">{errors.name?.message || state.errors?.name?.[0]}</p>
              )}
            </div>

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
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{translations.auth.confirmPasswordLabel[language]}</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                aria-invalid={!!errors.confirmPassword || !!state.errors?.confirmPassword}
              />
               {(errors.confirmPassword || state.errors?.confirmPassword) && (
                <p className="text-sm text-destructive">{errors.confirmPassword?.message || state.errors?.confirmPassword?.[0]}</p>
              )}
            </div>

            <SubmitButton />
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {translations.auth.haveAccount[language]}{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              {translations.auth.login[language]}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
