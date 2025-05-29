<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <slot name="title">
          <IonButtons slot="start" :collapse="true">
            <IonBackButton />
          </IonButtons>
          <IonTitle>{{ props.title }}</IonTitle>
        </slot>
        <IonButtons slot="end">
          <IonButton
            fill="clear"
            shape="round"
            color="primary"
            @click="menuController.open()"
          >
            <IonIcon slot="icon-only" size="large" :icon="ioniconsMenu" />
          </IonButton>
        </IonButtons>
        <IonProgressBar v-if="globalLoadingStatus" type="indeterminate" />
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <slot>{{ props.title }}</slot>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string;
}>();
</script>
