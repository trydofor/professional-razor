import type { Anchor } from 'vuetify';

// https://github.com/vuetifyjs/vuetify/issues/21430
// export type ToastOptions = Partial<ComponentProps<typeof VSnackbar>>;

export type ToastOptions = {
  message: string; // to text
  class?: string | string[];
  color?: string;
  closeDelay?: string | number;
  location?: Anchor;
  timeout?: string | number;
  variant?: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain';
};
export type AppToastEvent = string | ToastOptions & { notifyLevel?: GlobalNotifyLevelType };
export const appToastNotify = createAppNotify<AppToastEvent>('appToastEventKey', GlobalNotifyStyle.Toast);

export type AlertOptions = {
  message: string;
  title?: string;
  class?: string | string[];
  color?: string;
  location?: Anchor;
  buttons?: { text: string; handler?: () => void }[];
};
export type AppAlertEvent = string | AlertOptions & { notifyLevel?: GlobalNotifyLevelType };
export const appAlertNotify = createAppNotify<AppAlertEvent>('appAlertEventKey', GlobalNotifyStyle.Alert);
