import type { EventBusKey } from '@vueuse/core';
import { useEventBus } from '@vueuse/core';
import type { Anchor } from 'vuetify';

// https://github.com/vuetifyjs/vuetify/issues/21430
// export type ToastOptions = Partial<ComponentProps<typeof VSnackbar>>;

export type ToastOptions = {
  text: string;
  class?: string | string[];
  color?: string;
  closeDelay?: string | number;
  location?: Anchor;
  timeout?: string | number;
  variant?: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain';
};
export type AppToastEvent = string | ToastOptions & { notifyLevel?: GlobalNotifyLevelType };
export const appToastEventKey: EventBusKey<AppToastEvent> = Symbol('appToastEventKey');
export const appToastEventBus = useEventBus<AppToastEvent>(appToastEventKey);

export type AlertOptions = {
  text: string;
  title?: string;
  class?: string | string[];
  color?: string;
  location?: Anchor;
  buttons?: { text: string; handler?: () => void }[];
};
export type AppAlertEvent = string | AlertOptions & { notifyLevel?: GlobalNotifyLevelType };
export const appAlertEventKey: EventBusKey<AppAlertEvent> = Symbol('appAlertEventKey');
export const appAlertEventBus = useEventBus<AppAlertEvent>(appAlertEventKey);

function newAppNotifyThrown(event: string | SafeObj, notifyStyle: string) {
  if (typeof event === 'string') {
    return newNotifyThrown({
      message: event,
      notifyStyle,
      notifyLevel: GlobalNotifyLevel.Warning,
    });
  }
  else {
    return newNotifyThrown({
      notifyStyle,
      notifyLevel: GlobalNotifyLevel.Warning,
      ...event,
    });
  }
}

export function newAppToastThrown(event: AppToastEvent) {
  return newAppNotifyThrown(event, GlobalNotifyStyle.Toast);
}

export function newAppAlertThrown(event: AppAlertEvent) {
  return newAppNotifyThrown(event, GlobalNotifyStyle.Alert);
}
