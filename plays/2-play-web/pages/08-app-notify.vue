<template>
  <div class="mt-2 flex flex-col gap-2">
    <VBtn @click="onToastEmit(GlobalNotifyLevel.Message)">
      Emit 2 Toast Message
    </VBtn>
    <VBtn @click="onToastEmit(GlobalNotifyLevel.Success)">
      Emit Toast Success
    </VBtn>
    <VBtn @click="onToastEmit(GlobalNotifyLevel.Warning)">
      Emit Toast Warning
    </VBtn>
    <VBtn @click="onToastEmit()">
      Emit 3 Toast Center
    </VBtn>
    <VBtn @click="onAlertEmit()">
      Emit 4 Notice
    </VBtn>
    <VBtn @click="onToastThrow()">
      Throw a Toast
    </VBtn>
    <VBtn @click="onAlertThrow()">
      Throw 1 Notice
    </VBtn>
    <VBtn @click="onShowLoading()">
      Loading Bar 5s
    </VBtn>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'App Notify Toast/Alert/Modal',
});

let toastCount = 0;
function onToastEmit(level?: GlobalNotifyLevelType) {
  if (level == null) {
    appToastEventBus.emit({
      location: 'center',
      message: `message-${++toastCount} emit from appToastEventBus`,
    });
    appToastEventBus.emit({
      location: 'center',
      notifyLevel: GlobalNotifyLevel.Success,
      message: `message-${++toastCount} emit from appToastEventBus`,
    });
    appToastEventBus.emit({
      location: 'center',
      notifyLevel: GlobalNotifyLevel.Warning,
      message: `message-${++toastCount} emit from appToastEventBus`,
    });
  }
  else {
    appToastEventBus.emit({
      message: `message-${++toastCount} emit from appToastEventBus`,
      notifyLevel: level,
    });
    if (level === GlobalNotifyLevel.Message) {
      appToastEventBus.emit(`message-${++toastCount} emit from appToastEventBus`);
    }
  }
}

let alertCount = 0;
function onAlertEmit() {
  appAlertEventBus.emit(`message-${++alertCount} emit from appAlertEventBus`);
  appAlertEventBus.emit({ message: `message-${++alertCount} emit from appAlertEventBus`, notifyLevel: GlobalNotifyLevel.Message });
  appAlertEventBus.emit({ message: `message-${++alertCount} emit from appAlertEventBus`, notifyLevel: GlobalNotifyLevel.Success });
  appAlertEventBus.emit({ message: `message-${++alertCount} emit from appAlertEventBus`, notifyLevel: GlobalNotifyLevel.Warning });
}

function onToastThrow() {
  if (toastCount % 2 === 0) {
    throw newAppToastThrown(`message-${++toastCount} by NotifyThrow A`);
  }
  else {
    throw newAppToastThrown({ message: `message-${++toastCount} by NotifyThrow B`, notifyLevel: GlobalNotifyLevel.Message });
  }
}
function onAlertThrow() {
  if (alertCount % 2 === 0) {
    throw newAppAlertThrown(`message-${++alertCount} by NotifyThrow A`);
  }
  else {
    throw newAppAlertThrown({ message: `message-${++alertCount} by NotifyThrow B`, notifyLevel: GlobalNotifyLevel.Message });
  }
}

function onShowLoading() {
  globalLoadingStatus.value = true;
  setTimeout(() => {
    globalLoadingStatus.value = false;
  }, 5000);
}
</script>
