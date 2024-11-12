<template>
  <div>
    <div class="bg-gray-200 p-2">
      💎 with v-auto-size, the transition-height goes smoothly as 1x,
      otherwise goes as 2x. vue Transition as 3x
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
    <div class="border-1 border-indigo">
      <div v-for="it in item2" :key="it.id">
        <div class="p-4 bg-green-100 flex flex-row gap-1" @click="toggle2(it.id)">
          <div>no auto-size {{ it.title }}</div>
          <div
            class="size-6"
            :class="show2 === it.id ? 'i-mdi:arrow-up-circle-outline' :'i-mdi:arrow-down-circle-outline'"
          />
        </div>
        <div class="transition-height duration-500 overflow-hidden">
          <div
            v-show="show2 === it.id"
            class="p-4 bg-gray-200 animate-slide-in-down animate-duration-500"
            @click="toggle2(it.id)"
          >
            {{ it.details }}
          </div>
        </div>
      </div>
    </div>
    <div class="border-1 border-indigo">
      <div v-for="it in item3" :key="it.id">
        <div class="p-4 bg-green-200 flex flex-row gap-1" @click="toggle3(it.id)">
          <div> Transition {{ it.title }}</div>
          <div
            class="size-6"
            :class="show3 === it.id ? 'i-mdi:arrow-up-circle-outline' :'i-mdi:arrow-down-circle-outline'"
          />
        </div>
        <Transition name="list">
          <div
            v-if="show3 === it.id"
            class="p-4 bg-gray-200"
            @click="toggle3(it.id)"
          >
            {{ it.details }}
          </div>
        </Transition>
      </div>
    </div>
    <div class="p-4 bg-red-200">
      Others
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'Showcase of v-autosize',
});

const show1 = ref(0);
const item1 = [
  { id: 11, title: 'order11', details: 'detail 11' },
  { id: 12, title: 'order12', details: 'detail 12' },
  { id: 13, title: 'order13', details: 'detail 13' },
];
function toggle1(id: number) {
  show1.value = show1.value === id ? 0 : id;
}

const show2 = ref(0);
const item2 = [
  { id: 21, title: 'order21', details: 'detail 21' },
  { id: 22, title: 'order22', details: 'detail 22' },
  { id: 23, title: 'order23', details: 'detail 23' },
];
function toggle2(id: number) {
  show2.value = show2.value === id ? 0 : id;
}

const show3 = ref(0);
const item3 = [
  { id: 31, title: 'order31', details: 'detail 31' },
  { id: 32, title: 'order32', details: 'detail 32' },
  { id: 33, title: 'order33', details: 'detail 33' },
];
function toggle3(id: number) {
  show3.value = show3.value === id ? 0 : id;
}
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
