<template>
  <slot />
</template>

<script lang="ts" setup>
import type { AlertOptions, ToastOptions } from '@ionic/vue';
import type { FetchError } from 'ofetch';

const props = defineProps<{
  preStatus?: (status: number, err: FetchError) => boolean | undefined;
  toastOpts?: (message: string | ToastOptions) => ToastOptions;
  alertOpts?: (message: string | AlertOptions) => AlertOptions;
  toastStep?: number;
}>();

const localize = useLocalizeMessage();

const defaultToastOpts = (message: string | ToastOptions): ToastOptions => typeof message === 'string'
  ? {
      duration: 1500,
      icon: ioniconsAlertCircleOutline,
      position: 'bottom',
      message,
    }
  : message;
const defaultAlertOpts = (message: string | AlertOptions): AlertOptions => typeof message === 'string'
  ? {
      header: localize('ui.label.notice', 'Notice'),
      buttons: [localize('ui.button.ok', 'OK')],
      message,
    }
  : message;

let toastOffset = 0;
async function presentToast(message: string | ToastOptions) {
  const opts = props.toastOpts?.(message) ?? defaultToastOpts(message);
  const toast = await toastController.create(opts);
  const step = props.toastStep ?? 50; // bottom is positive, top is negative
  toastOffset -= step;
  toast.style.setProperty('margin-top', `${toastOffset}px`);

  toast.onDidDismiss().then(() => {
    toastOffset += step;
  });
  await toast.present();
}

const alertQueue: AlertOptions[] = [];
let alertShown = false;
async function presentAlert(message: string | AlertOptions) {
  alertQueue.push(props.alertOpts?.(message) ?? defaultAlertOpts(message));
  if (!alertShown) {
    void showNextAlert(); // no Unhandled Promise
  }
};

async function showNextAlert() {
  if (alertQueue.length === 0) {
    alertShown = false;
    return;
  }

  alertShown = true;
  const opts = alertQueue.shift()!;
  const alert = await alertController.create(opts);
  await alert.present();
  await alert.onDidDismiss();
  showNextAlert();
}

// handle global notices
globalNoticeCapturer.put({ id: 'AppNoticeThrown', order: 1000, hook: (ntc) => {
  const message = localize(ntc);
  if (message) {
  // no await
    const fun = (ntc.type === 'Toast' ? presentToast : presentAlert);
    fun(message);
    return false;
  }
} });

// handle global router changes
const router = useIonRouter();
globalThrownCapturer.put({ id: 'AppNavigateThrown', order: 3000, hook: (err) => {
  if (isNavigateThrown(err) && err.route) {
    router.push(err.route);
    return false;
  }
} });

globalThrownCapturer.put({ id: 'AlertToastDataThrow', order: 4000, hook: (err) => {
  if (isDataThrown(err)) {
    if (err.type === 'Alert') {
      presentAlert(err.data as AlertOptions);
      return false;
    }
    if (err.type === 'Toast') {
      presentToast(err.data as ToastOptions);
      return false;
    }
  }
} });

globalThrownCapturer.put({ id: 'FetchStatusThrown', order: 9000, hook: (err) => {
  if (isFetchError(err)) {
    const status = err.response?.status;
    if (typeof status !== 'number') return;

    const rt = props.preStatus?.(status, err);
    if (typeof rt === 'boolean') {
      return rt;
    }

    const message = localize(`error.fetcher.${status}`);
    if (message) {
      presentAlert(message);
      if (status === 401 || status === 403) {
        apiResponseEventBus.emit({ status }, err as ApiResponseContext);
        return false;
      }
      else {
        return true; // bottom up to sentry
      }
    }
  }
} });

const slots = useSlots();
if (slots.default) {
  logger.info('register onErrorCaptured(globalThrownCapturer.hookError) by default slot');
  onErrorCaptured(globalThrownCapturer.hookError);
}
else {
  logger.warn('should register onErrorCaptured(globalThrownCapturer.hookError) to top level component');
}
</script>
