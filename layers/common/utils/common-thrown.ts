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

export const captureSystemError: Parameters<typeof onErrorCaptured>[0] = (err: unknown) => {
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
    order: 9000,
    hook: captureSystemError,
  },
],
);

/**
 * throttle by key, default is 300ms, throw ThrottleThrown if throttled
 */
export type ThrottleThrownKey = string | { key: string; ms: number };
/**
 * default ignore thrown instance
 */
export const ThrottleThrown = newIgnoredThrown('Throttled');

const _throttled = new Map<string, number>();

export function throwIfThrottle(opt?: ThrottleThrownKey): void {
  if (opt == null) return;

  let key;
  let ms;
  if (typeof opt === 'string') {
    key = opt;
  }
  else {
    key = opt.key;
    ms = opt.ms;
  }

  if (!key) return;
  if (ms == null || ms < 0) ms = 300;

  const now = Date.now();
  const last = _throttled.get(key);
  if (last != null && now < last) throw ThrottleThrown;

  const next = now + ms;
  _throttled.set(key, next);
  // clean
  setTimeout(() => {
    if (_throttled.get(key) === next) _throttled.delete(key);
  }, ms);
}
