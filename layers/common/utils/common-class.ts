// https://github.com/nuxt/nuxt/issues/26516

import type { RouteLocationRaw } from 'vue-router';
import { IgnoredThrown, NavigateThrown, DataThrown, NoticeThrown } from '../classes/ClassThrown';
import { ApiResultError, SystemError } from '../classes/ClassError';
import { NoticeCapturer, ThrownCapturer } from '../classes/ClassCapturer';

export type { PriorityHookType } from '../classes/ClassPriorityHook';
export type { OnErrorCapturedHook, OnNoticeCapturedHook } from '../classes/ClassCapturer';
export { captureNoticelikeThrown, thrownToNotices } from '../classes/ClassCapturer';
export { TypeApiFalse, TypeApiError } from '../classes/ClassError';

// ClassThrown

export type ClassIgnoredThrown = typeof IgnoredThrown;
export function newIgnoredThrown(message: string) {
  return new IgnoredThrown(message);
}
export function isIgnoredThrown(instance: unknown): instance is IgnoredThrown {
  return instance instanceof IgnoredThrown;
}

export type ClassNavigateThrown = typeof NavigateThrown;
export function newNavigateThrown(route: RouteLocationRaw) {
  return new NavigateThrown(route);
}
export function isNavigateThrown(instance: unknown): instance is NavigateThrown {
  return instance instanceof NavigateThrown;
}

export type ClassDataThrown = typeof DataThrown;
export function newDataThrown(type: string, data: unknown) {
  return new DataThrown(type, data);
}
export function isDataThrown(instance: unknown): instance is DataThrown {
  return instance instanceof DataThrown;
}

export type ClassNoticeThrown = typeof NoticeThrown;
export function newNoticeThrown(...notices: I18nNotice[]) {
  return new NoticeThrown(notices);
}
export function isNoticeThrown(instance: unknown): instance is NoticeThrown {
  return instance instanceof NoticeThrown;
}

// ClassError

export type ClassApiResultError = typeof ApiResultError;
export function newApiResultError(result: ApiResult) {
  return new ApiResultError(result);
}
export function isApiResultError(instance: unknown): instance is ApiResultError {
  return instance instanceof ApiResultError;
}

export type ClassSystemError = typeof SystemError;
export function newSystemError(message: string, attachment?: unknown) {
  return new SystemError(message, attachment);
}
export function isSystemError(instance: unknown): instance is SystemError {
  return instance instanceof SystemError;
}

// ClassCapturer

export type ClassNoticeCapturer = typeof NoticeCapturer;
export function newNoticeCapturer(inits: ConstructorParameters<ClassNoticeCapturer>[0] = []) {
  return new NoticeCapturer(inits);
}
export function isNoticeCapturer(instance: unknown): instance is NoticeCapturer {
  return instance instanceof NoticeCapturer;
}

export type ClassThrownCapturer = typeof ThrownCapturer;
export function newThrownCapturer(inits: ConstructorParameters<ClassThrownCapturer>[0] = []) {
  return new ThrownCapturer(inits);
}
export function isThrownCapturer(instance: unknown): instance is ThrownCapturer {
  return instance instanceof ThrownCapturer;
}
