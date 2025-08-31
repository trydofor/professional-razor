import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shallowRef } from 'vue';

describe('useInputChecker', () => {
  // Mock NoticeCapturer
  const mockNoticeCapturer = {
    put: vi.fn(),
    del: vi.fn(),
    emit: vi.fn(),
    handle: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate input against regex correctly', () => {
    const model = shallowRef('');
    const validator = useInputChecker({
      check: /^[0-9]{6,}$/,
      model,
      notify: undefined,
    });

    model.value = '12345'; // Too short
    expect(validator()).toBe(false);

    model.value = '123456'; // Valid
    expect(validator()).toBe(true);
  });

  it('should call notify.output when validation fails', () => {
    const errorOutput = shallowRef('');
    const validator = useInputChecker({
      check: /^[0-9]{6,}$/,
      model: shallowRef(''),
      output: errorOutput,
      notify: {
        handle: mockNoticeCapturer as SafeAny,
        accept: 'testField',
      },
    });

    validator(); // No value in model
    expect(errorOutput.value).toBeTruthy();

    // Test with invalid value
    validator('abc'); // Direct input
    expect(errorOutput.value).toBeTruthy();
  });

  it('should emit notice when event is passed', () => {
    const validator = useInputChecker({
      check: /^[0-9]{6,}$/,
      output: () => {},
      notify: {
        handle: mockNoticeCapturer as SafeAny,
        accept: 'noticeTarget',
      },
    });

    const mockEvent = { target: 'noticeTarget', message: 'Invalid input' };
    validator(mockEvent as SafeAny);

    expect(mockNoticeCapturer.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should register a notice handler on initialization', () => {
    useInputChecker({
      check: /^[0-9]{6,}$/,
      output: () => {},
      notify: {
        handle: mockNoticeCapturer as SafeAny,
        accept: 'noticeTarget',
        id: 'custom-id',
        order: 50,
      },
    });

    expect(mockNoticeCapturer.put).toHaveBeenCalled();
  });
});
