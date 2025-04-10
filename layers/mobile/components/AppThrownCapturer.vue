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
  toastDuration?: number;
}>();

const localize = useLocalizeMessage();
const defaultToastOpts = (message: string | ToastOptions): ToastOptions => typeof message === 'string'
  ? {
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

const toastDuration = Math.abs(props.toastStep ?? 2000);
const toastStep = Math.abs(props.toastStep ?? 55);
const toastOffset = [[0], [0], [0]]; // top, middle, bottom

async function presentToast(message: string | ToastOptions) {
  const opts = props.toastOpts?.(message) ?? defaultToastOpts(message);
  if (opts.duration == null && opts.buttons?.length) {
    opts.duration = toastDuration;
  }

  const idx = opts.position === 'top' ? 0 : opts.position === 'middle' ? 1 : 2;
  const cell = toastOffset[idx];
  let ptr = cell.findIndex(v => v === 0);
  if (ptr === -1) {
    ptr = cell.length;
    cell.push(1);
  }
  else {
    cell[ptr] = 1;
  }

  const off = (idx === 0 ? toastStep : -toastStep) * ptr;
  const toast = await toastController.create(opts);
  toast.style.setProperty('margin-top', `${off}px`);
  toast.onDidDismiss().finally(() => cell[ptr] = 0);

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

const appNoticeCapturer = useNoticeCapturer();

// handle app notices
appNoticeCapturer.put({ id: 'AppNoticeThrown', order: 1000, hook: (ntc) => {
  const message = localize(ntc, false);
  if (message) {
  // no await
    const fun = (ntc.type === 'Toast' ? presentToast : presentAlert);
    fun(message);
    return false;
  }
} });

const appThrownCapturer = useThrownCapturer();
// handle app router changes
const router = useIonRouter();
appThrownCapturer.put({ id: 'AppNavigateThrown', order: 3000, hook: (err) => {
  if (isNavigateThrown(err) && err.route) {
    router.push(err.route);
    return false;
  }
} });

appThrownCapturer.put({ id: 'AlertToastDataThrow', order: 4000, hook: (err) => {
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

appThrownCapturer.put({ id: 'FetchStatusThrown', order: 9000, hook: (err) => {
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
  logger.info('register onErrorCaptured(appThrownCapturer.hookError) by default slot');
  onErrorCaptured(appThrownCapturer.hookError);
}
else {
  logger.warn('should register onErrorCaptured(appThrownCapturer.hookError) to top level component');
}

//
appToastEventBus.on(msg => presentToast(msg));
appAlertEventBus.on(msg => presentAlert(msg));
defineExpose({ presentToast, presentAlert });
</script>
