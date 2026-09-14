// ─────────────────────────────────────────────────────────────────────────────
// Titan Common Utilities
// ─────────────────────────────────────────────────────────────────────────────
import { ulid } from 'ulid';
import { createHash } from 'crypto';
import { ok, err } from '../result/index.js';
// ── ID generation ─────────────────────────────────────────────────────────────
/**
 * Generate a new ULID — a monotonically sortable, URL-safe unique identifier.
 * Used for all Titan entity IDs (Jobs, Assets, Profiles, etc.)
 */
export function generateId() {
    return ulid();
}
// ── Formatting ────────────────────────────────────────────────────────────────
/**
 * Format a byte count into a human-readable string.
 * @example formatBytes(1536) → "1.5 KB"
 */
export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i] ?? 'Bytes'}`;
}
/**
 * Format milliseconds into a human-readable duration string.
 * @example formatDuration(125400) → "2m 5s"
 */
export function formatDuration(ms) {
    if (ms < 1000)
        return `${ms}ms`;
    const s = Math.floor(ms / 1000);
    if (s < 60)
        return `${s}s`;
    const m = Math.floor(s / 60);
    const remS = s % 60;
    if (m < 60)
        return `${m}m ${remS}s`;
    const h = Math.floor(m / 60);
    const remM = m % 60;
    return `${h}h ${remM}m`;
}
/**
 * Format a cost in cents to a localised currency string.
 * @example formatCostCents(1295, 'USD') → "$12.95"
 */
export function formatCostCents(cents, currency = 'USD', locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(cents / 100);
}
// ── Math ──────────────────────────────────────────────────────────────────────
/** Clamp a number between min and max (inclusive). */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
/** Linear interpolation between a and b at factor t (0–1). */
export function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
}
/** Round to N decimal places. */
export function roundTo(value, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}
// ── Async ─────────────────────────────────────────────────────────────────────
/** Delay execution for a given number of milliseconds. */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Retry an async operation with exponential backoff.
 * @param fn       The async function to retry.
 * @param maxRetries Number of retry attempts (not counting the initial try).
 * @param baseDelayMs Initial delay before first retry (doubles each attempt).
 */
export async function retry(fn, maxRetries = 3, baseDelayMs = 100) {
    let lastError = new Error('Unknown error');
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return ok(await fn());
        }
        catch (e) {
            lastError = e instanceof Error ? e : new Error(String(e));
            if (attempt < maxRetries) {
                await sleep(baseDelayMs * Math.pow(2, attempt));
            }
        }
    }
    return err(lastError);
}
/**
 * Execute an async function with a timeout.
 * Returns Err if the timeout is exceeded.
 */
export async function withTimeout(fn, timeoutMs) {
    const timeoutPromise = sleep(timeoutMs).then(() => {
        throw new Error(`Operation timed out after ${timeoutMs}ms`);
    });
    try {
        return ok(await Promise.race([fn(), timeoutPromise]));
    }
    catch (e) {
        return err(e instanceof Error ? e : new Error(String(e)));
    }
}
// ── Strings ───────────────────────────────────────────────────────────────────
/** Truncate a string to maxLength, appending an ellipsis if truncated. */
export function truncate(str, maxLength, ellipsis = '…') {
    if (str.length <= maxLength)
        return str;
    return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}
/** Convert a string to slug format (lowercase, hyphens, no special chars). */
export function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
/** Capitalise the first letter of a string. */
export function capitalize(str) {
    return str.length === 0 ? str : str[0].toUpperCase() + str.slice(1);
}
// ── Hashing ───────────────────────────────────────────────────────────────────
/** Compute a SHA-256 hex digest of a string or Buffer. */
export function sha256(data) {
    return createHash('sha256').update(data).digest('hex');
}
// ── Objects ───────────────────────────────────────────────────────────────────
/** Deep clone a plain JSON-serialisable object. */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/** Pick specific keys from an object. */
export function pick(obj, keys) {
    const result = {};
    for (const key of keys) {
        if (key in obj)
            result[key] = obj[key];
    }
    return result;
}
/** Omit specific keys from an object. */
export function omit(obj, keys) {
    const result = { ...obj };
    for (const key of keys)
        delete result[key];
    return result;
}
/** Check if a value is a plain object (not array, null, class instance). */
export function isPlainObject(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}
// ── Arrays ────────────────────────────────────────────────────────────────────
/** Chunk an array into subarrays of a given size. */
export function chunk(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}
/** Remove duplicate values from an array using a key selector. */
export function uniqueBy(arr, keyFn) {
    const seen = new Set();
    return arr.filter((item) => {
        const key = keyFn(item);
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
}
/** Group an array of objects by a key. */
export function groupBy(arr, keyFn) {
    return arr.reduce((acc, item) => {
        const key = keyFn(item);
        if (!acc[key])
            acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
}
// ── Date / time ───────────────────────────────────────────────────────────────
/** Return the current time as an ISO 8601 string. */
export function now() {
    return new Date().toISOString();
}
/** Return a future ISO 8601 string offset by the given number of days. */
export function daysFromNow(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
}
/** Check if an ISO date string is in the past. */
export function isExpired(isoDate) {
    return new Date(isoDate).getTime() < Date.now();
}
/** Human-readable relative time: "3 minutes ago", "in 2 hours", etc. */
export function relativeTime(isoDate) {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diffMs = new Date(isoDate).getTime() - Date.now();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHr = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHr / 24);
    if (Math.abs(diffSec) < 60)
        return rtf.format(diffSec, 'second');
    if (Math.abs(diffMin) < 60)
        return rtf.format(diffMin, 'minute');
    if (Math.abs(diffHr) < 24)
        return rtf.format(diffHr, 'hour');
    return rtf.format(diffDay, 'day');
}
//# sourceMappingURL=index.js.map