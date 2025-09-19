
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Camera, Save, KeyRound, ShieldCheck, Mail, Phone, Bell, User } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  primaryEmail: z.string().email(),
  recoveryEmail: z.string().email({ message: "Please enter a valid email." }).or(z.literal('')).optional(),
  phone: z.string().optional(),
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
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.displayName?.split(' ')[0] || '',
      lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
      primaryEmail: user?.email || '',
      phone: user?.phoneNumber || '',
      recoveryEmail: '',
      notifications: {
        invoices: true,
        reminders: true,
        gallery: true,
      },
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    console.log('Updating profile...', data);
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved.',
    });
  };
  
  const handlePasswordReset = () => {
      toast({
          title: 'Password Reset Email Sent',
          description: 'If an account exists, you will receive an email with instructions.'
      });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User /> Personal Information</CardTitle>
                <CardDescription>Update your name and contact details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex flex-col items-center sm:flex-row gap-6">
                    <div className="relative group">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                            <AvatarFallback className="text-3xl">
                                {form.getValues('firstName')?.charAt(0) || user?.email?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 group-hover:bg-primary group-hover:text-primary-foreground">
                            <Camera className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6 flex-1 w-full">
                         <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>First Name</FormLabel>
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
                                <FormLabel>Last Name</FormLabel>
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
                            <FormLabel className="flex items-center gap-2"><Mail /> Primary Email</FormLabel>
                            <FormControl>
                                <Input {...field} disabled placeholder="your.email@example.com" />
                            </FormControl>
                            <FormDescription>Used for login and password reset.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="recoveryEmail"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="flex items-center gap-2"><Mail /> Recovery Email</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="personal@example.com" />
                            </FormControl>
                             <FormDescription>A backup for notifications.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Phone /> Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your phone number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <Button type="submit">
                    <Save className="mr-2"/>
                    Save Changes
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>

      <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck /> Security</CardTitle>
                <CardDescription>Manage your account security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Button variant="secondary" onClick={handlePasswordReset} className="w-full justify-start">
                    <KeyRound className="mr-2"/>
                    Send Password Reset Email
                </Button>
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <Label>Enable 2-Factor Auth</Label>
                         <p className="text-[0.8rem] text-muted-foreground">
                            Secure your account with a second factor.
                        </p>
                    </div>
                    <Switch />
                </div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell /> Notifications</CardTitle>
                <CardDescription>Choose what you want to be notified about.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="notifications.invoices"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Invoices & Payments</FormLabel>
                                <FormDescription className="text-xs">
                                    Receive updates on new invoices and payment confirmations.
                                </FormDescription>
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
                                <FormLabel>Event Reminders</FormLabel>
                                <FormDescription className="text-xs">
                                    Get reminders for upcoming deadlines and event dates.
                                </FormDescription>
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
                                <FormLabel>Gallery Updates</FormLabel>
                                <FormDescription className="text-xs">
                                   Be notified when your event gallery is ready.
                                </FormDescription>
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
  );
}
