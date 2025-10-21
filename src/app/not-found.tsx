
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Wrench, Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center text-center p-4 md:p-8 bg-background">
      <div className="max-w-md">
        <Frown className="mx-auto h-24 w-24 text-primary opacity-30" />
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-primary md:text-6xl">
          404 - Page Not Found
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2" />
              Go to Homepage
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/services">
              <Wrench className="mr-2" />
              Explore Services
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
