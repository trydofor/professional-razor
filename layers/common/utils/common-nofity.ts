export const GlobalNotifyStyle = {
  Toast: 'Toast',
  Alert: 'Alert',
  Modal: 'Modal',
} as const;

export type GlobalNotifyStyleKey = keyof typeof GlobalNotifyStyle;
export type GlobalNotifyStyleType = typeof GlobalNotifyStyle[GlobalNotifyStyleKey];

export const GlobalNotifyLevel = {
  Message: 'Message', // 💬
  Success: 'Success', // ✅
  Warning: 'Warning', // ⚠️
} as const;

export type GlobalNotifyLevelKey = keyof typeof GlobalNotifyLevel;
export type GlobalNotifyLevelType = typeof GlobalNotifyLevel[GlobalNotifyLevelKey];

const closeTimeout = 100;

/**
 * stacked by offset, reuse the absent stack (unlimited is limit <= 0)
 */
export function createStackedNotify<T>(handler: (index: number, data: T, close: () => void) => void, limit = 0) {
  const stackIndex = new Array<boolean>(Math.max(limit, 5)).fill(true);

  // unlimited
  if (limit <= 0) return (data: T) => {
    let idx = stackIndex.findIndex(v => v);
    if (idx === -1) {
      idx = stackIndex.length;
      stackIndex.push(false);
    }
    else {
      stackIndex[idx] = false;
    }

    // no Unhandled Promise
    void handler(idx, data, wrapMacroTaskFunction(() => stackIndex[idx] = true, closeTimeout));
  };

  // max limited
  const notifyQueue: T[] = [];
  const checkNotify = () => {
    if (notifyQueue.length === 0) return;

    const idx = stackIndex.findIndex(v => v);
    if (idx === -1) return; // all slots are in use

    const data = notifyQueue.shift()!;
    stackIndex[idx] = false;

    void handler(idx, data, wrapMacroTaskFunction(() => {
      // must call after next tick, otherwise, the alert will not be shown
      stackIndex[idx] = true;
      checkNotify();
    }, closeTimeout));
  };

  return (data: T) => {
    const idx = stackIndex.findIndex(v => v);
    if (idx !== -1) {
      stackIndex[idx] = false;
      void handler(idx, data, wrapMacroTaskFunction(() => {
        stackIndex[idx] = true;
        checkNotify();
      }, closeTimeout));
    }
    else {
      notifyQueue.push(data);
    }
  };
}

/**
 * single notify at a time, open the next one when the previous one closed
 */
export function createSingledNotify<T>(handler: (data: T, close: () => void) => void) {
  const notifyQueue: T[] = [];
  let notNotify = true;

  const checkNotify = () => {
    if (notifyQueue.length > 0) {
      notNotify = false;
      const data = notifyQueue.shift()!;
      // no Unhandled Promise  must call after next tick, otherwise, the alert will not be shown
      void handler(data, wrapMacroTaskFunction(checkNotify, closeTimeout));
    }
    else {
      notNotify = true;
    }
  };

  return (data: T) => {
    notifyQueue.push(data);
    if (notNotify) {
      void checkNotify();
    };
  };
}

type ToggleRef = Ref<boolean>;
type ToggleFun<D> = (toggle: boolean, data: D) => void;

/**
 *  toggle open/close boolean. 1st call open(true), 2nd call close(false), and so on.
 * @example
 * ```ts
 * const toggleNotify = createToggledNotify<{
 *   ModalRef: Ref<boolean>;
 *   ModalFun: (toggle: boolean, data: boolean) => void;
 * }>();
 * ```
 */
export function createToggledNotify<T extends Record<string, ToggleRef | ToggleFun<SafeAny>>>() {
  type Key = keyof T;
  type DataOf<K extends Key> = T[K] extends ToggleFun<infer D> ? D : never;

  type IsRequired<T> = undefined extends T ? false : true;

  type RequiredDataKey = {
    [K in Key]: T[K] extends ToggleFun<infer D> ? IsRequired<D> extends true ? K : never : never;
  }[Key];

  type OptionalDataKey = {
    [K in Key]: T[K] extends ToggleFun<infer D> ? IsRequired<D> extends false ? K : never : never;
  }[Key];

  type RefKey = {
    [K in Key]: T[K] extends ToggleRef ? K : never;
  }[Key];

  const flags = {} as Record<Key, boolean>;
  const hooks = {} as T;

  function init<K extends Key>(key: K, hook: T[K], value?: boolean) {
    hooks[key] = hook;

    if (typeof hook !== 'function') {
      flags[key] = value ?? hook.value;
    }
    else {
      flags[key] = value ?? false;
    }
  };

  function call<K extends RequiredDataKey>(key: K, value: boolean, data: DataOf<K>): void;
  function call<K extends OptionalDataKey>(key: K, value: boolean, data?: DataOf<K>): void;
  function call<K extends RefKey>(key: K, value: boolean): void;
  function call<K extends Key>(key: K, value: boolean, data?: DataOf<K>): void {
    const hook = hooks[key];
    if (!hook) return;

    if (typeof hook === 'function') {
      (hook as ToggleFun<DataOf<K>>)(value, data!);
    }
    else {
      hook.value = value;
    }
    flags[key] = value;
  }

  function open<K extends RequiredDataKey>(key: K, data: DataOf<K>): void;
  function open<K extends OptionalDataKey>(key: K, data?: DataOf<K>): void;
  function open<K extends RefKey>(key: K): void;
  function open<K extends Key>(key: K, data?: DataOf<K>): void {
    call(key as SafeAny, true, data);
  }

  function close<K extends RequiredDataKey>(key: K, data: DataOf<K>): void;
  function close<K extends OptionalDataKey>(key: K, data?: DataOf<K>): void;
  function close<K extends RefKey>(key: K): void;
  function close<K extends Key>(key: K, data?: DataOf<K>): void {
    call(key as SafeAny, false, data);
  }

  function toggle<K extends RequiredDataKey>(key: K, data: DataOf<K>): void;
  function toggle<K extends OptionalDataKey>(key: K, data?: DataOf<K>): void;
  function toggle<K extends RefKey>(key: K): void;
  function toggle<K extends Key>(key: K, data?: DataOf<K>): void {
    call(key as SafeAny, !flags[key], data);
  }

  function openExclusive<K extends RequiredDataKey>(key: K, data: DataOf<K>): void;
  function openExclusive<K extends OptionalDataKey>(key: K, data?: DataOf<K>): void;
  function openExclusive<K extends RefKey>(key: K): void;
  function openExclusive<K extends Key>(key: K, data?: DataOf<K>): void {
    (Object.keys(flags) as Key[]).forEach((k) => {
      if (k === key) {
        open(k as SafeAny, data);
      }
      else if (flags[k]) {
        close(k as SafeAny);
      }
    });
  }

  function closeAll() {
    (Object.keys(flags) as Key[]).forEach((key) => {
      if (flags[key]) close(key as SafeAny);
    });
  };

  return {
    init,
    call,
    open,
    close,
    toggle,
    openExclusive,
    closeAll,
    flags,
  };
}
