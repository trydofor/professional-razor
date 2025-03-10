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
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'Ion Input validate',
});

const firstNameModel = ref('');
const firstNameRefer = useTemplateRef('firstNameRefer');
const firstNameCheck = useIonInputChecker({ el: firstNameRefer, check: /^[\x20-\x7E]{3,}$/, model: firstNameModel });
const onFirstNameCheck = useIonInputChecker({ el: firstNameRefer, check: /^[\x20-\x7E]{5,}$/, model: firstNameModel });
</script>
