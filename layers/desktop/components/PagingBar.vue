<template>
  <div class="flex items-center">
    <VPagination
      :model-value="props.page"
      :length="props.totalPage"
      :total-visible="props.visible"
      :density="props.density"
      :rounded="props.rounded"
      :disabled="props.disabled"
      @update:model-value="(pg) => onChangePage(pg, props.pageSize)"
    />
    <PagingOpt
      :page="props.page"
      :page-size="props.pageSize"
      :total-data="props.totalData"
      :total-page="props.totalPage"
      :size-items="props.sizeItems"
      :density="props.density"
      @change-page="onChangePage"
    />
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  page: number;
  pageSize: number;
  totalPage: number;
  sizeItems?: number[];
  totalData?: number;
  // vuetify ui
  visible?: number;
  density?: 'default' | 'comfortable' | 'compact';
  disabled?: boolean;
  rounded?: boolean;
}>(), {
  visible: 7,
  density: 'default',
  disabled: false,
  rounded: false,
});

const emits = defineEmits<{
  /**
   * zero means no change
   */
  (e: 'changePage', page: number, size: number): void;
}>();

function onChangePage(page: number, size: number) {
  emits('changePage', page, size);
}
</script>
