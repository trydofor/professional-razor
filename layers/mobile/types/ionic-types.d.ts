import type { OverlayEventDetail } from '@ionic/core';

/**
 * https://ionicframework.com/docs/api/alert#events
 */
export type IonAlertDismiss<T> = CustomEvent<OverlayEventDetail<{ values: T }>>;
