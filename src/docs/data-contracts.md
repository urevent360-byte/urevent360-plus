

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

    function isSignedIn() { return request.auth != null; }
    function isMe(uid) { return isSignedIn() && request.auth.uid == uid; }

    // Si en el futuro usas custom claims:
    function isAdminClaim() { return isSignedIn() && request.auth.token.admin == true; }

    // ---- ADMINS ----
    // El usuario autenticado puede leer SU PROPIO doc /admins/{uid}.
    // Ediciones solo desde consola / backend (no front).
    match /admins/{uid} {
      allow read: if isMe(uid) || isAdminClaim();
      allow write: if false;
    }

    // ---- USERS ----
    match /users/{uid} {
      // Su perfil: leer/escribir solo el dueño (y admins por claim).
      allow read, write: if isMe(uid) || isAdminClaim();
    }

    // ---- LEADS ----
    match /leads/{leadId} {
      // Crear lead: cualquier usuario autenticado (ajusta a tu flujo).
      allow create: if isSignedIn();

      // Leer/editar: dueño del lead (hostId) o admin (claim).
      allow read, update, delete: if isSignedIn() && (
        isAdminClaim() ||
        (resource.data.hostId == request.auth.uid)
      );
    }

    // ---- EVENTS ----
    match /events/{eventId} {
      // Leer: admin o host dueño
      allow read: if isSignedIn() && (
        isAdminClaim() ||
        (get(/databases/$(database)/documents/events/$(eventId)).data.hostId == request.auth.uid)
      );

      // Crear: admin; también permite que un host cree si el hostId == su uid
      allow create: if isSignedIn() && (
        isAdminClaim() ||
        (request.resource.data.hostId == request.auth.uid)
      );

      // Actualizar/Eliminar: admin o dueño
      allow update, delete: if isSignedIn() && (
        isAdminClaim() ||
        (resource.data.hostId == request.auth.uid)
      );

      // ---- Subcolecciones de eventos ----
      match /services/{serviceId} {
        allow read: if isSignedIn() && (
          isAdminClaim() ||
          (get(/databases/$(database)/documents/events/$(eventId)).data.hostId == request.auth.uid)
        );
        // Crear/editar por admin; host puede proponer (write) si es dueño
        allow create, update, delete: if isSignedIn() && (
          isAdminClaim() ||
          (get(/databases/$(database)/documents/events/$(eventId)).data.hostId == request.auth.uid)
        );
      }

      match /payments/{paymentId} {
        // Host y admin pueden leer; escribe solo admin
        allow read: if isSignedIn() && (
          isAdminClaim() ||
          (get(/databases/$(database)/documents/events/$(eventId)).data.hostId == request.auth.uid)
        );
        allow create, update, delete: if isAdminClaim();
      }

      match /files/{fileId} {
        // Leer: host y admin
        allow read: if isSignedIn() && (
          isAdminClaim() ||
          (get(/databases/$(database)/documents/events/$(eventId)).data.hostId == request.auth.uid)
        );
        // Subir/eliminar: admin; host puede subir si es dueño (ajústalo según tu flujo)
        allow create, delete: if isSignedIn() && (
          isAdminClaim() ||
          (get(/databases/$(database)/documents/events/$(eventId)).data.hostId == request.auth.uid)
        );
        // Actualizar metadatos
        allow update: if isAdminClaim();
      }

      match /timeline/{itemId} {
        allow read: if isSignedIn() && (
          isAdminClaim() ||
          (get(/databases/$(database)/documents/events/$(eventId)).data.hostId == request.auth.uid)
        );
        allow create, update, delete: if isSignedIn() && (
          isAdminClaim() ||
          (get(/databases/$(database)/documents/events/$(eventId)).data.hostId == request.auth.uid)
        );
      }

      match /guestUploads/{uploadId} {
        // Si quieres público, cambia esta regla. Por ahora, solo host/admin.
        allow read: if isSignedIn() && (
          isAdminClaim() ||
          (get(/databases/$(database)/documents/events/$(eventId)).data.hostId == request.auth.uid)
        );
        // Crear: normalmente lo hace un endpoint con token; aquí lo limita a host/admin
        allow create: if isSignedIn() && (
          isAdminClaim() ||
          (get(/databases/$(database)/documents/events/$(eventId)).data.hostId == request.auth.uid)
        );
        allow update, delete: if isAdminClaim();
      }
    }

    // ---- DEFAULT DENY (última barrera) ----
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

    
