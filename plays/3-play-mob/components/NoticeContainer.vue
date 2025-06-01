<template>
  <IonAlert
    :is-open="alertOpen"
    header="Notice Container"
    sub-header="Inner Notice Capturer"
    :message="alertMessage"
    :buttons="['OK']"
    @did-dismiss="alertOpen = false"
  />
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
