

# Data Contracts & Firestore Collections

This document outlines the data structures for the main Firestore collections used in the UREVENT 360 PLUS platform.

## `users/{uid}` (Host/Admin Profile)

Stores profile information for any user, host or admin.

- **uid** (string): Matches Firebase Auth UID.
- **displayName** (string): Full name, synced with Firebase Auth.
- **firstName** (string)
- **lastName** (string)
- **primaryEmail** (string): Copied from Auth, read-only in UI.
- **recoveryEmail** (string, nullable): For notifications; password reset always goes to primary.
- **phone** (string, optional)
- **photoURL** (string, nullable): Synced with Firebase Auth.
- **locale** (string): 'en' or 'es'.
- **timeZone** (string): IANA format, e.g., "America/New_York".
- **notificationPrefs** (map):
    - **invoices** (boolean)
    - **reminders** (boolean)
    - **gallery** (boolean)
- **mfaEnabled** (boolean): Indicates if Multi-Factor Authentication is active.
- **createdAt** (timestamp)
- **updatedAt** (timestamp)
- **deletedAt** (timestamp, nullable): For soft deletes.

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
    - **price** (number, optional): Admin-only field.
    - **status** (string): `selected`, `requested`, `approved`, `rejected`.

#### `payments`
A record of all financial transactions for this event. The "current" invoice is the one with `isActive: true`.
- **`payments/{paymentId}`**
    - **isActive** (boolean): `true` if this is the currently active invoice.
    - **qbInvoiceId** (string): The ID of the invoice in QuickBooks.
    - **quickbooksUrl** (string): The direct URL for the host to pay the invoice.
    - **total** (number): The total amount of the invoice.
    - **depositRequired** (number): The amount required for the deposit.
    - **depositPaid** (number): The amount paid towards the deposit.
    - **remaining** (number): The remaining balance.
    - **dueDate** (timestamp): The due date for the payment.
    - **status** (string): `unpaid`, `deposit_paid`, `paid_in_full`, `void`.
    - **history** (array of maps, optional): A log of payment attempts or status changes.
        - **ts** (timestamp)
        - **method** (string)
        - **amount** (number)
        - **note** (string)
        - **qbPaymentId** (string)
    - **pdfUrl** (string, optional): A link to the invoice PDF.

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

## Security Rules Summary

This section outlines the Firestore security rules logic to be implemented.

```firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if a user is an admin
    function isAdmin() {
      // In a real app, this would check a custom claim: request.auth.token.admin == true
      return get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'Super Admin';
    }

    // Helper function to check if user is the host of an event
    function isHost(eventId) {
      return request.auth.uid == get(/databases/$(database)/documents/events/$(eventId)).data.hostId;
    }

    // Admins have global write access.
    match /{document=**} {
      allow write: if isAdmin();
    }
    
    // Users can read and write their own profile. Admins can read any profile.
    match /users/{uid} {
        allow read, write: if request.auth.uid == uid || isAdmin();
    }

    // Admins can read their own admin record to verify their role
    match /admins/{uid} {
        allow read: if request.auth.uid == uid;
    }

    // Events can only be read by the assigned host or an admin.
    match /events/{eventId} {
      allow read: if isHost(eventId) || isAdmin();
      // Only admins can write directly to events. Hosts must use change requests.
      allow write: if isAdmin();
    }

    // Hosts can read subcollections of their own events. Admins can read any.
    match /events/{eventId}/{subcollection}/{document=**} {
       allow read: if isHost(eventId) || isAdmin();
    }
    
    // Hosts can create change requests for their events.
    match /events/{eventId}/changeRequests/{requestId} {
        allow create: if isHost(eventId);
        // Only admins can update (approve/reject) change requests.
        allow update: if isAdmin();
    }
    
    // Payments: Hosts and Admins can read. Only Admins can write.
    match /events/{eventId}/payments/{paymentId} {
      allow read: if isHost(eventId) || isAdmin();
      allow write: if isAdmin();
    }

    // Guest Uploads: Public can create if QR is active. Host/Admin can read. Admin can delete.
    match /events/{eventId}/guestUploads/{uploadId} {
      allow read: if isHost(eventId) || isAdmin();
      allow create: if get(/databases/$(database)/documents/events/$(eventId)).data.qrUpload.status == 'active';
      allow delete: if isAdmin();
    }
  }
}
```

    