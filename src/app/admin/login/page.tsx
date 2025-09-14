
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, getMultiFactorResolver, PhoneAuthProvider, PhoneMultiFactorGenerator } from 'firebase/auth';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Mail, Eye, EyeOff, Smartphone } from 'lucide-react';
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

  const [step, setStep] = useState<'credentials' | 'verification'>('credentials');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [resolver, setResolver] = useState<any>(null);

  useEffect(() => {
    if (user && isAdmin && !loading) {
      router.push('/admin/home');
    }
  }, [user, loading, router, isAdmin]);

  const { register: registerCredentials, handleSubmit: handleCredentialsSubmit, formState: { errors: credentialErrors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'admin@urevent360.com',
      password: ''
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
        title: 'Success!',
        description: 'Login successful! Redirecting to Admin Dashboard...',
      });
    } catch (error: any) {
       if (error.code === 'auth/multi-factor-required') {
            const mfaResolver = getMultiFactorResolver(auth, error);
            setResolver(mfaResolver);
            const phoneInfo = mfaResolver.hints[0];
            const phoneAuthProvider = new PhoneAuthProvider(auth);
            const verId = await phoneAuthProvider.verifyPhoneNumber(phoneInfo, mfaResolver.session);
            setVerificationId(verId);
            setStep('verification');
            toast({
                title: 'Verification Required',
                description: 'A code has been sent to your phone.',
            });
       } else {
            toast({
                title: 'Login Error',
                description: 'Invalid credentials or you are not an administrator.',
                variant: 'destructive',
            });
       }
    } finally {
        setIsSubmitting(false);
    }
  }

  async function onCodeSubmit(data: VerificationCodeValues) {
      if (!resolver || !verificationId) return;

      setIsSubmitting(true);
      try {
          const cred = PhoneMultiFactorGenerator.assertion(verificationId, data.code);
          await resolver.resolveSignIn(cred);
          toast({
              title: 'Success!',
              description: 'Verification successful! Redirecting...',
          });
      } catch (error) {
          toast({
              title: 'Verification Failed',
              description: 'The code you entered is incorrect. Please try again.',
              variant: 'destructive',
          });
      } finally {
          setIsSubmitting(false);
      }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Card className="max-w-md w-full shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
            <Shield className="inline-block mr-2" />
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
                {isSubmitting ? 'Logging in...' : <><Mail className="mr-2" />Login with Email</>}
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
                    {isSubmitting ? 'Verifying...' : <><Smartphone className="mr-2" />Verify Code</>}
                </Button>
                 <Button variant="link" onClick={() => setStep('credentials')}>Back to Login</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    
