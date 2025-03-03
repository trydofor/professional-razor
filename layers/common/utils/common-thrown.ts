/**
 * default ignore thrown instance
 */
export const Ignored = newIgnoredThrown('ignored this thrown');

/**
 * global notice capturer used by globalThrownCapturer.
 */
export const globalNoticeCapturer = newNoticeCapturer();

export const captureIgnoredThrown: Parameters<typeof onErrorCaptured>[0] = (err: SafeAny) => {
  if (isIgnoredThrown(err) || err?.name === 'IgnoredThrown') return false;
};

export const captureSystemError: Parameters<typeof onErrorCaptured>[0] = (err: SafeAny) => {
  if (isSystemError(err)) {
    globalNoticeCapturer.call({
      message: err.message,
      i18nCode: 'error.system.message1',
      i18nArgs: [err.message],
    });
    return true; // bubble up to sentry
  }
};

/**
 * should use on app top vue component, e.g. App.vue or Layout.vue.
 * `onErrorCaptured(globalThrownCapturer.call)` to handle thrown first.
 */
export const globalThrownCapturer = newThrownCapturer([
  {
    id: 'IgnoredThrownHook',
    order: 1000,
    hook: captureIgnoredThrown,
  },
  {
    id: 'I18nNoticeHook',
    order: 2000,
    hook: globalNoticeCapturer.hookError,
  },
  {
    id: 'noticeSystemError',
    order: 2010,
    hook: captureSystemError,
  },
],
);
