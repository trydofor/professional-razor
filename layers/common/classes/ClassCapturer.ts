import { PriorityHook, type PriorityHookType } from './ClassPriorityHook';

export type OnErrorCapturedHook = Parameters<typeof onErrorCaptured>[0];
export type OnNoticeCapturedHook = (notice: I18nNotice) => MayPromise<boolean | undefined>;

/**
 * non-empty array or undefined
 */
export function thrownToNotices(err: unknown): I18nNotice[] | undefined {
  let notices: I18nNotice[] | undefined;
  if (isApiResultError(err)) {
    if (err.errorResult) {
      notices = err.errorResult.errors;
    }
    else if (err.falseResult) {
      const fr = err.falseResult;
      notices = [{
        type: TypeApiFalse,
        message: fr.message,
        i18nCode: fr.i18nCode ?? fr.code,
        i18nArgs: fr.i18nArgs,
      }];
    }
  }
  else if (isNoticeThrown(err)) {
    notices = err.notices;
  }
  return notices && notices.length > 0 ? notices : undefined;
}

export function captureNoticelikeThrown(capturer: NoticeCapturer): OnErrorCapturedHook {
  return (err: unknown) => {
    const notices = thrownToNotices(err);

    if (notices) {
      for (const notice of notices) {
        const rt = capturer.call(notice);
        if (rt != null) return rt;
      }
    }
  };
}

/**
 * Capture Notices
 * - converted by Thrown, e.g. ApiResultError, NoticeThrown
 * - Notice instance
 */
export class NoticeCapturer extends PriorityHook<OnNoticeCapturedHook> {
  constructor(inits: PriorityHookType<OnNoticeCapturedHook>[] = []) {
    super(inits);
    this._scope = onScopeDispose;
  }

  hookError = captureNoticelikeThrown(this);
  hookCatch: ((err: unknown) => void) = this.hookError as SafeAny;
}

/**
 * Capture Thrown/Error
 */
export class ThrownCapturer extends PriorityHook<OnErrorCapturedHook> {
  constructor(inits: PriorityHookType<OnErrorCapturedHook>[] = []) {
    super(inits);
    this._scope = onScopeDispose;
  }

  hookError: OnErrorCapturedHook = (err, vm, info) => {
    return this.call(err, vm, info);
  };

  hookCatch: ((err: unknown) => void) = this.hookError as SafeAny;
}
