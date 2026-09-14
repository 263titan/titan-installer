// ─────────────────────────────────────────────────────────────────────────────
// Result<T, E> — Railway-oriented error handling
// Eliminates thrown exceptions from business logic; forces explicit error handling.
// ─────────────────────────────────────────────────────────────────────────────
export class Ok {
    value;
    _tag = 'Ok';
    constructor(value) {
        this.value = value;
    }
    isOk() { return true; }
    isErr() { return false; }
    map(fn) {
        return new Ok(fn(this.value));
    }
    mapErr(_fn) {
        return new Ok(this.value);
    }
    andThen(fn) {
        return fn(this.value);
    }
    unwrap() { return this.value; }
    unwrapOr(_fallback) { return this.value; }
    unwrapOrElse(_fn) { return this.value; }
    match(cases) {
        return cases.Ok(this.value);
    }
}
export class Err {
    error;
    _tag = 'Err';
    constructor(error) {
        this.error = error;
    }
    isOk() { return false; }
    isErr() { return true; }
    map(_fn) {
        return new Err(this.error);
    }
    mapErr(fn) {
        return new Err(fn(this.error));
    }
    andThen(_fn) {
        return new Err(this.error);
    }
    unwrap() {
        if (this.error instanceof Error)
            throw this.error;
        throw new Error(`Called unwrap() on Err: ${String(this.error)}`);
    }
    unwrapOr(fallback) { return fallback; }
    unwrapOrElse(fn) { return fn(this.error); }
    match(cases) {
        return cases.Err(this.error);
    }
}
// Constructors
export const ok = (value) => new Ok(value);
export const err = (error) => new Err(error);
// Wraps a throwing function in a Result
export function trySync(fn) {
    try {
        return ok(fn());
    }
    catch (e) {
        return err(e instanceof Error ? e : new Error(String(e)));
    }
}
// Wraps an async throwing function in a Result
export async function tryAsync(fn) {
    try {
        return ok(await fn());
    }
    catch (e) {
        return err(e instanceof Error ? e : new Error(String(e)));
    }
}
// Collect all Ok values, or return the first Err
export function collectResults(results) {
    const values = [];
    for (const result of results) {
        if (result.isErr())
            return result;
        values.push(result.value);
    }
    return ok(values);
}
export class TitanError extends Error {
    code;
    cause;
    constructor(code, message, cause) {
        super(message);
        this.code = code;
        this.cause = cause;
        this.name = 'TitanError';
    }
    static notFound(entity, id) {
        return new TitanError('NOT_FOUND', `${entity} '${id}' not found`);
    }
    static unauthorized(message = 'Unauthorized') {
        return new TitanError('UNAUTHORIZED', message);
    }
    static validationError(message) {
        return new TitanError('VALIDATION_ERROR', message);
    }
    static licenseExpired() {
        return new TitanError('LICENSE_EXPIRED', 'Your Titan license has expired');
    }
    static licenseInvalid() {
        return new TitanError('LICENSE_INVALID', 'License token is invalid or has been tampered with');
    }
    static deviceOffline(deviceId) {
        return new TitanError('DEVICE_OFFLINE', `Device '${deviceId}' is offline`);
    }
    static internal(message, cause) {
        return new TitanError('INTERNAL_ERROR', message, cause);
    }
}
//# sourceMappingURL=index.js.map