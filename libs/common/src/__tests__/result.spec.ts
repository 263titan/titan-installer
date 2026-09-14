import { ok, err, trySync, tryAsync, collectResults, TitanError, Err } from '../result/index.js';

describe('Result<T,E>', () => {
  describe('Ok', () => {
    const r = ok(42);

    it('isOk() returns true', () => expect(r.isOk()).toBe(true));
    it('isErr() returns false', () => expect(r.isErr()).toBe(false));
    it('unwrap() returns the value', () => expect(r.unwrap()).toBe(42));
    it('map() transforms the value', () => expect(r.map(x => x * 2).unwrap()).toBe(84));
    it('mapErr() is a no-op', () => expect(r.mapErr(() => 'error').unwrap()).toBe(42));
    it('andThen() chains', () => {
      expect(r.andThen(x => ok(x + 1)).unwrap()).toBe(43);
    });
    it('unwrapOr() returns the value', () => expect(r.unwrapOr(0)).toBe(42));
    it('match() calls Ok branch', () => {
      const result = r.match({ Ok: v => `val=${v}`, Err: () => 'error' });
      expect(result).toBe('val=42');
    });
  });

  describe('Err', () => {
    const e = err<number, string>('something broke');

    it('isOk() returns false', () => expect(e.isOk()).toBe(false));
    it('isErr() returns true', () => expect(e.isErr()).toBe(true));
    it('unwrap() throws', () => expect(() => e.unwrap()).toThrow());
    it('map() is a no-op', () => expect(e.map(x => x).isErr()).toBe(true));
    it('mapErr() transforms the error', () => {
      expect(e.mapErr(s => s.toUpperCase()).error).toBe('SOMETHING BROKE');
    });
    it('unwrapOr() returns fallback', () => expect(e.unwrapOr(99)).toBe(99));
    it('match() calls Err branch', () => {
      const result = e.match({ Ok: () => 'ok', Err: v => `err=${v}` });
      expect(result).toBe('err=something broke');
    });
  });

  describe('trySync', () => {
    it('returns Ok when fn succeeds', () => {
      const r = trySync(() => 1 + 1);
      expect(r.unwrap()).toBe(2);
    });
    it('returns Err when fn throws', () => {
      const r = trySync(() => { throw new Error('boom'); });
      expect(r.isErr()).toBe(true);
      expect((r as Err<unknown, Error>).error.message).toBe('boom');
    });
  });

  describe('tryAsync', () => {
    it('returns Ok for resolved promise', async () => {
      const r = await tryAsync(async () => 'hello');
      expect(r.unwrap()).toBe('hello');
    });
    it('returns Err for rejected promise', async () => {
      const r = await tryAsync(async () => { throw new Error('async boom'); });
      expect(r.isErr()).toBe(true);
    });
  });

  describe('collectResults', () => {
    it('returns Ok array when all Ok', () => {
      const r = collectResults([ok(1), ok(2), ok(3)]);
      expect(r.unwrap()).toEqual([1, 2, 3]);
    });
    it('returns first Err when any Err', () => {
      const r = collectResults([ok(1), err('oops'), ok(3)]);
      expect(r.isErr()).toBe(true);
    });
  });

  describe('TitanError', () => {
    it('creates notFound error', () => {
      const e = TitanError.notFound('Job', 'job_123');
      expect(e.code).toBe('NOT_FOUND');
      expect(e.message).toContain('job_123');
    });
    it('creates licenseExpired error', () => {
      const e = TitanError.licenseExpired();
      expect(e.code).toBe('LICENSE_EXPIRED');
    });
  });
});
