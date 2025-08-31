<template>
  <AppTab :title="metaName">
    <div class="m-6">
      <PagingBar
        :page="page"
        :page-size="size"
        :total-page="totalPage"
        @change-page="onPageChange"
      />
      <PagingBar
        :page="page"
        :page-size="size"
        :total-page="totalPage"
        :size-items="sizes"
        :total-data="totalData"
        @change-page="onPageChange"
      />
      <IonItemDivider class="m-4" />
      <PagingBar
        :page="page"
        :page-size="size"
        :total-page="totalPage"
        :size-items="sizes"
        :total-data="totalData"
        :visible="visible"
        @change-page="onPageChange"
      />
      <PagingBar
        :page="page"
        :page-size="size"
        :total-page="totalPage"
        :size-items="sizes"
        :total-data="totalData"
        :visible="visible"
        rounded
        @change-page="onPageChange"
      />
      <div class="border border-solid my-4 border-primary p-4">
        {{ $t('ui.paging.page') + ': '+ page +', '+ $t('ui.paging.pageSize') +': '+ size }}
      </div>
      <div class="mt-4">
        <IonSelect v-model="visible" label="visible">
          <IonSelectOption v-for="item in visibleItem" :key="item" :value="item">
            {{ item }}
          </IonSelectOption>
        </IonSelect>
      </div>
      <div class="border border-solid my-4 border-primary p-4">
        border border-solid border-primary
      </div>
      <div class="border border-solid my-4 border-primary text-secondary p-4">
        border border-solid border-primary text-secondary
      </div>
      <div class="border border-solid my-4 border-primary hover:bg-secondary text-primary-contrast p-4 bg-primary-lighten">
        text-primary-contrast bg-primary hover:bg-secondary
      </div>
      <div class="border border-solid my-4 border-primary flex flex-col">
        <div class="bg-primary">
          bg-primary unocss
        </div>
        <div class="_bg-primary">
          _bg-primary unocss
        </div>
        <div class="bg-[var(--ion-color-primary)]">
          bg-[var(--ion-color-primary)] unocss
        </div>
        <div class="bg-primary-darken">
          bg-primary-darken unocss
        </div>
        <div class="_bg-primary-darken">
          _bg-primary-darken unocss
        </div>
        <div class="bg-primary-lighten">
          bg-primary-lighten unocss
        </div>
        <div class="_bg-primary-lighten">
          _bg-primary-lighten unocss
        </div>
      </div>
    </div>
  </AppTab>
</template>

<script lang="ts" setup>
const metaName = 'Paging Bar and Dark Mode';
definePageMeta({ name: metaName });

const sizes = [10, 20, 30, 40, 50];
const page = shallowRef(1);
const size = shallowRef(20);
const totalData = 211;
const totalPage = computed(() => Math.floor((totalData - 1) / size.value) + 1);

const visible = shallowRef<undefined>();
const visibleItem = [3, 4, 5, 6, 7, 8, 9];

function onPageChange(pg: number, sz: number) {
  console.log('onPageChange', pg, sz);
  page.value = pg;
  size.value = sz;
}
</script>
