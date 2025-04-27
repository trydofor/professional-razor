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
 * attach id to object or function
 */
export function attachId<T extends object | SafeFun>(id: string, ins: T): T & { id: string } {
  return Object.assign(ins, { id });
}

/**
 * Flattens an array of possibly nested arrays and removes `null` or `undefined` values.
 * * `1, [2, 3], 4 => [1, 2, 3, 4]`
 * * `[], [1, 2], [undefined], 3 => [1, 2, 3]`
 * @template T - The non-nullable type of the elements in the array.
 * @param {Array<undefined | null | T | T[]>} items - The input array containing possibly nested elements.
 * @returns {T[]} A flattened array without `null` or `undefined` values.
 */
export function flatArray<T extends NonNullable<unknown>>(items?: Array<undefined | null | T | T[]>): T[] {
  return items == null ? [] : items.flat().filter((it): it is T => it != null);
}

/**
 * Flattens an array and removes `null` or `undefined` values, returning `null` if empty or a single item if only one element remains.
 * @template T - The non-nullable type of the elements in the array.
 * @param {Array<undefined | null | T | T[]>} items - The input array containing possibly nested elements.
 * @returns {null | T | T[]} - Returns `null` if the array is empty, a single element if there's only one, or a flattened array otherwise.
 */
export function flatItems<T extends NonNullable<unknown>>(items?: Array<undefined | null | T | T[]>): undefined | T | T[] {
  const arr = flatArray<T>(items);
  return arr.length === 0 ? undefined : arr.length === 1 ? arr[0] : arr;
}

/**
 * Align a number string based on the specified scale.
 *
 * - If scale > 0: keep `scale` decimal places, pad with zeros if necessary.
 * - If scale = 0: keep only the integer part.
 * - If scale < 0: floor the integer part to the nearest lower 10^abs(scale).
 *
 * @param numStr - The input number or number string.
 * @param scale - The number of decimal places (positive), no decimals (0), or integer rounding (negative).
 * @returns The aligned number string.
 *
 * @example
 * alignNumStr(2, 2);        // "2.00"
 * alignNumStr("2", 2);      // "2.00"
 * alignNumStr("2.0", 2);    // "2.00"
 * alignNumStr("2.001", 2);  // "2.00"
 * alignNumStr(1234, -2);    // "1200"
 * alignNumStr(1, -3);       // "0"
 * alignNumStr(1, -3，true); // "000"
 * alignNumStr(123.456, 0);  // "123"
 */
export function alignNumStr(numStr: string | number, scale: number, fix = false): string {
  const str = numStr.toString();
  const di = str.indexOf('.');
  const ip = (di >= 0 ? str.slice(0, di) : str) || '0';
  const dt = (di >= 0 ? str.slice(di + 1) : '0') || '0';

  if (scale === 0) return ip;

  if (scale > 0) {
    const dl = dt.length;
    if (dl == scale) return `${ip}.${dt}`;
    if (dl < scale) return `${ip}.${dt.padEnd(scale, '0')}`;
    return `${ip}.${dt.slice(0, scale)}`;
  }

  const bs = -scale;
  const il = ip.length;
  if (il <= bs) return fix ? '0'.padEnd(bs, '0') : '0';
  return ip.slice(0, il - bs).padEnd(il, '0');
}
