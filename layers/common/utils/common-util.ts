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
