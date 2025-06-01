import { type StorageLikeAsync, useStorageAsync } from '@vueuse/core';

export const BrowserStorage = {
  _id: 'BrowserStorage',
  getItem: localStorage.getItem,
  setItem: localStorage.setItem,
  removeItem: localStorage.removeItem,
} as StorageLikeAsync & { _id: string };

export const GlobalStorageLikeAsync = lazyNonnull(BrowserStorage);

/**
 * set the value to storage
 * @param key typed key
 * @param value null to remove, otherwise to set
 * @returns current value or null
 */
export async function setTypedStorage<T>(key: TypedKey<T>, value: Promise<T | null> | T | null) {
  const v = value instanceof Promise ? await value : value;
  const storageLikeAsync = GlobalStorageLikeAsync.value;
  if (v == null) {
    await storageLikeAsync.removeItem(key.key);
  }
  else {
    await storageLikeAsync.setItem(key.key, encodeTyped(key, v));
  }
  return v;
}

/**
 * get the value from storage
 * @param key typed key
 * @returns current value
 */
export async function getTypedStorage<T>(key: TypedKey<T>) {
  const storageLikeAsync = GlobalStorageLikeAsync.value;
  const value = await storageLikeAsync.getItem(key.key);
  let v: T | null = null;
  if (value != null) {
    v = decodeTyped(key, value);
  }
  return v;
}

/**
 * ```ts
 * // cookiePrivacy example
 * const cookiePrivacy = ref(true);
 * const cookiePrivacyStorage = defTypedStorage<boolean>({
 *   key: "cookiePrivacy",
 *   callback: it => cookiePrivacy.value = it ?? false,
 * });
 *
 * function agreeCookiePrivacy() {
 *   cookiePrivacyStorage.value = true;
 * };
 * ```
 * @param key typed key, callback called when initial get and every set
 * @returns state operations
 */
export function defTypedStorage<T>(key: TypedKey<T> & { callback?: (v: T | null) => void }) {
  if (key.callback) {
    getTypedStorage(key).then((it) => {
      key.callback?.(it);
      return it;
    });
  }

  return {
    get value(): Promise<T | null> {
      return getTypedStorage(key);
    },
    set value(value: Promise<T | null> | T | null) {
      setTypedStorage(key, value).then((it) => {
        key.callback?.(it);
        return it;
      });
    },
  };
}

/**
 * ```ts
 * // cookiePrivacy example
 * const cookiePrivacy = useStorage({ key: "cookiePrivacy", init: false });
 * function agreeCookiePrivacy() {
 *   cookiePrivacy.value = true;
 * };
 * ```
 * @param key typed key
 * @returns reactive ref
 */
export function useTypedStorage<T>(key: TypedKey<T> & { init?: T; mergeDefaults?: true }) {
  const opts = {
    mergeDefaults: key.mergeDefaults,
    serializer: {
      read: (raw: string) => Promise.resolve(decodeTyped(key, raw)),
      write: (value: T) => Promise.resolve(encodeTyped(key, value)),
    },
  };

  const storageLikeAsync = GlobalStorageLikeAsync.value;
  if (key.init != null) {
    return useStorageAsync(key.key, key.init, storageLikeAsync, opts);
  }
  else {
    return useStorageAsync(key.key, null, storageLikeAsync, opts);
  }
}
