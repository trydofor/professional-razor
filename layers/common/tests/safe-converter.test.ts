﻿import { Md5 } from 'ts-md5';
import { describe, it, expect } from 'vitest';

describe('safeConvert', () => {
  it('should return converted value when input is valid', () => {
    const result = safeConvert(5, 'default', value => value > 3 ? 'valid' : null);
    expect(result).toBe('valid');
  });

  it('should return default value when conversion returns null', () => {
    const result = safeConvert(2, 'default', value => value > 3 ? 'valid' : null);
    expect(result).toBe('default');
  });

  it('should return default value when input is null or undefined', () => {
    expect(safeConvert(null, 'default', value => String(value))).toBe('default');
    expect(safeConvert(undefined, 'default', value => String(value))).toBe('default');
  });

  it('should handle function inputs and evaluate them correctly', () => {
    const result = safeConvert(() => 10, 'default', value => value > 5 ? 'valid' : null);
    expect(result).toBe('valid');
  });

  it('should break after one function evaluation if once is true', () => {
    const nestedFunction: SafeAny = () => () => 10;
    const result = safeConvert(nestedFunction, 'default', value => value > 5 ? 'valid' : null, true);
    expect(result).toBe('default');
  });

  it('should evaluate nested functions until a value is returned when once is false', () => {
    const nestedFunction: SafeAny = () => () => 10;
    const result = safeConvert(nestedFunction, 'default', value => value > 5 ? 'valid' : null);
    expect(result).toBe('valid');
  });

  it('should work with complex conversion logic', () => {
    const complexConvert = (value: number) => (value % 2 === 0 ? 'even' : null);
    expect(safeConvert(4, 'odd', complexConvert)).toBe('even');
    expect(safeConvert(3, 'odd', complexConvert)).toBe('odd');
  });

  it('should handle different default types', () => {
    expect(safeConvert(null, 0, (value: string) => parseInt(value, 10))).toBe(0);
    expect(safeConvert('42', 0, (value: string) => parseInt(value, 10))).toBe(42);
  });
});

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
  it('should return defaults if null, undefined, NaN, Infinity', () => {
    expect(safeNumber(null)).toBe(0);
    expect(safeNumber(undefined)).toBe(0);
    expect(safeNumber(NaN)).toBe(0);
    expect(safeNumber(-Infinity)).toBe(0);
    expect(safeNumber(+Infinity)).toBe(0);
  });

  it('should return the number itself if valOrFun is a valid number', () => {
    expect(safeNumber(12.5)).toBe(12.5);
    expect(safeNumber(-1.125)).toBe(-1.125);
  });

  it('should convert boolean to number (true -> 1, false -> 0)', () => {
    expect(safeNumber(true)).toBe(1);
    expect(safeNumber(false)).toBe(0);
  });

  it('should return result of function if valOrFun is a function', () => {
    expect(safeNumber(() => 1.125, 0)).toBe(1.125);
  });

  it('should convert string, bigint, and other types to number', () => {
    expect(safeNumber('1.125')).toBe(1.125);
    expect(safeNumber(125n)).toBe(125);
    expect(safeNumber('invalid', 1.125)).toBe(1.125); // Invalid string
  });
});

describe('safeInt', () => {
  it('should return defaults if null, undefined, NaN, Infinity', () => {
    expect(safeInt(null)).toBe(0);
    expect(safeInt(undefined)).toBe(0);
    expect(safeInt(NaN)).toBe(0);
    expect(safeNumber(-Infinity)).toBe(0);
    expect(safeNumber(+Infinity)).toBe(0);
  });

  it('should return the number itself if valOrFun is a valid number', () => {
    expect(safeInt(123)).toBe(123);
    expect(safeInt(-456)).toBe(-456);
  });

  it('should convert boolean to number (true -> 1, false -> 0)', () => {
    expect(safeInt(true)).toBe(1);
    expect(safeInt(false)).toBe(0);
  });

  it('should return result of function if valOrFun is a function', () => {
    expect(safeInt(() => 42, 0)).toBe(42);
  });

  it('should convert string, bigint, and other types to number', () => {
    expect(safeInt('123')).toBe(123);
    expect(safeInt(123n)).toBe(123);
    expect(safeInt('invalid', 99)).toBe(99); // Invalid string
  });
});

describe('safeBigint', () => {
  it('should return defaults if null or undefined', () => {
    expect(safeBigint(null)).toBe(0n);
    expect(safeBigint(undefined)).toBe(0n);

    expect(safeBigint({} as SafeAny)).toBe(0n);
    expect(safeBigint(NaN)).toBe(0n);
    expect(safeBigint(-Infinity)).toBe(0n);
    expect(safeBigint(+Infinity)).toBe(0n);
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

describe('safeBoolean', () => {
  it('should return true for truthy values', () => {
    expect(safeBoolean(true)).toBe(true);
    expect(safeBoolean(1)).toBe(true);
    expect(safeBoolean(1n)).toBe(true);
    expect(safeBoolean('true')).toBe(true);
    expect(safeBoolean('TRUE')).toBe(true);
    expect(safeBoolean('t')).toBe(true);
    expect(safeBoolean('T')).toBe(true);
    expect(safeBoolean('1')).toBe(true);
  });

  it('should return false for falsy values', () => {
    expect(safeBoolean(false)).toBe(false);
    expect(safeBoolean(0)).toBe(false);
    expect(safeBoolean(0n)).toBe(false);
    expect(safeBoolean('false')).toBe(false);
    expect(safeBoolean('f')).toBe(false);
    expect(safeBoolean('0')).toBe(false);
  });

  it('should handle function inputs', () => {
    expect(safeBoolean(() => true)).toBe(true);
    expect(safeBoolean(() => 0)).toBe(false);
  });

  it('should use the default value if conversion fails', () => {
    expect(safeBoolean(null, true)).toBe(true);
    expect(safeBoolean(undefined, true)).toBe(true);
    expect(safeBoolean(NaN, true)).toBe(true);
    expect(safeBoolean(-Infinity, true)).toBe(true);
    expect(safeBoolean(+Infinity, true)).toBe(true);
    expect(safeBoolean(null, false)).toBe(false);
    expect(safeBoolean(undefined, false)).toBe(false);
    expect(safeBoolean(NaN, false)).toBe(false);
    expect(safeBoolean(-Infinity, false)).toBe(false);
    expect(safeBoolean(+Infinity, false)).toBe(false);

    expect(safeBoolean({} as SafeAny, true)).toBe(true);
    expect(safeBoolean({} as SafeAny, false)).toBe(false);
  });
});

describe('safeBoolTof', () => {
  it('should return "t" for truthy values', () => {
    expect(safeBoolTof(true)).toBe('t');
    expect(safeBoolTof(1)).toBe('t');
    expect(safeBoolTof('true')).toBe('t');
  });

  it('should return "f" for falsy values', () => {
    expect(safeBoolTof(false)).toBe('f');
    expect(safeBoolTof(0)).toBe('f');
    expect(safeBoolTof('false')).toBe('f');
  });

  it('should handle function inputs', () => {
    expect(safeBoolTof(() => true)).toBe('t');
    expect(safeBoolTof(() => 0)).toBe('f');
  });
});

describe('safeBoolNum', () => {
  it('should return 1 for truthy values', () => {
    expect(safeBoolNum(true)).toBe(1);
    expect(safeBoolNum(1)).toBe(1);
    expect(safeBoolNum('true')).toBe(1);
  });

  it('should return 0 for falsy values', () => {
    expect(safeBoolNum(false)).toBe(0);
    expect(safeBoolNum(0)).toBe(0);
    expect(safeBoolNum('false')).toBe(0);
  });

  it('should handle function inputs', () => {
    expect(safeBoolNum(() => true)).toBe(1);
    expect(safeBoolNum(() => 0)).toBe(0);
  });
});

describe('safeArray', () => {
  it('should return the default array if input is null', () => {
    const result = safeArray(null, [1, 2, 3]);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should return the default array if input is undefined', () => {
    expect(safeArray(undefined, [1, 2, 3])).toEqual([1, 2, 3]);
    expect(safeArray(NaN, [1, 2, 3])).toEqual([1, 2, 3]);
    expect(safeArray(-Infinity, [1, 2, 3])).toEqual([1, 2, 3]);
    expect(safeArray(+Infinity, [1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('should return the input array if input is already an array', () => {
    const input = [4, 5, 6];
    const result = safeArray(input);
    expect(result).toEqual(input);
  });

  it('should return an array wrapping a single non-array value', () => {
    const result = safeArray('test');
    expect(result).toEqual(['test']);
  });

  it('should handle functions that return arrays', () => {
    const result = safeArray(() => [7, 8, 9]);
    expect(result).toEqual([7, 8, 9]);
  });

  it('should handle functions that return non-array values', () => {
    const result = safeArray(() => 'dynamic');
    expect(result).toEqual(['dynamic']);
  });

  it('should wrap non-array, non-function values in an array', () => {
    const result = safeArray(42);
    expect(result).toEqual([42]);
  });

  it('should return an empty array when defaults are not provided and input is null', () => {
    const result = safeArray(null);
    expect(result).toEqual([]);
  });

  it('should return an empty array when defaults are not provided and input is undefined', () => {
    const result = safeArray(undefined);
    expect(result).toEqual([]);
  });
});

describe('safeValue', () => {
  it('should return the default value if input is undefined or null', () => {
    expect(safeValue(undefined, 'default')).toBe('default');
    expect(safeValue(null, 42)).toBe(42);
  });

  it('should return the resolved value if input is a function', () => {
    const fn = () => 'resolved value';
    expect(safeValue(fn, 'default')).toBe('resolved value');
  });

  it('should return the first element of an array', () => {
    expect(safeValue([10, 20, 30], 0)).toBe(10);
    expect(safeValue(['a', 'b', 'c'], 'z')).toBe('a');
  });

  it('should return the default value for an empty array', () => {
    expect(safeValue([], 'default')).toBe('default');
  });

  it('should return the default value if the first element of the array is null or undefined', () => {
    expect(safeValue([null, 20], 0)).toBe(0);
    expect(safeValue([undefined], 'default')).toBe('default');
  });

  it('should return the input value directly if it is neither null, a function, nor an array', () => {
    expect(safeValue(123, 0)).toBe(123);
    expect(safeValue('string', 'default')).toBe('string');
    expect(safeValue(true, false)).toBe(true);
  });

  it('should handle nested arrays', () => {
    expect(safeValue([[1, 2], [3, 4]], [0])).toEqual([1, 2]);
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
    const obj = { 1: '1', 0.3: '0.3' } as SafeAny;
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

describe('safeJson', () => {
  it('json map and obj', () => {
    const obj = {
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
    };

    expect(JSON.stringify(obj)).toBe('{"firstName":"John","lastName":"Doe","age":30}');

    const map = new Map();
    map.set('firstName', 'John');
    map.set('lastName', 'Doe');
    map.set('age', 30);

    expect(JSON.stringify(map)).toBe('{}');
  });

  it('should convert BigInt to string', () => {
    const input = { value: 42n };
    const result = safeJson(input);
    expect(result).toEqual('{"value":"42"}');
  });

  it('should convert Map to object', () => {
    const input = {
      scores: new Map([
        ['math', 90],
        ['science', 85],
      ]),
    };
    const result = safeJson(input);
    expect(result).toEqual('{"scores":{"math":90,"science":85}}');
  });

  it('should convert Set to array', () => {
    const input = {
      uniqueItems: new Set([1, 2, 3, 4]),
    };
    const result = safeJson(input);
    expect(result).toEqual('{"uniqueItems":[1,2,3,4]}');
  });

  it('should not modify other types', () => {
    const input = {
      name: 'Alice',
      age: 30,
      active: true,
    };
    const result = safeJson(input);
    expect(result).toEqual('{"name":"Alice","age":30,"active":true}');
  });

  it('should handle mixed types', () => {
    const input = {
      name: 'Alice',
      age: 30n,
      scores: new Map([
        ['math', 90],
        ['science', 85],
      ]),
      uniqueItems: new Set([1, 2, 3, 4]),
    };
    const result = safeJson(input);
    expect(result).toEqual('{"name":"Alice","age":"30","scores":{"math":90,"science":85},"uniqueItems":[1,2,3,4]}');
  });

  it('should return unchanged for null and undefined', () => {
    const input = { a: null, b: undefined };
    const result = safeJson(input);
    expect(result).toEqual('{"a":null}');
  });
});

describe('safeObjMap', () => {
  it('should convert object to Map', () => {
    const obj = { a: 1, b: 2 };
    const result = safeObjMap(obj);
    expect(result instanceof Map).toBe(true);
    expect(result.size).toBe(2);
    expect(result.get('a')).toBe(1);
    expect(result.get('b')).toBe(2);
  });

  it('should return empty Map if null or undefined', () => {
    expect(safeObjMap(null).size).toBe(0);
    expect(safeObjMap(undefined).size).toBe(0);
  });
});

describe('safeArrSet', () => {
  it('should convert array to Set', () => {
    const arr = [1, 2, 3, 2, 1];
    const result = safeArrSet(arr);
    expect(result instanceof Set).toBe(true);
    expect(result.size).toBe(3);
    expect(result.has(1)).toBe(true);
    expect(result.has(2)).toBe(true);
    expect(result.has(3)).toBe(true);
  });

  it('should return empty Set if null or undefined', () => {
    expect(safeArrSet(null).size).toBe(0);
    expect(safeArrSet(undefined).size).toBe(0);
  });
});

describe('safeMapObj', () => {
  it('should convert Map to object', () => {
    const map = new Map([['a', 1], ['b', 2]]);
    const result = safeMapObj(map);
    expect(typeof result).toBe('object');
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should return empty object if null or undefined', () => {
    expect(safeMapObj(null)).toEqual({});
    expect(safeMapObj(undefined)).toEqual({});
  });
});

describe('safeSetArr', () => {
  it('should convert Set to array', () => {
    const set = new Set([1, 2, 3]);
    const result = safeSetArr(set);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should return empty array if null or undefined', () => {
    expect(safeSetArr(null)).toEqual([]);
    expect(safeSetArr(undefined)).toEqual([]);
  });
});

describe('safeMd5', () => {
  it('should return correct md5 hash for a string', () => {
    const input = 'hello';
    const expected = Md5.hashStr(input);
    expect(safeMd5(input)).toBe(expected);
    expect(expected).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  it('should return correct md5 hash for numbers', () => {
    const input = 12345;
    const expected = Md5.hashStr(input.toString());
    expect(safeMd5(input)).toBe(expected);
  });

  it('should return correct md5 hash for objects', () => {
    const input = { name: 'Vue', version: 3 };
    const expected = Md5.hashStr(JSON.stringify(input));
    expect(safeMd5(input)).toBe(expected);
  });

  it('should return correct md5 hash for arrays', () => {
    const input = [1, 2, 3];
    const expected = Md5.hashStr(JSON.stringify(input));
    expect(safeMd5(input)).toBe(expected);
  });

  it('should return correct md5 hash for boolean values', () => {
    const input = true;
    const expected = Md5.hashStr(input.toString());
    expect(safeMd5(input)).toBe(expected);
  });

  it('should return correct md5 hash for null and undefined', () => {
    const input1 = null;
    const input2 = undefined;
    expect(safeMd5(input1)).toBe(Md5.hashStr(''));
    expect(safeMd5(input2)).toBe(Md5.hashStr(''));
  });

  it('should return different hashes for different inputs', () => {
    const hash1 = safeMd5('hello');
    const hash2 = safeMd5('world');
    expect(hash1).not.toBe(hash2);
  });
});
