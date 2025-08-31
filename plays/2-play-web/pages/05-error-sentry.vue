<template>
  <div class="flex flex-col gap-2">
    <VBtn id="captureClientBtn" @click="captureClientError">
      Catch Client Error
    </VBtn>
    <VBtn id="throwClientBtn" @click="throwClientError">
      Throw Client Error
    </VBtn>
    <VBtn id="spanServerBtn" @click="spanServerError">
      Span Server Error
    </VBtn>
  </div>
</template>

<script lang="ts" setup>
import * as Sentry from '@sentry/nuxt';

definePageMeta({
  name: 'Sentry Error Handling',
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
