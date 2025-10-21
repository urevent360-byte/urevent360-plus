// src/app/app/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Si ya tienes este context, reutilízalo. Si no, puedes omitir el guard y renderizar directo.
import { useAuth } from '@/contexts/AuthProvider';

import {
  CalendarCheck,
  ShoppingCart,
  MessageSquare,
  Wallet,
  Heart,
  UserCircle,
  MapPin,
  Clock,
  CheckCircle,
} from 'lucide-react';

// Guard simple: requiere usuario logueado (sin exigir rol admin)
function useHostGuard() {
  const { user, loading } = useAuth?.() ?? { user: null, loading: false };
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/app/login');
  }, [loading, user, router]);

  return { loading, user };
}

// --- Datos mock (puedes reemplazar por datos reales) ---
const overview = [
  { title: 'Próximos eventos', value: 2, icon: <CalendarCheck className="h-5 w-5" />, href: '/app/events' },
  { title: 'Carrito', value: 3, icon: <ShoppingCart className="h-5 w-5" />, href: '/app/cart' },
  { title: 'Mensajes', value: 1, icon: <MessageSquare className="h-5 w-5" />, href: '/app/messages' },
  { title: 'Pagos pendientes', value: 0, icon: <Wallet className="h-5 w-5" />, href: '/app/billing' },
];

const upcoming = [
  {
    id: 'EVT-24018',
    title: 'Sweet 16 de Valeria',
    date: 'Sat, Nov 9 • 6:00 PM',
    venue: 'Bella Collina, Montverde',
    status: 'confirmado',
    services: ['360 Photo Booth', 'Monogram', 'Dance on the Clouds'],
  },
  {
    id: 'EVT-24021',
    title: 'Boda Ana & Luis',
    date: 'Fri, Dec 13 • 5:30 PM',
    venue: 'The Balcony Orlando',
    status: 'borrador',
    services: ['Photo Booth Printer'],
  },
];

const recentActivity = [
  { label: 'Actualizaste el paquete del evento #EVT-24018.', time: 'hace 2 horas' },
  { label: 'Nuevo mensaje del equipo: “Confirmada hora de llegada”.', time: 'ayer' },
  { label: 'Se generó una cotización para “Quinceañera – 360 Booth”.', time: 'hace 3 días' },
];

// -------------------------------------------------------

export default function HostDashboardPage() {
  const { loading } = useHostGuard();
  if (loading) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back 🎉</h1>
          <p className="text-muted-foreground">
            Revisa tus próximos eventos, pagos, mensajes y acciones rápidas.
          </p>
        </div>
        <Button asChild>
          <Link href="/plan">
            <Heart className="mr-2 h-4 w-4" />
            Plan a New Event
          </Link>
        </Button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {overview.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <div className="text-muted-foreground">{item.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <Button variant="link" asChild className="h-auto p-0 text-xs" aria-label={`View ${item.title}`}>
                <Link href={item.href}>View</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Próximos eventos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Próximos eventos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcoming.length === 0 ? (
              <div className="text-sm text-muted-foreground">No tienes eventos próximos.</div>
            ) : (
              upcoming.map((e) => (
                <div key={e.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold">{e.title}</h3>
                        <Badge variant={e.status === 'confirmado' ? 'default' : 'secondary'}>
                          {e.status}
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {e.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {e.venue}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" /> {e.services.join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                      <Button asChild size="sm" variant="default">
                        <Link href={`/app/events/${e.id}`}>Manage</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/app/events/${e.id}/invoice`}>View Invoice</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Acciones rápidas + actividad */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Acciones rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline">
                <Link href="/app/cart">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Ver carrito
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/app/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Mensajes
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/app/billing">
                  <Wallet className="mr-2 h-4 w-4" />
                  Pagos
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/app/profile">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Perfil
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/app/gallery">Galería</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Soporte</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actividad reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentActivity.map((a, i) => (
                  <li key={i}>
                    <div className="text-sm">{a.label}</div>
                    <div className="text-xs text-muted-foreground">{a.time}</div>
                    {i < recentActivity.length - 1 && <Separator className="my-3" />}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}