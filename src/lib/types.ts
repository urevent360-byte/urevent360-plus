
export type PlaceholderImage = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Collection: Clients
export type Client = {
  id: string; // Corresponds to Firebase Auth UID
  name: string;
  email: string;
  phone?: string;
  language: 'en' | 'es';
  profileInfo?: {
    photoURL?: string;
    [key: string]: any;
  };
};

// Collection: Leads
export type Lead = {
  id: string;
  clientId?: string; // Optional link to a client account
  name: string; // Name if not a client yet
  email: string; // Email if not a client yet
  serviceRequested: string;
  status: 'new' | 'contacted' | 'follow-up' | 'confirmed' | 'archived';
  notes?: string;
  timestamp: Date;
  eventId?: string;
};

// Collection: Services
export type Service = {
  id: string; // e.g., '360-photo-booth'
  name: string;
  description: string;
  category: 'Photo Booth' | 'Entertainment' | 'Special Effects' | 'Decor' | 'Other';
  images: { url: string; alt: string }[];
  videos?: { url: string; alt: string }[];
  seoKeywords: string[]; // Changed from comma-separated string to array
  seoMetadata: {
    title: string;
    description: string;
  };
  lastUpdated: Date;
};

// Collection: Photos / Media
export type Media = {
    id: string;
    serviceId: string;
    filename: string;
    altText: string;
    uploadDate: Date;
    type: 'image' | 'video';
    url: string;
    eventId: string;
    clientId: string;
};

// Collection: Events / Timeline
export type Event = {
  id: string;
  clientId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  reminders?: Date[];
  notes?: string;
};

// Collection: Chats
export type ChatMessage = {
  id: string;
  chatId: string;
  sender: 'client' | 'admin' | 'AI';
  message: string;
  timestamp: Date;
};

export type Chat = {
  id:string; // Associated with a client or booking
  clientId: string;
  messages: ChatMessage[];
};

// Collection: Admin Users
export type AdminUserRole = 'Super Admin' | 'Service Editor' | 'Photo Editor' | 'SEO Manager';

export type AdminUser = {
  id: string; // Corresponds to Firebase Auth UID
  name: string;
  email: string;
  role: AdminUserRole;
  permissions?: string[];
};

// Collection: Music / Playlists
export type Song = {
  title: string;
  artist: string;
};

export type MusicPlaylist = {
  id: string; // Could be the booking ID
  clientId: string;
  songList?: Song[]; // General requests
  mustPlay: Song[];
  doNotPlay: Song[];
  spotifyLink?: string;
};

// This represents a confirmed booking, linking multiple collections
export type Booking = {
  id: string;
  clientId: string;
  serviceId: string;
  eventId: string; // Link to the Event/Timeline entry
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'overdue';
  photoboothLink?: string; // External link to photo booth album
};
