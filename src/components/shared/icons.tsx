import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center" aria-label="UREVENT 360 PLUS Home">
      <div className="font-headline text-xl font-bold tracking-tight text-primary md:text-2xl">
        UREVENT 360 <span className="text-accent">PLUS</span>
      </div>
    </Link>
  );
}
