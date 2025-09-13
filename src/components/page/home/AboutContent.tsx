'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Rocket } from 'lucide-react';

export function AboutContent() {
  
  return (
    <div>
       <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                About UREVENT 360
            </h2>
            <p className="mt-2 text-lg text-accent max-w-2xl mx-auto">
                Crafting Unforgettable Moments, One Event at a Time
            </p>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="text-lg text-foreground/80">
            At UREVENT 360, we believe every event is an opportunity to create lasting memories. We are a passionate team dedicated to transforming your visions into spectacular realities. With years of experience in event planning and entertainment, we bring creativity, professionalism, and a touch of magic to every celebration.
          </p>
          <p className="text-lg text-foreground/80">
            Our mission is to provide seamless, stress-free event experiences that exceed expectations. From intimate gatherings to grand corporate affairs, we handle every detail with precision and care, ensuring your event is not just successful, but truly unforgettable. Let us bring your dream event to life!
          </p>
        </div>
        <div className="space-y-8">
          <Card className="bg-white text-gray-800 shadow-lg border-l-4 border-primary">
            <CardHeader className="flex flex-row items-center gap-4">
               <div className="bg-primary/10 p-3 rounded-full">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
              <CardTitle className="text-xl font-headline">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                To deliver exceptional event experiences through innovative solutions and unparalleled service.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white text-gray-800 shadow-lg border-l-4 border-accent">
             <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-accent/10 p-3 rounded-full">
                    <Rocket className="h-6 w-6 text-accent" />
                </div>
              <CardTitle className="text-xl font-headline">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                To be the leading event planning and entertainment provider, known for creativity, reliability, and client satisfaction.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
