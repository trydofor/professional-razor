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

/**
 * toggle open/close boolean. 1st call open(true), 2nd call close(false), and so on.
 */
export function createToggledNotify<T extends Record<string, boolean>>(
  flags: T,
) {
  const hooks: Record<keyof T, Ref<boolean> | ((toggle: boolean) => void)> = {} as SafeAny;
  const init = (key: keyof T, hook: Ref<boolean> | ((toggle: boolean) => void), value?: boolean) => {
    hooks[key] = hook;

    if (typeof hook !== 'function') {
      flags[key] = hook.value as SafeAny;
    }

    if (typeof value === 'boolean') {
      flags[key] = value as SafeAny;
    }
  };

  const call = (key: keyof T, value: boolean) => {
    const hook = hooks[key];
    if (hook == null) return;

    if (typeof hook === 'function') {
      hook(value);
    }
    else {
      hook.value = value;
    }
    // set the value if success
    flags[key] = value as SafeAny;
  };

  const open = (key: keyof T) => call(key, true);
  const close = (key: keyof T) => call(key, false);

  const toggle = (key: keyof T) => {
    const hook = hooks[key];
    if (hook == null) return;

    if (typeof hook === 'function') {
      const nv = !flags[key];
      hook(nv);
      flags[key] = nv as SafeAny;
    }
    else {
      const nv = !hook.value;
      hook.value = nv;
      flags[key] = nv as SafeAny;
    }
  };

  return {
    init,
    call,
    open,
    close,
    toggle,
  };
}
