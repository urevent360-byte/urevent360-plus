
'use client';
import { HeaderClient } from './HeaderClient';

export function Header({ logoUrl }: { logoUrl: string | null }) {  
  return <HeaderClient logoUrl={logoUrl} />;
}
