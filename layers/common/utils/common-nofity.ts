export const GlobalNotifyMode = {
  Toast: 'Toast',
  Alert: 'Alert',
  Modal: 'Modal',
} as const;

export type GlobalNotifyModeKey = keyof typeof GlobalNotifyMode;
export type GlobalNotifyModeType = typeof GlobalNotifyMode[GlobalNotifyModeKey];

/**
 * stacked by offset, reuse the absent stack
 */
export function createStackedNotify<T>(handler: (index: number, data: T, close: () => void) => void) {
  const toastOffset = [true, true, true, true, true]; // default 5 toasts

  return (data: T) => {
    let idx = toastOffset.findIndex(v => v);
    if (idx === -1) {
      idx = toastOffset.length;
      toastOffset.push(false);
    }
    else {
      toastOffset[idx] = false;
    }

    // no Unhandled Promise
    void handler(idx, data, () => toastOffset[idx] = true);
  };
}

/**
 * single notify at a time, open the next one when the previous one closed
 */
export function createSingledNotify<T>(handler: (data: T, close: () => void) => void) {
  const alertQueue: T[] = [];
  let notAlert = true;

  const checkAlert = () => {
    if (alertQueue.length > 0) {
      notAlert = false;
      const data = alertQueue.shift()!;
      // no Unhandled Promise
      void handler(data, () => checkAlert());
    }
    else {
      notAlert = true;
    }
  };

  return (data: T) => {
    alertQueue.push(data);
    if (notAlert) {
      void checkAlert();
    };
  };
}

type ToggleRef = Ref<boolean>;
type ToggleFun<D> = (toggle: boolean, data?: D) => void;

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

  const flags = {} as Record<Key, boolean>;
  const hooks = {} as T;

  const init = <K extends Key>(key: K, hook: T[K], value?: boolean) => {
    hooks[key] = hook;

    if (typeof hook !== 'function') {
      flags[key] = value ?? hook.value;
    }
    else {
      flags[key] = value ?? false;
    }
  };

  const call = <K extends Key>(key: K, value: boolean, data?: DataOf<K>) => {
    const hook = hooks[key];
    if (!hook) return;

    if (typeof hook === 'function') {
      hook(value, data);
    }
    else {
      hook.value = value;
    }

    flags[key] = value;
  };

  const open = <K extends Key>(key: K, data?: DataOf<K>) => call(key, true, data);
  const close = <K extends Key>(key: K, data?: DataOf<K>) => call(key, false, data);
  const toggle = <K extends Key>(key: K, data?: DataOf<K>) => call(key, !flags[key], data);

  const closeAll = () => {
    (Object.keys(flags) as Key[]).forEach((key) => {
      if (flags[key]) close(key);
    });
  };

  const openExclusive = <K extends Key>(key: K, data?: DataOf<K>) => {
    (Object.keys(flags) as Key[]).forEach((k) => {
      if (k === key) {
        open(k, data);
      }
      else if (flags[k]) {
        close(k);
      }
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
