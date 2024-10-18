import { describe, it, expect } from 'vitest';
import { safeString, safeNumber, safeBigint, safeValues, safeKeys, safeEntries } from '../utils/safe-converter';

describe('safeString', () => {
  it('should return defaults if null or undefined', () => {
    expect(safeString(null)).toBe('');
    expect(safeString(undefined)).toBe('');
  });

  it('should return the string itself if valOrFun is a string', () => {
    expect(safeString('test')).toBe('test');
  });

  it('should convert number, boolean, and bigint to string', () => {
    expect(safeString(123)).toBe('123');
    expect(safeString(true)).toBe('true');
    expect(safeString(123n)).toBe('123');
  });

  it('should return result of function if valOrFun is a function', () => {
    expect(safeString(() => 'dynamic', 'default')).toBe('dynamic');
  });

  it('should convert object to JSON string', () => {
    expect(safeString({ key: 'value' })).toBe('{"key":"value"}');
    expect(safeString({ key: 123 })).toBe('{"key":123}');
    expect(safeString({ key: 123n })).toBe('{"key":"123"}');
  });
});

describe('safeNumber', () => {
  it('should return defaults if null, undefined, or NaN', () => {
    expect(safeNumber(null)).toBe(0);
    expect(safeNumber(undefined)).toBe(0);
    expect(safeNumber(NaN)).toBe(0);
  });

  it('should return the number itself if valOrFun is a valid number', () => {
    expect(safeNumber(123)).toBe(123);
    expect(safeNumber(-456)).toBe(-456);
  });

  it('should convert boolean to number (true -> 1, false -> 0)', () => {
    expect(safeNumber(true)).toBe(1);
    expect(safeNumber(false)).toBe(0);
  });

  it('should return result of function if valOrFun is a function', () => {
    expect(safeNumber(() => 42, 0)).toBe(42);
  });

  it('should convert string, bigint, and other types to number', () => {
    expect(safeNumber('123')).toBe(123);
    expect(safeNumber(123n)).toBe(123);
    expect(safeNumber('invalid', 99)).toBe(99); // Invalid string
  });
});

describe('safeBigint', () => {
  it('should return defaults if null or undefined', () => {
    expect(safeBigint(null)).toBe(0n);
    expect(safeBigint(undefined)).toBe(0n);
  });

  it('should return the bigint itself if valOrFun is a bigint', () => {
    expect(safeBigint(123n)).toBe(123n);
  });

  it('should convert number and boolean to bigint', () => {
    expect(safeBigint(123)).toBe(123n);
    expect(safeBigint(true)).toBe(1n);
    expect(safeBigint(false)).toBe(0n);
  });

  it('should convert string to bigint', () => {
    expect(safeBigint('123')).toBe(123n);
    expect(safeBigint('9007199254740991123')).toBe(9007199254740991123n);
    expect(safeBigint('9007199254740991123n')).toBe(9007199254740991123n);
    expect(safeBigint('90071992547409911.23')).toBe(90071992547409911n);
  });

  it('should return result of function if valOrFun is a function', () => {
    expect(safeBigint(() => 42n, 0n)).toBe(42n);
  });

  it('should return defaults for invalid string', () => {
    expect(safeBigint('invalid', 99n)).toBe(99n);
  });
});

describe('safeValues', () => {
  it('should return defaults if null or undefined', () => {
    expect(safeValues(null)).toEqual([]);
    expect(safeValues(undefined)).toEqual([]);
  });

  it('should return the values of an object', () => {
    const obj = { a: 1, b: 'test' };
    expect(safeValues(obj)).toEqual([1, 'test']);
  });

  it('should return result of function if valOrFun is a function', () => {
    expect(safeValues(() => ({ a: 1, b: 'test' }))).toEqual([1, 'test']);
  });
});

describe('safeKeys', () => {
  it('should return defaults if null or undefined', () => {
    expect(safeKeys(null)).toEqual([]);
    expect(safeKeys(undefined)).toEqual([]);
  });

  it('should return the keys of an object', () => {
    const obj = { a: 1, b: 'test', c: true };
    expect(safeKeys(obj)).toEqual(['a', 'b', 'c']);
  });

  it('should return an empty array for an empty object', () => {
    expect(safeKeys({})).toEqual([]);
  });

  it('should return result of function if valOrFun is a function', () => {
    const obj = { a: 1, b: 2 };
    expect(safeKeys(() => obj)).toEqual(['a', 'b']);
  });

  it('should return defaults if function returns null or undefined', () => {
    const defaults = ['defaultKey'];
    expect(safeKeys(() => null, defaults)).toEqual(defaults);
    expect(safeKeys(() => undefined, defaults)).toEqual(defaults);
  });

  it('should handle arrays and return string index keys', () => {
    const arr = [10, 20, 30];
    expect(safeKeys(arr)).toEqual(['0', '1', '2']);
  });

  it('should handle nested functions that return objects', () => {
    const nestedFunction = () => () => ({ foo: 'bar' });
    expect(safeKeys(nestedFunction)).toEqual(['foo']);
  });

  it('should return an empty array for non-object values (like number, boolean)', () => {
    expect(safeKeys(123 as unknown)).toEqual([]); // Non-object value
    expect(safeKeys(true as unknown)).toEqual([]); // Non-object value
  });

  it('should return keys for objects with complex types', () => {
    const obj = { a: [1, 2], b: { nested: true }, c: 'test' };
    expect(safeKeys(obj)).toEqual(['a', 'b', 'c']);
  });
});

describe('safeEntries', () => {
  it('should return defaults if null or undefined', () => {
    expect(safeEntries(null)).toEqual([]);
    expect(safeEntries(undefined)).toEqual([]);
  });

  it('should return entries of an object', () => {
    const obj = { a: 1, b: 'test', c: true };
    expect(safeEntries(obj)).toEqual([['a', 1], ['b', 'test'], ['c', true]]);
  });

  it('should return entries of an empty object', () => {
    expect(safeEntries({})).toEqual([]);
  });

  it('should return result of function if valOrFun is a function', () => {
    const obj = { a: 1, b: 2 };
    expect(safeEntries(() => obj)).toEqual([['a', 1], ['b', 2]]);
  });

  it('should return defaults if valOrFun is null and function is provided', () => {
    const defaults = [['key', 'value']] as [string, unknown][];
    expect(safeEntries(() => null, defaults)).toEqual(defaults);
  });

  it('should handle non-object values by throwing or returning an empty array', () => {
    expect(safeEntries(123 as unknown)).toEqual([]); // Non-object values should return an empty array
  });

  it('should handle arrays and return index-value pairs', () => {
    const arr = [10, 20, 30];
    expect(safeEntries(arr)).toEqual([['0', 10], ['1', 20], ['2', 30]]);
  });

  it('should handle nested functions that return objects', () => {
    const nestedFunction = () => () => ({ foo: 'bar' });
    expect(safeEntries(nestedFunction)).toEqual([['foo', 'bar']]);
  });
});

describe('numberKey;', () => {
  const d3 = 0.1 + 0.2;

  it('number key of object', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj = { 1: '1', 0.3: '0.3' } as any;
    expect(obj[1]).toBe('1');
    expect(obj['1']).toBe('1');
    expect(obj[d3]).toBe(undefined);
  });

  it('number key of Set/Map', () => {
    const numSet = new Set<unknown>([1, 0.3]);
    const strSet = new Set<unknown>(['1', '0.3']);

    expect(numSet.has(1)).toBe(true);
    expect(strSet.has('1')).toBe(true);

    expect(numSet.has('1')).toBe(false);
    expect(numSet.has('0.3')).toBe(false);
    expect(strSet.has(1)).toBe(false);
    expect(strSet.has(d3)).toBe(false);

    const numMap = new Map<unknown, string>([[1, '1'], [0.3, '0.3']]);
    const strMap = new Map<unknown, string>([['1', '1'], ['0.3', '0.3']]);

    expect(numMap.has(1)).toBe(true);
    expect(strMap.has('1')).toBe(true);

    expect(numMap.has('1')).toBe(false);
    expect(numMap.has('0.3')).toBe(false);
    expect(strMap.has(1)).toBe(false);
    expect(strMap.has(d3)).toBe(false);
  });
});
