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
  if (provider == null && capturer == null) {
    return inject(NoticeCapturerInjectKey, globalNoticeCapturer);
  }

  const noticeCapturer = newNoticeCapturer();
  if (provider) provide(NoticeCapturerInjectKey, noticeCapturer);
  if (capturer) onErrorCaptured(noticeCapturer.hookError);
  return noticeCapturer;
}
