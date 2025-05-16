<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>Lifecircle and Cache</IonTitle>
        <IonButtons slot="end">
          <IonMenuButton />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div class="flex flex-col gap-4 p-4">
        <div>
          These lifecycles are only called on components directly mapped by a router.
          This means if /pageOne maps to PageOneComponent, then Ionic lifecycles will
          be called on PageOneComponent but will not be called on
          any child components that PageOneComponent may render.
        </div>
        <div>
          child componet need watch ref props to trigger change
        </div>
        <pre>
{{ logText }}
        </pre>
        <LifeCircle :log-fun="logFun" :ref-num="refNum" />
        <IonButton @click="clearLog">
          Clear Log
        </IonButton>
        <IonButton @click="refNum ++">
          Add Num
        </IonButton>
      </div>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'Lifecircle and Cache',
});

const logText = ref('');
const refNum = ref(0);

function clearLog() {
  logText.value = '';
}
function logFun(msg: string) {
  logText.value = logText.value + `${msg}\n`;
  console.log(msg);
}

onIonViewWillEnter(() => {
  logFun('parent component will enter');
});

onIonViewWillLeave(() => {
  logFun('parent component will leave');
});

onBeforeMount(() => {
  logFun('parent component before mount');
});

onBeforeUnmount(() => {
  logFun('parent component before unmount');
});
</script>
