<template>
  <Teleport to="body">
    <div
      v-if="runModeStyle"
      :style="runModeStyle"
      :title="runModeTitle"
      @click="hideTemporarily"
    />
  </Teleport>
</template>

<script lang="ts" setup>
type PropsRunModeType = string | RunModeType | (() => MayPromise<string | RunModeType>);

const props = defineProps<{
  runMode?: PropsRunModeType;
  barSide?: 'top' | 'bottom' | 'left' | 'right';
  barSize?: number;
  barHide?: number;
  apiUri?: string;
}>();

const runModeStyle = shallowRef<Record<string, string> | null>(null);
const runModeTitle = shallowRef('');

async function init() {
  let runModeProduce = props.runMode;
  if (runModeProduce == null) {
    const prefix = useRuntimeConfig().public.apiRoute;
    const apiUri = prefix + (props.apiUri ?? '/test/envs/run-mode.json');
    runModeProduce = () => $fetch<string>(apiUri, { method: 'post', responseType: 'text' });
  }

  let runMode: string | null;
  if (typeof runModeProduce === 'function') {
    try {
      runMode = await runModeProduce();
    }
    catch (err) {
      logger.error('failed to load runmode api, use build mode by env', err);
      runMode = envRunMode;
    }
  }
  else {
    runMode = runModeProduce;
  }

  runMode = guessRunMode(runMode);

  let bgColor = '';
  if (runMode === RunMode.Develop) {
    bgColor = '#3b82f6'; // bg-blue-500
  }
  else if (runMode === RunMode.Test) {
    bgColor = '#22c55e'; // bg-green-500
  }
  else if (runMode === RunMode.Local) {
    bgColor = '#f97316'; // bg-orange-500
  }

  if (!bgColor) return;
  runModeTitle.value = `run-mode is ${runMode}`;

  const baseStyle = {
    position: 'fixed',
    zIndex: '99999',
    backgroundColor: bgColor,
    pointerEvents: 'auto',
    display: 'block',
  };

  const size = (props.barSize ?? '2') + 'px';
  switch (props.barSide) {
    case 'bottom':
      Object.assign(baseStyle, { height: size, width: '100vw', bottom: '0', left: '0' });
      break;
    case 'left':
      Object.assign(baseStyle, { width: size, height: '100vh', top: '0', left: '0' });
      break;
    case 'right':
      Object.assign(baseStyle, { width: size, height: '100vh', top: '0', right: '0' });
      break;
    case 'top':
    default:
      Object.assign(baseStyle, { height: size, width: '100vw', top: '0', left: '0' });
      break;
  }

  runModeStyle.value = baseStyle;
}

function hideTemporarily() {
  const baseStyle = runModeStyle.value;
  const hidden = Math.max(props.barHide ?? 10, 0);
  runModeStyle.value = { ...baseStyle, display: 'none' };

  try {
    alert(`hide ${hidden}s, ${runModeTitle.value}`);
  }
  catch (err) {
    logger.error('failed to show alert', err);
  }
  //
  setTimeout(() => runModeStyle.value = baseStyle, hidden * 1000);
}

onMounted(init);
</script>
