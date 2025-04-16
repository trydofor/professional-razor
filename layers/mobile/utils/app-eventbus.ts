import type { EventBusKey } from '@vueuse/core';
import { useEventBus } from '@vueuse/core';
import type { AlertOptions, ToastOptions } from '@ionic/vue';

export type AppToastEvent = string | ToastOptions & { level?: GlobalNotifyLevelType };
export const appToastEventKey: EventBusKey<AppToastEvent> = Symbol('appToastEventKey');
export const appToastEventBus = useEventBus<AppToastEvent>(appToastEventKey);

export type AppAlertEvent = string | AlertOptions & { level?: GlobalNotifyLevelType };
export const appAlertEventKey: EventBusKey<AppAlertEvent> = Symbol('appAlertEventKey');
export const appAlertEventBus = useEventBus<AppAlertEvent>(appAlertEventKey);
