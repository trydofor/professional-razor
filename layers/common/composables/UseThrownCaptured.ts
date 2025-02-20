type ErrorHook = Parameters<typeof onErrorCaptured>[0];

const ignoredThrownHook: ErrorHook = (err: SafeAny) => {
  if (err instanceof IgnoredThrown || err?.name === 'IgnoredThrown') return false;
};

export function useThrownCaptured(withIgnored: boolean = true) {
  let hooks = new Map<string, ErrorHook>();
  if (withIgnored) {
    hooks.set('100.ignoredThrownHook', ignoredThrownHook);
  }

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
   *
   * - false - stop the call in this, and in vue
   * - true - stop the call in this, but not in vue
   * - void - continue the call in this and in vue
   * @see https://github.com/vuejs/core/blob/0c8dd94ef9fe33f72732e7d9ec52b8e72918df8f/packages/runtime-core/src/errorHandling.ts#L112
   */
  function callThrownHook(...args: Parameters<ErrorHook>): boolean | undefined {
    for (const [name, hook] of hooks) {
      try {
        const rt = hook(...args);
        if (rt === false) return false;
        if (rt === true) return true;
      }
      catch (e) {
        logger.error(`failed to hook thrown hook=${name}`, e);
      }
    }
  }

  function sortThrownHook(sorter?: (a: string, b: string) => number): void {
    if (sorter == null) {
      sorter = (a, b) => a.localeCompare(b);
    }
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
