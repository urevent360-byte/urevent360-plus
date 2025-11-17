'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  Settings,
  Package,
  ShoppingCart,
  Images,
  Search,
  Users2,
  BarChart3,
  Sparkles,
  Wand2,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthProvider';


// --- Mock data (can be replaced with real data) ---
const stats = {
  services: 11,
  openOrders: 3,
  inquiries: 7,
  lowInventory: 2,
};

const recentActivity = [
    {
      id: 'act-1',
      title: 'New quote received',
      meta: '360 Photo Booth • Wedding • 12/14',
      when: '15 min ago',
      pill: 'Quote',
    },
    {
      id: 'act-2',
      title: 'Booking confirmed',
      meta: 'Magic Mirror • Sweet 16 • 10/30',
      when: '1 hour ago',
      pill: 'Booking',
    },
    {
      id: 'act-3',
      title: 'Service updated',
      meta: 'LED Screens Wall • Price and description',
      when: 'yesterday',
      pill: 'Update',
    },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  
  return (
    <main className="container max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <Badge variant="secondary" className="font-semibold">
              Admin
            </Badge>
          </div>
          <h1 className="mt-2 font-headline text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Hi {user?.email?.split('@')[0] ?? 'admin'}, manage services, bookings, and content for UREVENT 360 PLUS.
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/services/new">
              <Sparkles className="mr-2 h-4 w-4" />
              New Service
            </Link>
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Published Services</CardDescription>
            <CardTitle className="text-3xl">{stats.services}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              <span>Catalog</span>
            </div>
            <Link href="/admin/services" className="inline-flex items-center">
              View <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Orders</CardDescription>
            <CardTitle className="text-3xl">{stats.openOrders}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Bookings</span>
            </div>
            <Link href="/admin/orders" className="inline-flex items-center">
              Manage <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Open Inquiries</CardDescription>
            <CardTitle className="text-3xl">{stats.inquiries}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Leads</span>
            </div>
            <Link href="/admin/inquiries" className="inline-flex items-center">
              View <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Critical Inventory</CardDescription>
            <CardTitle className="text-3xl">{stats.lowInventory}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Equipment</span>
            </div>
            <Link href="/admin/inventory" className="inline-flex items-center">
              Review <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions & Activity */}
      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system movements.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivity.map((item) => (
                <li key={item.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.meta}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{item.pill}</Badge>
                      <span className="text-xs text-muted-foreground">{item.when}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Shortcuts for common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/admin/services/new">
                <Wand2 className="mr-2 h-4 w-4" />
                Create Service
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/admin/orders">
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Bookings
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/admin/media">
                <Images className="mr-2 h-4 w-4" />
                Manage Gallery
              </Link>
            </Button>
            <Separator />
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/seo">
                <Search className="mr-2 h-4 w-4" />
                SEO & Sitemaps
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/users">
                <Users2 className="mr-2 h-4 w-4" />
                Users & Roles
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
