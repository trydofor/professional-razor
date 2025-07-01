<template>
  <AppTab :title="metaName">
    <div class="m-6 bg-gray-200">
      <RunModeBar />
      <RunModeBar run-mode="test" bar-side="left" />
      <RunModeBar :run-mode="apiRunMode" bar-side="bottom" />
      <RunModeBar run-mode="local" bar-side="right" />
      <pre class="p-4">
      develop-bar at top by default
      test-bar at left
      dev-bar at bottom by api
      local-bar at right

      click to hide 10s
    </pre>
    </div>
  </AppTab>
</template>

<script lang="ts" setup>
const metaName = 'App Run Mode';
definePageMeta({ name: metaName });

function apiRunMode() {
  return '<R><success>true</success><data>Develop</data></R>';
}
</script>
