export type EventHandler<T> = (event: T) => void | Promise<void>;
export type Unsubscribe = () => void;
export declare class TypedEventEmitter<EventMap extends Record<string, unknown>> {
    private readonly handlers;
    /** Subscribe to an event. Returns an unsubscribe function. */
    on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): Unsubscribe;
    /** Subscribe to an event exactly once. */
    once<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): Unsubscribe;
    /** Emit an event synchronously to all subscribers. */
    emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void;
    /** Emit an event and await all async handlers. */
    emitAsync<K extends keyof EventMap>(event: K, data: EventMap[K]): Promise<void>;
    /** Remove all subscribers for a specific event, or all subscribers if no event given. */
    off<K extends keyof EventMap>(event?: K): void;
    /** Count of active subscribers for a given event. */
    listenerCount<K extends keyof EventMap>(event: K): number;
}
import type { DeviceStatus } from '../types/index.js';
export interface TitanEventMap {
    'job:queued': {
        jobId: string;
        priority: string;
    };
    'job:started': {
        jobId: string;
        deviceId: string;
    };
    'job:progress': {
        jobId: string;
        percent: number;
        step: string;
    };
    'job:completed': {
        jobId: string;
        durationMs: number;
    };
    'job:failed': {
        jobId: string;
        error: string;
    };
    'job:cancelled': {
        jobId: string;
    };
    'device:connected': {
        deviceId: string;
        model: string;
    };
    'device:disconnected': {
        deviceId: string;
    };
    'device:status': {
        deviceId: string;
        status: DeviceStatus;
    };
    'device:error': {
        deviceId: string;
        codes: string[];
    };
    'sync:started': {
        entity: string;
    };
    'sync:completed': {
        entity: string;
        count: number;
    };
    'license:validated': {
        licenseId: string;
        type: string;
    };
    'license:expired': {
        licenseId: string;
    };
    'update:available': {
        version: string;
        channel: string;
    };
    'update:downloaded': {
        version: string;
    };
    [key: string]: unknown;
}
export declare const titanEvents: TypedEventEmitter<TitanEventMap>;
//# sourceMappingURL=index.d.ts.map