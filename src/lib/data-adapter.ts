

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
    hostEmail: z.string().email(),
    hostName: z.string().optional(),
    name: z.string(), // Derived from hostName or a default
    email: z.string().email(), // Same as hostEmail
    requestedServices: z.array(z.string()),
    eventDraft: z.object({
        eventName: z.string(),
        eventDate: z.string(),
        notes: z.string().optional(),
    }),
    status: z.enum(['new', 'contacted', 'follow-up', 'quote_sent', 'accepted', 'rejected', 'converted']),
    eventId: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
export type Lead = z.infer<typeof LeadSchema>;

const EventSchema = z.object({
    id: z.string(),
    hostId: z.string(),
    clientName: z.string(),
    eventName: z.string(),
    eventDate: z.string(),
    status: z.enum(['quote_requested', 'contract_sent', 'invoice_sent', 'deposit_due', 'booked', 'completed', 'canceled']),
    confirmedAt: z.string().optional(),
    contractSigned: z.boolean().optional(),
    photoboothLink: z.string().optional(),
    galleryVisibilityDate: z.string().optional(),
    galleryExpirationDate: z.string().optional(),
});
export type Event = z.infer<typeof EventSchema>;

const FileRecordSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['contract', 'invoice', 'audio', 'other']),
    status: z.enum(['pending_signature', 'signed', 'active']),
    url: z.string(),
    uploadedBy: z.enum(['admin', 'host']),
    timestamp: z.string(),
});
export type FileRecord = z.infer<typeof FileRecordSchema>;

const PaymentSchema = z.object({
    id: z.string(),
    invoiceId: z.string(),
    amount: z.number(),
    status: z.enum(['paid', 'unpaid', 'overdue']),
    method: z.enum(['credit_card', 'bank_transfer', '']),
    timestamp: z.string(),
    quickbooksUrl: z.string().optional(),
});
export type Payment = z.infer<typeof PaymentSchema>;

const TimelineItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    notes: z.string().optional(),
    status: z.enum(['upcoming', 'in_progress', 'completed']),
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
    eventId: z.string(),
    serviceName: z.string(),
    status: z.enum(['requested', 'approved', 'rejected']),
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


// --- Mock Data ---

const MOCK_LEADS: Lead[] = [
    { 
        id: 'lead-123',
        hostEmail: 'client@urevent360.com',
        hostName: 'John Doe',
        name: 'John Doe',
        email: 'client@urevent360.com',
        requestedServices: ['360 Photo Booth', 'Cold Sparklers'],
        eventDraft: {
            eventName: 'Johns Quinceañera',
            eventDate: new Date('2024-10-15T18:00:00').toISOString(),
            notes: 'Wants the new props.'
        },
        status: 'converted',
        eventId: 'evt-123',
        createdAt: new Date('2024-08-25').toISOString(),
        updatedAt: new Date().toISOString(),
    },
    { 
        id: 'lead-456',
        hostEmail: 'david@example.com',
        hostName: 'David Lee',
        name: 'David Lee',
        email: 'david@example.com',
        requestedServices: ['Magic Mirror'],
        eventDraft: {
            eventName: 'Lee Corporate Gala',
            eventDate: new Date('2024-07-20T12:00:00').toISOString(),
        },
        status: 'converted',
        eventId: 'evt-456',
        createdAt: new Date('2024-07-20').toISOString(),
        updatedAt: new Date().toISOString(),
    },
     { 
        id: 'lead-789',
        hostEmail: 'jane@example.com',
        name: 'Jane Smith',
        email: 'jane@example.com',
        requestedServices: ['Photo Booth Printer'],
        eventDraft: {
            eventName: 'Smith Wedding',
            eventDate: new Date('2024-11-01').toISOString(),
        },
        status: 'quote_sent',
        eventId: null,
        createdAt: new Date('2024-07-29').toISOString(),
        updatedAt: new Date().toISOString(),
    },
     { 
        id: 'lead-new',
        hostEmail: 'new@example.com',
        name: 'New Client',
        email: 'new@example.com',
        requestedServices: ['La Hora Loca with LED Robot'],
        eventDraft: {
            eventName: 'Big Birthday Bash',
            eventDate: new Date('2024-12-01').toISOString(),
        },
        status: 'new',
        eventId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

let MOCK_EVENTS: Event[] = [
    {
        id: 'evt-123',
        hostId: 'user-johndoe',
        clientName: 'John Doe',
        eventName: 'Johns Quinceañera',
        eventDate: new Date('2024-10-15T18:00:00').toISOString(),
        status: 'invoice_sent', // Starts as quote_requested
    },
    {
        id: 'evt-456',
        hostId: 'user-davidlee',
        clientName: 'David Lee',
        eventName: 'Lee Corporate Gala',
        eventDate: new Date('2024-07-20T12:00:00').toISOString(),
        status: 'booked', // This event is fully booked and active
        confirmedAt: new Date().toISOString(),
        contractSigned: true,
        photoboothLink: 'https://photos.app.goo.gl/sample1',
        galleryVisibilityDate: add(new Date(), { days: 10 }).toISOString(),
        galleryExpirationDate: add(new Date(), { months: 6 }).toISOString(),
    },
     {
        id: 'evt-789',
        hostId: 'user-janesmith',
        clientName: 'Jane Smith',
        eventName: 'Smith Wedding',
        eventDate: new Date('2024-11-01').toISOString(),
        status: 'deposit_due', // This one is waiting for deposit
        contractSigned: true,
    },
     {
        id: 'evt-new',
        hostId: 'user-newclient',
        clientName: 'New Client',
        eventName: 'Big Birthday Bash',
        eventDate: new Date('2024-12-01').toISOString(),
        status: 'quote_requested',
        contractSigned: false,
    },
];

let MOCK_FILES: Record<string, FileRecord[]> = {
    'evt-456': [
        { id: 'file-1', name: 'Signed Contract - Lee Gala.pdf', type: 'contract', status: 'signed', url: '#', uploadedBy: 'admin', timestamp: new Date().toISOString() },
        { id: 'file-2', name: 'Invoice-001.pdf', type: 'invoice', status: 'active', url: '#', uploadedBy: 'admin', timestamp: new Date().toISOString() },
    ],
    'evt-789': [
         { id: 'file-3', name: 'Invoice-002.pdf', type: 'invoice', status: 'active', url: '#', uploadedBy: 'admin', timestamp: new Date().toISOString() },
    ]
};

let MOCK_PAYMENTS: Record<string, Payment[]> = {
    'evt-456': [
        { id: 'pay-1', invoiceId: 'inv-001', amount: 500, status: 'paid', method: 'credit_card', timestamp: new Date().toISOString(), quickbooksUrl: '#' },
    ]
};

const MOCK_TIMELINE: Record<string, TimelineItem[]> = {
    'evt-456': [
        { id: 'tl-1', title: 'DJ Setup', startTime: '2024-07-20T17:00:00Z', endTime: '2024-07-20T18:00:00Z', status: 'completed', isSyncedToGoogle: true },
        { id: 'tl-2', title: 'Magic Mirror Opens', startTime: '2024-07-20T18:00:00Z', endTime: '2024-07-20T22:00:00Z', status: 'completed', isSyncedToGoogle: true },
        { id: 'tl-3', title: 'Dinner Service', startTime: '2024-07-20T19:00:00Z', endTime: '2024-07-20T20:00:00Z', status: 'completed', isSyncedToGoogle: false },
    ],
    'evt-123': [
        { id: 'tl-4', title: 'Grand Entrance', startTime: '2024-10-15T18:30:00Z', endTime: '2024-10-15T18:45:00Z', status: 'upcoming', isSyncedToGoogle: false },
        { id: 'tl-5', title: '360 Booth & Sparklers', startTime: '2024-10-15T19:00:00Z', endTime: '2024-10-15T23:00:00Z', status: 'upcoming', isSyncedToGoogle: false },
    ]
};

const MOCK_ADDONS: Addon[] = [
    { id: 'addon-1', name: 'Extra Hour of Service', description: 'Extend the fun for one more hour.', image: 'https://picsum.photos/seed/addon1/400/300' },
    { id: 'addon-2', name: 'Custom Prop Set', description: 'Props tailored to your event theme.', image: 'https://picsum.photos/seed/addon2/400/300' },
    { id: 'addon-3', name: 'Guest Book Station', description: 'A station for guests to leave photo strips and messages.', image: 'https://picsum.photos/seed/addon3/400/300' },
    { id: 'addon-4', name: 'Live Slideshow Screen', description: 'A large screen displaying photos in real-time.', image: 'https://picsum.photos/seed/addon4/400/300' },
];

let MOCK_REQUESTED_SERVICES: RequestedService[] = [
    { id: 'req-1', eventId: 'evt-456', serviceName: 'Guest Book Station', status: 'requested' }
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

// --- Data Adapter API ---
// For now, all functions use mock data. We'll add TODOs for Firestore integration.

const DATA_SOURCE: 'mock' | 'firestore' = 'mock';

// === Leads Adapter ===

export async function getLeads(): Promise<Lead[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        return MOCK_LEADS;
    }
    // TODO: Implement Firestore fetching logic
    throw new Error('Firestore not implemented');
}

export async function getLead(leadId: string): Promise<Lead | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        return MOCK_LEADS.find(lead => lead.id === leadId);
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
                hostId: `user-${lead.name.toLowerCase().replace(' ', '')}`,
                clientName: lead.hostName || lead.name,
                eventName: lead.eventDraft.eventName,
                eventDate: lead.eventDraft.eventDate,
                status: 'quote_requested',
                contractSigned: false,
            };
            MOCK_EVENTS.push(newEvent);
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
        return MOCK_EVENTS.find(event => event.id === eventId);
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
                amount: 2500, // Placeholder amount
                status: 'unpaid',
                method: '',
                timestamp: new Date().toISOString(),
                quickbooksUrl: '#'
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
                payment.status = 'paid';
                payment.method = 'credit_card'; // Simulate CC payment
                payment.timestamp = new Date().toISOString();
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
        name: `Signed Contract - ${event.eventName}.pdf`,
        type: 'contract',
        status: 'signed',
        url: '#',
        uploadedBy: 'host',
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
        return MOCK_TIMELINE[eventId] || [];
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
            MOCK_TIMELINE[eventId].forEach(item => item.isSyncedToGoogle = true);
            console.log(`(Mock) Synced all items for event ${eventId} to Google.`);
        } else {
            const item = MOCK_TIMELINE[eventId].find(i => i.id === itemId);
            if (item) {
                item.isSyncedToGoogle = !item.isSyncedToGoogle;
                console.log(`(Mock) Toggled Google Sync for item ${itemId} in event ${eventId} to ${item.isSyncedToGoogle}`);
            }
        }
    }
}

// === Gallery Adapter ===
export async function getGalleryPolicy(eventId: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    return {
        visibilityDate: event?.galleryVisibilityDate,
        expirationDate: event?.galleryExpirationDate,
    };
}

export async function setPhotoBoothLink(eventId: string, url: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    if (event) {
        event.photoboothLink = url;
    }
    console.log(`(Mock) Set photobooth link for event ${eventId} to ${url}`);
}

export async function getGuestUploads(eventId: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log(`(Mock) Fetching guest uploads for event ${eventId}`);
    return []; // Return empty for now
}

// === Services Adapter ===
export async function listSelectedServices(eventId: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (DATA_SOURCE === 'mock') {
        const lead = MOCK_LEADS.find(l => l.eventId === eventId);
        if (lead) {
            return lead.requestedServices.map(name => ({ id: `svc-${name.replace(/\s+/g, '-')}`, name: name, status: 'Booked' }));
        }
        return [{ id: 'svc-1', name: '360 Photo Booth', status: 'Booked' }];
    }
    // TODO: Implement Firestore query
    throw new Error('Firestore not implemented');
}

export async function listAddons(): Promise<Addon[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
     if (DATA_SOURCE === 'mock') {
        return MOCK_ADDONS;
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
        return MOCK_REQUESTED_SERVICES.filter(req => req.eventId === eventId);
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

    