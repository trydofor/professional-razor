/**
 * Injection key for the `ThrownCapturer` instance
 */
export const ThrownCapturerInjectKey: InjectionKey<InstanceType<typeof ThrownCapturer>> = Symbol('ThrownCapturerInjectKey');

/**
 * get ThrownCapturer instance when asProvider is,
 *
 * * true - create new instance and provide by ThrownCapturerInjectKey
 * * false (default) - the injected instance by ThrownCapturerInjectKey, or globalThrownCapturer if not injected
 */
export function useThrownCapturer(asProvider: boolean = false) {
  let thrownCapturer;

  if (asProvider) {
    thrownCapturer = new ThrownCapturer();
    provide(ThrownCapturerInjectKey, thrownCapturer);
  }
  else {
    thrownCapturer = inject(ThrownCapturerInjectKey, globalThrownCapturer);
  }

  return thrownCapturer;
}
