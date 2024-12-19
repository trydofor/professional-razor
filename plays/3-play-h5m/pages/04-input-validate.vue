<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>Input Validate</IonTitle>
        <IonButtons slot="end">
          <IonMenuButton />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div class="bg-gray-200 p-4">
        Auto validate on input/blur, 3+ ascii is ok.
        but Manually validate 5+ ascii.
      </div>
      <div class="p-4">
        <IonInput
          ref="inputFirstNameRef"
          v-model="inputFirstName"
          label="First Name"
          label-placement="floating"
          fill="outline"
          clear-input
          placeholder="Enter text"
          error-text="invalid first name"
          @ion-blur="checkFirstName"
          @ion-input="checkFirstName"
        />
      </div>
      <div class="p-4">
        <IonButton class="text-white" @click="checkFirstNameManual">
          Validate Manually
        </IonButton>
      </div>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'Ion Input validate',
});

const inputFirstName = ref('');
const inputFirstNameRef = useTemplateRef('inputFirstNameRef');
const checkFirstName = ionicValidateInput(inputFirstNameRef, /^[\x20-\x7E]{3,}$/, inputFirstName);
const checkFirstNameManual = ionicValidateInput(inputFirstNameRef, /^[\x20-\x7E]{5,}$/, inputFirstName);
</script>
