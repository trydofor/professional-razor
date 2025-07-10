<template>
  <AppTab :title="metaName">
    <div class="bg-gray-200 p-4">
      popup as backdrop box at center,
      style by uno rules and @apply
    </div>
    <div class="p-4">
      <IonButton id="popup-default" class="text-white">
        Popup by rules
      </IonButton>
      <IonModal trigger="popup-default" class="ion-fit-card">
        <div class="h-30 w-40 p-4">
          box of w-40 h-30 p-4
        </div>
      </IonModal>
    </div>
    <div class="p-4">
      <IonButton id="popup-directives" class="text-white">
        Popup by @apply
      </IonButton>
      <IonModal trigger="popup-directives" class="my-fit-card">
        <div class="h-30 w-40 p-4">
          box of w-40 h-30 p-4
        </div>
      </IonModal>
    </div>
    <div class="p-4">
      <IonButton id="present-alert">
        Popup by IonAlert
      </IonButton>
      <IonAlert
        trigger="present-alert"
        header="A Short Title Is Best"
        sub-header="A Sub Header Is Optional"
        message="A message should be a short, complete sentence."
      />
    </div>
  </AppTab>
</template>

<script lang="ts" setup>
const metaName = 'Ion Modal popup';
definePageMeta({ name: metaName });
</script>

<style lang="css" scoped>
.my-fit-card {
  --at-apply: ion-var-fit ion-var-card;
}
</style>
