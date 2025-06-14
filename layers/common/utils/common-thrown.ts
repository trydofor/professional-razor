/**
 * default ignore thrown instance
 */
export const Ignored = new IgnoredThrown('ignored this thrown');

/**
 * global notice capturer used by globalThrownCapturer.
 */
export const globalNoticeCapturer = new NoticeCapturer();

export const captureIgnoredThrown: OnErrorCapturedHook = (err: SafeAny) => {
  if (err instanceof IgnoredThrown || err?.name === 'IgnoredThrown') return false;
};

export const captureSystemError: OnErrorCapturedHook = (err: unknown) => {
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
    id: 'GlobalIgnoredThrownHook',
    order: 1000,
    hook: captureIgnoredThrown,
  },
  {
    id: 'GlobalThrownToNoticeHook',
    order: 2000,
    hook: globalNoticeCapturer.hookError, // default ApiResultError and NoticeThrown
  },
  {
    id: 'GlobalSystemErrorHook',
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
export const ThrottleThrown = new IgnoredThrown('Throttled');

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
