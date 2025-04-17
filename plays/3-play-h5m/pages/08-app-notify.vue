<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>App Notify Toast/Alert/Modal</IonTitle>
        <IonButtons slot="end">
          <IonMenuButton />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div class="mt-2 flex flex-col gap-2">
        <IonButton @click="onToastEmit(GlobalNotifyLevel.Message)">
          Emit 2 Toast Message
        </IonButton>
        <IonButton @click="onToastEmit(GlobalNotifyLevel.Success)">
          Emit Toast Success
        </IonButton>
        <IonButton @click="onToastEmit(GlobalNotifyLevel.Warning)">
          Emit Toast Warning
        </IonButton>
        <IonButton @click="onToastEmit()">
          Emit 3 Toast Middle
        </IonButton>
        <IonButton @click="onAlertEmit()">
          Emit 4 Notice
        </IonButton>
        <IonButton @click="onToastThrow()">
          Throw a Toast
        </IonButton>
        <IonButton @click="onAlertThrow()">
          Throw 1 Notice
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
  name: 'App Notify Toast/Alert/Modal',
});

let toastCount = 0;
function onToastEmit(level?: GlobalNotifyLevelType) {
  if (level == null) {
    appToastEventBus.emit({
      icon: ioniconsAlertCircleOutline,
      position: 'middle',
      message: `message-${++toastCount} emit from appToastEventBus`,
    });
    appToastEventBus.emit({
      position: 'middle',
      notifyLevel: GlobalNotifyLevel.Success,
      message: `message-${++toastCount} emit from appToastEventBus`,
    });
    appToastEventBus.emit({
      position: 'middle',
      notifyLevel: GlobalNotifyLevel.Warning,
      message: `message-${++toastCount} emit from appToastEventBus`,
    });
  }
  else {
    appToastEventBus.emit({
      message: `message-${++toastCount} emit from appToastEventBus`,
      notifyLevel: level,
    });
    if (level === GlobalNotifyLevel.Message) {
      appToastEventBus.emit(`message-${++toastCount} emit from appToastEventBus`);
    }
  }
}

let alertCount = 0;
function onAlertEmit() {
  appAlertEventBus.emit(`message-${++alertCount} emit from appAlertEventBus`);
  appAlertEventBus.emit({ message: `message-${++alertCount} emit from appAlertEventBus`, notifyLevel: GlobalNotifyLevel.Message });
  appAlertEventBus.emit({ message: `message-${++alertCount} emit from appAlertEventBus`, notifyLevel: GlobalNotifyLevel.Success });
  appAlertEventBus.emit({ message: `message-${++alertCount} emit from appAlertEventBus`, notifyLevel: GlobalNotifyLevel.Warning });
}

function onToastThrow() {
  if (toastCount % 2 === 0) {
    throw newAppToastThrown(`message-${++toastCount} by NotifyThrow A`);
  }
  else {
    throw newAppToastThrown({ message: `message-${++toastCount} by NotifyThrow B`, notifyLevel: GlobalNotifyLevel.Message });
  }
}
function onAlertThrow() {
  if (alertCount % 2 === 0) {
    throw newAppAlertThrown(`message-${++alertCount} by NotifyThrow A`);
  }
  else {
    throw newAppAlertThrown({ message: `message-${++alertCount} by NotifyThrow B`, notifyLevel: GlobalNotifyLevel.Message });
  }
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
