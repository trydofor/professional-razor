<template>
  <slot />
  <VDialog v-model="alertOpen" max-width="500">
    <VCard
      max-width="400"
      v-bind="alertOptions"
      :text="alertOptions.message"
    >
      <template #actions>
        <VBtn
          v-for="(it, ix) in alertOptions.buttons"
          :key="ix"
          class="ms-auto"
          :text="it.text"
          @click="() => alertBtnClick(it.handler)"
        />
      </template>
    </VCard>
  </VDialog>
  <VSnackbar
    v-for="(it, ix) in toastPosition"
    :key="ix"
    v-model="it.open"
    :style="toastOffset(ix)"
    v-bind="it.options"
    :text="it.options.message"
    @update:model-value="() => toastOnModel(it.open, it.dismiss)"
  />
</template>

<script lang="ts" setup>
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
      class: 'app-alert-message',
      location: 'bottom',
      message: event,
    };
  }

  // level enhancement
  if (event.notifyLevel === GlobalNotifyLevel.Success) {
    event.location ??= 'top';
    event.color ??= 'success';
    event.class ??= 'app-alert-success';
  }
  else if (event.notifyLevel === GlobalNotifyLevel.Warning) {
    event.location ??= 'top';
    event.color ??= 'warning';
    event.class ??= 'app-alert-warning';
  }
  else if (event.notifyLevel === GlobalNotifyLevel.Message) {
    event.location ??= 'bottom';
    event.class ??= 'app-alert-message';
  }

  return event;
};

const defaultAlertOpts = (event: AppAlertEvent): AlertOptions => {
  if (typeof event === 'string') {
    return {
      title: localize('ui.label.notice', 'Notice'),
      buttons: [{ text: localize('ui.button.ok', 'OK') }],
      message: event,
    };
  }

  // level enhancement
  if (event.notifyLevel === GlobalNotifyLevel.Success) {
    event.title ??= localize('ui.label.success', 'Success');
    event.buttons ??= [{ text: localize('ui.button.ok', 'OK') }];
    event.class ??= 'app-alert-success';
  }
  else if (event.notifyLevel === GlobalNotifyLevel.Warning) {
    event.title ??= localize('ui.label.warning', 'Warning');
    event.buttons ??= [{ text: localize('ui.button.ok', 'OK') }];
    event.class ??= 'app-alert-warning';
  }
  else if (event.notifyLevel === GlobalNotifyLevel.Message) {
    event.title ??= localize('ui.label.notice', 'Notice');
    event.buttons ??= [{ text: localize('ui.button.ok', 'OK') }];
    event.class ??= 'app-alert-message';
  }

  return event;
};

const toastDuration = Math.abs(props.toastStep ?? 3000);
const toastStep = Math.abs(props.toastStep ?? 55);
const toastCount = 5;

function toastOffset(idx = 0) {
  let px = toastStep * (idx % toastCount);
  if (idx >= toastCount && idx < toastCount * 2) px = px * 2; // center translate(-50%, -50%)
  return idx < toastCount ? { top: `${px}px` } : { bottom: `${px}px` };
}

function toastIndex(pos: unknown) {
  return pos === 'top' ? 0 : pos === 'center' ? 1 : 2;
}

function toastOnModel(open: boolean, dismiss?: () => void) {
  if (open === false && dismiss) {
    dismiss();
  }
}

const toastHandler = async (index: number, data: ToastOptions, close: () => void) => {
  const offset = toastIndex(data.location) * toastCount;
  const itm = toastPosition.value[offset + index];
  itm.options = data;
  itm.open = true;
  itm.dismiss = close;
};

const toastNotify = [
  createStackedNotify<ToastOptions>(toastHandler, toastCount), // top
  createStackedNotify<ToastOptions>(toastHandler, toastCount), // center
  createStackedNotify<ToastOptions>(toastHandler, toastCount), // bottom
];

const toastPosition = ref(Array.from({ length: toastCount * toastNotify.length }, () => shallowReactive({
  open: false,
  options: {} as ToastOptions,
  dismiss: () => {},
})));

function presentToast(event: AppToastEvent) {
  const opts = props.toastOpts?.(event) ?? defaultToastOpts(event);
  opts.timeout ??= toastDuration;

  const idx = toastIndex(opts.location);
  toastNotify[idx](opts);
}

const alertOpen = ref(false);
const alertOptions = shallowRef<AlertOptions>({ message: '' });
const alertDismiss = shallowRef(() => {});

function alertBtnClick(fun?: () => void) {
  alertOpen.value = false;
  fun?.();
  // must call at next tick, otherwise, the alert will not be shown
  alertDismiss.value();
}

const alertNotify = createSingledNotify<AlertOptions>((data, close) => {
  alertOptions.value = data;
  alertOpen.value = true;
  alertDismiss.value = close;
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
const router = useRouter();
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
appToastNotify.eventBus.on(event => presentToast(event));
appAlertNotify.eventBus.on(event => presentAlert(event));
defineExpose({ presentToast, presentAlert });
</script>

<style>
.app-alert-success .v-card-title {
  color: rgb(var(--v-theme-success));
}

.app-alert-warning .v-card-title {
  color: rgb(var(--v-theme-warning));
}

.app-alert-message .v-card-title::before,
.app-alert-message .v-snackbar__content::before {
  content: "💬";
  margin-right: 0.5em;
  font-size: 1.2em;
  vertical-align: middle;
}
.app-alert-success .v-card-title::before,
.app-alert-success .v-snackbar__content::before {
  content: "✅";
  margin-right: 0.5em;
  font-size: 1.2em;
  vertical-align: middle;
}

.app-alert-warning .v-card-title::before,
.app-alert-warning .v-snackbar__content::before {
  content: "⚠️";
  margin-right: 0.5em;
  font-size: 1.2em;
  vertical-align: middle;
}
</style>
