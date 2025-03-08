import type { EventBusKey } from '@vueuse/core';
import { useEventBus } from '@vueuse/core';
import type { AlertOptions, ToastOptions } from '@ionic/vue';

export const appToastEventKey: EventBusKey<string | ToastOptions> = Symbol('appToastEventKey');
export const appToastEventBus = useEventBus<string | ToastOptions>(appToastEventKey);

export const appAlertEventKey: EventBusKey<string | AlertOptions> = Symbol('appAlertEventKey');
export const appAlertEventBus = useEventBus<string | AlertOptions>(appAlertEventKey);
