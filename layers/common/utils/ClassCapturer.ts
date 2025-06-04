import { PriorityHook, type PriorityHookType } from './ClassPriorityHook';

export type OnErrorCapturedHook = Parameters<typeof onErrorCaptured>[0];
export type OnNoticeCapturedHook<T extends I18nNotice = I18nNotice> = (notice: T) => MayPromise<boolean | undefined>;

/**
 * non-empty array or undefined
 */
export function thrownToNotices<T extends I18nNotice = I18nNotice>(err: unknown): T[] | undefined {
  let notices: T[] | undefined;
  if (err instanceof ApiResultError) {
    if (err.errorResult) {
      notices = err.errorResult.errors as T[];
    }
    else if (err.falseResult) {
      const fr = err.falseResult;
      notices = [{
        type: TypeApiFalse,
        message: fr.message,
        i18nCode: fr.i18nCode ?? fr.code,
        i18nArgs: fr.i18nArgs,
      }] as T[];
    }
  }
  else if (err instanceof NoticeThrown) {
    notices = err.notices as T[];
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
  hookCatch = (err: unknown): void => void this.hookError(err, null, 'unhandled');
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

  hookCatch = (err: unknown): void => void this.hookError(err, null, 'unhandled');
}
