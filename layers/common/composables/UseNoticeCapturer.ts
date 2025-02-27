/**
 * Injection key for the `NoticeCapturer` instance
 */
export const NoticeCapturerInjectKey: InjectionKey<InstanceType<typeof NoticeCapturer>> = Symbol('NoticeCapturerInjectKey');

/**
 * get NoticeCapturer instance when asProvider is,
 *
 * * true - create new instance and provide by NoticeCapturerInjectKey
 * * false (default) - the injected instance by NoticeCapturerInjectKey, or globalNoticeCapturer if not injected
 */
export function useNoticeCapturer(asProvider: boolean = false) {
  let noticeCapturer;

  if (asProvider) {
    noticeCapturer = new NoticeCapturer();
    provide(NoticeCapturerInjectKey, noticeCapturer);
  }
  else {
    noticeCapturer = inject(NoticeCapturerInjectKey, globalNoticeCapturer);
  }

  return noticeCapturer;
}
