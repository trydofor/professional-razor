<template>
  <AppTab :title="metaName">
    <div class="flex flex-col gap-2">
      <IonButton id="captureClientErrorBtn" @click="captureClientError">
        Catch Client Error
      </IonButton>
      <IonButton id="throwClientBtn" @click="throwClientError">
        Throw Client Error
      </IonButton>
      <IonButton id="spanServerBtn" @click="spanServerError">
        Span Server Error
      </IonButton>
    </div>
  </AppTab>
</template>

<script lang="ts" setup>
import { captureException, startSpan } from '@sentry/nuxt';

const metaName = 'Sentry Error Handling';
definePageMeta({ name: metaName });

function captureClientError() {
  try {
    throw new Error('Test error from Vue!');
  }
  catch (err) {
    captureException(err);
  }
}

function throwClientError() {
  throw new Error('Nuxt Button Error');
}

function spanServerError() {
  return startSpan(
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
