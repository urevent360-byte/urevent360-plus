
# Data Contracts & Firestore Collections

This document outlines the data structures for the main Firestore collections used in the UREVENT 360 PLUS platform.

## `users/{uid}` (Host Profile)

Stores profile information for a host user.

- **displayName** (string)
- **email** (string)
- **phone** (string, optional)
- **photoUrl** (string, optional)
- **org** (string, optional): The organization or company the user belongs to.
- **preferredLanguage** (string): "en" or "es".
- **emergencyContact** (map, optional):
    - **name** (string)
    - **phone** (string)

## `leads/{leadId}`

Represents an initial inquiry from a potential client.

- **hostId** (string, optional): The user's UID, if they are logged in.
- **hostEmail** (string): The email of the person making the inquiry.
- **status** (string): The current stage of the lead.
    - `new_request`: A new inquiry that has not been addressed.
    - `quote_sent`: A price quote has been sent to the client.
    - `accepted`: The client has accepted the quote.
    - `rejected`: The client has rejected the quote.
    - `converted`: The lead has been converted into a formal event/project.
- **eventDraft** (map): Preliminary details about the event.
    - **name** (string)
    - **type** (string, e.g., "Wedding", "Quinceañera")
    - **guestCount** (number)
    - **date** (timestamp)
    - **timeWindow** (string, e.g., "6 PM - 11 PM")
    - **timeZone** (string)
    - **venueName** (string)
    - **address** (string)
    - **city** (string)
    - **state** (string)
    - **zip** (string)
    - **onsiteContactName** (string)
    - **onsiteContactPhone** (string)
    - **notes** (string, optional)
- **requestedServices** (array of maps): List of services the client is interested in.
    - **serviceId** (string)
    s   - **title** (string)
    - **qty** (number)
    - **notes** (string, optional)
- **eventId** (string, nullable): If converted, this holds the ID of the corresponding document in the `events` collection.
- **createdAt** (timestamp): When the lead was created.
- **updatedAt** (timestamp): When the lead was last modified.

## `events/{eventId}`

Represents a confirmed and booked event.

- **hostId** (string): The Firebase UID of the client/host.
- **hostEmail** (string): The email of the host.
- **projectNumber** (string): A human-readable project identifier.
- **name** (string): The official name of the event.
- **type** (string, e.g., "Wedding", "Corporate")
- **guestCount** (number)
- **eventDate** (timestamp)
- **timeWindow** (string, e.g., "6 PM - 11 PM")
- **timeZone** (string)
- **venue** (map):
    - **name** (string)
    - **address** (string)
    - **city** (string)
    - **state** (string)
    - **zip** (string)
- **onsiteContact** (map):
    - **name** (string)
    - **phone** (string)
- **status** (string): The current status of the event.
    - `quote_requested`: Initial state after conversion from lead.
    - `invoice_sent`: The initial invoice has been sent.
    - `deposit_due`: The deposit payment is pending.
    - `booked`: The deposit has been paid, the contract is signed, and the event is confirmed.
    - `completed`: The event has taken place.
    - `canceled`: The event has been canceled.
- **confirmedAt** (timestamp, optional): The timestamp when the event status became `booked`.
- **google** (map, optional):
    - **connected** (boolean)
    - **gcalEventId** (string, optional)
- **photoboothLink** (string, optional): The URL for the official photo booth gallery.
- **galleryPolicy** (map, optional):
    - **releaseDelayDays** (number)
    - **visibilityWindowDays** (number)
    - **autoPurgeDays** (number, optional)
- **qrUpload** (map, optional):
    - **token** (string)
    - **status** (string): 'active', 'paused', 'expired'
    - **expiresAt** (timestamp, optional)
    - **maxFilesPerDevice** (number, optional)
    - **allowedTypes** (array of strings, optional)
- **design** (map, optional):
    - **status** (string): 'pending', 'sent', 'approved', 'changes_requested'
    - **previewUrl** (string, optional)
- **audit** (map):
    - **createdBy** (string)
    - **createdAt** (timestamp)
    - **lastUpdatedBy** (string)
    - **lastUpdatedAt** (timestamp)

### Subcollections of `events/{eventId}`

#### `services`
A list of all services booked for this event.
- **`services/{serviceId}`**
    - **title** (string)
    - **qty** (number)
    - **notes** (string, optional)
    - **status** (string): `selected`, `requested`, `approved`, `rejected`.

#### `payments`
A record of all financial transactions for this event.
- **`payments/{paymentId}`**
    - **invoiceId** (string): The ID of the invoice in the accounting system.
    - **quickbooksUrl** (string, optional): A link to the invoice in QuickBooks.
    - **status** (string): `unpaid`, `deposit_paid`, `paid_in_full`.
    - **history** (array of maps, optional): A log of payment attempts or status changes.

#### `files`
Stores references to all files related to the event (contracts, invoices, etc.).
- **`files/{fileId}`**
    - **name** (string)
    - **type** (string): `invoice`, `contract`, `other`, `audio`.
    - **uploadedBy** (string): `admin` or `host`.
    - **status** (string): `paid`, `signed`, `none`.
    - **storagePath** (string): The path to the file in Cloud Storage.
    - **createdAt** (timestamp)

#### `timeline`
The chronological plan for the event day.
- **`timeline/{itemId}`**
    - **start** (timestamp)
    - **end** (timestamp)
    - **title** (string)
    - **notes** (string, optional)
    - **status** (string)
    - **syncToGoogle** (boolean)
    - **approvalStatus** (string)
    - **gcalEventId** (string, optional)

#### `guestUploads`
References to media uploaded by guests.
- **`guestUploads/{uploadId}`**
    - **fileName** (string)
    - **contentType** (string)
    - **size** (number)
    - **uploadedAt** (timestamp)
    - **thumbUrl** (string, optional)
    - **downloadUrl** (string)
    - **uploaderTag** (string): 'guest' or a specific identifier

