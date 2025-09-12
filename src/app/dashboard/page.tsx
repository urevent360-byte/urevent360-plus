'use client';

import { useAuth } from '@/contexts/AuthProvider';
import { useLanguage } from '@/contexts/LanguageProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <Card className="max-w-4xl mx-auto shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
            {language === 'en' ? 'Client Dashboard' : 'Panel de Cliente'}
          </CardTitle>
          <CardDescription className="text-lg">
            {language === 'en' ? 'Welcome back, ' : 'Bienvenido de nuevo, '} {user.displayName || user.email}!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
            <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="text-xl font-semibold">{user.displayName}</p>
          <p className="text-muted-foreground">{user.email}</p>

          <div className="mt-8 text-center">
             <p className="text-foreground/80">
                {language === 'en' ? 'This is your client dashboard. Booked services, timeline, and other features will be available here soon.' : 'Este es tu panel de cliente. Los servicios reservados, la línea de tiempo y otras funcionalidades estarán disponibles aquí pronto.'}
            </p>
          </div>

          <Button onClick={signOut} variant="destructive" className="mt-8">
            {language === 'en' ? 'Logout' : 'Cerrar Sesión'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
