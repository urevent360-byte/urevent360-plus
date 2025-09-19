
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Camera, Save, KeyRound, ShieldCheck, Mail, Phone, Bell, User, Trash2, Languages } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { auth } from '@/lib/firebase/client';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import locales from '@/lib/locales.json';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  primaryEmail: z.string().email(),
  recoveryEmail: z.string().email({ message: "Please enter a valid email." }).or(z.literal('')).optional(),
  phone: z.string().optional(),
  locale: z.enum(['en', 'es']),
  timeZone: z.string(),
  notifications: z.object({
    invoices: z.boolean().default(true),
    reminders: z.boolean().default(true),
    gallery: z.boolean().default(true),
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type UserProfileProps = {
  role: 'host' | 'admin';
};

export function UserProfile({ role }: UserProfileProps) {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.displayName?.split(' ')[0] || '',
      lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
      primaryEmail: user?.email || '',
      phone: user?.phoneNumber || '',
      recoveryEmail: '',
      locale: 'en',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: {
        invoices: true,
        reminders: true,
        gallery: true,
      },
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    // In a real app, this would call Firebase Auth's updateProfile and update Firestore.
    // For this prototype, we'll simulate it by updating the auth context.
    const newDisplayName = `${data.firstName} ${data.lastName}`.trim();
    if (updateProfile) {
        updateProfile({ displayName: newDisplayName });
    }
    
    console.log('Updating profile...', data);
    toast({
      title: locales.profile.toast.saved.title[language],
      description: locales.profile.toast.saved.description[language],
    });
  };

  const handlePasswordReset = async () => {
    if (!user?.email) {
      toast({ title: "Error", description: "No primary email found for this user.", variant: "destructive" });
      return;
    }
    try {
      // This is a real Firebase call
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: locales.profile.toast.passwordReset.title[language],
        description: locales.profile.toast.passwordReset.description[language],
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'There was a problem sending the password reset email. Please try again later.',
        variant: "destructive"
      });
      console.error("Password reset error:", error);
    }
  }

  const handleChangeEmail = () => {
    toast({
      title: 'Simulating Email Change',
      description: 'In a real app, this would trigger a re-authentication and verification flow.'
    });
  };

  const handleMfaSetup = () => {
    toast({
      title: 'MFA Setup',
      description: 'MFA configuration flow is not yet implemented.'
    });
  }

  const handleAccountDelete = () => {
    toast({
      title: locales.profile.toast.delete.title[language],
      description: locales.profile.toast.delete.description[language],
      variant: 'destructive'
    });
  }

  const handleAvatarUpload = () => {
    toast({
        title: locales.profile.toast.photo.saving[language],
    });
    // In a real app, you would handle file upload here.
    // For the simulation, we'll just show a success message.
    setTimeout(() => {
         toast({
            title: locales.profile.toast.photo.saved[language],
        });
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end gap-2">
          <Button variant={language === 'en' ? 'default' : 'outline'} onClick={() => setLanguage('en')}>EN</Button>
          <Button variant={language === 'es' ? 'default' : 'outline'} onClick={() => setLanguage('es')}>ES</Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><User /> {locales.profile.info.title[language]}</CardTitle>
                  <CardDescription>{locales.profile.info.subtitle[language]}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center sm:flex-row gap-6">
                    <div className="relative group">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                        <AvatarFallback className="text-3xl">
                          {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 group-hover:bg-primary group-hover:text-primary-foreground" onClick={handleAvatarUpload} type="button" title={locales.profile.photo.upload[language]}>
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6 flex-1 w-full">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{locales.profile.info.firstName[language]}</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="John" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{locales.profile.info.lastName[language]}</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Doe" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="primaryEmail"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="flex items-center gap-2"><Mail /> {locales.profile.recoveryEmail.primaryLabel[language]}</FormLabel>
                            <Button type="button" variant="link" className="text-xs h-auto p-0" onClick={handleChangeEmail}>{locales.ui.change[language]}</Button>
                          </div>
                          <FormControl>
                            <Input {...field} disabled placeholder="your.email@example.com" />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="recoveryEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><Mail /> {locales.profile.recoveryEmail.label[language]}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="personal@example.com" />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><Phone /> {locales.profile.info.phone[language]}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Your phone number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timeZone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><Languages /> {locales.profile.info.timeZone[language]}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit">
                    <Save className="mr-2" />
                    {locales.profile.info.save[language]}
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ShieldCheck /> {locales.profile.security.title[language]}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="secondary" onClick={handlePasswordReset} className="w-full justify-start" type="button">
                    <KeyRound className="mr-2" />
                    {locales.profile.security.changePassword[language]}
                  </Button>
                   <Button variant="secondary" onClick={handleMfaSetup} className="w-full justify-start" type="button">
                        <ShieldCheck className="mr-2"/>
                        {locales.profile.security.mfa.setup[language]}
                    </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Bell /> {locales.profile.notifications.title[language]}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notifications.invoices"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>{locales.profile.notifications.invoices[language]}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notifications.reminders"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>{locales.profile.notifications.reminders[language]}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notifications.gallery"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>{locales.profile.notifications.gallery[language]}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">{locales.profile.danger.title[language]}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {locales.profile.danger.description[language]}
              </CardDescription>
              <Button variant="destructive" onClick={handleAccountDelete} type="button">
                <Trash2 className="mr-2" />
                {locales.profile.danger.delete[language]}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
