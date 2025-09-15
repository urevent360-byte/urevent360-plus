# Data Contracts & Firestore Collections

This document outlines the data structures for the main Firestore collections used in the UREVENT 360 PLUS platform.

## `leads/{leadId}`

Represents an initial inquiry from a potential client.

- **id** (string): The unique identifier for the lead.
- **hostEmail** (string): The email of the person making the inquiry.
- **hostName** (string, optional): The name of the person.
- **requestedServices** (array of strings): List of service names the client is interested in.
- **eventDraft** (map): Preliminary details about the event.
    - **eventName** (string)
    - **eventDate** (timestamp)
    - **notes** (string, optional)
- **status** (string): The current stage of the lead.
    - `new`: A new inquiry that has not been addressed.
    - `contacted`: Initial contact has been made.
    - `follow-up`: A follow-up is scheduled or has occurred.
    - `quote_sent`: A price quote has been sent to the client.
    - `accepted`: The client has accepted the quote.
    - `rejected`: The client has rejected the quote.
    - `converted`: The lead has been converted into a formal event/project.
- **eventId** (string, nullable): If converted, this holds the ID of the corresponding document in the `events` collection.
- **createdAt** (timestamp): When the lead was created.
- **updatedAt** (timestamp): When the lead was last modified.

## `events/{eventId}`

Represents a confirmed and booked event.

- **id** (string): The unique identifier for the event.
- **hostId** (string): The Firebase UID of the client/host.
- **clientName** (string): The name of the client.
- **eventName** (string): The official name of the event.
- **eventDate** (timestamp): The date of the event.
- **status** (string): The current status of the event.
    - `quote_requested`: Initial state after conversion from lead.
    - `contract_sent`: The contract has been sent to the client for signature.
    - `invoice_sent`: The initial invoice (usually for the deposit) has been sent.
    - `deposit_due`: The deposit payment is pending.
    - `booked`: The deposit has been paid, the contract is signed, and the event is confirmed. The host portal is fully unlocked.
    - `completed`: The event has taken place.
    - `canceled`: The event has been canceled.
- **confirmedAt** (timestamp, optional): The timestamp when the event status became `booked`.
- **contractSigned** (boolean, optional): `true` if the contract has been signed by the client.
- **photoboothLink** (string, optional): The URL for the official photo booth gallery.
- **galleryVisibilityDate** (timestamp, optional): The date when the photo galleries will become visible to the host and guests.
- **galleryExpirationDate** (timestamp, optional): The date when guest-uploaded photos will be automatically deleted.

### Subcollections of `events/{eventId}`

#### `services`
A list of all services booked for this event.

- **`services/{serviceId}`**
    - **name** (string): "360 Photo Booth"
    - **price** (number): The quoted price for this service.
    - **status** (string): `requested`, `approved`, `rejected`, `invoiced`.

#### `payments`
A record of all financial transactions for this event.

- **`payments/{paymentId}`**
    - **invoiceId** (string): The ID of the invoice in the accounting system (e.g., QuickBooks).
    - **amount** (number): The amount of the payment.
    - **status** (string): `paid`, `unpaid`, `overdue`.
    - **method** (string): `credit_card`, `bank_transfer`.
    - **timestamp** (timestamp): The date the payment was recorded.
    - **quickbooksUrl** (string, optional): A link to the invoice in QuickBooks.

#### `files`
Stores references to all files related to the event (contracts, invoices, etc.).

- **`files/{fileId}`**
    - **name** (string): "Signed Contract - Garcia Wedding.pdf"
    - **type** (string): `contract`, `invoice`, `audio`, `other`.
    - **status** (string): `pending_signature`, `signed`, `active`.
    - **url** (string): The download URL from Cloud Storage.
    - **uploadedBy** (string): `admin` or `host`.

#### `timeline`
The chronological plan for the event day.

- **`timeline/{itemId}`**
    - **title** (string): "DJ Setup"
    - **startTime** (timestamp)
    - **endTime** (timestamp)
    - **notes** (string, optional)
    - **status** (string): `upcoming`, `in_progress`, `completed`.
    - **isSyncedToGoogle** (boolean): `true` if pushed to Google Calendar.

#### `guestUploads`
References to media uploaded by guests.

- **`guestUploads/{uploadId}`**
    - **fileName** (string)
    - **url** (string): The download URL from Cloud Storage.
    - **timestamp** (timestamp)
