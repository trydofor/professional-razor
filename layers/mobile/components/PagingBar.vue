<template>
  <div class="flex items-center">
    <PagingNav
      :page="props.page"
      :total-page="props.totalPage"
      :visible="props.visible"
      :rounded="props.rounded"
      :disabled="props.disabled"
      @change-page="(pg) => onChangePage(pg, props.pageSize)"
    />
    <PagingOpt
      :page="props.page"
      :page-size="props.pageSize"
      :total-data="props.totalData"
      :total-page="props.totalPage"
      :size-items="props.sizeItems"
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
  disabled?: boolean;
  rounded?: boolean;
}>(), {
  visible: 5,
  disabled: false,
  rounded: false,
});

const emits = defineEmits<{
  (e: 'changePage', page: number, size: number): void;
}>();

function onChangePage(page: number, size: number) {
  emits('changePage', page, size);
}
</script>
