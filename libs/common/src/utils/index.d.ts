import { type Result } from '../result/index.js';
/**
 * Generate a new ULID — a monotonically sortable, URL-safe unique identifier.
 * Used for all Titan entity IDs (Jobs, Assets, Profiles, etc.)
 */
export declare function generateId(): string;
/**
 * Format a byte count into a human-readable string.
 * @example formatBytes(1536) → "1.5 KB"
 */
export declare function formatBytes(bytes: number, decimals?: number): string;
/**
 * Format milliseconds into a human-readable duration string.
 * @example formatDuration(125400) → "2m 5s"
 */
export declare function formatDuration(ms: number): string;
/**
 * Format a cost in cents to a localised currency string.
 * @example formatCostCents(1295, 'USD') → "$12.95"
 */
export declare function formatCostCents(cents: number, currency?: string, locale?: string): string;
/** Clamp a number between min and max (inclusive). */
export declare function clamp(value: number, min: number, max: number): number;
/** Linear interpolation between a and b at factor t (0–1). */
export declare function lerp(a: number, b: number, t: number): number;
/** Round to N decimal places. */
export declare function roundTo(value: number, decimals: number): number;
/** Delay execution for a given number of milliseconds. */
export declare function sleep(ms: number): Promise<void>;
/**
 * Retry an async operation with exponential backoff.
 * @param fn       The async function to retry.
 * @param maxRetries Number of retry attempts (not counting the initial try).
 * @param baseDelayMs Initial delay before first retry (doubles each attempt).
 */
export declare function retry<T>(fn: () => Promise<T>, maxRetries?: number, baseDelayMs?: number): Promise<Result<T, Error>>;
/**
 * Execute an async function with a timeout.
 * Returns Err if the timeout is exceeded.
 */
export declare function withTimeout<T>(fn: () => Promise<T>, timeoutMs: number): Promise<Result<T, Error>>;
/** Truncate a string to maxLength, appending an ellipsis if truncated. */
export declare function truncate(str: string, maxLength: number, ellipsis?: string): string;
/** Convert a string to slug format (lowercase, hyphens, no special chars). */
export declare function slugify(str: string): string;
/** Capitalise the first letter of a string. */
export declare function capitalize(str: string): string;
/** Compute a SHA-256 hex digest of a string or Buffer. */
export declare function sha256(data: string | Buffer): string;
/** Deep clone a plain JSON-serialisable object. */
export declare function deepClone<T>(obj: T): T;
/** Pick specific keys from an object. */
export declare function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
/** Omit specific keys from an object. */
export declare function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
/** Check if a value is a plain object (not array, null, class instance). */
export declare function isPlainObject(value: unknown): value is Record<string, unknown>;
/** Chunk an array into subarrays of a given size. */
export declare function chunk<T>(arr: T[], size: number): T[][];
/** Remove duplicate values from an array using a key selector. */
export declare function uniqueBy<T>(arr: T[], keyFn: (item: T) => unknown): T[];
/** Group an array of objects by a key. */
export declare function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]>;
/** Return the current time as an ISO 8601 string. */
export declare function now(): string;
/** Return a future ISO 8601 string offset by the given number of days. */
export declare function daysFromNow(days: number): string;
/** Check if an ISO date string is in the past. */
export declare function isExpired(isoDate: string): boolean;
/** Human-readable relative time: "3 minutes ago", "in 2 hours", etc. */
export declare function relativeTime(isoDate: string): string;
//# sourceMappingURL=index.d.ts.map