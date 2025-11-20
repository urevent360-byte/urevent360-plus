'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthProvider';
import {
  CalendarCheck,
  MessageSquare,
  Wallet,
  Heart,
  UserCircle,
  PlusCircle,
} from 'lucide-react';

const quickActions = [
  { title: 'My Events', icon: <CalendarCheck />, href: '/app/my-events' },
  { title: 'Plan New Event', icon: <PlusCircle />, href: '/app/events/new' },
  { title: 'Chat With Us', icon: <MessageSquare />, href: '/app/chat' },
  { title: 'View Payments', icon: <Wallet />, href: '/app/payments' },
  { title: 'My Profile', icon: <UserCircle />, href: '/app/profile' },
  { title: 'Our Services', icon: <Heart />, href: '/services' },
];

export default function HostDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.displayName?.split(' ')[0] || 'Host'}! 🎉
          </h1>
          <p className="text-muted-foreground">
            Review your upcoming events, payments, messages, and quick actions.
          </p>
        </div>
        <Button asChild>
          <Link href="/app/events/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Plan a New Event
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
          {quickActions.map((item) => (
            <Button asChild variant="outline" key={item.href}>
              <Link href={item.href}>
                {item.icon}
                {item.title}
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center py-8">
              You have no upcoming events.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent activity.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
