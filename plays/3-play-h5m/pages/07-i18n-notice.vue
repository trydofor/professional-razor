import { NoticeCapturer } from '../../../layers/common/utils/common-thrown';
import { nuxtCompatibilityDate } from '../../../layers/common/configures/nuxt-config-helper';
<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>I18n Notice</IonTitle>
        <IonButtons slot="end">
          <IonMenuButton />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div>
        <div v-if="toggleGlobal">
          <NoticeSender title="Global" />
        </div>
        <div v-else>
          <NoticeContainer>
            <NoticeSender title="Inner" />
          </NoticeContainer>
        </div>
        <div>
          <IonButton
            v-for="lcl in locales"
            :key="lcl.code"
            color="secondary"
            :disabled="locale === lcl.code"
            @click.prevent.stop="setLocale(lcl.code)"
          >
            {{ lcl.code }} - {{ lcl.name }}
          </IonButton>
          <IonToggle v-model="toggleGlobal">
            {{ toggleGlobal ? 'Global':'Inner' }} Capturer
          </IonToggle>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'I18n Notice and Thrown',
});

const toggleGlobal = ref(false);
const { locale, locales, setLocale } = useI18n();
</script>
