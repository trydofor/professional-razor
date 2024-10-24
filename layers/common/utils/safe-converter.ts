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
 * get non-null converted value
 *
 * @param valOrFun value or function
 * @param defaults default value if null/undefined
 * @param convert non-null value converter
 * @returns
 */

export function safeConvert<S, T>(valOrFun: S, defaults: T, convert: (value: S) => T | null): T {
  if (valOrFun == null) return defaults;

  switch (typeof valOrFun) {
    case 'function':
      return safeConvert(valOrFun(), defaults, convert);
    default:
      return convert(valOrFun) ?? defaults;
  }
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
