'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Mail, Eye, EyeOff } from 'lucide-react';
import { auth } from '@/lib/firebase/client';
import { useAuth } from '@/contexts/AuthProvider';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof formSchema>;


export default function AdminLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, isAdmin, loading } = useAuth();
  
  useEffect(() => {
    if (user && isAdmin && !loading) {
      router.push('/admin/home');
    }
  }, [user, loading, router, isAdmin]);


  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'admin@urevent360.com'
    }
  });
  
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // The useEffect in AuthProvider will handle the redirect on successful login
      toast({
        title: 'Success!',
        description: 'Login successful! Redirecting to Admin Dashboard...',
      });
    } catch (error: any) {
       toast({
          title: 'Login Error',
          description: 'Invalid credentials or you are not an administrator.',
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
                {...register('email')}
                placeholder="admin@urevent360.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
                  Login with Email
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
