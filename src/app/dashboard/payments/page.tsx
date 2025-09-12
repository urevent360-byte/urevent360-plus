'use client';

import { useLanguage } from '@/contexts/LanguageProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

export default function PaymentsPage() {
  const { language } = useLanguage();

  const t = {
    title: { en: 'Payments', es: 'Pagos' },
    description: { en: 'View your payment history and manage your balance.', es: 'Consulta tu historial de pagos y gestiona tu saldo.' },
    noPayments: { en: 'You have no payment history.', es: 'No tienes historial de pagos.' },
    quickbooks: { en: 'We use QuickBooks for secure online payments.', es: 'Utilizamos QuickBooks para pagos seguros en línea.'}
  };

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
                <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{t.noPayments[language]}</p>
            </CardContent>
        </Card>

        <Card className="mt-8 bg-green-900/10 border-green-500/20">
            <CardHeader className="flex flex-row items-center gap-4">
                 <CreditCard className="h-8 w-8 text-green-500" />
                <div>
                    <CardTitle>QuickBooks Integration</CardTitle>
                    <CardDescription>{t.quickbooks[language]}</CardDescription>
                </div>
            </CardHeader>
        </Card>
    </div>
  );
}
