<template>
  <AppTab :title="metaName">
    <div class="flex flex-col gap-4 p-4">
      <div>Error is eaten by Ionic Lifecycle Methods</div>
      <div>
        <ul>
          <li>ionViewDidEnter - eat throw</li>
          <li>ionViewWillLeave - manually handle to vue</li>
        </ul>
      </div>
      <div>enter this page, IgnoredThrown in the console log</div>
      <div>click [Home] to see App alert</div>
      <div class="text-center">
        <IonButton router-link="/">
          Home
        </IonButton>
      </div>
    </div>
  </AppTab>
</template>

<script lang="ts" setup>
const metaName = 'Manually Handle Eaten Error';
definePageMeta({ name: metaName });

const vueErrorHandler = useVueErrorHandler();

onIonViewDidEnter(async () => {
  throw newIgnoredThrown('Should NOT be here');
});

onIonViewWillLeave(async () => {
  vueErrorHandler.handleCatch(() => {
    throw newAppAlertThrown('Manually handle to vue');
  });
});
</script>
