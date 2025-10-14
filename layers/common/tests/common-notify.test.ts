import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

describe('common notify helpers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('handles unlimited stacked notifications', () => {
    const calls: Array<{ index: number; data: string }> = [];
    const notify = createStackedNotify<string>((index, data, close) => {
      calls.push({ index, data });
      close();
    });

    notify('first');
    vi.runOnlyPendingTimers();
    notify('second');
    vi.runOnlyPendingTimers();

    expect(calls).toEqual([
      { index: 0, data: 'first' },
      { index: 0, data: 'second' },
    ]);
  });

  it('queues stacked notifications when all slots are busy', () => {
    const calls: string[] = [];
    const closers: Array<() => void> = [];
    const notify = createStackedNotify<string>((index, data, close) => {
      calls.push(`${index}:${data}`);
      closers.push(() => close());
    }, 2);

    for (let i = 0; i < 5; i++) {
      notify(`job-${i}`);
    }

    notify('queued');
    expect(calls).toHaveLength(5);

    closers[0]!();
    vi.runOnlyPendingTimers();

    expect(calls).toHaveLength(6);
    expect(calls.at(-1)).toMatch(/\d:queued/);
  });

  it('processes notifications sequentially', () => {
    const calls: string[] = [];
    const notify = createSingledNotify<string>((data, close) => {
      calls.push(data);
      close();
    });

    notify('a');
    notify('b');

    expect(calls).toEqual(['a']);
    vi.runOnlyPendingTimers();
    expect(calls).toEqual(['a', 'b']);
  });

  it('toggles refs and callbacks correctly', () => {
    const modal = ref(false);
    const callback = vi.fn<(open: boolean, payload?: string) => void>();
    const optional = vi.fn<(open: boolean, payload?: number) => void>();

    const toggled = createToggledNotify<{
      modal: typeof modal;
      callback: (open: boolean, payload?: string) => void;
      optional: (open: boolean, payload?: number) => void;
    }>();

    toggled.init('modal', modal);
    toggled.init('callback', callback);
    toggled.init('optional', optional, true);

    toggled.open('modal');
    expect(modal.value).toBe(true);

    toggled.toggle('modal');
    expect(modal.value).toBe(false);

    toggled.openExclusive('callback', 'payload');
    expect(callback).toHaveBeenLastCalledWith(true, 'payload');

    toggled.open('optional', 42);
    expect(optional).toHaveBeenLastCalledWith(true, 42);

    toggled.closeAll();
    expect(callback).toHaveBeenLastCalledWith(false, undefined);
    expect(optional).toHaveBeenLastCalledWith(false, undefined);
  });

  it('creates app notify with default warning level', () => {
    const { eventBus, newThrown } = createAppNotify('toast', GlobalNotifyStyle.Toast);

    const notifyFromString = newThrown('be careful');
    expect(notifyFromString).toBeInstanceOf(NotifyThrown);
    expect(notifyFromString.notify).toMatchObject({
      message: 'be careful',
      notifyLevel: GlobalNotifyLevel.Warning,
      notifyStyle: GlobalNotifyStyle.Toast,
    });

    const notifyFromObject = newThrown({
      message: 'ok',
      notifyLevel: GlobalNotifyLevel.Success,
    });
    expect(notifyFromObject.notify).toMatchObject({
      message: 'ok',
      notifyLevel: GlobalNotifyLevel.Success,
      notifyStyle: GlobalNotifyStyle.Toast,
    });

    expect(typeof eventBus.emit).toBe('function');
    expect(typeof eventBus.on).toBe('function');
  });
});
