'use client';

import { useAuth } from '@/contexts/AuthProvider';
import { useLanguage } from '@/contexts/LanguageProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { translations } from '@/lib/translations';
import { ArrowRight, Calendar, Camera, CreditCard, Music } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

// Placeholder data for the client's next confirmed event
const nextEvent = {
    serviceName: '360 Photo Booth',
    eventDate: new Date('2024-08-25T18:00:00'),
    location: 'Miami, FL'
};

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  const t = {
    title: { en: 'Client Dashboard', es: 'Panel de Cliente' },
    welcome: { en: 'Welcome back,', es: 'Bienvenido de nuevo,' },
    logout: { en: 'Logout', es: 'Cerrar Sesión' },
    upcomingEvent: { en: 'Upcoming Event', es: 'Próximo Evento' },
    quickActions: { en: 'Quick Actions', es: 'Acciones Rápidas' },
    viewBookings: { en: 'View All Bookings', es: 'Ver Todas las Reservas' },
    viewGallery: { en: 'My Event Gallery', es: 'Galería de mi Evento' },
    musicPrefs: { en: 'Music Preferences', es: 'Preferencias Musicales' },
    payments: { en: 'Manage Payments', es: 'Gestionar Pagos' },
    reminders: { en: 'Important Reminders', es: 'Recordatorios Importantes' },
    reminderText: { en: 'Your music playlist is due in 2 weeks.', es: 'Tu lista de reproducción de música vence en 2 semanas.' },
    noEvents: { en: 'You have no upcoming events.', es: 'No tienes eventos próximos.'}
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {t.title[language]}
                </h1>
                <p className="text-muted-foreground">
                    {t.welcome[language]} {user.displayName || user.email}!
                </p>
            </div>
             <Button onClick={signOut} variant="outline">
                {t.logout[language]}
            </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Calendar /> {t.upcomingEvent[language]}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {nextEvent ? (
                            <div>
                                <h3 className="text-2xl font-semibold text-primary">{nextEvent.serviceName}</h3>
                                <p className="text-lg text-muted-foreground mt-1">{format(nextEvent.eventDate, 'PPPP p')}</p>
                                <p className="text-sm text-muted-foreground">{nextEvent.location}</p>
                                <Button asChild variant="link" className="px-0">
                                    <Link href="/dashboard/bookings">
                                        {t.viewBookings[language]} <ArrowRight className="ml-2"/>
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                             <p className="text-muted-foreground">{t.noEvents[language]}</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>{t.quickActions[language]}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                       <Button asChild variant="outline"><Link href="/dashboard/gallery"><Camera className="mr-2"/> {t.viewGallery[language]}</Link></Button>
                       <Button asChild variant="outline"><Link href="/dashboard/music"><Music className="mr-2"/> {t.musicPrefs[language]}</Link></Button>
                       <Button asChild variant="outline"><Link href="/dashboard/payments"><CreditCard className="mr-2"/> {t.payments[language]}</Link></Button>
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>{t.reminders[language]}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{t.reminderText[language]}</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
