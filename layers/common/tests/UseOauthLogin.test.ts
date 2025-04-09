import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';

vi.useFakeTimers();

describe('useOauthLogin', () => {
  let openMock: ReturnType<typeof vi.fn>;
  let closeMock: ReturnType<typeof vi.fn>;
  let popupWin: SafeAny;

  beforeEach(() => {
    openMock = vi.fn();
    closeMock = vi.fn();
    popupWin = {
      open: openMock,
      close: closeMock,
      opening: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();
  });

  it('returns false if popup fails to open', async () => {
    openMock.mockResolvedValue(false);
    const authing = ref(false);

    const popup = useOauthLogin({
      popupWin,
      authing,
      authUrl: async () => 'https://auth.url',
      checkToken: vi.fn(),
    });

    const result = await popup('google');
    expect(result).toBe(false);
    expect(authing.value).toBe(false);
  });

  it('opens popup and starts checking on success', async () => {
    openMock.mockResolvedValue(true);
    popupWin.opening.mockReturnValue(true);
    const authing = ref(false);
    const checkToken = vi.fn().mockResolvedValue(true);

    const popup = useOauthLogin({
      popupWin,
      authing,
      authUrl: async () => 'https://auth.url',
      checkToken,
    });

    const result = await popup('google');
    expect(result).toBe(true);
    expect(authing.value).toBe(true);

    // trigger checking after 2000ms
    vi.advanceTimersByTime(2000);

    // checking will close popup and update authing
    await Promise.resolve(); // wait microtask
    expect(checkToken).toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalled();
    expect(authing.value).toBe(false);
  });

  it('sets error when checkToken throws', async () => {
    openMock.mockResolvedValue(true);
    popupWin.opening.mockReturnValue(true);
    const authing = ref(false);
    const checkToken = vi.fn().mockRejectedValue(new Error('token check failed'));

    const popup = useOauthLogin({
      popupWin,
      authing,
      authUrl: async () => 'https://auth.url',
      checkToken,
    });

    const result = await popup('apple');
    expect(result).toBe(true);
    expect(authing.value).toBe(true);

    vi.advanceTimersByTime(2000);
    await Promise.resolve();

    expect(authing.value).toBe(false); // Done is false
    expect(closeMock).toHaveBeenCalled();
  });

  it('uses function authing callback', async () => {
    const authCallback = vi.fn();
    openMock.mockResolvedValue(false);

    const popup = useOauthLogin({
      popupWin,
      authing: authCallback,
      authUrl: async () => 'https://auth.url',
      checkToken: vi.fn(),
    });

    await popup('custom');
    expect(authCallback).toHaveBeenCalledWith(LoadingStatus.Error);
  });

  it('retries if checkToken returns number', async () => {
    openMock.mockResolvedValue(true);
    popupWin.opening.mockReturnValue(true);
    const authing = ref(false);

    const checkToken = vi.fn()
      .mockResolvedValueOnce(1000)
      .mockResolvedValueOnce(true);

    const popup = useOauthLogin({
      popupWin,
      authing,
      authUrl: async () => 'https://auth.url',
      checkToken,
    });

    await popup('apple');
    vi.advanceTimersByTime(2000); // initial wait
    await Promise.resolve();
    expect(checkToken).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000); // retry
    await Promise.resolve();
    expect(checkToken).toHaveBeenCalledTimes(2);
    expect(closeMock).toHaveBeenCalled();
  });
});
