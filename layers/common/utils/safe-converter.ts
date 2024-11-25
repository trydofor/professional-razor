/**
 * stringify, bigint as string, Map as object, Set as array
 */
export function jsonReplacer(k: string, v: unknown) {
  if (typeof v === 'bigint') return v.toString();
  if (v instanceof Map) return Object.fromEntries(v);
  if (v instanceof Set) return Array.from(v);
  return v;
}

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
export function safeConvert<S, T>(valOrFun: S | (() => S), defaults: T, convert: (value: S) => T | null, once = false): T {
  while (typeof valOrFun === 'function') {
    valOrFun = (valOrFun as () => S)();
    if (once) break;
  }
  if (valOrFun == null) return defaults;
  return convert(valOrFun) ?? defaults;
}

/**
 * get non-null string. bigint to string
 *
 * @param valOrFun value or function
 * @param defaults default value if null/undefined
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeString(valOrFun: any, defaults: string = ''): string {
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
 * get non-null and non-NaN number
 *
 * @param valOrFun value or function
 * @param defaults default value if null/undefined/NaN
 * @returns
 */
export function safeNumber(valOrFun: NumberLike | (() => NumberLike), defaults: number = 0): number {
  return safeConvert(valOrFun, defaults, (value) => {
    switch (typeof value) {
      case 'number':
        return isNaN(value) ? null : value;
      case 'boolean':
        return value ? 1 : 0;
      default:{
        const num = parseInt(String(value)); // Number('') === 0
        return isNaN(num) ? null : num;
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
        return isNaN(num) ? null : BigInt(num);
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
export function safeArray<T>(valOrFun: undefined | T | T[] | (() => undefined | T | T[]), defaults: T[] = []): T[] {
  if (valOrFun == null) return defaults;
  if (Array.isArray(valOrFun)) return valOrFun;

  if (typeof valOrFun == 'function') {
    valOrFun = (valOrFun as () => undefined | T | T[])();
  }

  if (Array.isArray(valOrFun)) {
    return valOrFun;
  }
  else {
    return valOrFun == null ? defaults : [valOrFun];
  }
}

/**
 * A utility function to safely retrieve a value from different types of inputs.
 * - If the input is `undefined` or `null`, it returns a default value.
 * - If the input is a function, it resolves the function's return value.
 * - If the input is an array, it returns the first element or the default value if the array is empty.
 * - Otherwise, it returns the input value.
 *
 * @template T - The type of the default value.
 * @param valOrFun - The input value, which can be:
 *   - `undefined` or `null`
 *   - A value of type `T`
 *   - An array of type `T[]`
 *   - A function returning `undefined`, a value of type `T`, or an array of type `T[]`.
 * @param defaults - The default value to return when the input is `undefined` or `null`.
 * @returns The resolved safe value of type `T`.
 */
export function safeValue<T>(valOrFun: undefined | T | T[] | (() => undefined | T | T[]), defaults: T): T {
  if (valOrFun == null) return defaults;

  if (typeof valOrFun == 'function') {
    valOrFun = (valOrFun as () => undefined | T | T[])();
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeValues<T>(valOrFun: any, defaults: T[] = []): T[] {
  return safeConvert(valOrFun, defaults, Object.values);
}

/**
 * get non-null Object.keys
 *
 * @param valOrFun value or function
 * @param defaults default value if null/undefined
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeKeys(valOrFun: any, defaults: string[] = []): string[] {
  return safeConvert(valOrFun, defaults, Object.keys);
}

/**
 * get non-null Object.entries
 *
 * @param valOrFun value or function
 * @param defaults default value if null/undefined
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeEntries<T>(valOrFun: any, defaults: [string, T][] = []): [string, T][] {
  return safeConvert(valOrFun, defaults, Object.entries);
}

/**
 * convert object to Map
 */
export function safeObjMap<T>(obj?: Record<string, T> | null): Map<string, T> {
  return obj == null ? new Map() : new Map(Object.entries(obj));
}

/**
 * convert array to Set
 */
export function safeArrSet<T>(arr?: T[] | null): Set<T> {
  return arr == null ? new Set() : new Set(arr);
}

/**
 * convert Map to object
 */
export function safeMapObj<T>(map?: Map<string, T> | null): Record<string, T> {
  return map == null ? {} : Object.fromEntries(map);
}

/**
 * convert Set to array
 */
export function safeSetArr<T>(set?: Set<T> | null): T[] {
  return set == null ? [] : Array.from(set);
}
