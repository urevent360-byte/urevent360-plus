
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  getMultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  MultiFactorInfo,
  PhoneMultiFactorInfo,
  MultiFactorResolver,
} from 'firebase/auth';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Eye, EyeOff, Smartphone, Home, User, Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase/client';
import { useAuth } from '@/contexts/AuthProvider';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const verificationCodeSchema = z.object({
    code: z.string().length(6, 'Code must be 6 digits.'),
});

type FormValues = z.infer<typeof formSchema>;
type VerificationCodeValues = z.infer<typeof verificationCodeSchema>;

export default function AdminLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, isAdmin, loading } = useAuth();
  
  const verifierRef = useRef<RecaptchaVerifier | null>(null);

  const [step, setStep] = useState<'credentials' | 'verification'>('credentials');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [resolver, setResolver] = useState<MultiFactorResolver | null>(null);

  useEffect(() => {
    if (user && isAdmin && !loading) {
      router.push('/admin/home');
    }
  }, [user, loading, router, isAdmin]);
  
  // Cleanup verifier on unmount
  useEffect(() => {
      return () => {
        verifierRef.current = null;
      }
  }, []);

  const { register: registerCredentials, handleSubmit: handleCredentialsSubmit, formState: { errors: credentialErrors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'admin@urevent360.com',
      password: 'password'
    }
  });

  const { register: registerCode, handleSubmit: handleCodeSubmit, formState: { errors: codeErrors } } = useForm<VerificationCodeValues>({
      resolver: zodResolver(verificationCodeSchema),
  });
  
  async function onCredentialsSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast({
            title: 'Login Success!',
            description: 'Redirecting to your dashboard...'
        });
        // AuthProvider will handle redirect for non-MFA users
    } catch (error: any) {
        let title = 'Login Error';
        let description = 'An unknown error occurred. Please try again.';

        switch (error.code) {
            case 'auth/invalid-credential':
                title = 'Login Failed';
                description = 'Email o contraseña incorrectos.';
                break;
            case 'auth/operation-not-allowed':
                description = 'Habilita Email/Password en Firebase.';
                break;
             case 'auth/invalid-api-key':
                title = 'Configuration Error';
                description = 'Revisa variables de entorno.';
                break;
            case 'auth/multi-factor-auth-required':
                try {
                    if (!verifierRef.current) {
                         verifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
                            'size': 'invisible'
                        });
                    }
                    const mfaResolver = getMultiFactorResolver(auth, error);
                    setResolver(mfaResolver);
                    const phoneInfo = mfaResolver.hints[0] as PhoneMultiFactorInfo;
                    const phoneAuthProvider = new PhoneAuthProvider(auth);
                    
                    const newVerificationId = await phoneAuthProvider.verifyPhoneNumber({
                        multiFactorHint: phoneInfo,
                        session: mfaResolver.session,
                    }, verifierRef.current);
                    
                    setVerificationId(newVerificationId);
                    setStep('verification');
                    toast({
                        title: 'Verification Required',
                        description: `A code has been sent to your phone: ${phoneInfo.phoneNumber}`
                    });
                    setIsSubmitting(false);
                    return; 
                } catch (verifyError: any) {
                    title = 'MFA Error';
                    switch (verifyError.code) {
                        case 'auth/missing-recaptcha-token':
                        case 'auth/recaptcha-not-enabled':
                            description = 'Configurar reCAPTCHA web en el proyecto.';
                            break;
                        case 'auth/too-many-requests':
                            description = 'Demasiados intentos; espera e inténtalo de nuevo.';
                            break;
                        default:
                            description = 'No se pudo enviar el código de verificación.';
                            break;
                    }
                    verifierRef.current= null;
                }
                break;
            default:
                description = error.message || description;
                break;
        }

        toast({ title, description, variant: 'destructive', duration: 9000 });
    } finally {
        if (step === 'credentials') {
          setIsSubmitting(false);
        }
    }
  }

  async function onCodeSubmit(data: VerificationCodeValues) {
      if (!resolver || !verificationId) return;

      setIsSubmitting(true);
      try {
          const cred = PhoneAuthProvider.credential(verificationId, data.code);
          const assertion = PhoneMultiFactorGenerator.assertion(cred);
          await resolver.resolveSignIn(assertion);
          toast({
              title: 'Success!',
              description: 'Verification successful! Redirecting...',
          });
      } catch (error: any) {
          let title = 'Verification Failed';
          let description = 'An unknown error occurred.';
          switch(error.code) {
              case 'auth/invalid-verification-code':
                  description = 'Código incorrecto.';
                  break;
              case 'auth/too-many-requests':
                  description = 'Demasiados intentos; por favor, solicita un nuevo código.';
                  break;
              default:
                  description = 'The code you entered is incorrect. Please try again.';
                  break;
          }
          toast({
              title,
              description,
              variant: 'destructive',
          });
      } finally {
          setIsSubmitting(false);
          // Don't clear verifier here, user might want to retry
      }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div id="recaptcha-container"></div>
      <Card className="max-w-md w-full shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary pt-8">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-lg">
             {step === 'credentials'
              ? 'Access the UREVENT 360 PLUS dashboard.'
              : 'Enter the 6-digit code sent to your phone.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit(onCredentialsSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerCredentials('email')}
                  placeholder="admin@urevent360.com"
                  aria-invalid={!!credentialErrors.email}
                />
                {credentialErrors.email && (
                  <p className="text-sm text-destructive">{credentialErrors.email?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                     <Link href="/admin/forgot-password"className="text-sm font-medium text-primary hover:underline">
                        Forgot Password?
                    </Link>
                </div>
                 <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...registerCredentials('password')}
                    aria-invalid={!!credentialErrors.password}
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
                {credentialErrors.password && (
                  <p className="text-sm text-destructive">{credentialErrors.password?.message}</p>
                )}
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <Loader2 className="mr-2 animate-spin"/> : <Mail className="mr-2" />}
                {isSubmitting ? 'Logging in...' : 'Login with Email'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit(onCodeSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                        id="code"
                        type="text"
                        maxLength={6}
                        {...registerCode('code')}
                        placeholder="123456"
                        aria-invalid={!!codeErrors.code}
                    />
                    {codeErrors.code && (
                        <p className="text-sm text-destructive">{codeErrors.code?.message}</p>
                    )}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? <Loader2 className="mr-2 animate-spin"/> : <Smartphone className="mr-2" />}
                    {isSubmitting ? 'Verifying...' : 'Verify Code'}
                </Button>
                 <Button variant="link" size="sm" className="w-full" onClick={() => {
                    setStep('credentials');
                    setResolver(null);
                    setVerificationId(null);
                    verifierRef.current= null;
                 }}>
                    Back to login
                </Button>
            </form>
          )}
           <div className="mt-6 text-center space-y-2">
             <Button variant="link" asChild>
                <Link href="/">
                    <Home className="mr-2" />
                    Go back to landing page
                </Link>
             </Button>
              <Button variant="link" asChild>
                <Link href="/app/login">
                    <User className="mr-2" />
                    Go to Host Login
                </Link>
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
