import { describe, it, expect, vi } from 'vitest';

describe('createStackedNotify', () => {
  it('should call the handler with the correct index and data', () => {
    const handler = vi.fn();
    const notify = createStackedNotify(handler);

    notify('test data');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(0, 'test data', expect.any(Function));
  });

  it('should reuse available indexes', () => {
    const handler = vi.fn();
    const notify = createStackedNotify(handler);

    notify('data1');
    const close = handler.mock.calls[0][2];
    close();
    notify('data2');

    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler).toHaveBeenNthCalledWith(2, 0, 'data2', expect.any(Function));
  });

  it('should increase the toastOffset array if all indexes are occupied', () => {
    const handler = vi.fn();
    const notify = createStackedNotify(handler);

    notify('data1');
    notify('data2');
    notify('data3');
    notify('data4');
    notify('data5');
    notify('data6');

    expect(handler).toHaveBeenCalledTimes(6);
    expect(handler).toHaveBeenNthCalledWith(6, 5, 'data6', expect.any(Function));
  });

  it('should set the index to true when the close function is called', () => {
    const handler = vi.fn();
    const notify = createStackedNotify(handler);

    notify('data1');
    const close = handler.mock.calls[0][2];
    close();

    notify('data2');
    expect(handler).toHaveBeenNthCalledWith(2, 0, 'data2', expect.any(Function));
  });
});

describe('createSingledNotify', () => {
  it('should call the handler with the correct data', () => {
    const handler = vi.fn();
    const notify = createSingledNotify(handler);

    notify('test data');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith('test data', expect.any(Function));
  });

  it('should queue multiple notifications', () => {
    const handler = vi.fn();
    const notify = createSingledNotify(handler);

    notify('data1');
    notify('data2');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith('data1', expect.any(Function));
  });

  it('should call the close function to process the next notification', () => {
    const handler = vi.fn();
    const notify = createSingledNotify(handler);

    notify('data1');
    const close = handler.mock.calls[0][1];
    close();
    notify('data2');

    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler).toHaveBeenNthCalledWith(2, 'data2', expect.any(Function));
  });
});
describe('createToggledNotify', () => {
  it('should initialize flags with default values', () => {
    const flags = {
      isOpen: false,
      isVisible: true,
    };
    const { init } = createToggledNotify(flags);
    const isOpenRef = { value: false };
    const isVisibleRef = { value: true };

    init('isOpen', isOpenRef as Ref<boolean>);
    init('isVisible', isVisibleRef as Ref<boolean>);

    expect(flags.isOpen).toBe(false);
    expect(flags.isVisible).toBe(true);
  });

  it('should toggle a boolean flag using a ref', () => {
    const flags = { isOpen: false };
    const { init, toggle } = createToggledNotify(flags);
    const isOpenRef = { value: false };
    init('isOpen', isOpenRef as Ref<boolean>);

    toggle('isOpen');
    expect(flags.isOpen).toBe(true);
    expect(isOpenRef.value).toBe(true);

    toggle('isOpen');
    expect(flags.isOpen).toBe(false);
    expect(isOpenRef.value).toBe(false);
  });

  it('should toggle a boolean flag using a callback function', () => {
    const flags = { isOpen: false };
    const mockCallback = vi.fn();
    const { init, toggle } = createToggledNotify(flags);
    init('isOpen', mockCallback);

    toggle('isOpen');
    expect(flags.isOpen).toBe(true);
    expect(mockCallback).toHaveBeenCalledWith(true);

    toggle('isOpen');
    expect(flags.isOpen).toBe(false);
    expect(mockCallback).toHaveBeenCalledWith(false);
  });

  it('should open a flag', () => {
    const flags = { isOpen: false };
    const { init, open } = createToggledNotify(flags);
    const isOpenRef = { value: false };
    init('isOpen', isOpenRef as Ref<boolean>);

    open('isOpen');
    expect(flags.isOpen).toBe(true);
    expect(isOpenRef.value).toBe(true);
  });

  it('should close a flag', () => {
    const flags = { isOpen: true };
    const { init, close } = createToggledNotify(flags);
    const isOpenRef = { value: true };
    init('isOpen', isOpenRef as Ref<boolean>);

    close('isOpen');
    expect(flags.isOpen).toBe(false);
    expect(isOpenRef.value).toBe(false);
  });

  it('should call a flag', () => {
    const flags = { isOpen: false };
    const { init, call } = createToggledNotify(flags);
    const isOpenRef = { value: false };
    init('isOpen', isOpenRef as Ref<boolean>);

    call('isOpen', true);
    expect(flags.isOpen).toBe(true);
    expect(isOpenRef.value).toBe(true);

    call('isOpen', false);
    expect(flags.isOpen).toBe(false);
    expect(isOpenRef.value).toBe(false);
  });
});
