import type { AlertOptions, ToastOptions } from '@ionic/vue';

export type AppToastEvent = string | ToastOptions & { notifyLevel?: GlobalNotifyLevelType };
export const appToastNotify = createAppNotify<AppToastEvent>('appToastEventKey', GlobalNotifyStyle.Toast);

export type AppAlertEvent = string | AlertOptions & { notifyLevel?: GlobalNotifyLevelType };
export const appAlertNotify = createAppNotify<AppAlertEvent>('appAlertEventKey', GlobalNotifyStyle.Alert);
