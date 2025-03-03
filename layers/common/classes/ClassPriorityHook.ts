export type PriorityHookType<H> = { id: string; order: number; hook: H; force?: boolean };
type SorterType<H> = (a: PriorityHookType<H>, b: PriorityHookType<H>) => number;

/**
 * creates a priority-based hook, sync call or async emit.
 * unique by id, sort by order asc, id asc.
 *
 * @param inits initial hooks, unique by id, sort by order asc, id asc.
 */
export class PriorityHook<H extends (...args: SafeAny[]) => MayPromise<SafeAny>> {
  protected _hooks: PriorityHookType<H>[]; // copy-on-write array
  protected _reads: number = 0;
  protected _scope: ((del: () => void) => SafeAny) | undefined = undefined;
  protected _sorter: SorterType<H> = (a, b) => {
    const rc = a.order - b.order;
    return rc === 0 ? a.id.localeCompare(b.id) : rc;
  };

  /**
   * unique by id, sort by order asc, id asc.
   */
  constructor(inits: PriorityHookType<H>[] = []) {
    switch (inits.length) {
      case 0:
        this._hooks = [];
        break;
      case 1:
        this._hooks = [...inits];
        break;
      default:
        this._hooks = Array.from(new Map(inits.map(h => [h.id, h])).values());
        this._hooks.sort(this._sorter);
    }
  }

  /**
   * put unique hook by id and sort by order, id asc.
   * and auto remove it when the scope is disposed, e.g. onScopeDispose
   * NOTE1: async hook is not supported.
   * NOTE2: should call del(id) to remove it if disposed is undefined,
   *        otherwise it will be auto removed when the scope is disposed.
   * @see  https://vuejs.org/api/reactivity-advanced.html#onscopedispose
   */
  put(hook: PriorityHookType<H>, scope?: (del: () => void) => SafeAny): (() => void) {
    const id = hook.id;
    const idx = this._hooks.findIndex(it => it.id === id);
    if (this._reads > 0) this._hooks = this._hooks.slice();

    if (idx < 0) {
      this._hooks.push(hook);
    }
    else {
      if (!hook.force) {
        logger.warn('replace existed hook id=%s', id);
      }
      this._hooks[idx] = hook;
    }
    this._hooks.sort(this._sorter);

    const rm = () => this.del(hook.id);
    // https://github.com/vuejs/core/blob/main/packages/reactivity/src/effectScope.ts
    (scope ?? this._scope)?.(rm);
    return rm;
  };

  /**
   * delete a hook by its id, returns the deleted hook or undefined if not found.
   */
  del(id: string): PriorityHookType<H> | undefined {
    const idx = this._hooks.findIndex(it => it.id === id);
    if (idx < 0) return undefined;

    if (this._reads > 0) this._hooks = this._hooks.slice();
    return this._hooks.splice(idx, 1)[0];
  };

  /**
   * Sorts the hooks using the provided sorter function.
   * default is order asc, id asc.
   */
  sort(sorter: SorterType<H> = this._sorter): void {
    if (this._reads > 0) {
      this._hooks = this._hooks.slice();
    }
    this._hooks.sort(sorter);
  };

  /**
   * sync call the hook, stops the continuous call if a hook returns non-null value.
   *
   * - false - stop the call in this, and in vue
   * - non-null - stop the call in this, but not in vue
   * - void - continue the call in this and in vue
   * @see https://github.com/vuejs/core/blob/0c8dd94ef9fe33f72732e7d9ec52b8e72918df8f/packages/runtime-core/src/errorHandling.ts#L112
   */
  call(...args: Parameters<H>): NonPromise<ReturnType<H>> | undefined {
    const snapshot = this._hooks;
    this._reads++;
    try {
      for (const hk of snapshot) {
        try {
          const rt = hk.hook(...args);
          // logger.info('call hook=%s', hk.id, typeof rt, rt);
          if (rt != null) {
            if (typeof rt.then === 'function' && typeof rt.catch === 'function') {
              // skip async and warn
              logger.warn('Synchronous call() received a Promise from hook=%s', hk.id);
            }
            else {
              return rt;
            }
          }
        }
        catch (e) {
          logger.error('failed to hook thrown hook=%s', hk.id, e);
        }
      }
    }
    finally {
      this._reads--;
    }
  };

  /**
   * async call the hook, stops the continuous call if a hook returns non-null value.
   */
  async emit(...args: Parameters<H>): Promise<NonPromise<ReturnType<H>> | undefined> {
    const snapshot = this._hooks;
    this._reads++;
    try {
      for (const hk of snapshot) {
        try {
          const rt = hk.hook(...args);
          if (rt != null) {
            if (typeof rt.then === 'function' && typeof rt.catch === 'function') {
              const pt = await rt;
              if (pt != null) return pt;
            }
            else {
              return rt;
            }
          }
        }
        catch (e) {
          logger.error('failed to hook thrown hook=%s', hk.id, e);
        }
      }
    }
    finally {
      this._reads--;
    }
  };

  /**
   * handle the inner hooks by the given callback directly without copy-on-write.
   */
  each<T>(call: (hooks: PriorityHookType<H>[]) => T): T {
    return call(this._hooks);
  };
}
