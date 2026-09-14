import {
  generateId, formatBytes, formatDuration, clamp, lerp, roundTo,
  sleep, retry, truncate, slugify, capitalize, sha256,
  deepClone, pick, omit, chunk, uniqueBy, groupBy, now, isExpired,
} from '../utils/index.js';

describe('utils', () => {
  describe('generateId', () => {
    it('generates a 26-char ULID', () => {
      const id = generateId();
      expect(id).toHaveLength(26);
      expect(id).toMatch(/^[0-9A-Z]{26}$/);
    });
    it('generates unique IDs', () => {
      const ids = new Set(Array.from({ length: 1000 }, () => generateId()));
      expect(ids.size).toBe(1000);
    });
  });

  describe('formatBytes', () => {
    it('formats 0 bytes', () => expect(formatBytes(0)).toBe('0 Bytes'));
    it('formats KB', () => expect(formatBytes(1536)).toBe('1.5 KB'));
    it('formats MB', () => expect(formatBytes(1048576)).toBe('1 MB'));
    it('formats GB', () => expect(formatBytes(1073741824)).toBe('1 GB'));
  });

  describe('formatDuration', () => {
    it('formats ms', () => expect(formatDuration(500)).toBe('500ms'));
    it('formats seconds', () => expect(formatDuration(5000)).toBe('5s'));
    it('formats minutes', () => expect(formatDuration(125000)).toBe('2m 5s'));
    it('formats hours', () => expect(formatDuration(3661000)).toBe('1h 1m'));
  });

  describe('clamp', () => {
    it('clamps below min', () => expect(clamp(-5, 0, 10)).toBe(0));
    it('clamps above max', () => expect(clamp(15, 0, 10)).toBe(10));
    it('passes through in-range', () => expect(clamp(5, 0, 10)).toBe(5));
  });

  describe('lerp', () => {
    it('lerps at t=0', () => expect(lerp(0, 100, 0)).toBe(0));
    it('lerps at t=1', () => expect(lerp(0, 100, 1)).toBe(100));
    it('lerps at t=0.5', () => expect(lerp(0, 100, 0.5)).toBe(50));
  });

  describe('roundTo', () => {
    it('rounds to 2 decimal places', () => expect(roundTo(1.2345, 2)).toBe(1.23));
    it('rounds to 0 decimal places', () => expect(roundTo(1.7, 0)).toBe(2));
  });

  describe('sleep', () => {
    it('resolves after specified time', async () => {
      const start = Date.now();
      await sleep(50);
      expect(Date.now() - start).toBeGreaterThanOrEqual(40);
    });
  });

  describe('retry', () => {
    it('returns Ok on first success', async () => {
      const r = await retry(async () => 'value');
      expect(r.unwrap()).toBe('value');
    });
    it('retries and succeeds', async () => {
      let calls = 0;
      const r = await retry(async () => {
        calls++;
        if (calls < 3) throw new Error('not yet');
        return 'done';
      }, 3, 1);
      expect(r.unwrap()).toBe('done');
      expect(calls).toBe(3);
    });
    it('returns Err after exhausting retries', async () => {
      const r = await retry(async () => { throw new Error('always fails'); }, 2, 1);
      expect(r.isErr()).toBe(true);
    });
  });

  describe('string utils', () => {
    it('truncates long strings', () => expect(truncate('hello world', 8)).toBe('hello w…'));
    it('slugifies', () => expect(slugify('Hello World!')).toBe('hello-world'));
    it('capitalizes', () => expect(capitalize('hello')).toBe('Hello'));
  });

  describe('sha256', () => {
    it('produces a 64-char hex string', () => {
      expect(sha256('titan')).toHaveLength(64);
    });
    it('is deterministic', () => {
      expect(sha256('titan')).toBe(sha256('titan'));
    });
    it('differs for different inputs', () => {
      expect(sha256('a')).not.toBe(sha256('b'));
    });
  });

  describe('object utils', () => {
    const obj = { a: 1, b: 2, c: 3 };
    it('pick returns selected keys', () => expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 }));
    it('omit removes keys', () => expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 }));
    it('deepClone creates a new object', () => {
      const clone = deepClone(obj);
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
    });
  });

  describe('array utils', () => {
    it('chunk splits array', () => expect(chunk([1,2,3,4,5], 2)).toEqual([[1,2],[3,4],[5]]));
    it('uniqueBy deduplicates', () => {
      const r = uniqueBy([{id:1},{id:2},{id:1}], x => x.id);
      expect(r).toHaveLength(2);
    });
    it('groupBy groups objects', () => {
      const r = groupBy([{k:'a',v:1},{k:'b',v:2},{k:'a',v:3}], x => x.k);
      expect(r['a']).toHaveLength(2);
      expect(r['b']).toHaveLength(1);
    });
  });

  describe('date utils', () => {
    it('now returns an ISO string', () => {
      expect(new Date(now()).getTime()).toBeGreaterThan(0);
    });
    it('isExpired returns true for past date', () => {
      expect(isExpired('2020-01-01T00:00:00Z')).toBe(true);
    });
    it('isExpired returns false for future date', () => {
      expect(isExpired('2099-01-01T00:00:00Z')).toBe(false);
    });
  });
});
