<template>
  <img
    :srcset="srcset"
    :src="src"
    :alt="props.alt"
  >
</template>

<script lang="ts" setup>
const props = defineProps<{
  alt?: string;
  srcset: string[];
}>();

const src = props.srcset[0];
const srcset = props.srcset.map((img, idx) => `${img} ${idx + 1}x`).join(', ');
</script>
