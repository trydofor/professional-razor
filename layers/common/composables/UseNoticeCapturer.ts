/**
 * Injection key for the `NoticeCapturer` instance
 */
export const NoticeCapturerInjectKey: InjectionKey<InstanceType<typeof NoticeCapturer>> = Symbol('NoticeCapturerInjectKey');

/**
 * get NoticeCapturer instance when asProvider is,
 *
 * * Provider - create new instance and provide by NoticeCapturerInjectKey
 * * ProviderCapturer - as Provider hook error by onErrorCaptured
 * * Injected - the injected instance by NoticeCapturerInjectKey, or globalNoticeCapturer if not injected
 */
export function useNoticeCapturer(role = UseCapturerType.Injected) {
  if (role === UseCapturerType.Injected) {
    return inject(NoticeCapturerInjectKey, globalNoticeCapturer);
  }

  const noticeCapturer = new NoticeCapturer();
  provide(NoticeCapturerInjectKey, noticeCapturer);
  if (role === UseCapturerType.ProviderCapturer) {
    onErrorCaptured(noticeCapturer.hookError);
  }

  return noticeCapturer;
}
