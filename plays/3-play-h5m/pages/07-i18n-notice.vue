<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>I18n Notice</IonTitle>
        <IonButtons slot="end">
          <IonMenuButton />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div class="flex flex-col gap-2">
        <IonButton @click="onGlobalToast">
          {{ toggleInnerAlert ? 'Inner Alert':'Global Toast' }}
        </IonButton>
        <IonButton @click="onGlobalAlert">
          {{ toggleInnerAlert ? 'Inner':'Global' }} Alert
        </IonButton>
        <IonButton @click="onGlobalAlert404">
          {{ toggleInnerAlert ? 'Inner':'Global' }} Alert 404
        </IonButton>
        <div v-if="toggleInnerAlert" class="h-8">
          <div>Notice Title is 'Inner'</div>
          <InnerNoticeHandler />
        </div>
        <div class="flex flex-row gap-2">
          <IonButton
            v-for="lcl in locales"
            :key="lcl.code"
            color="secondary"
            :disabled="locale === lcl.code"
            @click.prevent.stop="setLocale(lcl.code)"
          >
            {{ lcl.code }} - {{ lcl.name }}
          </IonButton>
        </div>

        <IonButton color="success" @click="onToggleInnerAlert">
          Toggle Inner Alert
        </IonButton>
        <IonButton color="success" @click="onShowCapturers">
          Show Notice Capturers
        </IonButton>
        <pre>
          {{ capturers }}
        </pre>
      </div>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'I18n Notice and Thrown',
});

const toggleInnerAlert = ref(false);
const capturers = ref('');

const { locale, locales, setLocale } = useI18n();

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

function onToggleInnerAlert() {
  toggleInnerAlert.value = !toggleInnerAlert.value;
}

function onGlobalToast() {
  throw new NoticeThrown([i18nToast]);
}

function onGlobalAlert() {
  throw new NoticeThrown([i18nAlert]);
}

function onGlobalAlert404() {
  throw new NoticeThrown([i18n404]);
}

function onShowCapturers() {
  globalNoticeCapturer.each((hks) => {
    capturers.value = JSON.stringify(hks, null, 2);
  });
}
</script>
