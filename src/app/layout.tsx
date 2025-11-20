import './globals.css';
import Providers from './Providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="h-1.5 bg-accent" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
