export const AppNotifyMode = {
  Alert: 'Alert',
  Toast: 'Toast',
  Modal: 'Modal',
} as const;

export type AppNotifyModeKey = keyof typeof AppNotifyMode;
export type AppNotifyModeType = typeof AppNotifyMode[AppNotifyModeKey];
