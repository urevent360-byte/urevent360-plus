'use client';

import { useAuth } from '@/contexts/AuthProvider';
import { useLanguage } from '@/contexts/LanguageProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function PortalPage() {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {language === 'en' ? 'Client Portal' : 'Portal de Cliente'}
                </h1>
                <p className="text-muted-foreground">
                    {language === 'en' ? 'Welcome back, ' : 'Bienvenido de nuevo, '} {user.displayName || user.email}!
                </p>
            </div>
             <Button onClick={signOut} variant="outline">
                {language === 'en' ? 'Logout' : 'Cerrar Sesión'}
            </Button>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>{language === 'en' ? 'Upcoming Event' : 'Próximo Evento'}</CardTitle>
                <CardDescription>{language === 'en' ? 'Details about your next booking will appear here.' : 'Los detalles de tu próxima reserva aparecerán aquí.'}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{language === 'en' ? 'You have no upcoming events.' : 'No tienes eventos próximos.'}</p>
            </CardContent>
        </Card>
    </div>
  );
}
