import type { EventBusKey } from '@vueuse/core';
import { useEventBus } from '@vueuse/core';
import type { AlertOptions, ToastOptions } from '@ionic/vue';

export type AppToastEvent = string | GlobalNotifyEvent & Pick<ToastOptions, 'position'> | ToastOptions;
export const appToastEventKey: EventBusKey<AppToastEvent> = Symbol('appToastEventKey');
export const appToastEventBus = useEventBus<AppToastEvent>(appToastEventKey);

export type AppAlertEvent = string | GlobalNotifyEvent | AlertOptions;
export const appAlertEventKey: EventBusKey<AppAlertEvent> = Symbol('appAlertEventKey');
export const appAlertEventBus = useEventBus<AppAlertEvent>(appAlertEventKey);
