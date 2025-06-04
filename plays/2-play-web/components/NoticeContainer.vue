<template>
  <VDialog v-model="alertOpen" max-width="500">
    <VCard
      max-width="400"
      title="Notice Container"
      :text="alertMessage"
    >
      <template #actions>
        <VBtn
          class="ms-auto"
          text="OK"
          @click="alertOpen = false"
        />
      </template>
    </VCard>
  </VDialog>
  <slot />
</template>

<script lang="ts" setup>
const alertOpen = shallowRef(false);
const alertMessage = shallowRef('');

const noticeCapturer = useNoticeCapturer(true, true);
noticeCapturer.put({ id: 'InnerNoticeThrown', order: 200, hook: (ntc) => {
  const msg = ntc.i18nCode ? $t(ntc.i18nCode, ntc.i18nArgs ?? []) : ntc.message || 'No I18N';
  alertMessage.value = msg;
  alertOpen.value = true;
  return false;
} }, onScopeDispose);
</script>
