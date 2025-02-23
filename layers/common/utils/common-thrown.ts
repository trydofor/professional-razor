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

export const globalNoticeCaptured = new PriorityHook<(notice: I18nNotice) => MayPromise<boolean | undefined>>();

export const globalThrownCaptured = new PriorityHook<Parameters<typeof onErrorCaptured>[0]>([
  {
    id: 'ignored-thrown-hook',
    order: 100,
    hook: (err: SafeAny) => {
      if (err instanceof IgnoredThrown || err?.name === 'IgnoredThrown') return false;
    },
  },
  {
    id: 'notice-thrown-hook',
    order: 200,
    hook: (err: SafeAny) => {
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

      if (notices && notices.length > 0) {
        for (const notice of notices) {
          globalNoticeCaptured.emit(notice);
        }
        return false;
      }
    },
  },
],
);
