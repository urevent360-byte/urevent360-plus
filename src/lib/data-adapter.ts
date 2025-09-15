
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
    status: z.enum(['quote_requested', 'invoice_sent', 'deposit_due', 'booked', 'completed', 'canceled']),
    confirmedAt: z.string().optional(),
});
export type Event = z.infer<typeof EventSchema>;


// --- Mock Data ---

const MOCK_LEADS: Lead[] = [
    { 
        id: 'lead-123',
        hostEmail: 'john.doe@example.com',
        hostName: 'John Doe',
        name: 'John Doe',
        email: 'john.doe@example.com',
        requestedServices: ['360 Photo Booth', 'Cold Sparklers'],
        eventDraft: {
            eventName: 'Johns Quinceañera',
            eventDate: new Date('2024-10-15T18:00:00').toISOString(),
            notes: 'Wants the new props.'
        },
        status: 'quote_sent',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    { 
        id: 'lead-456',
        hostEmail: 'jane.smith@example.com',
        hostName: 'Jane Smith',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        requestedServices: ['Magic Mirror'],
        eventDraft: {
            eventName: 'Smith & Co Product Launch',
            eventDate: new Date('2024-11-01T12:00:00').toISOString(),
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
        clientName: 'Jane Smith',
        eventName: 'Smith & Co Product Launch',
        eventDate: new Date('2024-11-01T12:00:00').toISOString(),
        status: 'booked',
        confirmedAt: new Date().toISOString()
    },
    {
        id: 'evt-789',
        hostId: 'client-123',
        clientName: 'Jane Smith',
        eventName: 'Annual Gala',
        eventDate: new Date('2025-02-20T19:00:00').toISOString(),
        status: 'deposit_due',
    },
];


// --- Data Adapter API ---

const DATA_SOURCE: 'mock' | 'firestore' = 'mock';

export async function getLead(leadId: string): Promise<Lead | undefined> {
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
    if (DATA_SOURCE === 'mock') {
        return MOCK_EVENTS.find(event => event.id === eventId);
    }
    // TODO: Implement Firestore fetching logic
    throw new Error('Firestore not implemented');
}

export async function listHostEvents(hostId: string): Promise<Event[]> {
    if (DATA_SOURCE === 'mock') {
        return MOCK_EVENTS.filter(event => event.hostId === hostId);
    }
    // TODO: Implement Firestore fetching logic
    throw new Error('Firestore not implemented');
}

export async function convertLeadToEvent(leadId: string): Promise<{ eventId: string }> {
     if (DATA_SOURCE === 'mock') {
        const lead = MOCK_LEADS.find(l => l.id === leadId);
        if (!lead) throw new Error('Lead not found');
        if (lead.eventId) return { eventId: lead.eventId };

        const newEventId = `evt-${leadId.split('-')[1]}`;
        console.log(`Simulating conversion of lead ${leadId} to new event ${newEventId}`);
        // In a real scenario, you'd create a new document in the 'events' collection.
        lead.status = 'converted';
        lead.eventId = newEventId;
        return { eventId: newEventId };
    }
    // TODO: Implement Firestore transaction logic
    throw new Error('Firestore not implemented');
}
