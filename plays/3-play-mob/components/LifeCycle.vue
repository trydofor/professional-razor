<template>
  <div>
    Life Circle child component
  </div>
  <div>
    refNum = {{ refNum }}
  </div>
  <div>
    watchStr = {{ watchStr }}
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  logFun: (msg: string) => void;
  refNum: number;
}>();

const watchStr = shallowRef('');

watch(() => props.refNum, (newVal) => {
  watchStr.value = `watch-${newVal}`;
});

onIonViewWillEnter(() => {
  props.logFun('child component will enter');
});

onIonViewWillLeave(() => {
  props.logFun('child component will leave');
});

onBeforeMount(() => {
  props.logFun('child component before mount');
});

onBeforeUnmount(() => {
  props.logFun('child component before unmount');
});
</script>
