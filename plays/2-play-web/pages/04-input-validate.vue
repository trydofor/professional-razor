<template>
  <div>
    <div class="bg-gray-200 p-4">
      Auto validate on input/blur, 3+ ascii is ok.
      but Manually validate, need 5+ ascii.
    </div>
    <div class="p-4">
      <VTextField
        v-model="firstNameModel"
        label="First Name"
        :rules="[firstNameCheck]"
        clearable
        placeholder="Enter text"
        :error-messages="firstNameError"
      />
    </div>
    <div class="p-4">
      <VBtn @click="onFirstNameCheck">
        Validate Manually
      </VBtn>
    </div>
  </div>
</template>

<script lang="ts" setup>
const metaName = 'Input validate';
definePageMeta({ name: metaName });

const firstNameModel = shallowRef('');
const firstNameError = shallowRef('');
const firstNameCheck = useInputChecker({ check: /^[\x20-\x7E]{3,}$/, model: firstNameModel, output: firstNameError });
const onFirstNameCheck = useInputChecker({ check: /^[\x20-\x7E]{5,}$/, model: firstNameModel, output: firstNameError });
</script>
