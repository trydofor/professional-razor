<template>
  <AppThrownCapturer>
    <VApp>
      <VNavigationDrawer :rail="rail" permanent>
        <VList :elevation="elevation" density="compact">
          <VListItem
            class="text-primary"
            title="Razor Desktop"
            @click="rail = !rail"
          >
            <template #prepend>
              <VAvatar tile size="24">
                <VImg :src="storm1" />
              </VAvatar>
            </template>
          </VListItem>
          <VListGroup>
            <template #activator="{ props }">
              <VListItem
                v-bind="props"
                prepend-icon="i-mdi:lightning-bolt-circle"
                title="Navigation"
              />
            </template>
            <VListItem
              title="Home"
              value="home"
              @click="router.push('/')"
            />
            <VListItem
              title="Back"
              value="back"
              class="text-primary"
              @click="router.back()"
            />
          </VListGroup>
          <VListGroup>
            <template #activator="{ props }">
              <VListItem
                v-bind="props"
                prepend-icon="i-mdi:routes"
                title="Routes"
              />
            </template>
            <VListItem
              v-for="rt in pageRoutes"
              :key="rt.path"
              :title="`${index(rt.path)}-${String(rt.name)}`"
              :click="rt.path"
            />
          </VListGroup>
        </VList>
      </VNavigationDrawer>
      <VAppBar
        :title="route.path == '/' ? '00' : route.path.slice(1, 3)"
        :elevation="elevation"
        density="compact"
      >
        <VProgressLinear
          :active="globalLoadingStatus"
          indeterminate
          color="deep-purple-accent-4"
          location="bottom"
          absolute
        />
      </VAppBar>
      <VMain>
        <VContainer>
          <slot />
        </VContainer>
      </VMain>
    </VApp>
  </AppThrownCapturer>
</template>

<script setup lang="ts">
import storm1 from '#layers/spa/assets/img/1x/storm.jpg';

const router = useRouter();
const route = useRoute();
const rail = ref(true);
const elevation = 2;

const pageRoutes = router.getRoutes().filter(it => it.path !== '/').sort((a, b) => a.path.localeCompare(b.path));
function index(path: string) {
  return path.length > 3 ? path.slice(1, 3) : '00';
}
</script>
