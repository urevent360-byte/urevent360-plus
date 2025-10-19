import { permanentRedirect } from 'next/navigation';

export default function HomeAlias() {
  // Permanently redirect /home -> /
  permanentRedirect('/');
}
