/**
 * Injection key for the `ThrownCapturer` instance
 */
export const ThrownCapturerInjectKey: InjectionKey<InstanceType<typeof ThrownCapturer>> = Symbol('ThrownCapturerInjectKey');

/**
 * get ThrownCapturer instance when asProvider is,
 *
 * * Provider - create new instance and provide by ThrownCapturerInjectKey
 * * ProviderCapturer - as Provider hook error by onErrorCaptured
 * * Injected - the injected instance by ThrownCapturerInjectKey, or globalThrownCapturer if not injected
 */
export function useThrownCapturer(role = UseCapturerType.Injected) {
  if (role === UseCapturerType.Injected) {
    return inject(ThrownCapturerInjectKey, globalThrownCapturer);
  }

  const thrownCapturer = new ThrownCapturer();
  provide(ThrownCapturerInjectKey, thrownCapturer);
  if (role === UseCapturerType.ProviderCapturer) {
    onErrorCaptured(thrownCapturer.hookError);
  }

  return thrownCapturer;
}
