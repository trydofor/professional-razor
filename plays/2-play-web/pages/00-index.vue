<template>
  <div>
    <div v-for="route in pageRoutes" :key="route.path" class="py-1 w-full hover:bg-indigo-100">
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

const pageRoutes = useRouter().getRoutes();

function index(path: string) {
  return path.length > 3 ? path.substring(1, 3) : '00';
}
</script>
