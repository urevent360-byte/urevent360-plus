'use client';

// Defines the shape of the context for a Firestore security rule error.
export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

// A custom error class to provide detailed context about Firestore permission errors.
export class FirestorePermissionError extends Error {
  context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const message = `Firestore permission denied: Cannot ${context.operation} on path '${context.path}'.`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
    // This is to make the error visible in the Next.js development overlay
    this.stack = JSON.stringify(this.toJSON(), null, 2);
  }

  toJSON() {
    return {
      message: this.message,
      context: this.context,
    };
  }
}
