<template>
  <div>
    <div v-if="toggleGlobal">
      <NoticeSender title="Global" :toast="true" />
    </div>
    <div v-else>
      <NoticeContainer>
        <NoticeSender title="Inner" :toast="false" />
      </NoticeContainer>
    </div>
    <div>
      <VBtn
        v-for="lcl in locales"
        :key="lcl.code"
        color="secondary"
        :disabled="locale === lcl.code"
        @click.prevent.stop="setLocale(lcl.code)"
      >
        {{ lcl.code }} - {{ lcl.name }}
      </VBtn>
      <VSwitch v-model="toggleGlobal" :label="toggleGlobal ? 'Global Capturer':'Inner Capturer'" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const metaName = 'I18n Notice and Thrown';
definePageMeta({ name: metaName });

const toggleGlobal = shallowRef(false);
const { locale, locales, setLocale } = useI18n();
</script>
