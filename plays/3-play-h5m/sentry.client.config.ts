import * as Sentry from '@sentry/nuxt';

Sentry.init({
  debug: true,
  // If set up, you can use the Nuxt runtime config here
  // dsn: useRuntimeConfig().public.sentry.dsn, // modify, depending on your custom runtime config
  dsn: 'https://02f272b04b41f2a343cdcbdc7ceb4f9e@o1149103.ingest.us.sentry.io/4508799291228160',

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    const error = hint.originalException as Error;
    if (typeof error?.name === 'string' && error.name.endsWith('Thrown')) {
      console.debug('ignore Thrown=' + error?.name);
      return null;
    }
    if (typeof error?.message === 'string' && error.name.startsWith('ignore')) {
      console.debug('ignore message=' + error?.message);
      return null;
    }
    return event;
  },
});
