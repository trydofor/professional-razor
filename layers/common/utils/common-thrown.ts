/**
 * default ignore thrown instance
 */
export const Ignored = new IgnoredThrown('ignored this thrown');

/**
 * global notice capturer used by globalThrownCapturer.
 */
export const globalNoticeCapturer = new NoticeCapturer();

/**
 * non-empty array or undefined
 */
export function thrownToNotices(err: SafeAny): I18nNotice[] | undefined {
  let notices: I18nNotice[] | undefined;
  if (err instanceof ApiResultError) {
    if (err.errorResult) {
      notices = err.errorResult.errors;
    }
    else if (err.falseResult) {
      const fr = err.falseResult;
      notices = [{
        type: TypeApiFalse,
        message: fr.message,
        i18nCode: fr.i18nCode,
        i18nArgs: fr.i18nArgs,
      }];
    }
  }
  else if (err instanceof NoticeThrown) {
    notices = err.notices;
  }
  return notices && notices.length > 0 ? notices : undefined;
}

export const captureIgnoredThrown: Parameters<typeof onErrorCaptured>[0] = (err: SafeAny) => {
  if (err instanceof IgnoredThrown || err?.name === 'IgnoredThrown') return false;
};

export const captureSystemError: Parameters<typeof onErrorCaptured>[0] = (err: SafeAny) => {
  if (err instanceof SystemError) {
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
export const globalThrownCapturer = new ThrownCapturer([
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
