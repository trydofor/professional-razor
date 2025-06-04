<template>
  <AppTab :title="metaName">
    <div class="bg-gray-200 p-4">
      Auto validate on input/blur, 3+ ascii is ok.
      but Manually validate, need 5+ ascii.
    </div>
    <div class="p-4">
      <IonInput
        ref="firstNameRefer"
        v-model="firstNameModel"
        label="First Name"
        label-placement="floating"
        fill="outline"
        clear-input
        placeholder="Enter text"
        error-text="invalid first name"
        @ion-blur="firstNameCheck"
        @ion-input="firstNameCheck"
      />
    </div>
    <div class="p-4">
      <IonButton class="text-white" @click="onFirstNameCheck">
        Validate Manually
      </IonButton>
    </div>
  </AppTab>
</template>

<script lang="ts" setup>
const metaName = 'Ion Input validate';
definePageMeta({ name: metaName });

const firstNameModel = shallowRef('');
const firstNameRefer = useTemplateRef('firstNameRefer');
const firstNameCheck = useInputChecker({ el: firstNameRefer, check: /^[\x20-\x7E]{3,}$/, model: firstNameModel });
const onFirstNameCheck = useInputChecker({ el: firstNameRefer, check: /^[\x20-\x7E]{5,}$/, model: firstNameModel });
</script>
