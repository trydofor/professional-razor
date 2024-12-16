<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>Popup</IonTitle>
        <IonButtons slot="end">
          <IonMenuButton />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div class="p-4">
        <IonButton id="popup-default" class="text-white">
          Popup Fit Card
        </IonButton>
        <IonModal trigger="popup-default" class="ion-fit-card">
          <div class="w-40 h-30 p-4">
            box of w-40 h-30 p-4
          </div>
        </IonModal>
      </div>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'Ion Modal popup',
});
</script>
