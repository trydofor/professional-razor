import type { EventBusKey } from '@vueuse/core';
import { useEventBus } from '@vueuse/core';
import type { AlertOptions, ToastOptions } from '@ionic/vue';

export type AppToastEvent = string | ToastOptions & { notifyLevel?: GlobalNotifyLevelType };
export const appToastEventKey: EventBusKey<AppToastEvent> = Symbol('appToastEventKey');
export const appToastEventBus = useEventBus<AppToastEvent>(appToastEventKey);

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

export function newAppAlertThrown(event: AppToastEvent) {
  return newAppNotifyThrown(event, GlobalNotifyStyle.Alert);
}
