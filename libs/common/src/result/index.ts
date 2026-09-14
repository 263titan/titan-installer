// ─────────────────────────────────────────────────────────────────────────────
// Result<T, E> — Railway-oriented error handling
// Eliminates thrown exceptions from business logic; forces explicit error handling.
// ─────────────────────────────────────────────────────────────────────────────

export type Result<T, E = Error> = Ok<T, E> | Err<T, E>;

export class Ok<T, E> {
  readonly _tag = 'Ok' as const;
  constructor(public readonly value: T) {}

  isOk(): this is Ok<T, E> { return true; }
  isErr(): this is Err<T, E> { return false; }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return new Ok<U, E>(fn(this.value));
  }

  mapErr<F>(_fn: (err: E) => F): Result<T, F> {
    return new Ok<T, F>(this.value);
  }

  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }

  unwrap(): T { return this.value; }

  unwrapOr(_fallback: T): T { return this.value; }

  unwrapOrElse(_fn: (err: E) => T): T { return this.value; }

  match<R>(cases: { Ok: (value: T) => R; Err: (err: E) => R }): R {
    return cases.Ok(this.value);
  }
}

export class Err<T, E> {
  readonly _tag = 'Err' as const;
  constructor(public readonly error: E) {}

  isOk(): this is Ok<T, E> { return false; }
  isErr(): this is Err<T, E> { return true; }

  map<U>(_fn: (value: T) => U): Result<U, E> {
    return new Err<U, E>(this.error);
  }

  mapErr<F>(fn: (err: E) => F): Result<T, F> {
    return new Err<T, F>(fn(this.error));
  }

  andThen<U>(_fn: (value: T) => Result<U, E>): Result<U, E> {
    return new Err<U, E>(this.error);
  }

  unwrap(): never {
    if (this.error instanceof Error) throw this.error;
    throw new Error(`Called unwrap() on Err: ${String(this.error)}`);
  }

  unwrapOr(fallback: T): T { return fallback; }

  unwrapOrElse(fn: (err: E) => T): T { return fn(this.error); }

  match<R>(cases: { Ok: (value: T) => R; Err: (err: E) => R }): R {
    return cases.Err(this.error);
  }
}

// Constructors
export const ok = <T, E = Error>(value: T): Result<T, E> => new Ok<T, E>(value);
export const err = <T, E = Error>(error: E): Result<T, E> => new Err<T, E>(error);

// Wraps a throwing function in a Result
export function trySync<T>(fn: () => T): Result<T, Error> {
  try {
    return ok(fn());
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)));
  }
}

// Wraps an async throwing function in a Result
export async function tryAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
  try {
    return ok(await fn());
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)));
  }
}

// Collect all Ok values, or return the first Err
export function collectResults<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const values: T[] = [];
  for (const result of results) {
    if (result.isErr()) return result as unknown as Result<T[], E>;
    values.push(result.value);
  }
  return ok(values);
}

// Standard Titan error codes
export type TitanErrorCode =
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'DEVICE_OFFLINE'
  | 'DEVICE_BUSY'
  | 'JOB_FAILED'
  | 'PREFLIGHT_FAILED'
  | 'LICENSE_INVALID'
  | 'LICENSE_EXPIRED'
  | 'LICENSE_SEATS_EXHAUSTED'
  | 'FILE_NOT_FOUND'
  | 'FILE_INVALID'
  | 'NETWORK_ERROR'
  | 'INTERNAL_ERROR';

export class TitanError extends Error {
  constructor(
    public readonly code: TitanErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'TitanError';
  }

  static notFound(entity: string, id: string): TitanError {
    return new TitanError('NOT_FOUND', `${entity} '${id}' not found`);
  }

  static unauthorized(message = 'Unauthorized'): TitanError {
    return new TitanError('UNAUTHORIZED', message);
  }

  static validationError(message: string): TitanError {
    return new TitanError('VALIDATION_ERROR', message);
  }

  static licenseExpired(): TitanError {
    return new TitanError('LICENSE_EXPIRED', 'Your Titan license has expired');
  }

  static licenseInvalid(): TitanError {
    return new TitanError('LICENSE_INVALID', 'License token is invalid or has been tampered with');
  }

  static deviceOffline(deviceId: string): TitanError {
    return new TitanError('DEVICE_OFFLINE', `Device '${deviceId}' is offline`);
  }

  static internal(message: string, cause?: unknown): TitanError {
    return new TitanError('INTERNAL_ERROR', message, cause);
  }
}
