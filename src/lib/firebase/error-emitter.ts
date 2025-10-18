import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

// Type definition for the events that can be emitted.
type AppEvents = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// A simple typed event emitter.
class TypedEventEmitter<T extends Record<string, (...args: any[]) => void>> {
  private emitter = new EventEmitter();

  on<E extends keyof T>(event: E, listener: T[E]): void {
    this.emitter.on(event as string, listener);
  }

  emit<E extends keyof T>(event: E, ...args: Parameters<T[E]>): void {
    this.emitter.emit(event as string, ...args);
  }
}

// Global singleton for emitting app-wide errors.
export const errorEmitter = new TypedEventEmitter<AppEvents>();
