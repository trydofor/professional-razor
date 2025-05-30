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
    <VCard v-bind="props" :title="title" />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'App Notify Toast/Alert/Modal',
});

const title = 'card title good';
const props = { title: 'card title bad', text: `card title should be '${title}', see https://v3-migration.vuejs.org/breaking-changes/v-bind` };

let toastCount = 0;
function onToastEmit(level?: GlobalNotifyLevelType) {
  if (level == null) {
    appToastNotify.eventBus.emit({
      location: 'center',
      message: `message-${++toastCount} emit from appToastNotify.eventBus`,
    });
    appToastNotify.eventBus.emit({
      location: 'center',
      notifyLevel: GlobalNotifyLevel.Success,
      message: `message-${++toastCount} emit from appToastNotify.eventBus`,
    });
    appToastNotify.eventBus.emit({
      location: 'center',
      notifyLevel: GlobalNotifyLevel.Warning,
      message: `message-${++toastCount} emit from appToastNotify.eventBus`,
    });
  }
  else {
    appToastNotify.eventBus.emit({
      message: `message-${++toastCount} emit from appToastNotify.eventBus`,
      notifyLevel: level,
    });
    if (level === GlobalNotifyLevel.Message) {
      appToastNotify.eventBus.emit(`message-${++toastCount} emit from appToastNotify.eventBus`);
    }
  }
}

let alertCount = 0;
function onAlertEmit() {
  appAlertNotify.eventBus.emit(`message-${++alertCount} emit from appAlertNotify.eventBus`);
  appAlertNotify.eventBus.emit({ message: `message-${++alertCount} emit from appAlertNotify.eventBus`, notifyLevel: GlobalNotifyLevel.Message });
  appAlertNotify.eventBus.emit({ message: `message-${++alertCount} emit from appAlertNotify.eventBus`, notifyLevel: GlobalNotifyLevel.Success });
  appAlertNotify.eventBus.emit({ message: `message-${++alertCount} emit from appAlertNotify.eventBus`, notifyLevel: GlobalNotifyLevel.Warning });
}

function onToastThrow() {
  if (toastCount % 2 === 0) {
    throw appToastNotify.newThrown(`message-${++toastCount} by NotifyThrow A`);
  }
  else {
    throw appToastNotify.newThrown({ message: `message-${++toastCount} by NotifyThrow B`, notifyLevel: GlobalNotifyLevel.Message });
  }
}
function onAlertThrow() {
  if (alertCount % 2 === 0) {
    throw appAlertNotify.newThrown(`message-${++alertCount} by NotifyThrow A`);
  }
  else {
    throw appAlertNotify.newThrown({ message: `message-${++alertCount} by NotifyThrow B`, notifyLevel: GlobalNotifyLevel.Message });
  }
}

function onShowLoading() {
  globalLoadingStatus.value = true;
  setTimeout(() => {
    globalLoadingStatus.value = false;
  }, 5000);
}
</script>
