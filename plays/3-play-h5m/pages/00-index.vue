<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <div class="flex flex-row gap-2 items-center">
          <DpiImg :srcset="[storm1, storm2, storm3, storm4]" alt="movingkite logo" class="p-2" />
          <div>Index</div>
        </div>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div v-for="rt in pageRoutes" :key="rt.path">
        <IonButton fill="clear" :router-link="rt.path">
          {{ index(rt.path) }} - {{ rt.name }}
        </IonButton>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import storm1 from '&spa/assets/img/1x/storm.jpg';
import storm2 from '&spa/assets/img/2x/storm.jpg';
import storm3 from '&spa/assets/img/3x/storm.jpg';
import storm4 from '&spa/assets/img/4x/storm.jpg';

definePageMeta({
  alias: '/',
  name: 'Index',
});
const pageRoutes = useRouter().getRoutes().filter(it => it.path !== '/');

function index(path: string) {
  return path.length > 3 ? path.substring(1, 3) : '00';
}
</script>
