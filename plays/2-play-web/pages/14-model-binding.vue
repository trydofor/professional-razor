<template>
  <div class="flex flex-col gap-4">
    <div class="border border-solid p-2 border-1 flex flex-col gap-2">
      <div class="border border-solid p-4 border-1">
        Parent ModelNew {{ modelNew }}
      </div>
      <div class="border border-solid cursor-pointer p-4 border-1" @click="modelNew++">
        👨🏻 Parent ++
      </div>
      <div class="border border-solid cursor-pointer p-4 border-1" @click="modelNew=modelNew+1">
        👨🏻 Parent + 1
      </div>
      <ModelNew v-model="modelNew" />
    </div>
    <div class="border border-solid p-2 border-1 flex flex-col gap-2">
      <div class="border border-solid p-4 border-1">
        Parent ModelOld {{ modelOld }}
      </div>
      <div class="border border-solid cursor-pointer p-4 border-1" @click="modelOld++">
        👨🏻 Parent ++
      </div>
      <div class="border border-solid cursor-pointer p-4 border-1" @click="modelOld=modelOld+1">
        👨🏻 Parent +1
      </div>
      <ModelOld v-model="modelOld" />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'ModelRef binding',
});

const modelNew = shallowRef(1000);
const modelOld = shallowRef(2000);
</script>
