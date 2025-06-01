<template>
  <AppTab :title="metaName">
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
      <IonButton @click="onShowLoading()">
        Loading Bar 5s
      </IonButton>
      <IonButton @click="onModalEmit()">
        Emit 2 Modal
      </IonButton>
      <pre>
          reactive array:{{ JSON.stringify(reactiveArray, null, 2) }}
          reactive object:{{ JSON.stringify(reactiveObject, null, 2) }}
          === change ✅:1,2N; ❌:2N+1 ===
        </pre>
      <IonButton @click="onReactive()">
        reactive: {{ reactiveCount }} should {{ reactiveCount == 1 || reactiveCount % 2 === 0 ? "✅" : "❌" }}
      </IonButton>
      <IonButton @click="onReactive(true)">
        non-reactive for function
      </IonButton>
      <pre>
          ref array:{{ JSON.stringify(refArray, null, 2) }}
          ref object:{{ JSON.stringify(refObject, null, 2) }}
          === change ✅:1,2N; ❌:2N+1 ===
        </pre>
      <IonButton @click="onRef()">
        ref: {{ refCount }} should {{ refCount == 1 || refCount % 2 === 0 ? "✅" : "❌" }}
      </IonButton>
      <IonButton @click="onRef(true)">
        non-ref for function
      </IonButton>
      <div v-for="ix in 2" :key="ix" :style="{ 'border-left': `${opens[ix-1].value}px solid red` }">
        arr[{{ ix }}] = {{ opens[ix-1] }}
      </div>
      <div v-for="(it, ix) in opens" :key="ix" :style="{ 'border-left': `${it.value}px solid blue` }">
        for-in = {{ it }}
      </div>
      <div :style="{ 'border-left': `${open0}px solid green` }">
        const = {{ open0 }}
      </div>
      <IonButton @click="onTmplRef">
        must write .value in expression
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
  </AppTab>
</template>

<script lang="ts" setup>
const metaName = 'App Notify Toast/Alert/Modal';
definePageMeta({ name: metaName });

let toastCount = 0;
function onToastEmit(level?: GlobalNotifyLevelType) {
  if (level == null) {
    appToastNotify.eventBus.emit({
      icon: ioniconsAlertCircleOutline,
      position: 'middle',
      message: `message-${++toastCount} emit from appToastNotify.eventBus`,
    });
    appToastNotify.eventBus.emit({
      position: 'middle',
      notifyLevel: GlobalNotifyLevel.Success,
      message: `message-${++toastCount} emit from appToastNotify.eventBus`,
    });
    appToastNotify.eventBus.emit({
      position: 'middle',
      notifyLevel: GlobalNotifyLevel.Warning,
      message: `message-${++toastCount} emit from appToastNotify.eventBus`,
    });
  }
  else {
    appToastNotify.eventBus.emit({
      message: `message-${++toastCount} emit from appToastNotify.eventBus`,
      notifyLevel: level,
    });
    if (level === GlobalNotifyLevel.Message) {
      appToastNotify.eventBus.emit(`message-${++toastCount} emit from appToastNotify.eventBus`);
    }
  }
}

let alertCount = 0;
function onAlertEmit() {
  appAlertNotify.eventBus.emit(`message-${++alertCount} emit from appAlertNotify.eventBus`);
  appAlertNotify.eventBus.emit({ message: `message-${++alertCount} emit from appAlertNotify.eventBus`, notifyLevel: GlobalNotifyLevel.Message });
  appAlertNotify.eventBus.emit({ message: `message-${++alertCount} emit from appAlertNotify.eventBus`, notifyLevel: GlobalNotifyLevel.Success });
  appAlertNotify.eventBus.emit({ message: `message-${++alertCount} emit from appAlertNotify.eventBus`, notifyLevel: GlobalNotifyLevel.Warning });
}

function onToastThrow() {
  if (toastCount % 2 === 0) {
    throw appToastNotify.newThrown(`message-${++toastCount} by NotifyThrow A`);
  }
  else {
    throw appToastNotify.newThrown({ message: `message-${++toastCount} by NotifyThrow B`, notifyLevel: GlobalNotifyLevel.Message });
  }
}
function onAlertThrow() {
  if (alertCount % 2 === 0) {
    throw appAlertNotify.newThrown(`message-${++alertCount} by NotifyThrow A`);
  }
  else {
    throw appAlertNotify.newThrown({ message: `message-${++alertCount} by NotifyThrow B`, notifyLevel: GlobalNotifyLevel.Message });
  }
}

const modal1 = shallowRef(false);
const modal2 = shallowRef(false);
const modalCount1 = shallowRef(0);
const modalCount2 = shallowRef(0);

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

const reactiveArray = reactive<SafeAny>([]);
const reactiveObject = reactive<SafeAny>({});
const reactiveCount = shallowRef(0);
function onReactive(fun = false) {
  if (reactiveArray.length === 0) {
    reactiveArray.push({ xx: { yy: { zz: 1, fn: () => {} } } });
    reactiveArray.push({ xx: shallowReactive({ yy: { zz: 1, fn: () => {} } }) });
    reactiveObject[0] = { xx: { yy: { zz: 1, fn: () => {} } } };
    reactiveObject[1] = { xx: shallowReactive({ yy: { zz: 1, fn: () => {} } }) };
    return;
  }

  reactiveCount.value = reactiveCount.value + 1;
  const i = reactiveCount.value % 2;
  if (fun) {
    reactiveArray[i].xx.yy.fn = () => console.log(reactiveCount.value);
    reactiveObject[i].xx.yy.fn = () => console.log(reactiveCount.value);
  }
  else {
    reactiveArray[i].xx.yy.zz++;
    reactiveObject[i].xx.yy.zz++;
  }
}

const refArray = ref<SafeAny>([]);
const refObject = ref<SafeAny>({});
const refCount = shallowRef(0);
function onRef(fun = false) {
  if (refArray.value.length === 0) {
    refArray.value.push({ xx: { yy: { zz: 1, fn: () => {} } } });
    refArray.value.push({ xx: shallowRef({ yy: { zz: 1, fn: () => {} } }) });
    refObject.value[0] = { xx: { yy: { zz: 1, fn: () => {} } } };
    refObject.value[1] = { xx: shallowRef({ yy: { zz: 1, fn: () => {} } }) };
    return;
  }

  refCount.value = refCount.value + 1;
  const i = refCount.value % 2;
  if (fun) {
    refArray.value[i].xx.yy.fn = () => console.log(refCount.value);
    refObject.value[i].xx.yy.fn = () => console.log(refCount.value);
  }
  else {
    refArray.value[i].xx.yy.zz++;
    refObject.value[i].xx.yy.zz++;
  }
}

const open0 = shallowRef(0);
const opens = [open0, shallowRef(0)];
function onTmplRef() {
  opens[0].value++;
  opens[1].value++;
}

function onShowLoading() {
  globalLoadingStatus.value = true;
  setTimeout(() => {
    globalLoadingStatus.value = false;
  }, 5000);
}
</script>
