import type { AlertOptions, ToastOptions } from '@ionic/vue';

export type AppToastEvent = string | ToastOptions & { notifyLevel?: GlobalNotifyLevelType };
export const {
  eventKey: appToastEventKey,
  eventBus: appToastEventBus,
  newThrown: newAppToastThrown,
} = createAppNotify<AppToastEvent>('appToastEventKey', GlobalNotifyStyle.Toast);

export type AppAlertEvent = string | AlertOptions & { notifyLevel?: GlobalNotifyLevelType };
export const {
  eventKey: appAlertEventKey,
  eventBus: appAlertEventBus,
  newThrown: newAppAlertThrown,
} = createAppNotify<AppAlertEvent>('appAlertEventKey', GlobalNotifyStyle.Alert);
