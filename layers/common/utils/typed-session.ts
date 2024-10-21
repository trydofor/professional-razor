import { useSessionStorage } from '@vueuse/core';

/**
 * set the value to session
 * @param key typed key
 * @param value null to remove, otherwise to set
 * @returns current value or null
 */
export function setTypedSession<T>(key: TypedKey<T>, value: T | null) {
  if (value == null) {
    sessionStorage.removeItem(key.key);
  }
  else {
    sessionStorage.setItem(key.key, encodeTyped(key, value));
  }
  return value;
}

/**
 * get the value from session
 * @param key typed key
 * @returns current value
 */
export function getTypedSession<T>(key: TypedKey<T>) {
  const value = sessionStorage.getItem(key.key);
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
 * const cookiePrivacySession = defTypedSession<boolean>({
 *   key: "cookiePrivacy",
 *   callback: it => cookiePrivacy.value = it ?? false,
 * });
 *
 * function agreeCookiePrivacy() {
 *   cookiePrivacySession.put(true);
 * };
 * ```
 * @param key typed key, callback called when initial get and every set
 * @returns state operations
 */
export function defTypedSession<T>(key: TypedKey<T> & { callback?: (v: T | null) => void }) {
  if (key.callback) {
    const it = getTypedSession(key);
    key.callback?.(it);
  }

  return {
    get value(): T | null {
      return getTypedSession(key);
    },
    set value(value: T | null) {
      setTypedSession(key, value);
      key.callback?.(value);
    },
  };
}

/**
 * ```ts
 * // cookiePrivacy example
 * const cookiePrivacy = useTypedSession({ key: "cookiePrivacy", init: false });
 * function agreeCookiePrivacy() {
 *   cookiePrivacy.value = true;
 * };
 * ```
 * @param key typed key
 * @returns reactive ref
 */
export function useTypedSession<T>(key: TypedKey<T> & { init?: T; mergeDefaults?: true }) {
  const opts = {
    mergeDefaults: key.mergeDefaults,
    serializer: {
      read: (raw: string) => decodeTyped(key, raw),
      write: (value: T) => encodeTyped(key, value),
    },
  };

  if (key.init != null) {
    return useSessionStorage(key.key, key.init, opts);
  }
  else {
    return useSessionStorage(key.key, null, opts);
  }
}
