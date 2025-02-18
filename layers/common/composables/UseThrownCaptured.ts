/**
 * make 'vue:error' hook of nuxt act as onErrorCaptured of vue
 *
 * @see https://vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured
 * @see https://nuxt.com/docs/getting-started/error-handling#vue-errors
 * @see https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/components/nuxt-root.vue
 */

type ErrorHook = Parameters<typeof onErrorCaptured>[0];

const ignoredThrownHook: ErrorHook = (err: SafeAny) => {
  if (err instanceof IgnoredThrown || err?.name === 'IgnoredThrown') return false;
};

export function useThrownCaptured() {
  let hooks = new Map<string, ErrorHook>([
    ['100.ignoredThrownHook', ignoredThrownHook],
  ]);

  /**
   * name must be unique, `###.name` is recommended.
   * stops the continuous call if a hook returns a boolean value
   */
  function putThrownHook(name: string, hook: ErrorHook): () => void {
    hooks.set(name, hook);
    return () => hooks.delete(name);
  }

  function delThrownHook(name: string): ErrorHook | undefined {
    const hook = hooks.get(name);
    if (hook != null) {
      hooks.delete(name);
    }
    return hook;
  }

  /**
   * stops the continuous call if a hook returns a boolean value
   */
  function callThrownHook(...args: Parameters<ErrorHook>): boolean | undefined {
    for (const [name, hook] of hooks) {
      try {
        const rt = hook(...args);
        if (rt === false) return false;
        if (rt === true) return true;
      }
      catch (e) {
        console.error(`failed to hook thrown hook=${name}`, e);
      }
    }
  }

  function sortThrownHook(sorter: (a: string, b: string) => number): void {
    hooks = new Map([...hooks.entries()].sort(([a], [b]) => sorter(a, b)));
  }

  function withThrownHook<T>(call: (hooks: Map<string, ErrorHook>) => T): T {
    return call(hooks);
  }

  return {
    putThrownHook,
    delThrownHook,
    callThrownHook,
    sortThrownHook,
    withThrownHook,
  };
}
