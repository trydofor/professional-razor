<template>
  <div class="flex flex-col gap-2">
    <button id="sentryBtn" @click="captureClientError">
      Catch Client Error
    </button>
    <button id="errorBtn" @click="throwClientError">
      Throw Client Error
    </button>
    <button type="button" @click="spanServerError">
      Span Server Error
    </button>
  </div>
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
