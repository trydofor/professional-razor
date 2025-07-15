<template>
  <AppTab>
    <template #title>
      <div class="flex-row flex gap-2 items-center">
        <DpiImg :srcset="[storm1, storm2, storm3, storm4]" alt="movingkite logo" class="p-2" />
        <div>Index</div>
      </div>
    </template>
    <div class="p-4 flex flex-col items-start">
      <IonButton
        v-for="rt in pageRoutes"
        :key="rt.path"
        fill="clear"
        :router-link="rt.path"
      >
        {{ index(rt.path) }} - {{ rt.name }}
      </IonButton>
    </div>
  </AppTab>
</template>

<script setup lang="ts">
import storm1 from '#layers/spa/assets/img/1x/storm.jpg';
import storm2 from '#layers/spa/assets/img/2x/storm.jpg';
import storm3 from '#layers/spa/assets/img/3x/storm.jpg';
import storm4 from '#layers/spa/assets/img/4x/storm.jpg';

definePageMeta({
  path: '/',
  name: 'Index',
});
const pageRoutes = useRouter().getRoutes().filter(it => it.path !== '/').sort((a, b) => a.path.localeCompare(b.path));

function index(path: string) {
  return path.length > 3 ? path.slice(1, 3) : '00';
}
</script>
