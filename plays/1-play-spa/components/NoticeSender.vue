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
      label="should be numbers"
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
  if (toggleThrowAlert.value) {
    throw new NoticeThrown([i18nToast]);
  }
  else {
    noticeCapturer.emit(i18nToast);
  }
}

function onAlert() {
  if (toggleThrowAlert.value) {
    throw new NoticeThrown([i18nAlert]);
  }
  else {
    noticeCapturer.emit(i18nAlert);
  }
}

function onAlert404() {
  if (toggleThrowAlert.value) {
    throw new NoticeThrown([i18n404]);
  }
  else {
    noticeCapturer.emit(i18n404);
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
const errorSendZip = ref('');
const inputSendZipRef = useTemplateRef('inputSendZipRef');
const checkSendZip = ionicValidateInput(inputSendZipRef, /^[0-9]{5}(-?[0-9]{4})?$/, inputSendZip);
</script>
