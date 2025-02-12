<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>Error Handling</IonTitle>
        <IonButtons slot="end">
          <IonMenuButton />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div class="flex flex-col gap-2">
        <IonButton id="sentryBtn" @click="captureClientError">
          Catch Client Error
        </IonButton>
        <IonButton id="errorBtn" @click="throwClientError">
          Throw Client Error
        </IonButton>
        <IonButton type="button" @click="spanServerError">
          Span Server Error
        </IonButton>
      </div>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
import * as Sentry from '@sentry/nuxt';

definePageMeta({
  name: 'Example of Error Handling',
});

function captureClientError() {
  try {
    throw new Error('Test error from Vue!');
  }
  catch (err) {
    Sentry.captureException(err);
  }
}

function throwClientError() {
  throw new Error('Nuxt Button Error');
}

function spanServerError() {
  Sentry.startSpan(
    {
      name: 'Example Frontend Span',
      op: 'test',
    },
    async () => {
      await $fetch('/api/sentry-example');
    },
  );
}
</script>
