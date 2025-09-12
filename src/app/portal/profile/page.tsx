'use client';

import { useAuth } from '@/contexts/AuthProvider';
import { useLanguage } from '@/contexts/LanguageProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();

  const t = {
    title: { en: 'My Profile', es: 'Mi Perfil' },
    description: { en: 'Update your personal information and preferences.', es: 'Actualiza tu información personal y tus preferencias.' },
    accountInfo: { en: 'Account Information', es: 'Información de la Cuenta' },
    displayName: { en: 'Display Name', es: 'Nombre a Mostrar' },
    email: { en: 'Email Address', es: 'Dirección de Correo Electrónico' },
    languagePref: { en: 'Language Preference', es: 'Preferencia de Idioma' },
    changeLang: { en: 'Change to Spanish', es: 'Cambiar a Español' },
    changeLangEs: { en: 'Change to English', es: 'Cambiar a Inglés' },
    saveChanges: { en: 'Save Changes', es: 'Guardar Cambios' },
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t.title[language]}</h1>
                <p className="text-muted-foreground">{t.description[language]}</p>
            </div>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>{t.accountInfo[language]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                        <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <div>
                        <h2 className="text-xl font-semibold">{user.displayName}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>

                <Separator />
                
                <div className="space-y-2">
                    <Label htmlFor="displayName">{t.displayName[language]}</Label>
                    <Input id="displayName" defaultValue={user.displayName || ''} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">{t.email[language]}</Label>
                    <Input id="email" defaultValue={user.email || ''} disabled />
                </div>

                 <div className="space-y-2">
                    <Label>{t.languagePref[language]}</Label>
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-muted-foreground">{language === 'en' ? 'English' : 'Español'}</p>
                        <Button variant="outline" onClick={toggleLanguage}>
                            {language === 'en' ? t.changeLang[language] : t.changeLangEs[language]}
                        </Button>
                    </div>
                </div>
                
                 <Button>{t.saveChanges[language]}</Button>
            </CardContent>
        </Card>
    </div>
  );
}
