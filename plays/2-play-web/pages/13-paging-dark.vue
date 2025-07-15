<template>
  <div>
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
    <VDivider class="m-4" />
    <PagingBar
      :page="page"
      :page-size="size"
      :total-page="totalPage"
      :size-items="sizes"
      :total-data="totalData"
      :density="density"
      :visible="visible"
      @change-page="onPageChange"
    />
    <PagingBar
      :page="page"
      :page-size="size"
      :total-page="totalPage"
      :size-items="sizes"
      :total-data="totalData"
      :density="density"
      :visible="visible"
      rounded
      @change-page="onPageChange"
    />
    <div class="border-sm my-4 p-4">
      {{ $t('ui.paging.page') + ': '+ page +', '+ $t('ui.paging.pageSize') +': '+ size }}
    </div>
    <div>
      <VSelect
        v-model="density"
        variant="outlined"
        label="density"
        :items="['default', 'comfortable', 'compact']"
      />
      <VSelect
        v-model="visible"
        variant="outlined"
        label="visible"
        :items="[3, 5, 7, 9]"
      />
    </div>
    <div class="border-sm my-4 p-4">
      border-sm
    </div>
    <div class="border border-opacity-100 my-4 border-primary p-4">
      border border-primary border-opacity-100
    </div>
    <div class="border border-opacity-100 my-4 border-primary bg-primary text-primary-contrast p-4 hover:_bg-secondary">
      text-primary-contrast bg-primary hover:_bg-secondary ❌ for !important
    </div>
    <div class="border border-opacity-100 my-4 border-primary text-primary-contrast p-4 _bg-primary hover:_bg-secondary">
      text-primary-contrast _bg-primary hover:_bg-secondary ✅
    </div>
    <div class="border border-opacity-100 my-4 border-primary flex flex-col">
      <div class="bg-primary">
        bg-primary vuetify with color
      </div>
      <div class="_bg-primary">
        _bg-primary unocss
      </div>
      <div class="bg-[rgba(var(--v-theme-primary),1)]">
        bg-[rgba(var(--v-theme-primary),1)] unocss
      </div>
      <div class="bg-[rgb(var(--v-theme-primary))]">
        bg-[rgb(var(--v-theme-primary))] unocss ❌
      </div>
      <div class="bg-primary-darken-1">
        bg-primary-darken-1 vuetify with color
      </div>
      <div class="bg-primary-darken">
        bg-primary-darken unocss
      </div>
      <div class="_bg-primary-darken">
        _bg-primary-darken unocss
      </div>
      <div class="bg-primary-lighten-1">
        bg-primary-lighten-1 vuetify with color
      </div>
      <div class="bg-primary-lighten">
        bg-primary-lighten unocss
      </div>
      <div class="_bg-primary-lighten">
        _bg-primary-lighten unocss
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { useLocale } from 'vuetify';
// https://github.com/vuetifyjs/nuxt-module/issues/324

definePageMeta({
  name: 'Paging Bar and Dark Mode',
});

const sizes = [10, 20, 30, 40, 50];
const page = shallowRef(1);
const size = shallowRef(20);
const totalData = 211;
const totalPage = computed(() => Math.floor((totalData - 1) / size.value) + 1);

const density = shallowRef<undefined>();
const visible = shallowRef<undefined>();

// const locale = useLocale();
// console.log('locale', locale);
function onPageChange(pg: number, sz: number) {
  console.log('onPageChange', pg, sz);
  page.value = pg;
  size.value = sz;
}
</script>
