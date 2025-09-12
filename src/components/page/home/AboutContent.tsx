'use client';
import { useLanguage } from '@/contexts/LanguageProvider';
import { translations } from '@/lib/translations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Rocket } from 'lucide-react';

export function AboutContent() {
  const { language } = useLanguage();
  
  const content = translations.about;

  return (
    <div>
       <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                {content.title[language]}
            </h2>
            <p className="mt-2 text-lg text-accent max-w-2xl mx-auto">
                {content.subtitle[language]}
            </p>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="text-lg text-foreground/80">
            {content.description1[language]}
          </p>
          <p className="text-lg text-foreground/80">
            {content.description2[language]}
          </p>
        </div>
        <div className="space-y-8">
          <Card className="bg-white text-gray-800 shadow-lg border-l-4 border-primary">
            <CardHeader className="flex flex-row items-center gap-4">
               <div className="bg-primary/10 p-3 rounded-full">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
              <CardTitle className="text-xl font-headline">{content.missionTitle[language]}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {content.missionText[language]}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white text-gray-800 shadow-lg border-l-4 border-accent">
             <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-accent/10 p-3 rounded-full">
                    <Rocket className="h-6 w-6 text-accent" />
                </div>
              <CardTitle className="text-xl font-headline">{content.visionTitle[language]}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {content.visionText[language]}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
