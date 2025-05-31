<template>
  <AppTab :title="metaName">
    <div class="flex flex-col gap-4">
      <div class="bg-gray-200 p-4">
        💎 in Chrome Develop, toggle Device Toolbar, set DPR to [1,2,3],
        the 'DipImg' never change size, keep the same as 'Img 1x'
      </div>
      <div>
        <div class="h-8">
          DipImg
        </div>
        <DpiImg alt="storm" :srcset="[storm1, storm2, storm3, storm4]" />
      </div>
      <div>
        Img will change size if DPR change
      </div>
      <div class="flex-row flex gap-4">
        <div>
          <div>1x</div>
          <img alt="storm1" :src="storm1">
        </div>
        <div>
          <div>2x</div>
          <img alt="storm2" :src="storm2">
        </div>
        <div>
          <div>3x</div>
          <img alt="storm3" :src="storm3">
        </div>
        <div>
          <div>4x</div>
          <img alt="storm4" :src="storm4">
        </div>
      </div>
      <div>
        Svg, imported as component
      </div>
      <div class="flex-row flex items-center gap-4">
        <div>
          <div>color</div>
          <SvgDota class="text-red text-20" />
        </div>
        <div class="bg-red">
          <div>bg</div>
          <SvgDota class="text-white text-20" />
        </div>
        <div>
          <div>cut 4rem</div>
          <div class="overflow-hidden size-16 bg-red">
            <SvgDota class="text-white -ml-2 -mt-2 text-20" />
          </div>
        </div>
      </div>
    </div>
  </AppTab>
</template>

<script lang="ts" setup>
import storm1 from '#layers/spa/assets/img/1x/storm.jpg';
import storm2 from '#layers/spa/assets/img/2x/storm.jpg';
import storm3 from '#layers/spa/assets/img/3x/storm.jpg';
import storm4 from '#layers/spa/assets/img/4x/storm.jpg';
import SvgDota from '#layers/spa/assets/svg/dota.svg';

const metaName = 'DpiImg, Img, Svg';
definePageMeta({ name: metaName });
</script>
