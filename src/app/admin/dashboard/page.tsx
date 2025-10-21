'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthProvider';

import {
  Loader2,
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

/**
 * Admin Dashboard
 * - Protegido por el AuthProvider (solo Admin)
 * - KPIs de ejemplo (puedes conectar Firestore cuando quieras)
 * - Acciones rápidas y accesos a módulos de administración
 */
export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();

  // Simulaciones/KPIs de muestra (reemplaza con Firestore cuando quieras)
  const [stats] = useState({
    services: 11,
    openOrders: 3,
    inquiries: 7,
    lowInventory: 2,
  });

  const recentActivity = useMemo(
    () => [
      {
        id: 'act-1',
        title: 'Nueva cotización recibida',
        meta: '360 Photo Booth • Boda • 12/14',
        when: 'hace 15 min',
        pill: 'Cotización',
      },
      {
        id: 'act-2',
        title: 'Reserva confirmada',
        meta: 'Magic Mirror • Sweet 16 • 10/30',
        when: 'hace 1 h',
        pill: 'Reserva',
      },
      {
        id: 'act-3',
        title: 'Servicio actualizado',
        meta: 'LED Screens Wall • Precio y descripción',
        when: 'ayer',
        pill: 'Actualización',
      },
    ],
    []
  );

  // Guardas & redirecciones
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/admin/login');
      } else if (!isAdmin) {
        router.replace('/'); // o /app si prefieres
      }
    }
  }, [loading, user, isAdmin, router]);

  if (loading || (!user && typeof window !== 'undefined')) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Verificando credenciales…</span>
        </div>
      </div>
    );
  }

  // Si no es admin, no renders (el useEffect se encarga de redirigir)
  if (user && !isAdmin) return null;

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
            Hola {user?.email?.split('@')[0] ?? 'admin'}, gestiona servicios, reservas y
            contenido de UREVENT 360 PLUS.
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/services/new">
              <Sparkles className="mr-2 h-4 w-4" />
              Nuevo servicio
            </Link>
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Servicios publicados</CardDescription>
            <CardTitle className="text-3xl">{stats.services}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              <span>Catálogo</span>
            </div>
            <Link href="/admin/services" className="inline-flex items-center">
              Ver <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Órdenes pendientes</CardDescription>
            <CardTitle className="text-3xl">{stats.openOrders}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Reservas</span>
            </div>
            <Link href="/admin/orders" className="inline-flex items-center">
              Gestionar <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Consultas abiertas</CardDescription>
            <CardTitle className="text-3xl">{stats.inquiries}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Leads</span>
            </div>
            <Link href="/admin/inquiries" className="inline-flex items-center">
              Ver <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inventario crítico</CardDescription>
            <CardTitle className="text-3xl">{stats.lowInventory}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Equipos</span>
            </div>
            <Link href="/admin/inventory" className="inline-flex items-center">
              Revisar <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Acciones rápidas */}
      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Actividad reciente
            </CardTitle>
            <CardDescription>Últimos movimientos en el sistema.</CardDescription>
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
              Acciones rápidas
            </CardTitle>
            <CardDescription>Atajos para tareas comunes.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/admin/services/new">
                <Wand2 className="mr-2 h-4 w-4" />
                Crear servicio
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/admin/orders">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Ver reservas
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/admin/media">
                <Images className="mr-2 h-4 w-4" />
                Gestionar galería
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
                Usuarios & Roles
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
