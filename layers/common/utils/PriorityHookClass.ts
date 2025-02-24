export type PriorityHookType<H> = { id: string; order: number; hook: H };
type SorterType<H> = (a: PriorityHookType<H>, b: PriorityHookType<H>) => number;

/**
 * creates a priority-based hook, sync call or async emit.
 * sorted by order asc, id asc by default.
 *
 * @param inits initial hooks without scoped and unique, but order asc, id asc.
 */
export class PriorityHook<H extends (...args: SafeAny[]) => MayPromise<SafeAny>> {
  private _hooks: PriorityHookType<H>[]; // copy-on-write array
  private _sorter: SorterType<H> = (a, b) => {
    const rc = a.order - b.order;
    return rc === 0 ? a.id.localeCompare(b.id) : rc;
  };

  constructor(inits?: PriorityHookType<H>[]) {
    if (inits == null) {
      this._hooks = [];
    }
    else if (inits.length > 1) {
      inits.sort(this._sorter);
      const uq = new Map<string, PriorityHookType<H>>();
      for (const hk of inits) {
        uq.set(hk.id, hk);
      }
      this._hooks = Array.from(uq.values());
    }
    else {
      this._hooks = [...inits];
    }
  }

  /**
   * put unique hook by id and sort by order, id asc.
   * NOTE1: async hook is not supported.
   * NOTE2: should call del(id) to remove it if scoped is false,
   *        otherwise it will be auto removed when the scope is disposed.
   */
  put = (hook: PriorityHookType<H>, scoped: boolean = true): (() => void) => {
    const id = hook.id;
    const copy = this._hooks.filter(it => it.id !== id);
    copy.push(hook);
    copy.sort(this._sorter);

    this._hooks = copy; // assign ref at last
    const un = () => this.del(hook.id);
    // https://vuejs.org/api/reactivity-advanced.html#onscopedispose
    // https://github.com/vuejs/core/blob/main/packages/reactivity/src/effectScope.ts
    if (scoped) onScopeDispose(un);
    return un;
  };

  /**
   * Deletes a hook by its id, returns the deleted hook or undefined if not found.
   */
  del = (id: string): PriorityHookType<H> | undefined => {
    const old = this._hooks.find(it => it.id === id);
    if (old == null) return undefined;
    this._hooks = this._hooks.filter(it => it.id !== id);
    return old;
  };

  /**
   * Sorts the hooks using the provided sorter function.
   * default is order asc, id asc.
   */
  sort = (sorter: SorterType<H> = this._sorter): void => {
    const copy = this._hooks.slice();
    copy.sort(sorter);
    this._hooks = copy;
  };

  /**
   * sync call the hook, stops the continuous call if a hook returns non-null value.
   *
   * - false - stop the call in this, and in vue
   * - non-null - stop the call in this, but not in vue
   * - void - continue the call in this and in vue
   * @see https://github.com/vuejs/core/blob/0c8dd94ef9fe33f72732e7d9ec52b8e72918df8f/packages/runtime-core/src/errorHandling.ts#L112
   */
  call = (...args: Parameters<H>): ReturnType<H> | undefined => {
    const snapshot = this._hooks;
    for (const hk of snapshot) {
      try {
        const rt = hk.hook(...args);
        if (rt == null) continue;

        if (typeof rt.then === 'function' && typeof rt.catch === 'function') {
          // skip async and warn
          logger.warn('Synchronous call() received a Promise from hook=%s', hk.id);
        }
        else {
          return rt;
        }
      }
      catch (e) {
        logger.error('failed to hook thrown hook=%s', hk.id, e);
      }
    }
  };

  /**
   * async call the hook, stops the continuous call if a hook returns non-null value.
   */
  emit = async (...args: Parameters<H>): Promise<NonPromise<ReturnType<H>> | undefined> => {
    const snapshot = this._hooks;
    for (const hk of snapshot) {
      try {
        const rt = hk.hook(...args);
        if (rt == null) continue;

        if (typeof rt.then === 'function' && typeof rt.catch === 'function') {
          const pt = await rt;
          if (pt != null) return pt;
        }
        else {
          return rt;
        }
      }
      catch (e) {
        logger.error('failed to hook thrown hook=%s', hk.id, e);
      }
    }
  };

  each = <T>(call: (hooks: PriorityHookType<H>[]) => T): T => {
    return call(this._hooks);
  };
}
