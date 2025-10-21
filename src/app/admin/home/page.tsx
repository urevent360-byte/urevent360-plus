import { redirect } from 'next/navigation';

export default function AdminHomeAlias() {
  redirect('/admin/dashboard');
}
