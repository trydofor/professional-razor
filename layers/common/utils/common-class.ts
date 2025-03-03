// https://github.com/nuxt/nuxt/issues/26516

import type { RouteLocationRaw } from 'vue-router';
import { IgnoredThrown, NavigateThrown, DataThrown, NoticeThrown } from '../classes/ClassThrown';
import { ApiResultError, SystemError } from '../classes/ClassError';
import { NoticeCapturer, ThrownCapturer } from '../classes/ClassCapturer';

export type { PriorityHookType } from '../classes/ClassPriorityHook';
export { captureNoticelikeThrown, thrownToNotices } from '../classes/ClassCapturer';
export { TypeApiFalse, TypeApiError } from '../classes/ClassError';

export type ClassIgnoredThrown = typeof IgnoredThrown;
export function newIgnoredThrown(message: string) {
  return new IgnoredThrown(message);
}
export function isIgnoredThrown(instance: SafeAny): instance is IgnoredThrown {
  return instance instanceof IgnoredThrown;
}

export type ClassNavigateThrown = typeof NavigateThrown;
export function newNavigateThrown(route: RouteLocationRaw) {
  return new NavigateThrown(route);
};
export function isNavigateThrown(instance: SafeAny): instance is NavigateThrown {
  return instance instanceof NavigateThrown;
}

export type ClassDataThrown = typeof DataThrown;
export function newDataThrown(type: string, data: SafeAny) {
  return new DataThrown(type, data);
};
export function isDataThrown(instance: SafeAny): instance is DataThrown {
  return instance instanceof DataThrown;
}

export type ClassNoticeThrown = typeof NoticeThrown;
export function newNoticeThrown(...notices: I18nNotice[]) {
  return new NoticeThrown(notices);
};
export function isNoticeThrown(instance: SafeAny): instance is NoticeThrown {
  return instance instanceof NoticeThrown;
}

export type ClassApiResultError = typeof ApiResultError;
export function newApiResultError(result: ApiResult) {
  return new ApiResultError(result);
};
export function isApiResultError(instance: SafeAny): instance is ApiResultError {
  return instance instanceof ApiResultError;
}

export type ClassSystemError = typeof SystemError;
export function newSystemError(message: string, attachment?: SafeAny) {
  return new SystemError(message, attachment);
};
export function isSystemError(instance: SafeAny): instance is SystemError {
  return instance instanceof SystemError;
}

export type ClassNoticeCapturer = typeof NoticeCapturer;
export function newNoticeCapturer(inits: ConstructorParameters<typeof NoticeCapturer>[0] = []) {
  return new NoticeCapturer(inits);
};
export function isNoticeCapturer(instance: SafeAny): instance is NoticeCapturer {
  return instance instanceof NoticeCapturer;
}

export type ClassThrownCapturer = typeof ThrownCapturer;
export function newThrownCapturer(inits: ConstructorParameters<typeof ThrownCapturer>[0] = []) {
  return new ThrownCapturer(inits);
};
export function isThrownCapturer(instance: SafeAny): instance is ThrownCapturer {
  return instance instanceof ThrownCapturer;
}
