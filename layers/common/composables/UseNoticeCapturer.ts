/**
 * Injection key for the `NoticeCapturer` instance
 */
export const NoticeCapturerInjectKey: InjectionKey<InstanceType<ClassNoticeCapturer>> = Symbol('NoticeCapturerInjectKey');

/**
 * Composable function to manage NoticeCapturer instance injection and error capturing.
 * return the injected or the global one if no args. otherwise, create a new one.
 *
 * @param provider - new instance, and provide it to the Vue if true
 * @param capturer - registers to onErrorCaptured if true
 * @returns NoticeCapturer instance (injected when no args, new instance when creating)
 */
export function useNoticeCapturer(provider?: boolean, capturer?: boolean) {
  const _parent = inject(NoticeCapturerInjectKey, globalNoticeCapturer);
  if (provider == null && capturer == null) {
    return _parent;
  }

  const noticeCapturer = newNoticeCapturer();
  noticeCapturer.parent = _parent;

  if (provider) provide(NoticeCapturerInjectKey, noticeCapturer);
  if (capturer) onErrorCaptured(noticeCapturer.hookError);

  return noticeCapturer;
}
