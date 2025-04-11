import type { EventBusKey } from '@vueuse/core';
import { useEventBus } from '@vueuse/core';
import type { AlertOptions, ToastOptions } from '@ionic/vue';

export const appToastEventKey: EventBusKey<string | ToastOptions> = Symbol('appToastEventKey');
export const appToastEventBus = useEventBus<string | ToastOptions>(appToastEventKey);

export const appAlertEventKey: EventBusKey<string | AlertOptions> = Symbol('appAlertEventKey');
export const appAlertEventBus = useEventBus<string | AlertOptions>(appAlertEventKey);

type AppModalEvent = { target: string; open: boolean };
export const appModalEventKey: EventBusKey<AppModalEvent> = Symbol('appModalEventKey');
/**
 * should wrap typed modelEventController(target:'LockScreen' | 'Login', open: boolean) in user project.
 */
export const appModalEventBus = useEventBus<AppModalEvent>(appModalEventKey);
