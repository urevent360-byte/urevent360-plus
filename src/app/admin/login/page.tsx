'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  signInWithEmailAndPassword,
  getMultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  PhoneMultiFactorInfo,
  MultiFactorResolver,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Eye, EyeOff, Smartphone, Home, User, Loader2 } from 'lucide-react';

import { auth } from '@/lib/firebase/authClient';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/contexts/AuthProvider';

const formSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(6, 'At least 6 characters.'),
});

const verificationCodeSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits.'),
});

type FormValues = z.infer<typeof formSchema>;
type VerificationCodeValues = z.infer<typeof verificationCodeSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAdmin, loading } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [step, setStep] = useState<'credentials' | 'verification'>('credentials');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [resolver, setResolver] = useState<MultiFactorResolver | null>(null);

  const verifierRef = useRef<RecaptchaVerifier | null>(null);

  // Redirect only when the auth context is fully loaded
  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.replace('/admin/home');
    }
  }, [loading, user, isAdmin, router]);

  useEffect(() => {
    return () => {
      // Clean up any created verifier when unmounting
      try {
        verifierRef.current?.clear();
      } catch {}
      verifierRef.current = null;
    };
  }, []);

  const {
    register: registerCredentials,
    handleSubmit: handleCredentialsSubmit,
    formState: { errors: credentialErrors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    register: registerCode,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors },
  } = useForm<VerificationCodeValues>({
    resolver: zodResolver(verificationCodeSchema),
  });

  async function ensureRecaptcha() {
    if (!verifierRef.current) {
      // Create invisible reCAPTCHA only when MFA is required
      verifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
    }
    return verifierRef.current;
  }

  async function onCredentialsSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);

      // Verify admin role in Firestore
      const adminRef = doc(db, 'admins', userCredential.user.uid);
      const adminSnap = await getDoc(adminRef);

      const active = adminSnap.exists() ? adminSnap.data().active === true : false;
      const role = adminSnap.exists() ? adminSnap.data().role : undefined;
      const isAuthorized = active && !!role;

      if (!isAuthorized) {
        await signOut(auth);
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access the admin portal.',
          variant: 'destructive',
        });
        return;
      }

      toast({ title: 'Login Success', description: 'Redirecting to admin dashboard…' });
      router.replace('/admin/home');
    } catch (error: any) {
      let title = 'Login Error';
      let description = 'An unknown error occurred. Please try again.';

      // If MFA is required, trigger phone verification flow
      if (error?.code === 'auth/multi-factor-auth-required') {
        try {
          const recaptcha = await ensureRecaptcha();
          const mfaResolver = getMultiFactorResolver(auth, error);
          setResolver(mfaResolver);

          // Prefer first phone hint; support multiple enrolled factors
          const phoneHint = (mfaResolver.hints.find(h => h.factorId === PhoneMultiFactorGenerator.FACTOR_ID) ||
            mfaResolver.hints[0]) as PhoneMultiFactorInfo;

          const phoneProvider = new PhoneAuthProvider(auth);
          const id = await phoneProvider.verifyPhoneNumber(
            { multiFactorHint: phoneHint, session: mfaResolver.session },
            recaptcha
          );

          setVerificationId(id);
          setStep('verification');
          toast({
            title: 'Verification Required',
            description: `We sent a code to: ${phoneHint?.phoneNumber ?? 'your phone'}`,
          });
          return; // stop normal error handling
        } catch (verifyError: any) {
          title = 'MFA Error';
          description = verifyError?.message || 'Could not send verification code.';
          try {
            verifierRef.current?.clear();
          } catch {}
          verifierRef.current = null;
        }
      } else {
        switch (error?.code) {
          case 'auth/invalid-credential':
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            title = 'Login Failed';
            description = 'Email or password is incorrect.';
            break;
          case 'auth/operation-not-allowed':
            description = 'Enable Email/Password in Firebase Authentication.';
            break;
          case 'auth/invalid-api-key':
            title = 'Configuration Error';
            description = 'Check Firebase environment variables.';
            break;
          default:
            description = error?.message || description;
        }
      }

      toast({ title, description, variant: 'destructive', duration: 9000 });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onCodeSubmit(data: VerificationCodeValues) {
    if (!resolver || !verificationId) return;

    setIsSubmitting(true);
    try {
      const cred = PhoneAuthProvider.credential(verificationId, data.code);
      const assertion = PhoneMultiFactorGenerator.assertion(cred);
      await resolver.resolveSignIn(assertion);

      toast({ title: 'Verification successful', description: 'Redirecting…' });
      router.replace('/admin/home');
    } catch (error: any) {
      let description = 'The code you entered is incorrect. Please try again.';
      switch (error?.code) {
        case 'auth/invalid-verification-code':
          description = 'Incorrect code.';
          break;
        case 'auth/too-many-requests':
          description = 'Too many attempts. Please request a new code.';
          break;
      }
      toast({ title: 'Verification Failed', description, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      {/* container needed for the invisible reCAPTCHA when MFA kicks in */}
      <div id="recaptcha-container" />
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
                  autoComplete="username"
                  placeholder="admin@urevent360.com"
                  {...registerCredentials('email')}
                  aria-invalid={!!credentialErrors.email}
                />
                {credentialErrors.email && (
                  <p className="text-sm text-destructive">{credentialErrors.email?.message}</p>
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
                    {...registerCredentials('password')}
                    aria-invalid={!!credentialErrors.password}
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
                {credentialErrors.password && (
                  <p className="text-sm text-destructive">{credentialErrors.password?.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting || loading} className="w-full">
                {isSubmitting ? <Loader2 className="mr-2 animate-spin" /> : <Mail className="mr-2" />}
                {isSubmitting ? 'Logging in…' : 'Login with Email'}
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
                  inputMode="numeric"
                  placeholder="123456"
                  {...registerCode('code')}
                  aria-invalid={!!codeErrors.code}
                />
                {codeErrors.code && (
                  <p className="text-sm text-destructive">{codeErrors.code?.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <Loader2 className="mr-2 animate-spin" /> : <Smartphone className="mr-2" />}
                {isSubmitting ? 'Verifying…' : 'Verify Code'}
              </Button>

              <Button
                variant="link"
                size="sm"
                className="w-full"
                onClick={() => {
                  setStep('credentials');
                  setResolver(null);
                  setVerificationId(null);
                  try {
                    verifierRef.current?.clear();
                  } catch {}
                  verifierRef.current = null;
                }}
              >
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
