import { inject as vueInject, getCurrentInstance, type InjectionKey } from 'vue';

const registry = new Map<InjectionKey<unknown>, unknown>();

/**
 * Provides a value globally for dependency injection.
 *
 * @param {InjectionKey<T>} key - The injection key, typically a unique symbol.
 * @param {T} value - The value to provide. If undefined, the key will be removed from the registry.
 * @param {boolean} force - Whether to force the value to be set even if the key already exists. Defaults to false.
 * @returns {T | undefined} - Returns the old value if it existed and was not overwritten; otherwise, returns undefined.
 */
export function globalProvide<T>(key: InjectionKey<T>, value: T | undefined, force = false): T | undefined {
  if (value === undefined) {
    registry.delete(key);
    return undefined;
  }
  const old = registry.get(key);
  if (force || old == null) {
    registry.set(key, value);
    return old as T ?? undefined;
  }
}

/**
 * Injects a globally provided value by its key.
 *
 * @param {InjectionKey<T>} key - The injection key used to retrieve the value.
 * @returns {T} - The value associated with the key.
 * @throws {Error} - Throws an error if no value is found for the given key.
 */
export function globalInject<T>(key: InjectionKey<T>, vueFallback = false): T {
  const cur = registry.get(key);
  if (cur != null) {
    return cur as T;
  }

  // Fallback to Vue inject if inside setup
  if (vueFallback && getCurrentInstance()) {
    const vueValue = vueInject(key, null);
    if (vueValue != null) {
      return vueValue as T;
    }
  }

  throw new Error(`no provided value found for key: ${key.toString()}`);
}
