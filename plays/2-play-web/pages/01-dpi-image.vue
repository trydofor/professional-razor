<template>
  <div class="flex flex-col gap-2">
    <div class="bg-gray-200 p-2">
      💎 in Chrome Develop, toggle Device Toolbar, set DPR to [1,2,3],
      the 'DipImg' never change size, keep the same as 'Img 1x'
    </div>
    <div>
      <div>DipImg</div>
      <DpiImg alt="storm" :srcset="[storm1, storm2, storm3, storm4]" />
    </div>
    <div>
      <div>Img 1x</div>
      <img alt="storm1" :src="storm1">
    </div>
    <div>
      <div>Img 2x</div>
      <img alt="storm2" :src="storm2">
    </div>
    <div>
      <div>Img 3x</div>
      <img alt="storm3" :src="storm3">
    </div>
    <div>
      <div>Img 4x</div>
      <img alt="storm4" :src="storm4">
    </div>
  </div>
</template>

<script lang="ts" setup>
import storm1 from '#layers/spa/assets/img/1x/storm.jpg';
import storm2 from '#layers/spa/assets/img/2x/storm.jpg';
import storm3 from '#layers/spa/assets/img/3x/storm.jpg';
import storm4 from '#layers/spa/assets/img/4x/storm.jpg';

definePageMeta({
  name: 'Diff between Img and DpiImg',
});
</script>
