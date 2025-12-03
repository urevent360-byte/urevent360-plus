'use client';

import { useLanguage } from '@/contexts/LanguageProvider';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-full border bg-white/80 p-1 shadow-sm text-xs overflow-hidden">
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={cn(
          'px-3 py-1 transition-colors rounded-full',
          language === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('es')}
        className={cn(
          'px-3 py-1 transition-colors rounded-full',
          language === 'es' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
        )}
      >
        ES
      </button>
    </div>
  );
}
