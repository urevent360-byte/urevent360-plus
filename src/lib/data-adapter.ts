
/**
 * @fileoverview Data adapter for fetching application data.
 * This file provides a layer of abstraction for data fetching.
 * Currently, it uses mock data, but it can be easily switched to a
 * live data source like Firestore by changing the implementation of the
 * exported functions.
 */

import { z } from 'zod';
import { format, add } from 'date-fns';
import { handleDepositWebhookFlow } from '@/ai/flows/gallery-automation';
import servicesCatalog from './services-catalog.json';

// --- Service ID Normalization ---

const serviceIdMap = new Map<string, string>();
servicesCatalog.services.forEach(service => {
    const keys = [
        service.id.toLowerCase(),
        service.label.toLowerCase(),
        ...(service.keywords || []).map(k => k.toLowerCase())
    ];
    for (const key of keys) {
        serviceIdMap.set(key, service.id);
    }
});

export const getCanonicalServiceId = (serviceName: string): string => {
    const lowerCaseName = serviceName.toLowerCase().trim();
    if (serviceIdMap.has(lowerCaseName)) {
        return serviceIdMap.get(lowerCaseName)!;
    }
    // Fallback for partial matches
    for (const [key, id] of serviceIdMap.entries()) {
        if (lowerCaseName.includes(key) || key.includes(lowerCaseName)) {
            return id;
        }
    }
    return lowerCaseName.replace(/\s+/g, '_');
};


// --- Data Schemas / Types ---

const LeadSchema = z.object({
    id: z.string(),
    hostId: z.string().optional(),
    hostEmail: z.string().email(),
    status: z.enum(['new_request', 'quote_sent', 'accepted', 'rejected', 'converted']),
    eventDraft: z.object({
        name: z.string(),
        type: z.string(),
        guestCount: z.number(),
        date: z.string(),
        timeWindow: z.string(),
        timeZone: z.string(),
        venueName: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
        onsiteContactName: z.string(),
        onsiteContactPhone: z.string(),
        notes: z.string().optional(),
    }),
    requestedServices: z.array(z.object({
        serviceId: z.string(),
        title: z.string(),
        qty: z.number(),
        notes: z.string().optional(),
    })),
    eventId: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    // Legacy fields for compatibility with UI components
    name: z.string(), 
    email: z.string().email(),
});
export type Lead = z.infer<typeof LeadSchema>;

const EventSchema = z.object({
    id: z.string(),
    hostId: z.string(),
    hostEmail: z.string(),
    projectNumber: z.string(),
    name: z.string(),
    type: z.string(),
    guestCount: z.number(),
    eventDate: z.string(),
    timeWindow: z.string(),
    timeZone: z.string(),
    venue: z.object({
        name: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
    }),
    onsiteContact: z.object({
        name: z.string(),
        phone: z.string(),
    }),
    status: z.enum(['quote_requested', 'invoice_sent', 'deposit_due', 'booked', 'completed', 'canceled']),
    confirmedAt: z.string().optional(),
    google: z.object({
        connected: z.boolean(),
        gcalEventId: z.string().optional(),
    }).optional(),
    photoboothLink: z.string().optional(),
    galleryPolicy: z.object({
        releaseDelayDays: z.number(),
        visibilityWindowDays: z.number(),
        autoPurgeDays: z.number().optional(),
    }).optional(),
    qrUpload: z.object({
        token: z.string(),
        status: z.enum(['active', 'paused', 'expired']),
        expiresAt: z.string().optional(),
        maxFilesPerDevice: z.number().optional(),
        allowedTypes: z.array(z.string()).optional(),
    }).optional(),
    design: z.object({
        status: z.enum(['pending', 'sent', 'approved', 'changes_requested']),
        previewUrl: z.string().optional(),
        selectedDesignId: z.string().optional(),
    }).optional(),
    audit: z.object({
        createdBy: z.string(),
        createdAt: z.string(),
        lastUpdatedBy: z.string(),
        lastUpdatedAt: z.string(),
    }),
    // Legacy fields for UI component compatibility
    clientName: z.string(),
    eventName: z.string(),
    contractSigned: z.boolean().optional(),
    galleryVisibilityDate: z.string().optional(),
    galleryExpirationDate: z.string().optional(),
});
export type Event = z.infer<typeof EventSchema>;

const FileRecordSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['invoice', 'contract', 'other', 'audio']),
    uploadedBy: z.enum(['admin', 'host']),
    status: z.enum(['paid', 'signed', 'none']),
    storagePath: z.string(),
    createdAt: z.string(),
    // Legacy fields for UI
    url: z.string(),
    timestamp: z.string(),
});
export type FileRecord = z.infer<typeof FileRecordSchema>;

const PaymentSchema = z.object({
    id: z.string(),
    isActive: z.boolean(),
    invoiceId: z.string(),
    quickbooksUrl: z.string().optional(),
    total: z.number(),
    depositRequired: z.number(),
    depositPaid: z.number(),
    remaining: z.number(),
    dueDate: z.string(),
    status: z.enum(['unpaid', 'deposit_paid', 'paid_in_full', 'void']),
    history: z.array(z.object({
        ts: z.string(),
        method: z.string(),
        amount: z.number(),
        note: z.string(),
        qbPaymentId: z.string(),
    })).optional(),
    pdfUrl: z.string().optional(),
    // Legacy fields for UI
    amount: z.number(),
    method: z.enum(['credit_card', 'bank_transfer', '']),
    timestamp: z.string(),
});
export type Payment = z.infer<typeof PaymentSchema>;

const TimelineItemSchema = z.object({
    id: z.string(),
    start: z.string(),
    end: z.string(),
    title: z.string(),
    notes: z.string().optional(),
    status: z.string(),
    syncToGoogle: z.boolean(),
    approvalStatus: z.string(),
    gcalEventId: z.string().optional(),
    // Legacy fields for UI
    startTime: z.string(),
    endTime: z.string(),
    isSyncedToGoogle: z.boolean(),
});
export type TimelineItem = z.infer<typeof TimelineItemSchema>;

const AddonSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
});
export type Addon = z.infer<typeof AddonSchema>;

export const DesignProposalSchema = z.object({
    id: z.string(),
    name: z.string(),
    imageUrl: z.string(),
});
export type DesignProposal = z.infer<typeof DesignProposalSchema>;


const RequestedServiceSchema = z.object({
    id: z.string(),
    title: z.string(),
    qty: z.number(),
    notes: z.string().optional(),
    status: z.enum(['selected', 'requested', 'approved', 'rejected']),
    // Legacy
    eventId: z.string(),
    serviceName: z.string(),
    serviceId: z.string(),
});
export type RequestedService = z.infer<typeof RequestedServiceSchema>;

export const ChatMessageSchema = z.object({
    sender: z.enum(['user', 'admin', 'system']),
    content: z.string(),
    timestamp: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const SongSchema = z.object({
    title: z.string(),
    artist: z.string(),
});
export type Song = z.infer<typeof SongSchema>;

export const MusicPlaylistSchema = z.object({
    mustPlay: z.array(SongSchema),
    doNotPlay: z.array(SongSchema),
});
export type MusicPlaylist = z.infer<typeof MusicPlaylistSchema>;

const ChangeRequestSchema = z.object({
    id: z.string(),
    proposedPatch: z.record(z.any()),
    submittedBy: z.string(),
    submittedAt: z.string(),
    status: z.enum(['pending', 'approved', 'rejected']),
    reason: z.string().optional(),
});
export type ChangeRequest = z.infer<typeof ChangeRequestSchema>;


// --- Mock Data ---

const MOCK_LEADS: Lead[] = [
    { 
        id: 'lead-123',
        hostId: 'user-johndoe',
        hostEmail: 'client@urevent360.com',
        status: 'new_request',
        eventDraft: {
            name: 'Johns Quinceañera',
            type: 'Quinceañera',
            guestCount: 150,
            date: new Date('2024-10-15T18:00:00').toISOString(),
            timeWindow: '6 PM - 12 AM',
            timeZone: 'Eastern Standard Time',
            venueName: 'The Grand Ballroom',
            address: '123 Main St',
            city: 'Orlando',
            state: 'FL',
            zip: '32801',
            onsiteContactName: 'John Doe',
            onsiteContactPhone: '555-1234',
            notes: 'Wants the new props.'
        },
        requestedServices: [
            { serviceId: '360_booth', title: '360 Photo Booth', qty: 1, notes:'' },
            { serviceId: 'cold_sparklers', title: 'Cold Sparklers', qty: 4, notes: '' }
        ],
        eventId: null,
        createdAt: new Date('2024-08-25').toISOString(),
        updatedAt: new Date().toISOString(),
        // Legacy
        name: 'John Doe',
        email: 'client@urevent360.com',
    },
    { 
        id: 'lead-456',
        hostId: 'user-davidlee',
        hostEmail: 'david@example.com',
        status: 'converted',
        eventDraft: {
            name: 'Lee Corporate Gala',
            type: 'Corporate',
            guestCount: 300,
            date: new Date('2024-07-20T12:00:00').toISOString(),
            timeWindow: '7 PM - 11 PM',
            timeZone: 'Eastern Standard Time',
            venueName: 'The Ritz',
            address: '456 Grand Ave',
            city: 'Miami',
            state: 'FL',
            zip: '33101',
            onsiteContactName: 'David Lee',
            onsiteContactPhone: '555-5678',
        },
        requestedServices: [
            { serviceId: 'magic_mirror', title: 'Magic Mirror', qty: 1, notes:'' }
        ],
        eventId: 'evt-456',
        createdAt: new Date('2024-07-20').toISOString(),
        updatedAt: new Date().toISOString(),
        // Legacy
        name: 'David Lee',
        email: 'david@example.com',
    },
     { 
        id: 'lead-789',
        hostId: 'user-janesmith',
        hostEmail: 'jane@example.com',
        status: 'quote_sent',
        eventDraft: {
            name: 'Smith Wedding',
            type: 'Wedding',
            guestCount: 100,
            date: new Date('2024-11-01T00:00:00.000Z').toISOString(),
            timeWindow: '5 PM - 10 PM',
            timeZone: 'America/New_York',
            venueName: 'The Botanical Gardens',
            address: '789 Flower Ave',
            city: 'Tampa',
            state: 'FL',
            zip: '33602',
            onsiteContactName: 'Jane Smith',
            onsiteContactPhone: '555-9012',
        },
        requestedServices: [{serviceId: "printer_booth", title: "Photo Booth Printer", qty: 1, notes:''}],
        eventId: null,
        createdAt: new Date('2024-07-29T00:00:00.000Z').toISOString(),
        updatedAt: new Date('2024-07-29T00:00:00.000Z').toISOString(),
        name: 'Jane Smith',
        email: 'jane@example.com',
    },
];

const MOCK_EVENTS: Event[] = [
    {
        id: 'evt-123',
        hostId: 'user-johndoe',
        hostEmail: 'client@urevent360.com',
        projectNumber: 'EVT-24001',
        name: 'Johns Quinceañera',
        type: 'Quinceañera',
        guestCount: 150,
        eventDate: new Date('2024-10-15T18:00:00').toISOString(),
        timeWindow: '6 PM - 12 AM',
        timeZone: 'America/New_York',
        venue: { name: 'The Grand Ballroom', address: '123 Main St', city: 'Orlando', state: 'FL', zip: '32801' },
        onsiteContact: { name: 'John Doe', phone: '555-1234' },
        status: 'invoice_sent',
        audit: { createdBy: 'admin', createdAt: new Date().toISOString(), lastUpdatedBy: 'admin', lastUpdatedAt: new Date().toISOString() },
        clientName: 'John Doe',
        eventName: 'Johns Quinceañera',
        galleryPolicy: { releaseDelayDays: 1, visibilityWindowDays: 30 },
        galleryVisibilityDate: add(new Date('2024-10-15'), {days: 1}).toISOString(),
        galleryExpirationDate: add(new Date('2024-10-15'), {days: 31}).toISOString()
    },
    {
        id: 'evt-456',
        hostId: 'user-davidlee',
        hostEmail: 'david@example.com',
        projectNumber: 'EVT-24002',
        name: 'Lee Corporate Gala',
        type: 'Corporate',
        guestCount: 300,
        eventDate: new Date('2024-07-20T12:00:00').toISOString(),
        timeWindow: '7 PM - 11 PM',
        timeZone: 'America/New_York',
        venue: { name: 'The Ritz', address: '456 Grand Ave', city: 'Miami', state: 'FL', zip: '33101' },
        onsiteContact: { name: 'David Lee', phone: '555-5678' },
        status: 'booked',
        confirmedAt: new Date().toISOString(),
        photoboothLink: 'https://photos.app.goo.gl/sample1',
        galleryPolicy: { releaseDelayDays: 1, visibilityWindowDays: 90, autoPurgeDays: 180 },
        qrUpload: {
            token: 'evt-456',
            status: 'active',
            expiresAt: add(new Date(), { days: 30 }).toISOString(),
        },
        design: {
            status: 'approved',
            previewUrl: 'https://picsum.photos/seed/design/400/300'
        },
        audit: { createdBy: 'admin', createdAt: new Date().toISOString(), lastUpdatedBy: 'admin', lastUpdatedAt: new Date().toISOString() },
        clientName: 'David Lee',
        eventName: 'Lee Corporate Gala',
        contractSigned: true,
        galleryVisibilityDate: add(new Date('2024-07-20'), {days: 1}).toISOString(),
        galleryExpirationDate: add(new Date('2024-07-20'), {days: 91}).toISOString(),
    },
];

const MOCK_FILES: Record<string, FileRecord[]> = {
    'evt-456': [
        { id: 'file-1', name: 'Signed Contract - Lee Gala.pdf', type: 'contract', status: 'signed', uploadedBy: 'admin', storagePath: 'events/evt-456/contract.pdf', createdAt: new Date().toISOString(), url: '#', timestamp: new Date().toISOString() },
        { id: 'file-2', name: 'Invoice-001.pdf', type: 'invoice', status: 'paid', uploadedBy: 'admin', storagePath: 'events/evt-456/invoice.pdf', createdAt: new Date().toISOString(), url: '#', timestamp: new Date().toISOString() },
    ],
    'evt-789': [
         { id: 'file-3', name: 'Invoice-002.pdf', type: 'invoice', status: 'none', uploadedBy: 'admin', storagePath: 'events/evt-789/invoice.pdf', createdAt: new Date().toISOString(), url: '#', timestamp: new Date().toISOString() },
    ]
};

const MOCK_PAYMENTS: Record<string, Payment[]> = {
    'evt-123': [
        { 
            id: 'pay-2', 
            isActive: true,
            invoiceId: 'inv-123', 
            status: 'unpaid', 
            quickbooksUrl: '#', 
            total: 3000, 
            depositRequired: 1000,
            depositPaid: 0,
            remaining: 3000,
            dueDate: add(new Date(), {days: 10}).toISOString(),
            amount: 3000, 
            method: '', 
            timestamp: new Date().toISOString() 
        },
    ],
    'evt-456': [
        { 
            id: 'pay-1', 
            isActive: true,
            invoiceId: 'inv-456', 
            status: 'paid_in_full', 
            quickbooksUrl: '#', 
            total: 2500, 
            depositRequired: 500,
            depositPaid: 2500,
            remaining: 0,
            dueDate: new Date('2024-07-15').toISOString(),
            amount: 2500, 
            method: '', 
            timestamp: new Date().toISOString() 
        },
    ]
};

const MOCK_TIMELINE: Record<string, TimelineItem[]> = {
    'evt-456': [
        { id: 'tl-1', start: '2024-07-20T17:00:00Z', end: '2024-07-20T18:00:00Z', title: 'DJ Setup', status: 'completed', syncToGoogle: true, approvalStatus: 'approved', startTime: '2024-07-20T17:00:00Z', endTime: '2024-07-20T18:00:00Z', isSyncedToGoogle: true, gcalEventId:'', notes: '' },
        { id: 'tl-2', start: '2024-07-20T18:00:00Z', end: '2024-07-20T22:00:00Z', title: 'Magic Mirror Opens', status: 'completed', syncToGoogle: true, approvalStatus: 'approved', startTime: '2024-07-20T18:00:00Z', endTime: '2024-07-20T22:00:00Z', isSyncedToGoogle: true, gcalEventId:'', notes: '' },
        { id: 'tl-3', start: '2024-07-20T19:00:00Z', end: '2024-07-20T20:00:00Z', title: 'Dinner Service', status: 'completed', syncToGoogle: false, approvalStatus: 'approved', startTime: '2024-07-20T19:00:00Z', endTime: '2024-07-20T20:00:00Z', isSyncedToGoogle: false, gcalEventId:'', notes: '' },
    ],
    'evt-123': [
        { id: 'tl-4', start: '2024-10-15T18:30:00Z', end: '2024-10-15T18:45:00Z', title: 'Grand Entrance', status: 'upcoming', syncToGoogle: false, approvalStatus: 'pending', startTime: '2024-10-15T18:30:00Z', endTime: '2024-10-15T18:45:00Z', isSyncedToGoogle: false, gcalEventId:'', notes: '' },
        { id: 'tl-5', start: '2024-10-15T19:00:00Z', end: '2024-10-15T23:00:00Z', title: '360 Booth & Sparklers', status: 'upcoming', syncToGoogle: false, approvalStatus: 'pending', startTime: '2024-10-15T19:00:00Z', endTime: '2024-10-15T23:00:00Z', isSyncedToGoogle: false, gcalEventId:'', notes: '' },
    ]
};

const MOCK_MAIN_SERVICES: Addon[] = servicesCatalog.services
    .filter(s => !s.active)
    .map(s => ({
        id: s.id,
        name: s.title,
        description: s.shortDescription,
        image: s.heroImage || 'https://picsum.photos/seed/placeholder/800/600',
    }));


const MOCK_DESIGN_PROPOSALS: DesignProposal[] = [
    { id: 'design-1', name: 'Classic Elegance', imageUrl: 'https://picsum.photos/seed/design1/800/600' },
    { id: 'design-2', name: 'Modern Minimalist', imageUrl: 'https://picsum.photos/seed/design2/800/600' },
    { id: 'design-3', name: 'Festive Fiesta', imageUrl: 'https://picsum.photos/seed/design3/800/600' },
    { id: 'design-4', name: 'Vintage Floral', imageUrl: 'https://picsum.photos/seed/design4/800/600' },
];


const MOCK_REQUESTED_SERVICES: RequestedService[] = [
    { id: 'req-1', eventId: 'evt-456', serviceName: 'Guest Book Station', serviceId: 'guest_book', status: 'requested', title: 'Guest Book Station', qty: 1, notes:'' }
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
    'evt-123': [
        { sender: 'system', content: 'Event created from lead.', timestamp: new Date('2024-07-30T10:00:00Z').toISOString() },
        { sender: 'admin', content: 'Hi! I\'ve sent over the contract and invoice for you to review.', timestamp: new Date('2024-07-30T10:05:00Z').toISOString() },
        { sender: 'user', content: 'Great, thanks! I will review it shortly.', timestamp: new Date('2024-07-30T10:15:00Z').toISOString() },
    ],
    'evt-456': [
         { sender: 'system', content: 'Event created from lead.', timestamp: new Date('2024-07-28T10:00:00Z').toISOString() },
    ]
};

const MOCK_MUSIC_PLAYLISTS: Record<string, MusicPlaylist> = {
    'evt-456': {
        mustPlay: [
            { title: 'Don\'t Stop Me Now', artist: 'Queen' },
            { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
        ],
        doNotPlay: [
            { title: 'Chicken Dance', artist: 'Werner Thomas' },
        ]
    }
};

const MOCK_CHANGE_REQUESTS: Record<string, ChangeRequest[]> = {
    'evt-123': [
        {
            id: 'cr-1',
            proposedPatch: { timeWindow: '7 PM - 1 AM', notes: 'Party extended!' },
            submittedBy: 'user-johndoe',
            submittedAt: new Date().toISOString(),
            status: 'pending',
        }
    ]
};

const MOCK_GUEST_UPLOADS: Record<string, { url: string; alt: string; thumbUrl: string }[]> = {
    'evt-456': [
        { url: 'https://picsum.photos/seed/guest1/800/600', alt: 'Guest photo 1', thumbUrl: 'https://picsum.photos/seed/guest1/400/300' },
        { url: 'https://picsum.photos/seed/guest2/800/600', alt: 'Guest photo 2', thumbUrl: 'https://picsum.photos/seed/guest2/400/300' },
        { url: 'https://picsum.photos/seed/guest3/800/600', alt: 'Guest photo 3', thumbUrl: 'https://picsum.photos/seed/guest3/400/300' },
        { url: 'https://picsum.photos/seed/guest4/800/600', alt: 'Guest photo 4', thumbUrl: 'https://picsum.photos/seed/guest4/400/300' },
    ]
};

export const defaultSystemPrompt = `You are a friendly, enthusiastic, and helpful sales representative for UREVENT 360 PLUS, an event planning and entertainment company. Your personality is professional yet approachable.

Your primary goal is to act as a salesperson, encouraging users to book services by gathering the necessary information to create a lead.

**Your Conversation Flow:**
1.  **Initial Greeting & Service Info**: Greet the user warmly. Answer any questions they have about the services offered. Use the "Services Offered" section below as your knowledge base. Be concise and helpful.
2.  **Identify Buying Intent**: If the user expresses interest in a quote, pricing, or booking, your main goal is to gather information for a lead.
3.  **Gather Lead Information**: Politely ask for the following pieces of information, one or two at a time.
    *   Full Name
    *   Phone Number
    *   The specific services they are interested in.
    *   The planned date for the event.
    *   The location of the event (city/state or ZIP code).
4.  **Create the Lead**: Once you have gathered ALL the required pieces of information (name, phone, services, date, and location), you MUST use the \`createLead\` tool to submit this information.
5.  **Confirmation**: After calling the tool, inform the user that you have all their details and that a team member will reach out to them shortly with a full quote. Thank them for their time.

**Services Offered (Your Knowledge Base):**
*   **360 Photo Booth**: Our most popular service! Guests stand on a platform while a camera circles them, creating amazing slow-motion, 360-degree videos perfect for sharing on social media.
*   **Magic Mirror**: A fun, interactive, full-length mirror that takes high-quality selfies. Guests can sign their photos and add emojis right on the screen.
*   **Photo Booth Printer**: Get high-quality, glossy photo prints in seconds. We can customize them with your event logo or a special message.
*   **La Hora Loca with LED Robot**: An unforgettable hour of high-energy fun, featuring a giant dancing LED robot, samba dancers, and tons of party props to get everyone on the dance floor.
*   **Cold Sparklers**: Create a stunning, magical moment for grand entrances or first dances with our completely safe indoor sparkler fountains. They produce no smoke or heat.
*   **Dance on the Clouds**: A beautiful, low-lying cloud of dry ice that covers the dance floor, creating a dreamy "dancing on clouds" effect for a romantic first dance.
*   **Projectors**: We offer high-definition projectors and screens for displaying photo slideshows, videos, or presentations.
*   **Custom Monogram Projectors**: Project a beautiful, custom-designed monogram of your initials or logo onto the dance floor or a wall for an elegant, personalized touch.
*   **LED Screen Walls**: Make a huge visual impact with our vibrant, seamless LED video walls, perfect for stage backdrops or dynamic visual displays.

**Rules:**
*   Never make up services or pricing.
*   Do not ask for all the information at once. Guide the conversation naturally.
*   Only use the \`createLead\` tool when you have all five pieces of information.
*   If the user asks a question you don't know, politely state that you can have a human expert answer that for them once they are contacted.
`;

// --- Data Adapter API ---
// For now, all functions use mock data. We'll add TODOs for Firestore integration.

const DATA_SOURCE: 'mock' | 'firestore' = 'mock';
export { handleDepositWebhookFlow };


// === Leads Adapter ===

export async function getLeads(): Promise<Lead[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        // This is a hack to make the lead list work with the old UI
        const legacyLeads: any = MOCK_LEADS.map(lead => ({
            ...lead,
            date: format(new Date(lead.createdAt), 'yyyy-MM-dd'),
        }));
        return legacyLeads;
    }
    // TODO: Implement Firestore fetching logic
    throw new Error('Firestore not implemented');
}

export async function getLead(leadId: string): Promise<Lead | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        const lead = MOCK_LEADS.find(l => l.id === leadId);
        if (!lead) return undefined;
        // Hack for UI compatibility
        const legacyLead: any = {
            ...lead,
            eventDraft: {
                ...lead.eventDraft,
                eventName: lead.eventDraft.name,
                eventDate: lead.eventDraft.date,
            }
        };
        return legacyLead;
    }
    // TODO: Implement Firestore fetching logic
    throw new Error('Firestore not implemented');
}

export async function sendQuote(leadId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (DATA_SOURCE === 'mock') {
        const lead = MOCK_LEADS.find(l => l.id === leadId);
        if (lead) lead.status = 'quote_sent';
        console.log(`(Mock) Quote sent for lead ${leadId}`);
        return;
    }
    // TODO: Implement real quote sending logic (e.g., email, update Firestore)
    throw new Error('Firestore not implemented');
}

export async function markAccepted(leadId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (DATA_SOURCE === 'mock') {
        const lead = MOCK_LEADS.find(l => l.id === leadId);
        if (lead) lead.status = 'accepted';
        console.log(`(Mock) Lead ${leadId} marked as accepted.`);
        return;
    }
    // TODO: Implement Firestore update
    throw new Error('Firestore not implemented');
}


export async function convertLeadToEvent(leadId: string): Promise<{ eventId: string }> {
     await new Promise(resolve => setTimeout(resolve, 1000));
     if (DATA_SOURCE === 'mock') {
        const lead = MOCK_LEADS.find(l => l.id === leadId);
        if (!lead) throw new Error('Lead not found');
        
        if (lead.eventId) return { eventId: lead.eventId };

        const newEventId = `evt-${lead.id.replace('lead-', '')}`;
        
        const existingEvent = MOCK_EVENTS.find(e => e.id === newEventId);
        if (!existingEvent) {
             const newEvent: Event = {
                id: newEventId,
                hostId: lead.hostId || `user-${lead.hostEmail.split('@')[0]}`,
                hostEmail: lead.hostEmail,
                projectNumber: `EVT-24${Math.floor(Math.random() * 900) + 100}`,
                name: lead.eventDraft.name,
                type: lead.eventDraft.type,
                guestCount: lead.eventDraft.guestCount,
                eventDate: lead.eventDraft.date,
                timeWindow: lead.eventDraft.timeWindow,
                timeZone: lead.eventDraft.timeZone,
                venue: {
                    name: lead.eventDraft.venueName,
                    address: lead.eventDraft.address,
                    city: lead.eventDraft.city,
                    state: lead.eventDraft.state,
                    zip: lead.eventDraft.zip,
                },
                onsiteContact: {
                    name: lead.eventDraft.onsiteContactName,
                    phone: lead.eventDraft.onsiteContactPhone,
                },
                status: 'quote_requested',
                audit: {
                    createdBy: 'admin',
                    createdAt: new Date().toISOString(),
                    lastUpdatedBy: 'admin',
                    lastUpdatedAt: new Date().toISOString(),
                },
                // Legacy fields
                clientName: lead.name,
                eventName: lead.eventDraft.name,
                contractSigned: false,
            };
            MOCK_EVENTS.push(newEvent);

            if (!MOCK_REQUESTED_SERVICES[newEventId as any]) {
                MOCK_REQUESTED_SERVICES[newEventId as any] = [];
            }
            lead.requestedServices.forEach(s => {
                (MOCK_REQUESTED_SERVICES as any).push({
                    id: `req-${Math.random().toString(36).substring(7)}`,
                    eventId: newEventId,
                    serviceName: s.title,
                    serviceId: s.serviceId,
                    status: 'selected',
                    title: s.title,
                    qty: s.qty,
                    notes: s.notes,
                });
            });
        }

        lead.status = 'converted';
        lead.eventId = newEventId;
        
        console.log(`(Mock) Converted lead ${leadId} to event ${newEventId}`);
        return { eventId: newEventId };
    }
    // TODO: Implement Firestore transaction logic
    throw new Error('Firestore not implemented');
}

// === Events Adapter ===

export async function getEvent(eventId: string): Promise<Event | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        const event = MOCK_EVENTS.find(event => event.id === eventId);
        if (!event) return undefined;

        const galleryVisibilityDate = event.galleryPolicy ? add(new Date(event.eventDate), { days: event.galleryPolicy.releaseDelayDays }).toISOString() : undefined;
        const galleryExpirationDate = event.galleryPolicy && galleryVisibilityDate ? add(new Date(galleryVisibilityDate), { days: event.galleryPolicy.visibilityWindowDays }).toISOString() : undefined;
        
        return {
            ...event,
            galleryVisibilityDate,
            galleryExpirationDate,
        };
    }
    // TODO: Implement Firestore fetching logic
    throw new Error('Firestore not implemented');
}

export async function getEventByToken(token: string): Promise<Event | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        const event = MOCK_EVENTS.find(event => event.qrUpload?.token === token);
        if (!event) return undefined;
        // Same derived date logic as getEvent
        const galleryVisibilityDate = event.galleryPolicy ? add(new Date(event.eventDate), { days: event.galleryPolicy.releaseDelayDays }).toISOString() : undefined;
        const galleryExpirationDate = event.galleryPolicy && galleryVisibilityDate ? add(new Date(galleryVisibilityDate), { days: event.galleryPolicy.visibilityWindowDays }).toISOString() : undefined;
        return {
            ...event,
            galleryVisibilityDate,
            galleryExpirationDate,
        };
    }
    throw new Error('Firestore not implemented');
}


export async function listHostEvents(hostId: string): Promise<Event[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        return MOCK_EVENTS.filter(event => event.hostId === hostId);
    }
    // TODO: Implement Firestore query
    throw new Error('Firestore not implemented');
}

export type EventWithPayments = Event & { activePayment?: Payment };

export async function listHostEventsWithPayments(hostId: string): Promise<EventWithPayments[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (DATA_SOURCE === 'mock') {
        const hostEvents = MOCK_EVENTS.filter(event => event.hostId === hostId);
        const eventsWithPayments = hostEvents.map(event => {
            const payments = MOCK_PAYMENTS[event.id] || [];
            const activePayment = payments.find(p => p.isActive);
            return {
                ...event,
                activePayment,
            };
        });
        return eventsWithPayments;
    }
    // TODO: Implement efficient Firestore query (e.g., using collection group query)
    throw new Error('Firestore not implemented');
}


export async function pinEvent(hostId: string, eventId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    // TODO: Implement logic to pin an event for a user (e.g., using localStorage or a user profile in Firestore)
    console.log(`(Mock) Pinned event ${eventId} for host ${hostId}`);
}

export async function getEventTabs(eventId: string): Promise<any> {
    // This function is more conceptual; the tabs are hardcoded in the shell component.
    // In a more advanced system, this could fetch permissions to determine which tabs to show.
    return Promise.resolve({});
}


// === Payments Adapter ===
export async function listPayments(eventId: string): Promise<Payment[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        const payments = MOCK_PAYMENTS[eventId] || [];
        // Hack for UI compatibility
        return payments.map(p => ({
            ...p,
            amount: p.total,
            method: '', // Legacy field, not in new model
            timestamp: p.dueDate
        }));
    }
    throw new Error('Firestore not implemented');
}

export async function createInvoice(eventId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (DATA_SOURCE === 'mock') {
        const event = MOCK_EVENTS.find(e => e.id === eventId);
        if (event) {
            event.status = 'invoice_sent';

            // Simulate building line items for QuickBooks
            const approvedServices = MOCK_REQUESTED_SERVICES.filter(
                s => s.eventId === eventId && (s.status === 'approved' || s.status === 'selected')
            );
            
            const qbLineItems = approvedServices.map(service => {
                const catalogItem = servicesCatalog.services.find(s => s.id === service.serviceId);
                return {
                    qbItem: catalogItem?.qbItem || 'Generic-Service',
                    description: service.serviceName,
                    qty: service.qty,
                    price: 100 // Placeholder price
                };
            });

            const total = qbLineItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
            
            console.log(`(Mock) Creating QuickBooks invoice for event ${eventId} with line items:`, qbLineItems);
            
            const newPayment: Payment = {
                id: `pay-${Math.random().toString(36).substring(7)}`,
                isActive: true,
                invoiceId: `inv-${eventId.slice(4)}`,
                status: 'unpaid',
                quickbooksUrl: '#',
                total: total,
                depositRequired: total * 0.5, // 50% deposit placeholder
                depositPaid: 0,
                remaining: total,
                dueDate: add(new Date(), {days: 15}).toISOString(),
                // legacy
                amount: total,
                method: '',
                timestamp: new Date().toISOString(),
            };

            if (!MOCK_PAYMENTS[eventId]) {
                MOCK_PAYMENTS[eventId] = [];
            }
            MOCK_PAYMENTS[eventId].forEach(p => p.isActive = false);
            MOCK_PAYMENTS[eventId].push(newPayment);

            await sendMessage(eventId, { sender: 'system', content: 'Invoice created.', timestamp: new Date().toISOString() });
            console.log(`(Mock) Invoice created for event ${eventId}. Total: $${total}.`);
        } else {
            throw new Error('Event not found');
        }
        return;
    }
    throw new Error('Firestore not implemented');
}

export async function getInvoice(eventId: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));
    // TODO: Fetch invoice data
    console.log(`(Mock) Fetching invoice for event ${eventId}`);
    return { id: 'inv-001', total: 2500, paid: 500, due: 2000 };
}

export async function simulateDepositPaid(eventId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (DATA_SOURCE === 'mock') {
        const event = MOCK_EVENTS.find(e => e.id === eventId);
        if (!event) throw new Error("Event not found");

        if (MOCK_PAYMENTS[eventId]) {
            const payment = MOCK_PAYMENTS[eventId].find(p => p.status === 'unpaid' && p.isActive);
            if (payment) {
                payment.status = 'deposit_paid';
                payment.depositPaid = payment.depositRequired;
                payment.remaining = payment.total - payment.depositPaid;
                 if (!payment.history) payment.history = [];
                payment.history.push({ 
                    ts: new Date().toISOString(),
                    method: 'Simulated Card',
                    amount: payment.depositRequired,
                    note: 'Deposit Paid',
                    qbPaymentId: `sim-${Math.random()}`
                });
            }
        }
        
        event.status = 'booked';
        event.confirmedAt = new Date().toISOString();
        
        await sendMessage(eventId, { sender: 'system', content: 'Deposit paid by client. Portal is now unlocked.', timestamp: new Date().toISOString() });
        console.log(`(Mock) Deposit payment simulated for event ${eventId}. Status is now 'booked'.`);
        return;
    }
    // TODO: Implement real webhook logic
    throw new Error('Firestore not implemented');
}


export async function registerPaymentWebhook(payload: any): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    // TODO: Handle webhook from payment processor
    console.log(`(Mock) Payment webhook received`, payload);
}

// === Files Adapter ===
export async function listFiles(eventId: string): Promise<FileRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        return MOCK_FILES[eventId] || [];
    }
    // TODO: Implement Firestore query
    throw new Error('Firestore not implemented');
}

export async function uploadFile(eventId: string, meta: any): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // TODO: Implement file upload to Firebase Storage and metadata save to Firestore
    console.log(`(Mock) Uploaded file for event ${eventId}`, meta);
}

export async function markContractSigned(eventId: string): Promise<FileRecord> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');
    
    event.contractSigned = true;

    // If invoice is sent, move to deposit_due. Otherwise, maybe contract_sent.
    if (event.status === 'invoice_sent') {
        event.status = 'deposit_due';
    }

    const newFile: FileRecord = {
        id: `file-${Math.random().toString(36).substring(7)}`,
        name: `Signed Contract - ${event.name}.pdf`,
        type: 'contract',
        status: 'signed',
        uploadedBy: 'host',
        storagePath: `events/${eventId}/signed-contract.pdf`,
        createdAt: new Date().toISOString(),
        url: '#',
        timestamp: new Date().toISOString(),
    };

    if (!MOCK_FILES[eventId]) {
        MOCK_FILES[eventId] = [];
    }
    MOCK_FILES[eventId].push(newFile);
    
    await sendMessage(eventId, { sender: 'system', content: 'Contract signed by client.', timestamp: new Date().toISOString() });
    console.log(`(Mock) Contract marked as signed for event ${eventId}`);
    return newFile;
}

// === Timeline Adapter ===
export async function listTimeline(eventId: string): Promise<TimelineItem[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        const timeline = MOCK_TIMELINE[eventId] || [];
        // Hack for legacy UI
        return timeline.map(t => ({
            ...t,
            startTime: t.start,
            endTime: t.end,
            isSyncedToGoogle: t.syncToGoogle
        }));
    }
    // TODO: Implement Firestore query
    throw new Error('Firestore not implemented');
}

export async function approveItem(eventId: string, itemId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`(Mock) Approved timeline item ${itemId} for event ${eventId}`);
}

export async function toggleSyncToGoogle(eventId: string, itemId: string | 'all'): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
     if (DATA_SOURCE === 'mock') {
        if (!MOCK_TIMELINE[eventId]) return;

        if (itemId === 'all') {
            MOCK_TIMELINE[eventId].forEach(item => {
                item.syncToGoogle = true;
                item.isSyncedToGoogle = true;
            });
            console.log(`(Mock) Synced all items for event ${eventId} to Google.`);
        } else {
            const item = MOCK_TIMELINE[eventId].find(i => i.id === itemId);
            if (item) {
                item.syncToGoogle = !item.syncToGoogle;
                item.isSyncedToGoogle = item.syncToGoogle;
                console.log(`(Mock) Toggled Google Sync for item ${itemId} in event ${eventId} to ${item.syncToGoogle}`);
            }
        }
    }
}

// === Gallery Adapter ===
export async function getGalleryPolicy(eventId: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    return event?.galleryPolicy;
}

export async function setPhotoBoothLink(eventId: string, url: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (DATA_SOURCE === 'mock') {
        const event = MOCK_EVENTS.find(e => e.id === eventId);
        if (event) {
            event.photoboothLink = url;
            console.log(`(Mock) Set photobooth link for event ${eventId} to ${url}`);
        }
    }
}

export async function getGuestUploads(eventId: string, options?: { page?: number, limit?: number }): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    if (DATA_SOURCE === 'mock') {
        // In a real implementation, you'd use the options for pagination in your Firestore query.
        // e.g., .orderBy('uploadedAt', 'desc').limit(options.limit || 20).startAfter(lastVisible)
        console.log(`(Mock) Fetching guest uploads for event ${eventId} with options:`, options);
        return MOCK_GUEST_UPLOADS[eventId] || [];
    }
    return [];
}

// === QR Adapter ===
export async function regenerateQrToken(eventId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    if (event && event.qrUpload) {
        event.qrUpload.token = `evt-${Math.random().toString(36).substring(2, 9)}`;
        console.log(`(Mock) Regenerated QR token for event ${eventId} to ${event.qrUpload.token}`);
    }
}

export async function pauseQr(eventId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    if (event && event.qrUpload) {
        event.qrUpload.status = 'paused';
        console.log(`(Mock) Paused QR for event ${eventId}`);
    }
}

export async function activateQr(eventId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    if (event && event.qrUpload) {
        event.qrUpload.status = 'active';
        console.log(`(Mock) Activated QR for event ${eventId}`);
    }
}

export async function expireQrNow(eventId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    if (event && event.qrUpload) {
        event.qrUpload.status = 'expired';
        console.log(`(Mock) Expired QR for event ${eventId}`);
    }
}

// === Services Adapter ===
export async function listSelectedServices(eventId: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        return MOCK_REQUESTED_SERVICES.filter(s => s.eventId === eventId && (s.status === 'selected' || s.status === 'approved'));
    }
    // TODO: Implement Firestore query
    throw new Error('Firestore not implemented');
}

export async function listAddons(): Promise<Addon[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
     if (DATA_SOURCE === 'mock') {
        return MOCK_MAIN_SERVICES;
    }
    // TODO: Implement Firestore query
    throw new Error('Firestore not implemented');
}

export async function requestAddons(eventId: string, items: string[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (DATA_SOURCE === 'mock') {
        items.forEach(itemId => {
            const catalogItem = servicesCatalog.services.find(s => s.id === itemId);
            if (!catalogItem) return;

            const newRequest: RequestedService = {
                id: `req-${Math.random().toString(36).substring(7)}`,
                eventId,
                serviceName: catalogItem.title,
                serviceId: catalogItem.id,
                status: 'requested',
                title: catalogItem.title,
                qty: 1,
                notes: ''
            };
            MOCK_REQUESTED_SERVICES.push(newRequest);
        });
        console.log(`(Mock) Requested add-ons for event ${eventId}:`, items);
    }
    // TODO: Implement Firestore write
    throw new Error('Firestore not implemented');
}

export async function listRequestedServices(eventId: string): Promise<RequestedService[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        return (MOCK_REQUESTED_SERVICES as any).filter((req: any) => req.eventId === eventId);
    }
    // TODO: Implement Firestore query
    throw new Error('Firestore not implemented');
}

export async function approveServiceRequest(eventId: string, requestId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (DATA_SOURCE === 'mock') {
        const request = MOCK_REQUESTED_SERVICES.find(req => req.id === requestId && req.eventId === eventId);
        if (request) {
            request.status = 'approved';
            console.log(`(Mock) Approved service request ${requestId} for event ${eventId}`);
        } else {
            console.warn(`(Mock) Could not find service request ${requestId} to approve.`);
        }
        return;
    }
    // TODO: Implement Firestore update
    throw new Error('Firestore not implemented');
}

// === Chat Adapter ===
export async function listMessages(eventId: string): Promise<ChatMessage[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (DATA_SOURCE === 'mock') {
        return MOCK_MESSAGES[eventId] || [];
    }
    // TODO: Implement Firestore query
    throw new Error('Firestore not implemented');
}

export async function sendMessage(eventId: string, msg: ChatMessage): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (DATA_SOURCE === 'mock') {
        if (!MOCK_MESSAGES[eventId]) {
            MOCK_MESSAGES[eventId] = [];
        }
        MOCK_MESSAGES[eventId].push(msg);
        console.log(`(Mock) Sent message to chat for event ${eventId}`, msg);
        return;
    }
    // TODO: Implement Firestore write
    throw new Error('Firestore not implemented');
}

// === Music Adapter ===
export async function getMusicPlaylist(eventId: string): Promise<MusicPlaylist | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        return MOCK_MUSIC_PLAYLISTS[eventId] || { mustPlay: [], doNotPlay: [] };
    }
    // TODO: Implement Firestore query
    throw new Error('Firestore not implemented');
}

export async function saveMusicPlaylist(eventId: string, playlist: MusicPlaylist): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (DATA_SOURCE === 'mock') {
        MOCK_MUSIC_PLAYLISTS[eventId] = playlist;
        console.log(`(Mock) Saved music playlist for event ${eventId}`, playlist);
    }
    // TODO: Implement Firestore write
    throw new Error('Firestore not implemented');
}


// === Change Request Adapter ===
export async function createChangeRequest(eventId: string, proposedPatch: Record<string, any>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (DATA_SOURCE === 'mock') {
        if (!MOCK_CHANGE_REQUESTS[eventId]) {
            MOCK_CHANGE_REQUESTS[eventId] = [];
        }
        const newRequest: ChangeRequest = {
            id: `cr-${Math.random().toString(36).substring(7)}`,
            proposedPatch,
            submittedBy: 'host', // Assuming host is the one requesting
            submittedAt: new Date().toISOString(),
            status: 'pending',
        };
        MOCK_CHANGE_REQUESTS[eventId].push(newRequest);
        console.log(`(Mock) Created change request for event ${eventId}`, newRequest);
    }
}

export async function listChangeRequests(eventId: string): Promise<ChangeRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        return MOCK_CHANGE_REQUESTS[eventId] || [];
    }
    throw new Error('Firestore not implemented');
}

export async function approveChangeRequest(eventId: string, requestId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (DATA_SOURCE === 'mock') {
        const event = MOCK_EVENTS.find(e => e.id === eventId);
        const request = MOCK_CHANGE_REQUESTS[eventId]?.find(r => r.id === requestId);
        if (event && request) {
            // Apply the patch
            Object.assign(event, request.proposedPatch);
            request.status = 'approved';
            event.audit.lastUpdatedAt = new Date().toISOString();
            event.audit.lastUpdatedBy = 'admin';
            console.log(`(Mock) Approved and applied change request ${requestId} for event ${eventId}`);
        }
    }
}

export async function rejectChangeRequest(eventId: string, requestId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (DATA_SOURCE === 'mock') {
        const request = MOCK_CHANGE_REQUESTS[eventId]?.find(r => r.id === requestId);
        if (request) {
            request.status = 'rejected';
            console.log(`(Mock) Rejected change request ${requestId} for event ${eventId}`);
        }
    }
}

// === Design Adapter ===
export async function listDesignProposals(): Promise<DesignProposal[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        return MOCK_DESIGN_PROPOSALS;
    }
    throw new Error('Firestore not implemented');
}

export async function approveDesign(eventId: string, designId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (DATA_SOURCE === 'mock') {
        const event = MOCK_EVENTS.find(e => e.id === eventId);
        if (event) {
            if (!event.design) {
                event.design = { status: 'pending' };
            }
            event.design.status = 'approved';
            event.design.selectedDesignId = designId;
            event.audit.lastUpdatedAt = new Date().toISOString();
            event.audit.lastUpdatedBy = 'host';
            console.log(`(Mock) Host for event ${eventId} approved design ${designId}`);
        }
    }
}
