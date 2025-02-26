import type { RouteLocationRaw } from 'vue-router';

export const TypeApiError = 'ApiErrorResult';
export const TypeApiFalse = 'ApiFalseResult';

/**
 * api result with error or false
 *
 * @class ApiResultError
 * @extends {Error}
 */
export class ApiResultError extends Error {
  public falseResult: DataResult | undefined | null;
  public errorResult: ErrorResult | undefined | null;

  constructor(result: ApiResult) {
    if ('errors' in result) {
      super(result.errors.filter(e => e.message).map(e => e.message).join('\n') || TypeApiError);
      this.errorResult = result;
    }
    else {
      super(result.message || TypeApiFalse);
      this.falseResult = result;
    }
    Object.setPrototypeOf(this, ApiResultError.prototype);
  }
}

/**
 * should ignore this thrown
 */
export class IgnoredThrown {
  public name = 'IgnoredThrown';
  constructor(public message: string) {}
}

/**
 * should handle the type and data as big return
 */
export class ReturnThrown {
  public name = 'ReturnThrown';
  constructor(public type: string, public data: SafeAny) {}
}

/**
 * should notice to user in UI
 */
export class NoticeThrown {
  public name = 'NoticeThrown';
  constructor(public notices: I18nNotice[]) {}
}

/**
 * should navigate to the route
 */
export class NavigateThrown {
  public name = 'NavigateThrown';
  constructor(public route: RouteLocationRaw) {}
}

/**
 * default ignore thrown instance
 */
export const Ignored = new IgnoredThrown('ignored this thrown');

export const ThrownCapturer = PriorityHook<Parameters<typeof onErrorCaptured>[0]>;
export const NoticeCapturer = PriorityHook<(notice: I18nNotice) => MayPromise<boolean | undefined>>;

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

export function captureNoticelikeThrown(capturer = globalNoticeCapturer): Parameters<typeof onErrorCaptured>[0] {
  return (err: SafeAny) => {
    const notices = thrownToNotices(err);

    if (notices) {
      for (const notice of notices) {
        capturer.emit(notice);
      }
      return false;
    }
  };
}

export const captureIgnoredThrown: Parameters<typeof onErrorCaptured>[0] = (err: SafeAny) => {
  if (err instanceof IgnoredThrown || err?.name === 'IgnoredThrown') return false;
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
    hook: captureNoticelikeThrown(),
  },
],
);
