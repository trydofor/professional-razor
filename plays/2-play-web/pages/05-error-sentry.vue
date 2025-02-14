<template>
  <div class="flex flex-col gap-2">
    <button id="captureClientBtn" @click="captureClientError">
      Catch Client Error
    </button>
    <button id="throwClientBtn" @click="throwClientError">
      Throw Client Error
    </button>
    <button id="spanServerBtn" @click="spanServerError">
      Span Server Error
    </button>
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
