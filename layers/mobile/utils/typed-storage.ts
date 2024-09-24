import { Preferences } from '@capacitor/preferences';
import { type StorageLikeAsync, useStorageAsync } from '@vueuse/core';

/**
 * set the value to storage
 * @param key typed key
 * @param value null to remove, otherwise to set
 * @returns current value or null
 */
export async function setStorage<T>(key: TypedKey<T>, value: Promise<T | null> | T | null) {
  const v = value instanceof Promise ? await value : value;
  if (v == null) {
    await Preferences.remove({ key: key.key });
  }
  else {
    await Preferences.set({
      key: key.key,
      value: encodeTyped(key, v),
    });
  }
  return v;
}

/**
 * get the value from storage
 * @param key typed key
 * @returns current value
 */
export async function getStorage<T>(key: TypedKey<T>) {
  const { value } = await Preferences.get({ key: key.key });
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
 * const cookiePrivacyStorage = defStorage<boolean>({
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
export function defStorage<T>(key: TypedKey<T> & { callback?: (v: T | null) => void }) {
  if (key.callback) {
    getStorage(key).then((it) => {
      key.callback?.(it);
      return it;
    });
  }

  return {
    get value(): Promise<T | null> {
      return getStorage(key);
    },
    set value(value: Promise<T | null> | T | null) {
      setStorage(key, value).then((it) => {
        key.callback?.(it);
        return it;
      });
    },
  };
}

export const storageLikeAsync: StorageLikeAsync = {
  getItem: (key: string) => Preferences.get({ key }).then(it => it.value),
  setItem: (key: string, value: string) => Preferences.set({ key, value }),
  removeItem: (key: string) => Preferences.remove({ key }),
};

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
export function useStorage<T>(key: TypedKey<T> & { init?: T; mergeDefaults?: true }) {
  const opts = {
    mergeDefaults: key.mergeDefaults,
    serializer: {
      read: (raw: string) => Promise.resolve(decodeTyped(key, raw)),
      write: (value: T) => Promise.resolve(encodeTyped(key, value)),
    },
  };

  if (key.init != null) {
    return useStorageAsync(key.key, key.init, storageLikeAsync, opts);
  }
  else {
    return useStorageAsync(key.key, null, storageLikeAsync, opts);
  }
}
