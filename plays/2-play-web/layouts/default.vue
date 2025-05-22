<template>
  <VResponsive class="border rounded">
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
            <VListItem class="dense-item" density="compact">
              <VListItemTitle>
                Other
              </VListItemTitle>
            </VListItem>
          </VListGroup>
        </VList>
      </VNavigationDrawer>
      <VAppBar
        :title="route.path == '/' ? '00' : route.path.slice(1, 3)"
        :elevation="elevation"
        density="compact"
      />
      <VMain>
        <VContainer>
          <slot />
        </VContainer>
      </VMain>
    </VApp>
  </VResponsive>
</template>

<script setup lang="ts">
import storm1 from '#layers/spa/assets/img/1x/storm.jpg';

const router = useRouter();
const route = useRoute();
const rail = ref(true);
const elevation = 2;
</script>
