import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

describe('common-blob utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('delegates to navigator.msSaveOrOpenBlob when available', () => {
    const blob = new Blob(['hello']);
    const navigatorStub = window.navigator as Navigator & { msSaveOrOpenBlob?: (blob: Blob, name?: string) => void };
    navigatorStub.msSaveOrOpenBlob = vi.fn();

    saveBlobFile({ name: 'hello.txt', blob });

    expect(navigatorStub.msSaveOrOpenBlob).toHaveBeenCalledWith(blob, 'hello.txt');
    delete navigatorStub.msSaveOrOpenBlob;
  });

  it('creates anchor element and revokes url for Blob', () => {
    const blob = new Blob(['world']);
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(document.body, 'removeChild');
    vi.spyOn(document, 'createElement');
    const dispatchSpy = vi.spyOn(HTMLAnchorElement.prototype, 'dispatchEvent');
    const objectUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');

    saveBlobFile(blob, 'fallback.txt');

    expect(objectUrlSpy).toHaveBeenCalledWith(blob);
    expect(appendSpy).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalled();

    vi.runAllTimers();

    expect(removeSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalledWith('blob:mock');
  });

  it('supports legacy MouseEvent fallback when constructor throws', () => {
    const originalMouseEvent = globalThis.MouseEvent;
    const mouseEventSpy = vi.fn(() => {
      throw new Error('unsupported');
    });
    globalThis.MouseEvent = mouseEventSpy as unknown as typeof MouseEvent;

    const originalCreateEvent = document.createEvent.bind(document);
    const createEventSpy = vi.spyOn(document, 'createEvent').mockImplementation((type: string) => {
      const event = originalCreateEvent(type) as MouseEvent & { initMouseEvent?: (...args: unknown[]) => void };
      if (type === 'MouseEvent' && typeof event.initMouseEvent !== 'function') {
        event.initMouseEvent = vi.fn();
      }
      return event;
    });

    const objectUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:legacy');
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');

    saveBlobFile(new Blob(['legacy']), 'legacy.txt');

    expect(mouseEventSpy).toHaveBeenCalled();
    expect(createEventSpy).toHaveBeenCalledWith('MouseEvent');

    vi.runAllTimers();

    expect(objectUrlSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalledWith('blob:legacy');

    createEventSpy.mockRestore();
    globalThis.MouseEvent = originalMouseEvent;
  });

  it('parses filenames from Content-Disposition header', () => {
    expect(parseContentDispositionFilename('attachment; filename="report.txt"')).toBe('report.txt');
    expect(parseContentDispositionFilename('attachment; filename="fallback.txt"; filename*=UTF-8\'\'%E4%B8%AD%E6%96%87.txt')).toBe('中文.txt');
    expect(parseContentDispositionFilename('attachment')).toBeUndefined();
  });

  it('detects blob-like objects', () => {
    const fakeBlob = { arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)), text: () => Promise.resolve('') };
    expect(isBlobLike(new Blob(['data']))).toBe(true);
    expect(isBlobLike(fakeBlob)).toBe(true);
    expect(isBlobLike({})).toBe(false);
  });
});
