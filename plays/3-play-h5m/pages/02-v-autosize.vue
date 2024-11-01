<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>Autosize</IonTitle>
        <IonButtons slot="end">
          <IonMenuButton />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div>
        <div class="bg-gray-200 p-2">
          💎 with v-auto-size, the transition-height goes smoothly as [1,2]
        </div>
        <div class="border-1 border-indigo">
          <div v-for="it in item1" :key="it.id">
            <div class="p-4 bg-green-200 flex flex-row gap-1 items-center" @click="toggle1(it.id)">
              <div>✅ auto-size {{ it.title }}</div>
              <div
                class="size-6"
                :class="show1 === it.id ? 'i-mdi:arrow-up-circle-outline' :'i-mdi:arrow-down-circle-outline'"
              />
            </div>
            <div v-autosize:height="it.details" class="transition-height duration-500 overflow-hidden">
              <div
                v-show="show1 === it.id"
                class="p-4 bg-gray-200 animate-slide-in-down animate-duration-500"
                @click="toggle1(it.id)"
              >
                {{ it.details }}
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 bg-red-200">
          Others
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'Showcase of v-autosize',
});

const show1 = ref(0);
const item1 = [
  { id: 1, title: 'order1', details: 'detail 1' },
  { id: 2, title: 'order2', details: 'detail 2' },
];
function toggle1(id: number) {
  show1.value = show1.value === id ? 0 : id;
}
</script>
