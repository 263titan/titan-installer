// ─────────────────────────────────────────────────────────────────────────────
// Titan Typed EventEmitter
// Type-safe event bus for intra-process communication.
// ─────────────────────────────────────────────────────────────────────────────

export type EventHandler<T> = (event: T) => void | Promise<void>;
export type Unsubscribe = () => void;

export class TypedEventEmitter<EventMap extends Record<string, unknown>> {
  private readonly handlers = new Map<
    keyof EventMap,
    Set<EventHandler<EventMap[keyof EventMap]>>
  >();

  /** Subscribe to an event. Returns an unsubscribe function. */
  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): Unsubscribe {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    const set = this.handlers.get(event)!;
    set.add(handler as EventHandler<EventMap[keyof EventMap]>);

    return () => {
      set.delete(handler as EventHandler<EventMap[keyof EventMap]>);
    };
  }

  /** Subscribe to an event exactly once. */
  once<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): Unsubscribe {
    const unsub = this.on(event, (data) => {
      unsub();
      return handler(data);
    });
    return unsub;
  }

  /** Emit an event synchronously to all subscribers. */
  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const set = this.handlers.get(event);
    if (!set) return;
    for (const handler of set) {
      try {
        void handler(data as EventMap[keyof EventMap]);
      } catch {
        // Individual handler errors should not break the event bus
      }
    }
  }

  /** Emit an event and await all async handlers. */
  async emitAsync<K extends keyof EventMap>(event: K, data: EventMap[K]): Promise<void> {
    const set = this.handlers.get(event);
    if (!set) return;
    const promises: Promise<void>[] = [];
    for (const handler of set) {
      try {
        const result = handler(data as EventMap[keyof EventMap]);
        if (result instanceof Promise) promises.push(result);
      } catch {
        // Sync errors swallowed; async errors caught below
      }
    }
    await Promise.allSettled(promises);
  }

  /** Remove all subscribers for a specific event, or all subscribers if no event given. */
  off<K extends keyof EventMap>(event?: K): void {
    if (event !== undefined) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
  }

  /** Count of active subscribers for a given event. */
  listenerCount<K extends keyof EventMap>(event: K): number {
    return this.handlers.get(event)?.size ?? 0;
  }
}

// ── Titan global event map ────────────────────────────────────────────────────
import type { DeviceStatus } from '../types/index.js';

export interface TitanEventMap {
  'job:queued': { jobId: string; priority: string };
  'job:started': { jobId: string; deviceId: string };
  'job:progress': { jobId: string; percent: number; step: string };
  'job:completed': { jobId: string; durationMs: number };
  'job:failed': { jobId: string; error: string };
  'job:cancelled': { jobId: string };
  'device:connected': { deviceId: string; model: string };
  'device:disconnected': { deviceId: string };
  'device:status': { deviceId: string; status: DeviceStatus };
  'device:error': { deviceId: string; codes: string[] };
  'sync:started': { entity: string };
  'sync:completed': { entity: string; count: number };
  'license:validated': { licenseId: string; type: string };
  'license:expired': { licenseId: string };
  'update:available': { version: string; channel: string };
  'update:downloaded': { version: string };
  [key: string]: unknown;
}

// Singleton global event bus for the Titan process
export const titanEvents = new TypedEventEmitter<TitanEventMap>();
