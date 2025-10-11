<template>
  <VContainer class="py-6" max-width="640">
    <VCard class="pa-6 d-flex flex-column gap-6">
      <div class="d-flex flex-column gap-2">
        <span class="text-h6 font-weight-medium">Download Demo</span>
        <VTextField
          v-model="downloadName"
          :disabled="loading"
          label="Filename"
          variant="outlined"
          placeholder="demo-report.txt"
          hint="Enter the file name to request from the API"
          persistent-hint
          clearable
        />
      </div>
      <div class="d-flex flex-wrap ga-4">
        <VBtn
          color="error"
          variant="flat"
          :loading="loading"
          :disabled="loading"
          @click="onDownloadError"
        >
          Download Error
        </VBtn>
        <VBtn
          color="success"
          variant="flat"
          :loading="loading"
          :disabled="loading"
          @click="onDownloadSave"
        >
          Download Save
        </VBtn>
      </div>
      <VAlert
        v-if="output"
        type="info"
        density="compact"
        variant="tonal"
      >
        {{ output }}
      </VAlert>
    </VCard>
  </VContainer>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'Download Demo',
});

const apiRoute = useApiRouteFetcher();
const loading = shallowRef(false);
const output = shallowRef('');
const downloadName = shallowRef('demo-report.txt');

async function onDownloadError() {
  output.value = '';
  const downloadError = apiRoute.get('/download');
  await fetchTypedResult(downloadError, loading);
  output.value = 'should not show this';
}

async function onDownloadSave() {
  output.value = '';
  const fetchFileResultSuccess = apiRoute.req('/download', {
    method: 'get',
    query: { f: downloadName.value },
    responseType: 'blob',
  });
  const download = await fetchFileResult(fetchFileResultSuccess, loading);
  saveBlobFile(download);
  output.value = 'should show download dialog to save file';
}
</script>
