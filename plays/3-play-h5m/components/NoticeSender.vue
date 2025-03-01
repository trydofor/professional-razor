<template>
  <div class="mt-2 flex flex-col gap-2">
    <IonButton @click="onToast">
      {{ prop.title }} Toast
    </IonButton>
    <IonButton @click="onAlert">
      {{ prop.title }} Alert
    </IonButton>
    <IonButton @click="onAlert404">
      {{ prop.title }} Alert 404
    </IonButton>
    <IonInput
      ref="inputSendZipRef"
      v-model="inputSendZip"
      class="w-full py-4 font-bold tracking-widest"
      label="Zipcode([0-9]{6,})"
      inputmode="numeric"
      label-placement="floating"
      fill="outline"
      clear-input
      :error-text="errorSendZip"
      @ion-input="checkSendZip"
      @ion-blur="checkSendZip"
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
const prop = defineProps<{ title: string }>();
const noticeCapturer = useNoticeCapturer();

const toggleThrowAlert = ref(true);
const capturers = ref('');

const i18nAlert = {
  message: 'should not be shown',
  i18nCode: 'error.assert.notEmpty1',
  i18nArgs: ['name'],
} as I18nMessage;

const i18nToast = {
  type: 'toast',
  message: 'should not be shown',
  i18nCode: 'error.assert.notEmpty1',
  i18nArgs: ['name'],
} as I18nMessage;

const i18n404 = {
  message: 'no code found',
  i18nCode: 'error.404',
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

function sendMessage(notice: I18nMessage) {
  if (toggleThrowAlert.value) {
    throw new NoticeThrown([notice]);
  }
  else {
    noticeCapturer.emit(notice);
  }
}

function onShowCapturers() {
  noticeCapturer.each((hks) => {
    capturers.value = JSON.stringify(hks, null, 2);
  });
  globalThrownCapturer.each((hks) => {
    capturers.value += '\n==Thrown Capturer==\n' + JSON.stringify(hks, null, 2);
  });
}

const inputSendZip = ref('');
const errorSendZip = ref('bad zipcode');
const inputSendZipRef = useTemplateRef('inputSendZipRef');

const checkSendZip = useIonInputChecker({
  el: inputSendZipRef,
  check: /^[0-9]{6,}$/,
  model: inputSendZip,
  notify: {
    handle: noticeCapturer,
    output: errorSendZip,
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
  checkSendZip(zipcodeNotice);
}
</script>
