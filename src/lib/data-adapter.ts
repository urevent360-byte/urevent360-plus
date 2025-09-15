

/**
 * @fileoverview Data adapter for fetching application data.
 * This file provides a layer of abstraction for data fetching.
 * Currently, it uses mock data, but it can be easily switched to a
 * live data source like Firestore by changing the implementation of the
 * exported functions.
 */

import { z } from 'zod';

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
    status: z.enum(['new', 'contacted', 'follow_up', 'quote_sent', 'accepted', 'rejected', 'converted']),
    eventId: z.string().optional(),
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

export type FileRecord = {
    id: string;
    name: string;
    type: 'contract' | 'invoice' | 'other';
    status: 'pending_signature' | 'signed' | 'active';
    url: string; // URL to the file in Cloud Storage
};


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
        eventId: 'evt-lead-123',
        createdAt: new Date().toISOString(),
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

const MOCK_EVENTS: Event[] = [
    {
        id: 'evt-456',
        hostId: 'client-123',
        clientName: 'David Lee',
        eventName: 'Lee Corporate Gala',
        eventDate: new Date('2024-07-20T12:00:00').toISOString(),
        status: 'booked',
        confirmedAt: new Date().toISOString(),
        contractSigned: true,
        photoboothLink: 'https://photos.app.goo.gl/sample1',
        galleryVisibilityDate: new Date('2024-07-21T12:00:00').toISOString(),
        galleryExpirationDate: new Date('2025-01-20T12:00:00').toISOString(),
    },
    {
        id: 'evt-789',
        hostId: 'client-123',
        clientName: 'Jane Smith',
        eventName: 'Annual Gala',
        eventDate: new Date('2025-02-20T19:00:00').toISOString(),
        status: 'deposit_due',
    },
     {
        id: 'evt-lead-123',
        hostId: 'client-456',
        clientName: 'John Doe',
        eventName: 'Johns Quinceañera',
        eventDate: new Date('2024-10-15T18:00:00').toISOString(),
        status: 'quote_requested',
    },
];


// --- Data Adapter API ---

const DATA_SOURCE: 'mock' | 'firestore' = 'mock';

export async function getLead(leadId: string): Promise<Lead | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network latency
    if (DATA_SOURCE === 'mock') {
        return MOCK_LEADS.find(lead => lead.id === leadId);
    }
    // TODO: Implement Firestore fetching logic
    // const docRef = doc(db, 'leads', leadId);
    // const docSnap = await getDoc(docRef);
    // return docSnap.exists() ? (docSnap.data() as Lead) : undefined;
    throw new Error('Firestore not implemented');
}

export async function getEvent(eventId: string): Promise<Event | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network latency
    if (DATA_SOURCE === 'mock') {
        // In a real app, you might fetch and merge data here. For mock, we'll just return it.
        return MOCK_EVENTS.find(event => event.id === eventId);
    }
    // TODO: Implement Firestore fetching logic
    throw new Error('Firestore not implemented');
}

export async function listHostEvents(hostId: string): Promise<Event[]> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network latency
    if (DATA_SOURCE === 'mock') {
        return MOCK_EVENTS.filter(event => event.hostId === hostId);
    }
    // TODO: Implement Firestore fetching logic
    throw new Error('Firestore not implemented');
}

export async function convertLeadToEvent(leadId: string): Promise<{ eventId: string }> {
     await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async operation
     if (DATA_SOURCE === 'mock') {
        const lead = MOCK_LEADS.find(l => l.id === leadId);
        if (!lead) throw new Error('Lead not found');
        
        // Use existing eventId if it has been converted before
        if (lead.eventId) return { eventId: lead.eventId };

        const newEventId = `evt-${leadId}`;
        
        const existingEvent = MOCK_EVENTS.find(e => e.id === newEventId);
        if (!existingEvent) {
             const newEvent: Event = {
                id: newEventId,
                hostId: 'client-temp-id', // In a real app, this would be the actual client ID
                clientName: lead.name,
                eventName: lead.eventDraft.eventName,
                eventDate: lead.eventDraft.eventDate,
                status: 'quote_requested',
                contractSigned: false,
            };
            MOCK_EVENTS.push(newEvent);
        }

        lead.status = 'converted';
        lead.eventId = newEventId;
        
        console.log(`Simulating conversion of lead ${leadId} to event ${newEventId}`);
        
        return { eventId: newEventId };
    }
    // TODO: Implement Firestore transaction logic
    throw new Error('Firestore not implemented');
}
