<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>Error Handling</IonTitle>
        <IonButtons slot="end">
          <IonMenuButton />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div class="flex flex-col gap-2">
        <IonButton @click="onErrorResult">
          Fetch Error Result
        </IonButton>
        <IonButton @click="onFalseResult">
          Fetch False Result
        </IonButton>
        <IonButton @click="onStatus401">
          Fetch Status 401
        </IonButton>
        <IonButton @click="onHeaderSession(true)">
          Fetch Session Success
        </IonButton>
        <IonButton @click="onHeaderSession(false)">
          Fetch Session Failure
        </IonButton>
        <IonButton @click="onIgnoredThrown">
          Ignored Thrown
        </IonButton>
        <IonButton color="success" @click="onClean">
          Clean
        </IonButton>
      </div>
      <div class="p-4">
        <div>open devtools check console and network to see sentry error</div>
        <div class="h-8 text-green">
          {{ eventText }}
        </div>
        <div class="h-8 text-red">
          {{ errorText }}
        </div>
        <div class="h-8 text-red">
          {{ shouldNot }}
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'ApiRoute Error Handling',
});

const errorText = ref('');
const eventText = ref('');
const shouldNot = ref('');
const apiRoute = useApiRoute();

apiResponseEventBus.on((evt) => {
  eventText.value = 'EVENT: session=' + evt.session + '@' + new Date().getMilliseconds();
});

const thrownCaptured = useThrownCaptured();
thrownCaptured.putThrownHook('200.component-error-logger', (err, ins, info) => {
  errorText.value = 'check sentry via network and console: ' + JSON.stringify(err) + ' @' + new Date().getMilliseconds();
  console.log('200.component-error-logger', err, ins, info);
});

// https://vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured
onErrorCaptured(thrownCaptured.callThrownHook);

const { $thrownCaptured } = useNuxtApp();
$thrownCaptured.putThrownHook('300.before-sentry-error', (err, ins, info) => {
  console.log('300.before-sentry-error', err, ins, info);
});
$thrownCaptured.sortThrownHook();

function onClean() {
  errorText.value = '';
  eventText.value = '';
  shouldNot.value = '';
}

async function onErrorResult() {
  onClean();
  const body = {
    success: false,
    errors: [
      {
        message: 'name must not be empty',
        i18nCode: 'error.assert.notEmpty1',
        i18nArgs: ['name'],
        type: 'IllegalArgument',
        target: 'name',
      },
    ],
  } as ErrorResult;

  const fetchError = apiRoute.post('/echo', { body });
  const apiResult = await ionicFetchResult(fetchError);
  console.log('should not be here, thrown before this', apiResult);
  shouldNot.value = 'should not be here: ErrorResult';
}

async function onFalseResult() {
  onClean();
  const body = {
    success: false,
    message: 'email must not be empty',
    i18nCode: 'error.assert.notEmpty1',
    i18nArgs: ['email'],
  } as DataResult;

  const fetchError = apiRoute.post('/echo', { body });
  const apiResult = await ionicFetchResult(fetchError);

  console.log('should not be here, thrown before this', apiResult);
  shouldNot.value = 'should not be here: FalseResult';
}

async function onHeaderSession(success = true) {
  onClean();
  shouldNot.value = success ? 'should not show this: HeaderSession' : '';
  const header = {
    session: 'session-token',
  };
  const body = {
    success,
  } as DataResult;

  const fetchError = apiRoute.post('/echo', { header, body });
  const apiResult = await ionicFetchResult(fetchError);
  console.log('should be here? =' + success, apiResult);
  shouldNot.value = success ? '' : 'should not show this';
}

async function onStatus401() {
  onClean();
  const body = {
    success: false,
  } as DataResult;

  const fetchError = apiRoute.post('/echo', { status: 401, body });
  const apiResult = await ionicFetchResult(fetchError);

  console.log('should not be here, thrown before this', apiResult);
  shouldNot.value = 'should not be here: Status401';
}

async function onIgnoredThrown() {
  throw new IgnoredThrown('Ignored Thrown');
}
</script>
