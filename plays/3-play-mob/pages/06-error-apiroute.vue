<template>
  <AppTab :title="metaName">
    <div class="flex flex-col gap-2">
      <IonButton @click="onErrorResult">
        Fetch Error Result
      </IonButton>
      <IonButton @click="onFalseResult">
        Fetch False Result
      </IonButton>
      <IonButton @click="onFalseLegacy(true)">
        Fetch False Result Legacy code
      </IonButton>
      <IonButton @click="onFalseLegacy(false)">
        Fetch False Result Legacy message
      </IonButton>
      <IonButton @click="onStatus401">
        Fetch Status 401, ignoreResponseError
      </IonButton>
      <IonButton @click="onStatus403">
        Fetch Status 403, Notice
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
      <IonButton @click="onNavigateThrown">
        Navigate Thrown to Home
      </IonButton>
      <IonButton color="success" @click="onClean">
        Clean
      </IonButton>
    </div>
    <div class="p-4">
      <div>open devtools check console and network to see sentry error</div>
      <div class="text-green h-8">
        {{ eventText }}
      </div>
      <div class="text-red h-8">
        {{ errorText }}
      </div>
      <div class="text-red h-8">
        {{ shouldNot }}
      </div>
    </div>
  </AppTab>
</template>

<script lang="ts" setup>
const metaName = 'ApiRoute Error Handling';
definePageMeta({ name: metaName });

const errorText = ref('');
const eventText = ref('');
const shouldNot = ref('');
const apiRoute = useApiRouteFetcher();

apiResponseEventBus.on((evt) => {
  eventText.value = `EVENT: session=${evt.session} status=${evt.status} @` + new Date().getMilliseconds();
});

const thrownCaptured = useThrownCapturer(false, true);
thrownCaptured.put({ id: 'component-error-logger', order: 200, hook: (err) => {
  errorText.value = 'check sentry via network and console: ' + JSON.stringify(err) + ' @' + new Date().getMilliseconds();
  logger.info('200.component-error-logger', err);
} });

// https://vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured
// onErrorCaptured(thrownCaptured.hookError);
// (1) useThrownCapturer(false, true); or
// (2) onErrorCaptured(thrownCaptured.hookError);

globalThrownCapturer.put({ id: 'before-sentry-error', order: 300, hook: (err) => {
  logger.info('300.before-sentry-error', err);
} }, onScopeDispose);

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
  const apiResult = await fetchTypedResult(fetchError);
  logger.error('should not be here, thrown before this', apiResult);
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
  const apiResult = await fetchTypedResult(fetchError);

  logger.error('should not be here, thrown before this', apiResult);
  shouldNot.value = 'should not be here: FalseResult';
}

async function onFalseLegacy(cd = false) {
  onClean();
  const body = {
    success: false,
    message: 'xxxx must not be empty',
    code: cd ? 'error.assert.notEmpty' : undefined,
  } as DataResult;

  const fetchError = apiRoute.post('/echo', { body });
  const apiResult = await fetchTypedResult(fetchError);

  logger.error('should not be here, thrown before this', apiResult);
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
  } as SafeAny;

  if (!success) {
    body.errors = [{
      message: 'session header false',
    }];
  }

  const fetchError = apiRoute.post('/echo', { header, body });
  const apiResult = await fetchTypedResult(fetchError);
  logger.info('api result', apiResult);
  shouldNot.value = success ? '' : 'should not show this';
}

async function onStatus401() {
  onClean();
  const body = {
    success: false,
  } as DataResult;

  const fetchError = apiRoute.post('/echo', { status: 401, body }, { ignoreResponseError: true });
  const apiResult = await fetchTypedResult(fetchError);

  logger.error('should not be here, thrown before this', apiResult);
  shouldNot.value = 'should not be here: Status401';
}

async function onStatus403() {
  onClean();
  const body = {
    success: false,
  } as DataResult;

  const fetchError = apiRoute.post('/echo', { status: 403, body });
  const apiResult = await fetchTypedResult(fetchError);

  logger.error('should not be here, thrown before this', apiResult);
  shouldNot.value = 'should not be here: Status401';
}

async function onIgnoredThrown() {
  throw new IgnoredThrown('Ignored Thrown');
}

async function onNavigateThrown() {
  throw new NavigateThrown({ path: '/' });
}
</script>
