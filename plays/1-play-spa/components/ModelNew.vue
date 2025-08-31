<template>
  <div class="border border-solid p-4 border-1">
    New defineModel is: {{ model }}
  </div>
  <div class="border border-solid cursor-pointer p-4 border-1" @click="update">
    👶 Child ++
  </div>
</template>

<script lang="ts" setup>
const model = defineModel<number>({ default: 0 });
// const loading1 = defineModel<boolean>({ default: false });
// const loading2 = defineModel<boolean>('loading', { required: true });

function update() {
  increase(model);
}

function increase(value:Ref<number>){
  value.value++;
}
</script>
