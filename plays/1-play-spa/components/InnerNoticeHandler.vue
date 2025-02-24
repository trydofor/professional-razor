<template>
  <IonAlert
    :is-open="alertOpen"
    header="Inner Notice"
    :message="alertMessage"
    :buttons="['OK']"
    @did-dismiss="alertOpen = false"
  />
</template>

<script lang="ts" setup>
const alertOpen = ref(false);
const alertMessage = ref('');

// handle global notices
globalNoticeCapturer.put({ id: 'InnerNoticeThrown', order: 200, hook: (ntc) => {
  const msg = ntc.i18nCode ? $t(ntc.i18nCode, ntc.i18nArgs ?? []) : ntc.message || 'No I18N';
  alertMessage.value = msg;
  alertOpen.value = true;
  return false;
} });
</script>
