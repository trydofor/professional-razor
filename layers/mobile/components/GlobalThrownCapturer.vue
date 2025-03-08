<template>
  <slot />
</template>

<script lang="ts" setup>
import type { AlertOptions, ToastOptions } from '@ionic/vue';

const step = 50; // bottom is positive, top is negative
let toastOffset = 0;

async function presentToast(message: string | ToastOptions) {
  const opts: ToastOptions = typeof message === 'string'
    ? {
        message,
        duration: 1500,
        icon: ioniconsAlertCircleOutline,
        position: 'bottom',
      }
    : message;
  const toast = await toastController.create(opts);

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
  alertQueue.push(typeof message === 'string'
    ? {
        header: 'Notice',
        message,
        buttons: ['OK'],
      }
    : message);

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
const { t } = useI18n();
const localize = localizeMessage(t);
globalNoticeCapturer.put({ id: 'AppNoticeThrown', order: 1000, hook: (ntc) => {
  const message = localize(ntc);
  if (message) {
  // no await
    const fun = (ntc.type === 'toast' ? presentToast : presentAlert);
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
