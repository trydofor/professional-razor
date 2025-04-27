<template>
  <div>
    <div class="fixed left-0 top-0 flex flex-col gap-1 bg-gray-200 p-1">
      <div class="i-mdi:home-circle size-6 hover:text-indigo" @click="router.push('/')" />
      <div class="i-mdi:arrow-back-circle size-6 hover:text-indigo" @click="router.back()" />
      <div class="size-6 flex items-center justify-center rounded-full bg-black text-4 text-white">
        {{ route.path == '/' ? '00' : route.path.slice(1, 3) }}
      </div>
    </div>
    <div class="pl-8">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();
</script>
