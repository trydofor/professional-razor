<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
globalThrownCapturer.put({ id: 'GlobalSentryErrorNotice', order: 9100, hook: (err: SafeAny) => {
  globalNoticeCapturer.call({
    message: 'this error will sent to sentry, check log',
  });
  logger.error('this error will sent to sentry', err);
} });
</script>
