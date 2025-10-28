
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center text-center">
      <div className="max-w-md">
        <Frown className="mx-auto h-24 w-24 text-primary opacity-30" />
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-primary md:text-6xl">
          404 - Page Not Found
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-10">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/">
              <Home className="mr-2" />
              Go to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
