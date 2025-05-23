<template>
  <slot />
  <IonAlert :is-open="alertOpen" v-bind="alertOptions" @did-dismiss="alertDismiss" />
  <IonToast
    v-for="(it, ix) in toastPosition"
    :key="ix"
    :style="{ 'margin-top': toastOffset(ix) + 'px' }"
    :is-open="it.open"
    v-bind="it.options"
    @did-dismiss="it.dismiss"
  />
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

const toastDuration = Math.abs(props.toastStep ?? 3000);
const toastStep = Math.abs(props.toastStep ?? 55);

function toastOffset(pos: unknown, idx = 0) {
  return (pos === 'top' || pos === 0 ? 1 : -1) * toastStep * (idx + 1);
}
function toastIndex(pos: unknown) {
  return pos === 'top' ? 0 : pos === 'middle' ? 1 : 2;
}

const toastPosition = ref(Array.from({ length: 3 }, () => shallowReactive({
  open: false,
  options: {} as ToastOptions,
  dismiss: () => {},
})));

const toastHandler = async (index: number, data: ToastOptions, close: () => void) => {
  if (index === 0) {
    const itm = toastPosition.value[toastIndex(data.position)];
    itm.options = data;
    itm.open = true;
    itm.dismiss = () => {
      itm.open = false;
      // must call at next tick, otherwise, the alert will not be shown
      setTimeout(close, 0);
    };
  }
  else {
    const off = toastOffset(data.position, index);
    const toast = await toastController.create(data);
    toast.style.setProperty('margin-top', `${off}px`);
    toast.onDidDismiss().finally(() => close());
    toast.present();
  }
};

const toastNotify = [
  createStackedNotify<ToastOptions>(toastHandler, 5),
  createStackedNotify<ToastOptions>(toastHandler, 5),
  createStackedNotify<ToastOptions>(toastHandler, 5),
];

function presentToast(event: AppToastEvent) {
  const opts = props.toastOpts?.(event) ?? defaultToastOpts(event);
  if (opts.duration == null && !opts.buttons?.length) {
    opts.duration = toastDuration;
  }

  const idx = toastIndex(opts.position);
  toastNotify[idx](opts);
}

const alertOpen = ref(false);
const alertOptions = shallowRef<AlertOptions>({});
const alertDismiss = shallowRef(() => {});
const alertNotify = createSingledNotify<AlertOptions>((data, close) => {
  alertOptions.value = data;
  alertOpen.value = true;
  alertDismiss.value = () => {
    alertOpen.value = false;
    // must call at next tick, otherwise, the alert will not be shown
    setTimeout(close, 0);
  };
});

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
    const notifyStyle = (ntc as SafeAny).notifyStyle;
    const notifyLevel = (ntc as SafeAny).notifyLevel;
    const _type = notifyStyle || ntc.type === GlobalNotifyStyle.Toast ? GlobalNotifyStyle.Toast : GlobalNotifyStyle.Alert;
    if (notifyStyle != null || notifyLevel != null) {
      return tryNotify({ message, notifyStyle, notifyLevel }, _type);
    }
    else {
      return tryNotify(message, _type);
    }
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
