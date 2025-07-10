<template>
  <div class="flex-row justify-center flex items-center text-2">
    <IonButton
      v-for="it in items"
      :key="it"
      fill="clear"
      size="small"
      :shape="shape"
      :disabled="props.disabled"
      class="color-inherit"
      :style="it === props.page ? '--background: rgba(var(--ion-color-medium-rgb),0.2)' : ''"
      @click="emit('changePage', it)"
    >
      {{ it }}
    </IonButton>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  page: number;
  totalPage: number;
  visible?: number;
  disabled?: boolean;
  rounded?: boolean;
}>(), {
  visible: 5,
  disabled: false,
  rounded: false,
});

const emit = defineEmits<{
  (e: 'changePage', val: number): void;
}>();

const shape = computed(() => props.rounded ? 'round' : undefined);

const items = computed<number[]>(() => {
  const total = Math.max(props.totalPage ?? 1, 1);
  const current = Math.max(props.page ?? 1, 1);
  const length = Math.min(Math.max(props.visible ?? 3, 3), 8);

  if (total <= length) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const half = Math.floor(length / 2);
  let start = current - half;
  let end = start + length - 1;

  if (start < 1) {
    start = 1;
    end = length;
  }
  else if (end > total) {
    end = total;
    start = total - length + 1;
  }

  return Array.from({ length }, (_, i) => start + i);
});
</script>
