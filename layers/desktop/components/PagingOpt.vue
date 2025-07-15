<template>
  <div>
    <VBtn :size="props.density === 'compact' || props.density === 'comfortable' ? 'small' : 'default'" @click="dialog = true">
      <div class="flex-row justify-center flex gap-1 items-center">
        <div class="i-mdi:cog size-4" />
        <div class="text-right text-2 flex flex-col gap-1px">
          <div :class="props.totalData ? undefined:'pr-1'">
            {{ dataStart }}
          </div>
          <div>{{ dataTotal }}</div>
        </div>
      </div>
    </VBtn>
    <VDialog v-model="dialog" max-width="400">
      <VCard rounded="md">
        <VCardTitle class="items-center justify-between justify-between flex!">
          <div>
            {{ $t('ui.paging.option') }}
          </div>
          <VBtn
            icon="i-mdi:close"
            variant="text"
            @click="onPageCancel"
          />
        </VCardTitle>

        <VDivider class="mb-2" />

        <VCardText>
          <div class="mb-2">
            {{ $t('ui.paging.page') + ': ' + props.page + ' / ' + props.totalPage }}
          </div>
          <VNumberInput
            v-model="pageJump"
            density="comfortable"
            :max="props.totalPage"
            :min="1"
            variant="outlined"
            decimal-separator="."
            :label="$t('ui.paging.jumpTo')"
          />

          <div class="mb-2">
            {{ $t('ui.paging.data') + ': ' + dataStart + ' / ' + dataTotal }}
          </div>
          <VSelect
            v-model="pageSize"
            density="comfortable"
            variant="outlined"
            :disabled="props.sizeItems == null ||props.sizeItems.length === 0"
            :label="$t('ui.paging.pageSize')"
            :items="props.sizeItems"
          />
        </VCardText>

        <VDivider class="mt-2" />

        <VCardActions class="justify-end my-2 flex">
          <VBtn
            rounded="md"
            :text="$t('ui.button.close')"
            @click="onPageCancel"
          />

          <VBtn
            color="primary"
            rounded="md"
            :text="$t('ui.button.ok')"
            variant="flat"
            @click="onPageSetting"
          />
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  page: number;
  pageSize: number;
  totalPage: number;
  sizeItems?: number[];
  totalData?: number;
  density?: 'default' | 'comfortable' | 'compact';
}>(), {
  density: 'default',
});

const emits = defineEmits<{
  (e: 'changePage', page: number, size: number): void;
}>();

const dataStart = computed(() => Math.max((props.page - 1) * props.pageSize + 1, 1).toFixed(0));
const dataTotal = computed(() => props.totalData ? props.totalData.toFixed(0) : ((props.totalPage - 1) * props.pageSize).toFixed(0) + '+');

const dialog = shallowRef<boolean>(false);

const pageJump = shallowRef<number>(props.page);
const pageSize = shallowRef<number>(props.pageSize);
watchEffect(() => {
  pageJump.value = props.page;
  pageSize.value = props.pageSize;
});

function onPageCancel() {
  dialog.value = false;
  pageJump.value = props.page;
  pageSize.value = props.pageSize;
}
function onPageSetting() {
  dialog.value = false;
  if (props.page !== pageJump.value || props.pageSize != pageSize.value) {
    emits('changePage', pageJump.value, pageSize.value);
  }
}
</script>
