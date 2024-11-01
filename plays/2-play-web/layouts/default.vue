<template>
  <div>
    <div class="flex flex-col gap-1 fixed top-0 left-0 bg-gray-200 p-1">
      <div class="i-mdi:home-circle size-6 hover:text-indigo" @click="router.push('/')" />
      <div class="i-mdi:arrow-back-circle size-6 hover:text-indigo" @click="router.back()" />
      <div class="rounded-full bg-black text-white size-6 text-4 flex items-center justify-center">
        {{ route.path == '/' ? '00' : route.path.substring(1, 3) }}
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
