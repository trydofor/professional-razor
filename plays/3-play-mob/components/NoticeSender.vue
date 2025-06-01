<template>
  <div class="mt-2 flex flex-col gap-2">
    <IonButton @click="onToast">
      {{ prop.title }} {{ toast ? 'Toast' :'Alert' }}
    </IonButton>
    <IonButton @click="onAlert">
      {{ prop.title }} Alert
    </IonButton>
    <IonButton @click="onAlert404">
      {{ prop.title }} Alert 404
    </IonButton>
    <IonInput
      ref="sendZipRefer"
      v-model="sendZipModel"
      class="w-full py-4 font-bold tracking-widest"
      label="Zipcode([0-9]{6,})"
      inputmode="numeric"
      label-placement="floating"
      fill="outline"
      clear-input
      :error-text="sendZipError"
      @ion-input="sendZipCheck"
      @ion-blur="sendZipCheck"
    >
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <!-- <div slot="start" class="i-flag:us-4x3" /> -->
      <!-- TODO https://github.com/ionic-team/ionic-framework/issues/28665  -->
    </IonInput>
    <IonButton @click="onApiError">
      Zipcode Error by Api Async
    </IonButton>
    <IonButton @click="onApiErrorSyncReturn">
      Zipcode Error by Api Sync return
    </IonButton>
    <IonButton @click="onApiErrorSyncCatch">
      Zipcode Error by Api Sync catch
    </IonButton>
    <IonButton @click="onNotifyError">
      Zipcode Error by Notice
    </IonButton>
    <IonButton @click="onBubbleUp">
      System Error Bubble Up
    </IonButton>
    <div class="h-8">
      <IonToggle v-model="toggleThrowAlert">
        {{ toggleThrowAlert ? 'Throw':'Emit' }} Alert
      </IonToggle>
    </div>
    <IonButton color="success" @click="onShowCapturers">
      Show Notice Capturers
    </IonButton>
    <pre>{{ capturers }}</pre>
  </div>
</template>

<script lang="ts" setup>
const prop = defineProps<{ title: string; toast?: boolean }>();
const noticeCapturer = useNoticeCapturer();

const toggleThrowAlert = ref(true);
const capturers = ref('');

const i18nAlert = {
  message: 'should not be shown',
  i18nCode: 'error.assert.notEmpty1',
  i18nArgs: ['name'],
} as I18nMessage;

const i18nToast = {
  type: GlobalNotifyStyle.Toast,
  message: 'should not be shown',
  i18nCode: 'error.assert.notEmpty1',
  i18nArgs: ['name'],
} as I18nMessage;

const i18n404 = {
  message: 'no code found',
  i18nCode: 'error.fetcher.404',
} as I18nMessage;

function onToast() {
  sendMessage(i18nToast);
}

function onAlert() {
  sendMessage(i18nAlert);
}

function onAlert404() {
  sendMessage(i18n404);
}

function sendMessage(notice: I18nNotice) {
  if (toggleThrowAlert.value) {
    if (notice.i18nCode!.includes('404')) {
      throw new NoticeThrown(notice);
    }
    else {
      throw new NoticeThrown({
        ...notice,
        notifyLevel: GlobalNotifyLevel.Warning,
      });
    }
  }
  else {
    noticeCapturer.emit(notice);
  }
}

function onShowCapturers() {
  capturers.value = '';
  let tmp1 = noticeCapturer;
  while (tmp1 != null) {
    tmp1.each((hks) => {
      capturers.value += '\n==Notice Capturer==\n' + JSON.stringify(hks, null, 2);
    });
    tmp1 = tmp1.parent as SafeAny;
  }

  let tmp2 = globalThrownCapturer;
  while (tmp2 != null) {
    tmp2.each((hks) => {
      capturers.value += '\n==Thrown Capturer==\n' + JSON.stringify(hks, null, 2);
    });
    tmp2 = tmp2.parent as SafeAny;
  }
}

const sendZipModel = ref('');
const sendZipError = ref('bad zipcode');
const sendZipRefer = useTemplateRef('sendZipRefer');
const sendZipCheck = useIonInputChecker({
  el: sendZipRefer,
  check: /^[0-9]{6,}$/,
  model: sendZipModel,
  notify: {
    handle: noticeCapturer,
    output: sendZipError,
    accept: 'zip',
  },
});

const zipcodeNotice = {
  target: 'zip',
  message: 'should not be shown',
  i18nCode: 'error.assert.greater2',
  i18nArgs: ['zipcode', 100000],
} as I18nNotice;

const apiRoute = useApiRouteFetcher();
const body = {
  success: false,
  errors: [
    zipcodeNotice,
  ],
} as ErrorResult;

async function onApiError() {
  await apiRoute.post('/echo', { body });
}

function onApiErrorSyncReturn() {
  return apiRoute.post('/echo', { body });
}

const thrownCapturer = useThrownCapturer();
function onApiErrorSyncCatch() {
  apiRoute.post('/echo', { body }).catch(thrownCapturer.hookCatch);
}

function onNotifyError() {
  sendZipCheck(zipcodeNotice);
}

function onBubbleUp() {
  throw new SystemError('notice and to sentry', 'bubble up');
}
</script>
