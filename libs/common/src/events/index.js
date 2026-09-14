// ─────────────────────────────────────────────────────────────────────────────
// Titan Typed EventEmitter
// Type-safe event bus for intra-process communication.
// ─────────────────────────────────────────────────────────────────────────────
export class TypedEventEmitter {
    handlers = new Map();
    /** Subscribe to an event. Returns an unsubscribe function. */
    on(event, handler) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        const set = this.handlers.get(event);
        set.add(handler);
        return () => {
            set.delete(handler);
        };
    }
    /** Subscribe to an event exactly once. */
    once(event, handler) {
        const unsub = this.on(event, (data) => {
            unsub();
            return handler(data);
        });
        return unsub;
    }
    /** Emit an event synchronously to all subscribers. */
    emit(event, data) {
        const set = this.handlers.get(event);
        if (!set)
            return;
        for (const handler of set) {
            try {
                void handler(data);
            }
            catch {
                // Individual handler errors should not break the event bus
            }
        }
    }
    /** Emit an event and await all async handlers. */
    async emitAsync(event, data) {
        const set = this.handlers.get(event);
        if (!set)
            return;
        const promises = [];
        for (const handler of set) {
            try {
                const result = handler(data);
                if (result instanceof Promise)
                    promises.push(result);
            }
            catch {
                // Sync errors swallowed; async errors caught below
            }
        }
        await Promise.allSettled(promises);
    }
    /** Remove all subscribers for a specific event, or all subscribers if no event given. */
    off(event) {
        if (event !== undefined) {
            this.handlers.delete(event);
        }
        else {
            this.handlers.clear();
        }
    }
    /** Count of active subscribers for a given event. */
    listenerCount(event) {
        return this.handlers.get(event)?.size ?? 0;
    }
}
// Singleton global event bus for the Titan process
export const titanEvents = new TypedEventEmitter();
//# sourceMappingURL=index.js.map