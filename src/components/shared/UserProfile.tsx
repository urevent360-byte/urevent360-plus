
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
import { Camera, Save, KeyRound } from 'lucide-react';
import { Separator } from '../ui/separator';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name is required.'),
  email: z.string().email(),
  phone: z.string().optional(),
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
      displayName: user?.displayName || '',
      email: user?.email || '',
      phone: user?.phoneNumber || '',
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
      <div className="lg:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your name, email, and phone number.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} disabled placeholder="your.email@example.com" />
                      </FormControl>
                       <FormDescription>Email address cannot be changed.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
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
      </div>

      <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                    <AvatarFallback className="text-3xl">
                        {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <Button variant="outline">
                    <Camera className="mr-2"/>
                    Upload New Picture
                </Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security settings.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button variant="secondary" onClick={handlePasswordReset}>
                    <KeyRound className="mr-2"/>
                    Send Password Reset Email
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
