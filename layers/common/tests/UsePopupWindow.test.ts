import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('usePopupWindow', () => {
  let fakeWindow: Window & { closed?: boolean; close?: () => void };

  beforeEach(() => {
    fakeWindow = {
      closed: false,
      close: vi.fn(() => {
        fakeWindow.closed = true;
      }),
    } as unknown as Window;

    vi.stubGlobal('window', {
      ...globalThis.window,
      open: vi.fn(() => fakeWindow),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should open a popup and return true if not blocked', async () => {
    const { open } = usePopupWindow();
    const result = await open('https://example.com');
    expect(result).toBe(true);
    expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank', 'popup');
  });

  it('should return false if popup is blocked (null)', async () => {
    (window.open as SafeAny).mockReturnValueOnce(null);
    const { open } = usePopupWindow();
    const result = await open('https://example.com');
    expect(result).toBe(false);
  });

  it('should detect if popup is open', async () => {
    const { open, opening } = usePopupWindow();
    await open('https://example.com');
    expect(opening()).toBe(true);
    fakeWindow.closed = true;
    expect(opening()).toBe(false);
  });

  it('should close the popup if open', async () => {
    const { open, close } = usePopupWindow();
    await open('https://example.com');
    const result = await close();
    expect(result).toBe(true);
    expect(fakeWindow.close).toHaveBeenCalled();
  });

  it('should return false if popup is not open when calling close', async () => {
    const { close } = usePopupWindow();
    const result = await close();
    expect(result).toBe(false);
  });
});
