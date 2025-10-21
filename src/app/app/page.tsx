// src/app/app/page.tsx
import { redirect } from 'next/navigation';

export default function AppIndex() {
  redirect('/app/dashboard');
}
