<template>
  <div>
    <IonButton
      fill="clear"
      class="color-inherit"
      size="small"
      @click="dialog = true"
    >
      <div class="flex-row justify-center flex gap-1 items-center">
        <div class="i-mdi:cog size-4" />
        <div class="text-right text-2 flex flex-col gap-1px">
          <div :class="props.totalData ? undefined:'pr-1'">
            {{ dataStart }}
          </div>
          <div>{{ dataTotal }}</div>
        </div>
      </div>
    </IonButton>
    <IonModal
      :is-open="dialog"
      :initial-breakpoint="0.4"
      @did-dismiss="onPageCancel"
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>{{ $t('ui.paging.option') }}</IonTitle>
          <IonButtons slot="end">
            <IonButton @click="onPageCancel">
              <IonIcon class="i-mdi:close" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList inset>
          <IonItem lines="none">
            {{ $t('ui.paging.page') + ': ' + props.page + ' / ' + props.totalPage }}
          </IonItem>
          <IonItem>
            <IonInput
              v-model.number="pageJump"
              :label="$t('ui.paging.jumpTo')"
              label-placement="floating"
              type="number"
              :min="1"
              :max="props.totalPage"
            />
          </IonItem>
          <IonItem lines="none">
            {{ $t('ui.paging.data') + ': ' + dataStart + ' / ' + dataTotal }}
          </IonItem>
          <IonItem>
            <IonSelect
              v-model="pageSize"
              :disabled="!props.sizeItems?.length"
              :label="$t('ui.paging.pageSize')"
              label-placement="floating"
            >
              <IonSelectOption v-for="size in props.sizeItems" :key="size" :value="size">
                {{ size }}
              </IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem class="mt-4">
            <IonButton
              slot="end"
              class="color-inherit"
              fill="clear"
              size="default"
              @click="onPageCancel"
            >
              {{ $t('ui.button.close') }}
            </IonButton>
            <IonButton
              slot="end"
              color="primary"
              size="default"
              @click="onPageSetting"
            >
              {{ $t('ui.button.ok') }}
            </IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
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
  if (props.page !== pageJump.value || props.pageSize !== pageSize.value) {
    emits('changePage', pageJump.value, pageSize.value);
  }
}
</script>
