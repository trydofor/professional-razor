<template>
  <div class="p-4">
    <div v-for="route in pageRoutes" :key="route.path" class="p-2 hover:bg-indigo-100">
      <NuxtLink :to="route.path">
        {{ index(route.path) }} - {{ route.name }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  path: '/',
  name: 'Index',
});

const pageRoutes = useRouter().getRoutes().filter(it => it.path !== '/').sort((a, b) => a.path.localeCompare(b.path));

function index(path: string) {
  return path.length > 3 ? path.slice(1, 3) : '00';
}
</script>
