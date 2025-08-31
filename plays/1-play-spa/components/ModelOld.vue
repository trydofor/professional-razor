<template>
  <div class="border border-solid p-4 border-1">
    Old props+emits is: {{ model }}
  </div>
  <div class="border border-solid cursor-pointer p-4 border-1" @click="update">
    👶 Child ++
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ modelValue: number }>();
const emits = defineEmits<{ 'update:modelValue': [number] }>();

const model = computed({
  get: () => props.modelValue,
  set: val => emits('update:modelValue', val),
});

function update() {
  increase(model);
}

function increase(value:Ref<number>){
  value.value++;
}
</script>
