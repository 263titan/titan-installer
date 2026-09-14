export type Result<T, E = Error> = Ok<T, E> | Err<T, E>;
export declare class Ok<T, E> {
    readonly value: T;
    readonly _tag: 'Ok';
    constructor(value: T);
    isOk(): this is Ok<T, E>;
    isErr(): this is Err<T, E>;
    map<U>(fn: (value: T) => U): Result<U, E>;
    mapErr<F>(_fn: (err: E) => F): Result<T, F>;
    andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E>;
    unwrap(): T;
    unwrapOr(_fallback: T): T;
    unwrapOrElse(_fn: (err: E) => T): T;
    match<R>(cases: {
        Ok: (value: T) => R;
        Err: (err: E) => R;
    }): R;
}
export declare class Err<T, E> {
    readonly error: E;
    readonly _tag: 'Err';
    constructor(error: E);
    isOk(): this is Ok<T, E>;
    isErr(): this is Err<T, E>;
    map<U>(_fn: (value: T) => U): Result<U, E>;
    mapErr<F>(fn: (err: E) => F): Result<T, F>;
    andThen<U>(_fn: (value: T) => Result<U, E>): Result<U, E>;
    unwrap(): never;
    unwrapOr(fallback: T): T;
    unwrapOrElse(fn: (err: E) => T): T;
    match<R>(cases: {
        Ok: (value: T) => R;
        Err: (err: E) => R;
    }): R;
}
export declare const ok: <T, E = Error>(value: T) => Result<T, E>;
export declare const err: <T, E = Error>(error: E) => Result<T, E>;
export declare function trySync<T>(fn: () => T): Result<T, Error>;
export declare function tryAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>>;
export declare function collectResults<T, E>(results: Result<T, E>[]): Result<T[], E>;
export type TitanErrorCode = 'NOT_FOUND' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'VALIDATION_ERROR' | 'CONFLICT' | 'DEVICE_OFFLINE' | 'DEVICE_BUSY' | 'JOB_FAILED' | 'PREFLIGHT_FAILED' | 'LICENSE_INVALID' | 'LICENSE_EXPIRED' | 'LICENSE_SEATS_EXHAUSTED' | 'FILE_NOT_FOUND' | 'FILE_INVALID' | 'NETWORK_ERROR' | 'INTERNAL_ERROR';
export declare class TitanError extends Error {
    readonly code: TitanErrorCode;
    readonly cause?: unknown;
    constructor(code: TitanErrorCode, message: string, cause?: unknown);
    static notFound(entity: string, id: string): TitanError;
    static unauthorized(message?: string): TitanError;
    static validationError(message: string): TitanError;
    static licenseExpired(): TitanError;
    static licenseInvalid(): TitanError;
    static deviceOffline(deviceId: string): TitanError;
    static internal(message: string, cause?: unknown): TitanError;
}
//# sourceMappingURL=index.d.ts.map