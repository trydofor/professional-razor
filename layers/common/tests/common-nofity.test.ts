import { describe, it, expect, vi } from 'vitest';

describe('createStackedNotify', () => {
  it('should call the handler with the correct index and data', () => {
    const handler = vi.fn();
    const notify = createStackedNotify(handler);

    notify('test data');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(0, 'test data', expect.any(Function));
  });

  it('should reuse available indexes', async () => {
    const handler = vi.fn();
    const notify = createStackedNotify(handler);

    notify('data1');
    const close = handler.mock.calls[0][2];
    close();
    await new Promise(resolve => setTimeout(resolve, 1000));
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

  it('should set the index to true when the close function is called', async () => {
    const handler = vi.fn();
    const notify = createStackedNotify(handler);

    notify('data1');
    const close = handler.mock.calls[0][2];
    close();
    await new Promise(resolve => setTimeout(resolve, 1000));

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

  it('should call the close function to process the next notification', async () => {
    const handler = vi.fn();
    const notify = createSingledNotify(handler);

    notify('data1');
    const close = handler.mock.calls[0][1];
    close();
    await new Promise(resolve => setTimeout(resolve, 1000));
    notify('data2');

    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler).toHaveBeenNthCalledWith(2, 'data2', expect.any(Function));
  });
});

describe('createToggledNotify', () => {
  it('should initialize flags and hooks', () => {
    const hook1 = ref(false);
    const hook2 = vi.fn();
    const toggledNotify = createToggledNotify<{ key1: typeof hook1; key2: typeof hook2 }>();

    toggledNotify.init('key1', hook1);
    toggledNotify.init('key2', hook2);

    expect(toggledNotify.flags.key1).toBe(false);
    expect(toggledNotify.flags.key2).toBe(false);
  });

  it('should call the hook with the correct value when toggle is called', () => {
    const hook1 = ref(false);
    const hook2 = vi.fn();
    const toggledNotify = createToggledNotify<{ key1: typeof hook1; key2: typeof hook2 }>();

    toggledNotify.init('key1', hook1);
    toggledNotify.init('key2', hook2);

    toggledNotify.toggle('key1');
    expect(hook1.value).toBe(true);
    expect(toggledNotify.flags.key1).toBe(true);

    toggledNotify.toggle('key2', 'test data');
    expect(hook2).toHaveBeenCalledWith(true, 'test data');
    expect(toggledNotify.flags.key2).toBe(true);
  });

  it('should call the hook with the correct value when open is called', () => {
    const hook1 = ref(false);
    const hook2 = vi.fn();
    const toggledNotify = createToggledNotify<{ key1: typeof hook1; key2: typeof hook2 }>();

    toggledNotify.init('key1', hook1);
    toggledNotify.init('key2', hook2);

    toggledNotify.open('key1');
    expect(hook1.value).toBe(true);
    expect(toggledNotify.flags.key1).toBe(true);

    toggledNotify.open('key2', 'test data');
    expect(hook2).toHaveBeenCalledWith(true, 'test data');
    expect(toggledNotify.flags.key2).toBe(true);
  });

  it('should call the hook with the correct value when close is called', () => {
    const hook1 = ref(true);
    const hook2 = vi.fn();
    const toggledNotify = createToggledNotify<{ key1: typeof hook1; key2: typeof hook2 }>();

    toggledNotify.init('key1', hook1);
    toggledNotify.init('key2', hook2, true);

    toggledNotify.close('key1');
    expect(hook1.value).toBe(false);
    expect(toggledNotify.flags.key1).toBe(false);

    toggledNotify.close('key2', 'test data');
    expect(hook2).toHaveBeenCalledWith(false, 'test data');
    expect(toggledNotify.flags.key2).toBe(false);
  });

  it('should close all flags when closeAll is called', () => {
    const hook1 = ref(true);
    const hook2 = vi.fn();
    const toggledNotify = createToggledNotify<{ key1: typeof hook1; key2: typeof hook2 }>();

    toggledNotify.init('key1', hook1);
    toggledNotify.init('key2', hook2, true);

    toggledNotify.closeAll();
    expect(hook1.value).toBe(false);
    expect(hook2).toHaveBeenCalledWith(false, undefined);
    expect(toggledNotify.flags.key1).toBe(false);
    expect(toggledNotify.flags.key2).toBe(false);
  });

  it('should open the specified key and close all other keys when openExclusive is called', () => {
    const hook1 = ref(true);
    const hook2 = vi.fn();
    const hook3 = ref(false);
    type NotifyType = { key1: typeof hook1; key2: typeof hook2; key3: typeof hook3 };
    const toggledNotify = createToggledNotify<NotifyType>();

    toggledNotify.init('key1', hook1);
    toggledNotify.init('key2', hook2, true);
    toggledNotify.init('key3', hook3);

    toggledNotify.openExclusive('key3');
    expect(hook1.value).toBe(false);
    expect(hook2).toHaveBeenCalledWith(false, undefined);
    expect(hook3.value).toBe(true);
    expect(toggledNotify.flags.key1).toBe(false);
    expect(toggledNotify.flags.key2).toBe(false);
    expect(toggledNotify.flags.key3).toBe(true);
  });

  it('works with Ref and function toggle hooks', () => {
    const refHook = ref(false);
    const fnHook = vi.fn<(toggle: boolean, data: string) => void>();

    const notify = createToggledNotify<{
      refModal: Ref<boolean>;
      fnModal: (toggle: boolean, data: string) => void;
    }>();

    notify.init('refModal', refHook);
    notify.init('fnModal', fnHook);

    notify.open('refModal');
    expect(refHook.value).toBe(true);
    expect(notify.flags.refModal).toBe(true);

    notify.open('fnModal', 'hello');
    expect(fnHook).toHaveBeenCalledWith(true, 'hello');
    expect(notify.flags.fnModal).toBe(true);

    notify.close('refModal');
    expect(refHook.value).toBe(false);
    expect(notify.flags.refModal).toBe(false);

    notify.toggle('refModal');
    expect(refHook.value).toBe(true);

    notify.closeAll();
    expect(refHook.value).toBe(false);
    expect(notify.flags.refModal).toBe(false);
    expect(notify.flags.fnModal).toBe(false);

    notify.openExclusive('refModal');
    expect(refHook.value).toBe(true);
    expect(notify.flags.refModal).toBe(true);
  });

  it('should enforce types strictly for open()', () => {
    const fnWithOptional = vi.fn<(toggle: boolean, data?: number) => void>();
    const notify = createToggledNotify<{
      optionalData: (toggle: boolean, data?: number) => void;
    }>();

    notify.init('optionalData', fnWithOptional);
    notify.open('optionalData');
    notify.open('optionalData', 123);

    expect(fnWithOptional).toHaveBeenCalledWith(true, undefined);
    expect(fnWithOptional).toHaveBeenCalledWith(true, 123);
  });
});
