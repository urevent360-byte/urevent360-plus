export type PlaceholderImage = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Client account information, ties into Firebase Auth
export type Client = {
  uid: string; // Corresponds to Firebase Auth UID
  name: string;
  email: string;
  languagePreference: 'en' | 'es';
  photoURL?: string;
};

// For inquiries and potential customers
export type Lead = {
  id: string;
  name: string;
  email: string;
  message: string;
  languagePreference: 'en' | 'es';
  status: 'new' | 'contacted' | 'converted' | 'archived';
  createdAt: Date;
};

// Represents a booked service by a client
export type Booking = {
  id: string;
  clientId: string; // Links to Client.uid
  serviceId: string; // e.g., '360-photo-booth'
  serviceName: string;
  eventDate: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};

// For internal notes or client requests related to a booking
export type ClientNote = {
  id: string;
  bookingId: string; // Links to Booking.id
  text: string;
  isInternal: boolean; // True if for admin eyes only
  createdAt: Date;
  authorId: string; // UID of creator
};

// Timeline for a specific event/booking
export type TimelineEvent = {
  id: string;
  time: string; // e.g., "7:00 PM"
  description: string;
};

export type Timeline = {
  id: string;
  bookingId: string; // Links to Booking.id
  events: TimelineEvent[];
};

// Chat messages for a booking
export type ChatMessage = {
  id: string;
  senderId: string; // UID of the sender
  text: string;
  timestamp: Date;
};

export type Chat = {
  id: string;
  bookingId: string; // Links to Booking.id
  messages: ChatMessage[];
};

// Music preferences for an event
export type Song = {
  id: string;
  title: string;
  artist: string;
  spotifyUrl?: string;
};

export type MusicPlaylist = {
  id:string;
  bookingId: string; // Links to Booking.id
  mustPlay: Song[];
  doNotPlay: Song[];
};


// === Admin & Service Management Types ===

export type ServiceImage = {
  id: string;
  serviceId: string;
  url: string; // URL to the image in storage
  altText: string;
  uploadDate: Date;
};

export type Service = {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: 'Photo Booth' | 'Entertainment' | 'Special Effects' | 'Decor' | 'Other';
  keywords: string; // Comma-separated string
  images: ServiceImage[];
  metaTitle: string;
  metaDescription: string;
  lastUpdated: Date;
};

export type AdminUserRole = 'Super Admin' | 'Service Editor' | 'Photo Editor' | 'SEO Manager';

export type AdminUser = {
  id: string; // Corresponds to Firebase Auth UID
  name: string;
  email: string;
  role: AdminUserRole;
};
