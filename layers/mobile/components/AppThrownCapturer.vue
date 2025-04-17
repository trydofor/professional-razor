<template>
  <slot />
</template>

<script lang="ts" setup>
import type { AlertOptions, ToastOptions } from '@ionic/vue';
import type { FetchError } from 'ofetch';

const props = defineProps<{
  preStatus?: (status: number, err: FetchError) => boolean | undefined;
  toastOpts?: (event: AppToastEvent) => ToastOptions;
  alertOpts?: (event: AppAlertEvent) => AlertOptions;
  toastStep?: number;
  toastDuration?: number;
}>();

const localize = useLocalizeMessage();
const defaultToastOpts = (event: AppToastEvent): ToastOptions => {
  if (typeof event === 'string') {
    return {
      icon: ioniconsChatboxOutline,
      position: 'bottom',
      message: event,
    };
  }

  // level enhancement
  if (event.notifyLevel === GlobalNotifyLevel.Success) {
    event.icon ??= ioniconsCheckmarkCircleOutline;
    event.position ??= 'top';
    event.color ??= 'success';
  }
  else if (event.notifyLevel === GlobalNotifyLevel.Warning) {
    event.icon ??= ioniconsAlertCircleOutline;
    event.position ??= 'top';
    event.color ??= 'warning';
  }
  else if (event.notifyLevel === GlobalNotifyLevel.Message) {
    event.icon ??= ioniconsChatbubbleEllipsesOutline;
    event.position ??= 'bottom';
  }

  return event;
};

const defaultAlertOpts = (event: AppAlertEvent): AlertOptions => {
  if (typeof event === 'string') {
    return {
      header: localize('ui.label.notice', 'Notice'),
      buttons: [localize('ui.button.ok', 'OK')],
      message: event,
    };
  }

  // level enhancement
  if (event.notifyLevel === GlobalNotifyLevel.Success) {
    event.header ??= localize('ui.label.success', 'Success');
    event.buttons ??= [localize('ui.button.ok', 'OK')];
    event.cssClass ??= 'app-alert-success';
  }
  else if (event.notifyLevel === GlobalNotifyLevel.Warning) {
    event.header ??= localize('ui.label.warning', 'Warning');
    event.buttons ??= [localize('ui.button.ok', 'OK')];
    event.cssClass ??= 'app-alert-warning';
  }
  else if (event.notifyLevel === GlobalNotifyLevel.Message) {
    event.header ??= localize('ui.label.notice', 'Notice');
    event.buttons ??= [localize('ui.button.ok', 'OK')];
    event.cssClass ??= 'app-alert-message';
  }

  return event;
};

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

function presentToast(event: AppToastEvent) {
  const opts = props.toastOpts?.(event) ?? defaultToastOpts(event);
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

async function presentAlert(event: AppAlertEvent) {
  const data = props.alertOpts?.(event) ?? defaultAlertOpts(event);
  alertNotify(data);
};

function tryNotify(event: SafeAny, style: string) {
  if (style === GlobalNotifyStyle.Toast) {
    presentToast(event);
    return false;
  }
  else if (style === GlobalNotifyStyle.Alert) {
    presentAlert(event);
    return false;
  }
}

const appNoticeCapturer = useNoticeCapturer();

// handle app notices
appNoticeCapturer.put({ id: 'AppNoticeThrown', order: 1000, hook: (ntc) => {
  const message = localize(ntc, false);
  if (message) {
    const style = ntc.type === GlobalNotifyStyle.Toast ? GlobalNotifyStyle.Toast : GlobalNotifyStyle.Alert;
    return tryNotify(message, style);
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

appThrownCapturer.put({ id: 'AppNotifyThrown', order: 4000, hook: (err) => {
  if (isNotifyThrown(err)) {
    if (err.notify) {
      return tryNotify(err.notify, err.notify.notifyStyle ?? GlobalNotifyStyle.Alert);
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
appToastEventBus.on(event => presentToast(event));
appAlertEventBus.on(event => presentAlert(event));
defineExpose({ presentToast, presentAlert });
</script>

<style>
.app-alert-success .alert-title {
  color: var(--ion-color-success);
}

.app-alert-warning .alert-title {
  color: var(--ion-color-warning);
}

.app-alert-message .alert-title::before {
  content: "💬";
  margin-right: 0.5em;
  font-size: 1.2em;
  vertical-align: middle;
}

.app-alert-success .alert-title::before {
  content: "✅";
  margin-right: 0.5em;
  font-size: 1.2em;
  vertical-align: middle;
}

.app-alert-warning .alert-title::before {
  content: "⚠️";
  margin-right: 0.5em;
  font-size: 1.2em;
  vertical-align: middle;
}
</style>
