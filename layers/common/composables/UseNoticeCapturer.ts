/**
 * Injection key for the `NoticeCapturer` instance
 */
export const NoticeCapturerInjectKey: InjectionKey<InstanceType<typeof NoticeCapturer>> = Symbol('NoticeCapturerInjectKey');

/**
 * Composable function to manage NoticeCapturer instance injection and error capturing.
 * return the injected or the global one if no args. otherwise, create a new one.
 *
 * @param provider - When true, provides a new instance to the Vue hierarchy
 * @param capturer - When true, registers error capture hook
 * @returns NoticeCapturer instance (injected when no args, new instance when creating)
 */
export function useNoticeCapturer(provider?: boolean, capturer?: boolean) {
  if (provider == null && capturer == null) {
    return inject(NoticeCapturerInjectKey, globalNoticeCapturer);
  }

  const noticeCapturer = new NoticeCapturer();
  if (provider) provide(NoticeCapturerInjectKey, noticeCapturer);
  if (capturer) onErrorCaptured(noticeCapturer.hookError);
  return noticeCapturer;
}
