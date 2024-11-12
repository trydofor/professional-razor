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
          💎 with v-auto-size, the transition-height goes smoothly as 1x
        </div>
        <div class="py-1">
          Debounce (ms):
          <input v-model.number="debounce" placeholder="debounce" type="number">
        </div>
        <div class="border-1 border-indigo">
          <div v-for="it in item1" :key="it.id">
            <div class="p-4 flex flex-row gap-1 items-center" :class="pick1 != it.id ? 'bg-green-200':'bg-blue-200'" @click="select1(it.id)">
              <div>✅ auto-size {{ it.title }}</div>
              <div
                class="size-6"
                :class="show1 === it.id ? 'i-mdi:arrow-up-circle-outline' :'i-mdi:arrow-down-circle-outline'"
                @click="toggle1(it.id)"
              />
            </div>
            <div v-autosize:height="{ debug: it.details, debounce: debounce }" class="transition-height duration-500 overflow-hidden">
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

const debounce = ref(500);
const show1 = ref(0);
const pick1 = ref(0);
const item1 = [
  { id: 1, title: 'order1', details: 'detail 1' },
  { id: 2, title: 'order2', details: 'detail 2' },
  { id: 3, title: 'order3', details: 'detail 3' },
];
function select1(id: number) {
  pick1.value = pick1.value === id ? 0 : id;
}
function toggle1(id: number) {
  show1.value = show1.value === id ? 0 : id;
}
</script>
