<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>App Notify</IonTitle>
        <IonButtons slot="end">
          <IonMenuButton />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div class="mt-2 flex flex-col gap-2">
        <IonButton @click="onToastEmit('bottom')">
          Emit Toast Bottom
        </IonButton>
        <IonButton @click="onToastEmit('top')">
          Emit Toast Top
        </IonButton>
        <IonButton @click="onToastEmit('middle')">
          Emit Toast Middle
        </IonButton>
        <IonButton @click="onAlertEmit()">
          Emit 2 Notice
        </IonButton>
        <IonButton @click="onModalEmit()">
          Emit 2 Modal
        </IonButton>
        <IonModal :is-open="modal1">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Modal A-{{ modalCount1 }}</IonTitle>
              <IonButtons slot="start">
                <IonButton @click="toggleNotify.close('Modal1')">
                  <IonIcon slot="icon-only" :icon="ioniconsChevronBack" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent class="ion-padding">
            <p>
              Modal A-{{ modalCount1 }} content
            </p>
          </IonContent>
        </IonModal>
        <IonModal :is-open="modal2">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Modal B-{{ modalCount2 }}</IonTitle>
              <IonButtons slot="start">
                <IonButton @click="toggleNotify.toggle('Modal2')">
                  <IonIcon slot="icon-only" :icon="ioniconsChevronBack" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent class="ion-padding">
            <p>
              Modal B-{{ modalCount2 }} content
            </p>
          </IonContent>
        </IonModal>
      </div>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'App Notify',
});

let toastCount = 0;
function onToastEmit(pos: string) {
  appToastEventBus.emit({
    duration: 1500,
    icon: ioniconsAlertCircleOutline,
    position: pos as SafeAny,
    message: `message-${++toastCount} emit from appToastEventBus`,
  });
}

let alertCount = 0;
function onAlertEmit() {
  appAlertEventBus.emit(`message-${++alertCount} emit from appAlertEventBus`);
  appAlertEventBus.emit(`message-${++alertCount} emit from appAlertEventBus`);
}

const modal1 = ref(false);
const modal2 = ref(false);
const modalCount1 = ref(0);
const modalCount2 = ref(0);

const toggleNotify = createToggledNotify<{
  Modal1: Ref<boolean>;
  Modal2: Ref<boolean>;
}>();
toggleNotify.init('Modal1', modal1);
toggleNotify.init('Modal2', modal2);

function onModalEmit() {
  modalCount1.value = ++modalCount1.value;
  modalCount2.value = ++modalCount2.value;
  toggleNotify.open('Modal1');
  toggleNotify.toggle('Modal2');
}
</script>
