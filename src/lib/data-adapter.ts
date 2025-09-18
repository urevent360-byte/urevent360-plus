

/**
 * @fileoverview Data adapter for fetching application data.
 * This file provides a layer of abstraction for data fetching.
 * Currently, it uses mock data, but it can be easily switched to a
 * live data source like Firestore by changing the implementation of the
 * exported functions.
 */

import { z } from 'zod';
import { format, add } from 'date-fns';

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
        autoPurgeDays: z.number(),
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
    invoiceId: z.string(),
    quickbooksUrl: z.string().optional(),
    status: z.enum(['unpaid', 'deposit_paid', 'paid_in_full']),
    history: z.array(z.object({
        status: z.string(),
        timestamp: z.string(),
    })).optional(),
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

const RequestedServiceSchema = z.object({
    id: z.string(),
    title: z.string(),
    qty: z.number(),
    notes: z.string().optional(),
    status: z.enum(['selected', 'requested', 'approved', 'rejected']),
    // Legacy
    eventId: z.string(),
    serviceName: z.string(),
});
export type RequestedService = z.infer<typeof RequestedServiceSchema>;

export const ChatMessageSchema = z.object({
    sender: z.enum(['user', 'admin', 'system']),
    text: z.string(),
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

let MOCK_LEADS: Lead[] = [
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
            { serviceId: '360-photo-booth', title: '360 Photo Booth', qty: 1 },
            { serviceId: 'cold-sparklers', title: 'Cold Sparklers', qty: 4 }
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
            { serviceId: 'magic-mirror', title: 'Magic Mirror', qty: 1 }
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
        requestedServices: [{serviceId: "photo-booth-printer", title: "Photo Booth Printer", qty: 1}],
        eventId: null,
        createdAt: new Date('2024-07-29T00:00:00.000Z').toISOString(),
        updatedAt: new Date('2024-07-29T00:00:00.000Z').toISOString(),
        name: 'Jane Smith',
        email: 'jane@example.com',
    },
];

let MOCK_EVENTS: Event[] = [
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
        status: 'quote_requested',
        audit: { createdBy: 'admin', createdAt: new Date().toISOString(), lastUpdatedBy: 'admin', lastUpdatedAt: new Date().toISOString() },
        clientName: 'John Doe',
        eventName: 'Johns Quinceañera',
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
        audit: { createdBy: 'admin', createdAt: new Date().toISOString(), lastUpdatedBy: 'admin', lastUpdatedAt: new Date().toISOString() },
        clientName: 'David Lee',
        eventName: 'Lee Corporate Gala',
        contractSigned: true,
        galleryVisibilityDate: add(new Date(), { days: 10 }).toISOString(),
        galleryExpirationDate: add(new Date(), { months: 6 }).toISOString(),
    },
];

let MOCK_FILES: Record<string, FileRecord[]> = {
    'evt-456': [
        { id: 'file-1', name: 'Signed Contract - Lee Gala.pdf', type: 'contract', status: 'signed', uploadedBy: 'admin', storagePath: 'events/evt-456/contract.pdf', createdAt: new Date().toISOString(), url: '#', timestamp: new Date().toISOString() },
        { id: 'file-2', name: 'Invoice-001.pdf', type: 'invoice', status: 'paid', uploadedBy: 'admin', storagePath: 'events/evt-456/invoice.pdf', createdAt: new Date().toISOString(), url: '#', timestamp: new Date().toISOString() },
    ],
    'evt-789': [
         { id: 'file-3', name: 'Invoice-002.pdf', type: 'invoice', status: 'none', uploadedBy: 'admin', storagePath: 'events/evt-789/invoice.pdf', createdAt: new Date().toISOString(), url: '#', timestamp: new Date().toISOString() },
    ]
};

let MOCK_PAYMENTS: Record<string, Payment[]> = {
    'evt-456': [
        { id: 'pay-1', invoiceId: 'inv-001', status: 'paid_in_full', quickbooksUrl: '#', amount: 500, method: 'credit_card', timestamp: new Date().toISOString() },
    ]
};

let MOCK_TIMELINE: Record<string, TimelineItem[]> = {
    'evt-456': [
        { id: 'tl-1', start: '2024-07-20T17:00:00Z', end: '2024-07-20T18:00:00Z', title: 'DJ Setup', status: 'completed', syncToGoogle: true, approvalStatus: 'approved', startTime: '2024-07-20T17:00:00Z', endTime: '2024-07-20T18:00:00Z', isSyncedToGoogle: true },
        { id: 'tl-2', start: '2024-07-20T18:00:00Z', end: '2024-07-20T22:00:00Z', title: 'Magic Mirror Opens', status: 'completed', syncToGoogle: true, approvalStatus: 'approved', startTime: '2024-07-20T18:00:00Z', endTime: '2024-07-20T22:00:00Z', isSyncedToGoogle: true },
        { id: 'tl-3', start: '2024-07-20T19:00:00Z', end: '2024-07-20T20:00:00Z', title: 'Dinner Service', status: 'completed', syncToGoogle: false, approvalStatus: 'approved', startTime: '2024-07-20T19:00:00Z', endTime: '2024-07-20T20:00:00Z', isSyncedToGoogle: false },
    ],
    'evt-123': [
        { id: 'tl-4', start: '2024-10-15T18:30:00Z', end: '2024-10-15T18:45:00Z', title: 'Grand Entrance', status: 'upcoming', syncToGoogle: false, approvalStatus: 'pending', startTime: '2024-10-15T18:30:00Z', endTime: '2024-10-15T18:45:00Z', isSyncedToGoogle: false },
        { id: 'tl-5', start: '2024-10-15T19:00:00Z', end: '2024-10-15T23:00:00Z', title: '360 Booth & Sparklers', status: 'upcoming', syncToGoogle: false, approvalStatus: 'pending', startTime: '2024-10-15T19:00:00Z', endTime: '2024-10-15T23:00:00Z', isSyncedToGoogle: false },
    ]
};

const MOCK_MAIN_SERVICES = [
    { 
        id: 'svc-360-photo-booth',
        name: '360 Photo Booth',
        description: 'A modern platform where guests can record dynamic, slow-motion videos with a rotating camera.',
        image: 'https://picsum.photos/seed/service1/800/600',
    },
    { 
        id: 'svc-photo-booth-printer',
        name: 'Photo Booth Printer',
        description: 'Receive glossy, high-quality photo strips instantly with custom logos and designs.',
        image: 'https://picsum.photos/seed/service2/800/600',
    },
    {
        id: 'svc-magic-mirror',
        name: 'Magic Mirror',
        description: 'An interactive, full-length mirror that takes amazing selfies with fun animations.',
        image: 'https://picsum.photos/seed/service3/800/600',
    },
    { 
        id: 'svc-la-hora-loca-led-robot',
        name: 'La Hora Loca with LED Robot',
        description: 'An epic hour of high-energy entertainment with a giant LED robot, dancers, and CO2 jets.',
        image: 'https://picsum.photos/seed/service4/800/600',
    },
    { 
        id: 'svc-cold-sparklers',
        name: 'Cold Sparklers',
        description: 'Create a stunning, safe pyrotechnic-like effect for magical moments without heat or smoke.',
        image: 'https://picsum.photos/seed/service5/800/600',
    },
    { 
        id: 'svc-dance-on-the-clouds',
        name: 'Dance on the Clouds',
        description: 'A dreamy, thick cloud effect that covers the dance floor for a fairy-tale first dance.',
        image: 'https://picsum.photos/seed/service6/800/600',
    },
];

let MOCK_REQUESTED_SERVICES: RequestedService[] = [
    { id: 'req-1', eventId: 'evt-456', serviceName: 'Guest Book Station', status: 'requested', title: 'Guest Book Station', qty: 1 }
];

let MOCK_MESSAGES: Record<string, ChatMessage[]> = {
    'evt-123': [
        { sender: 'system', text: 'Event created from lead.', timestamp: new Date('2024-07-30T10:00:00Z').toISOString() },
        { sender: 'admin', text: 'Hi! I\'ve sent over the contract and invoice for you to review.', timestamp: new Date('2024-07-30T10:05:00Z').toISOString() },
        { sender: 'user', text: 'Great, thanks! I will review it shortly.', timestamp: new Date('2024-07-30T10:15:00Z').toISOString() },
    ],
    'evt-456': [
         { sender: 'system', text: 'Event created from lead.', timestamp: new Date('2024-07-28T10:00:00Z').toISOString() },
    ]
};

let MOCK_MUSIC_PLAYLISTS: Record<string, MusicPlaylist> = {
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

let MOCK_CHANGE_REQUESTS: Record<string, ChangeRequest[]> = {
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

const MOCK_GUEST_UPLOADS: Record<string, { url: string; alt: string }[]> = {
    'evt-456': [
        { url: 'https://picsum.photos/seed/guest1/400/300', alt: 'Guest photo 1' },
        { url: 'https://picsum.photos/seed/guest2/400/300', alt: 'Guest photo 2' },
        { url: 'https://picsum.photos/seed/guest3/400/300', alt: 'Guest photo 3' },
        { url: 'https://picsum.photos/seed/guest4/400/300', alt: 'Guest photo 4' },
    ]
};

// --- Data Adapter API ---
// For now, all functions use mock data. We'll add TODOs for Firestore integration.

const DATA_SOURCE: 'mock' | 'firestore' = 'mock';

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
            requestedServices: lead.requestedServices.map(s => s.title),
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

        // Hack to make UI work with old data structure
        return {
            ...event,
            galleryVisibilityDate: event.galleryPolicy ? add(new Date(), { days: event.galleryPolicy.releaseDelayDays }).toISOString() : undefined,
            galleryExpirationDate: event.galleryPolicy ? add(new Date(), { days: event.galleryPolicy.autoPurgeDays }).toISOString() : undefined,
        };
    }
    // TODO: Implement Firestore fetching logic
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
        return MOCK_PAYMENTS[eventId] || [];
    }
    throw new Error('Firestore not implemented');
}

export async function createInvoice(eventId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (DATA_SOURCE === 'mock') {
        const event = MOCK_EVENTS.find(e => e.id === eventId);
        if (event) {
            event.status = event.contractSigned ? 'deposit_due' : 'invoice_sent';
            
            const newPayment: Payment = {
                id: `pay-${Math.random().toString(36).substring(7)}`,
                invoiceId: `inv-${eventId.slice(4)}`,
                status: 'unpaid',
                quickbooksUrl: '#',
                // legacy
                amount: 2500, // Placeholder amount
                method: '',
                timestamp: new Date().toISOString(),
            };

            if (!MOCK_PAYMENTS[eventId]) {
                MOCK_PAYMENTS[eventId] = [];
            }
            MOCK_PAYMENTS[eventId].push(newPayment);

            await sendMessage(eventId, { sender: 'system', text: 'Invoice created.', timestamp: new Date().toISOString() });
            console.log(`(Mock) Invoice created for event ${eventId}. Event status updated.`);
        } else {
            throw new Error('Event not found');
        }
        return;
    }
    // TODO: Implement actual invoice creation (e.g., with QuickBooks API and Firestore updates)
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
            const payment = MOCK_PAYMENTS[eventId].find(p => p.status === 'unpaid');
            if (payment) {
                payment.status = 'deposit_paid';
                 if (!payment.history) payment.history = [];
                payment.history.push({ status: 'deposit_paid', timestamp: new Date().toISOString() });
            }
        }
        
        event.status = 'booked';
        event.confirmedAt = new Date().toISOString();
        
        await sendMessage(eventId, { sender: 'system', text: 'Deposit paid by client. Portal is now unlocked.', timestamp: new Date().toISOString() });
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
    } else if (event.status === 'quote_requested') {
        event.status = 'contract_sent';
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
    
    await sendMessage(eventId, { sender: 'system', text: 'Contract signed by client.', timestamp: new Date().toISOString() });
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

export async function getGuestUploads(eventId: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    if (DATA_SOURCE === 'mock') {
        return MOCK_GUEST_UPLOADS[eventId] || [];
    }
    console.log(`(Mock) Fetching guest uploads for event ${eventId}`);
    return []; // Return empty for now
}

// === Services Adapter ===
export async function listSelectedServices(eventId: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        const lead = MOCK_LEADS.find(l => l.eventId === eventId);
        if (lead) {
            return lead.requestedServices.map(s => ({ id: `svc-${s.serviceId}`, name: s.title, status: 'Booked' }));
        }
        return [{ id: 'svc-magic-mirror', name: 'Magic Mirror', status: 'Booked' }];
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
        items.forEach(itemName => {
            const newRequest: RequestedService = {
                id: `req-${Math.random().toString(36).substring(7)}`,
                eventId,
                serviceName: itemName,
                status: 'requested',
                title: itemName,
                qty: 1,
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
