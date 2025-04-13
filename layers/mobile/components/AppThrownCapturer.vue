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

const toastHandler = async (index: number, data: ToastOptions, close: () => void) => {
  const pos = data.position === 'top' ? 1 : -1;
  const off = pos * toastStep * (index + 1);
  const toast = await toastController.create(data);
  toast.style.setProperty('margin-top', `${off}px`);
  toast.onDidDismiss().finally(() => close());
  toast.present();
};

const toastNotify = [
  createStackedNotify<ToastOptions>(toastHandler),
  createStackedNotify<ToastOptions>(toastHandler),
  createStackedNotify<ToastOptions>(toastHandler),
];

function presentToast(message: string | ToastOptions) {
  const opts = props.toastOpts?.(message) ?? defaultToastOpts(message);
  if (opts.duration == null && !opts.buttons?.length) {
    opts.duration = toastDuration;
  }

  const idx = opts.position === 'top' ? 0 : opts.position === 'middle' ? 1 : 2;
  toastNotify[idx](opts);
}

const alertNotify = createSingledNotify<AlertOptions>(
  async (data, close) => {
    const alert = await alertController.create(data);
    alert.onDidDismiss().finally(close);
    alert.present();
  },
);

async function presentAlert(message: string | AlertOptions) {
  const data = props.alertOpts?.(message) ?? defaultAlertOpts(message);
  alertNotify(data);
};

function tryNotify(data: SafeAny, type?: string) {
  if (type === GlobalNotifyMode.Toast) {
    presentToast(data);
    return false;
  }
  else {
    presentAlert(data);
    return false;
  }
}

const appNoticeCapturer = useNoticeCapturer();

// handle app notices
appNoticeCapturer.put({ id: 'AppNoticeThrown', order: 1000, hook: (ntc) => {
  const message = localize(ntc, false);
  if (message) {
    return tryNotify(message, ntc.type);
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
    return tryNotify(err.data, err.type);
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
