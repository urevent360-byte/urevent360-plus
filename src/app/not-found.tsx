
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="max-w-md p-4">
        <Frown className="mx-auto h-24 w-24 text-primary/50" />
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-primary md:text-6xl">
          404 - Page Not Found
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-10">
          <Button asChild size="lg">
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
