<template>
  <img v-bind="srcset" :alt="props.alt">
</template>

<script lang="ts" setup>
const props = defineProps<{ alt?: string; srcset: string[] }>();
const srcset = imageDpiSrcset(props.srcset);
</script>
