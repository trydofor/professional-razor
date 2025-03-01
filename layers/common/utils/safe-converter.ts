/**
 * stringify, bigint as string, Map as object, Set as array
 */
export function safeJson(obj: unknown): string {
  return JSON.stringify(obj, jsonReplacer);
}

/**
 * A utility function that safely converts a value using a provided conversion function.
 * - If the value is a function, it will be invoked to resolve the value.
 * - The function can be configured to either resolve the function once or repeatedly (based on the `once` flag).
 * - If the conversion result is `null`, it will return a default value.
 *
 * @template S - The type of the initial value or the value returned by the function.
 * @template T - The type of the value after conversion.
 * @template D - The type of defaults.
 * @param valOrFun - The value to be converted, which can either be:
 *   - A direct value of type `S`
 *   - A function that returns a value of type `S`.
 * @param defaults - The default value to return if the conversion results in `null` or the input is invalid.
 * @param convert - The function used to convert the value of type `S` to type `T`. If it returns `null`, the default value is returned.
 * @param once - A flag that indicates whether the function should only resolve the value once.
 *   - When `true`, the function is called only once, and the value is resolved immediately.
 *   - When `false` (the default), the function will continue to be invoked until it no longer returns a function, allowing for multiple resolutions.
 * @returns The converted value of type `T`, or the default value if the conversion is unsuccessful.
 */
export function safeConvert<S, T, D>(valOrFun: Maybe<S> | (() => Maybe<S>), defaults: D, convert: (value: S) => T | null, once = false): OrElse<T, D> {
  while (typeof valOrFun === 'function') {
    valOrFun = (valOrFun as () => S)();
    if (once) break;
  }
  if (valOrFun == null) return defaults;
  return convert(valOrFun) ?? defaults;
}

/**
 * true if null | undefined | NaN | Infinity
 */
export function isVoidValue(arg?: unknown) {
  return arg === null || arg === undefined || (typeof arg === 'number' && !Number.isFinite(arg));
}
/**
 * true if NaN | Infinity
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
 */
export function isVoidNumber(arg?: number) {
  return arg == null || !Number.isFinite(arg);
}

/**
 * get non-null string. bigint to string
 *
 * @param valOrFun value or function
 * @param defaults default value if null/undefined
 * @returns
 */
export function safeString(valOrFun: SafeAny, defaults: string = ''): string {
  return safeConvert(valOrFun, defaults, (value) => {
    switch (typeof value) {
      case 'string':
        return value;
      case 'number':
      case 'boolean':
      case 'bigint':
        return String(value);
      default:
        return safeJson(value);
    }
  });
}

/**
 * get non-null and non-NaN integer by parseInt
 *
 * @param valOrFun value or function
 * @param defaults default value if null/undefined/NaN
 * @returns
 */
export function safeInt(valOrFun: NumberLike | (() => NumberLike), defaults: number = 0): number {
  return safeConvert(valOrFun, defaults, (value) => {
    switch (typeof value) {
      case 'number':
        return isVoidNumber(value) ? null : value;
      case 'boolean':
        return value ? 1 : 0;
      default:{
        const num = parseInt(String(value)); // Number('') === 0
        return isVoidNumber(num) ? null : num;
      }
    }
  });
}

/**
 * get non-null and non-NaN number by parseFloat
 *
 * @param valOrFun value or function
 * @param defaults default value if null/undefined/NaN
 * @returns
 */
export function safeNumber(valOrFun: NumberLike | (() => NumberLike), defaults: number = 0): number {
  return safeConvert(valOrFun, defaults, (value) => {
    switch (typeof value) {
      case 'number':
        return isVoidNumber(value) ? null : value;
      case 'boolean':
        return value ? 1 : 0;
      default:{
        const num = parseFloat(String(value)); // Number('') === 0
        return isVoidNumber(num) ? null : num;
      }
    }
  });
}

/**
 * get non-null bigint
 *
 * @param valOrFun value or function
 * @param defaults default value if null/undefined/NaN
 * @returns
 */
export function safeBigint(valOrFun: NumberLike | (() => NumberLike), defaults: bigint = 0n): bigint {
  return safeConvert(valOrFun, defaults, (value) => {
    switch (typeof value) {
      case 'bigint':
        return value;
      case 'boolean':
        return value ? 1n : 0n;
      case 'number':{
        const num = Math.trunc(value);
        return isVoidNumber(num) ? null : BigInt(num);
      }
      case 'string':{
        const num = parseInt(value);
        if (Number.isSafeInteger(num)) {
          return BigInt(num);
        }
        else {
          const p1 = value.indexOf('.'); // ###.###
          if (p1 > 0) return BigInt(value.substring(0, p1));

          const n1 = value.substring(value.length - 1); // ####n
          if (n1 === 'n' || n1 === 'N') return BigInt(value.substring(0, value.length - 1));

          // #.##e+10, 0x###, 0b###, 0o###
          // invalid number
          try {
            return BigInt(value);
          }
          catch {
            return null;
          }
        }
      }
      default:
        return null;
    }
  });
}

/**
 * Safely converts a value or function returning a value to a boolean.
 *
 * * defaults - if Nan, null, undefined
 * * true - if !0n, !0, `t`, `1`, ~`true`
 *
 * @param valOrFun - A value of type `NumberLike` or a function that returns a `NumberLike`.
 * @param defaults - A default value to use if the conversion fails (default is `false`).
 * @returns `true` or `false` based on the value of `valOrFun` and conversion logic.
 */
export function safeBoolean(valOrFun: NumberLike | (() => NumberLike), defaults = false): boolean {
  return safeConvert(valOrFun, defaults, (value) => {
    switch (typeof value) {
      case 'boolean':
        return value;
      case 'string':{
        return value === 'true' || value === 't' || value === '1' || value === 'T' || value.toLowerCase() === 'true';
      }
      case 'number':{
        return isVoidNumber(value) ? null : value !== 0;
      }
      case 'bigint':
        return value !== 0n;
      default:
        return null;
    }
  });
}

/**
 * Converts a value to a 't' or 'f' string based on its truthiness.
 *
 * @see safeBoolean
 * @returns 't' if the value converts to `true`, otherwise 'f'.
 */
export function safeBoolTof(valOrFun: NumberLike | (() => NumberLike), defaults = false): BoolTof {
  return safeBoolean(valOrFun, defaults) ? 't' : 'f';
}

/**
 * Converts a value to a numeric representation of its truthiness.
 *
 * @see safeBoolean
 * @returns `1` if the value converts to `true`, otherwise `0`.
 */
export function safeBoolNum(valOrFun: NumberLike | (() => NumberLike), defaults = false): BoolNum {
  return safeBoolean(valOrFun, defaults) ? 1 : 0;
}

/**
 * A utility function to safely convert various input types into an array.
 * - If the input is `undefined` or `null`, it returns a default array.
 * - If the input is already an array, it is returned as-is.
 * - If the input is a function, it resolves the function's return value and processes it recursively.
 * - If the input is a single value, it returns an array containing that value.
 *
 * @template T - The type of the array elements.
 * @param valOrFun - The input value, which can be:
 *   - `undefined` or `null`
 *   - A single value of type `T`
 *   - An array of type `T[]`
 *   - A function that returns `undefined`, a single value of type `T`, or an array of type `T[]`.
 * @param defaults - The default array to return if the input is `undefined` or `null`. Defaults to an empty array (`[]`).
 * @returns An array of type `T[]` containing the resolved values.
 */
export function safeArray<T>(valOrFun: Maybe<T | T[]> | (() => Maybe<T | T[]>), defaults: T[] = []): T[] {
  if (valOrFun == null) return defaults;
  if (Array.isArray(valOrFun)) return valOrFun;

  if (typeof valOrFun === 'function') {
    valOrFun = (valOrFun as () => Maybe<T | T[]>)();
  }

  if (Array.isArray(valOrFun)) {
    return valOrFun;
  }
  else {
    return isVoidValue(valOrFun) ? defaults : [valOrFun] as T[];
  }
}

/**
 * A utility function to safely retrieve a value from different types of inputs.
 * - If the input is `undefined` or `null`, it returns a default value.
 * - If the input is a function, it resolves the function's return value.
 * - If the input is an array, it returns the first element or the default value if the array is empty.
 * - Otherwise, it returns the input value.
 *
 * @template T - The type of the input value.
 * @template D - The type of the defaults value.
 * @param valOrFun - The input value, which can be:
 *   - `undefined` or `null`
 *   - A value of type `T`
 *   - An array of type `T[]`
 *   - A function returning `undefined`, a value of type `T`, or an array of type `T[]`.
 * @param defaults - The default value to return when the input is `undefined` or `null`.
 * @returns The resolved safe value of type `T`.
 */
export function safeValue<T, D>(valOrFun: Maybe<T | T[]> | (() => Maybe<T | T[]>), defaults: D): OrElse<T, D> {
  if (valOrFun == null) return defaults;

  if (typeof valOrFun === 'function') {
    valOrFun = (valOrFun as () => Maybe<T | T[]>)();
  }

  if (Array.isArray(valOrFun)) {
    valOrFun = valOrFun.length == 0 ? undefined : valOrFun[0] as T;
  }

  return valOrFun ?? defaults;
}

/**
 * get non-null Object.values
 *
 * @param valOrFun value or function
 * @param defaults default value if null/undefined
 * @returns
 */
export function safeValues<T>(valOrFun: SafeAny, defaults: T[] = []): T[] {
  return safeConvert(valOrFun, defaults, Object.values);
}

/**
 * get non-null Object.keys
 *
 * @param valOrFun value or function
 * @param defaults default value if null/undefined
 * @returns
 */
export function safeKeys(valOrFun: SafeAny, defaults: string[] = []): string[] {
  return safeConvert(valOrFun, defaults, Object.keys);
}

/**
 * get non-null Object.entries
 *
 * @param valOrFun value or function
 * @param defaults default value if null/undefined
 * @returns
 */
export function safeEntries<T>(valOrFun: SafeAny, defaults: [string, T][] = []): [string, T][] {
  return safeConvert(valOrFun, defaults, Object.entries);
}

/**
 * convert object to Map
 */
export function safeObjMap<T>(obj?: Maybe<Record<string, T>>): Map<string, T> {
  return obj == null ? new Map() : new Map(Object.entries(obj));
}

/**
 * convert array to Set
 */
export function safeArrSet<T>(arr?: Maybe<T[]>): Set<T> {
  return arr == null ? new Set() : new Set(arr);
}

/**
 * convert Map to object
 */
export function safeMapObj<T>(map?: Maybe<Map<string, T>>): Record<string, T> {
  return map == null ? {} : Object.fromEntries(map);
}

/**
 * convert Set to array
 */
export function safeSetArr<T>(set?: Maybe<Set<T>>): T[] {
  return set == null ? [] : Array.from(set);
}
