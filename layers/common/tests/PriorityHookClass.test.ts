import { describe, it, expect, vi } from 'vitest';

describe('PriorityHook', () => {
  it('should initialize with empty hooks', () => {
    const hook = new PriorityHook<() => void>();
    hook.each((hooks) => {
      expect(hooks).toEqual([]);
    });
  });

  it('should initialize with sorted hooks3', () => {
    const hooks: PriorityHookType<() => void>[] = [
      { id: 'b', order: 2, hook: vi.fn() },
      { id: 'a', order: 1, hook: vi.fn() },
      { id: 'c', order: 2, hook: vi.fn() },
    ];
    const hookManager = new PriorityHook(hooks);

    hookManager.each((hooks) => {
      expect(hooks.map(h => h.id)).toEqual(['a', 'b', 'c']); // Order 1 first, then by id
    });
  });

  it('should initialize with sorted hooks1', () => {
    const hooks: PriorityHookType<() => void>[] = [
      { id: 'a', order: 1, hook: vi.fn() },
    ];
    const hookManager = new PriorityHook(hooks);

    hookManager.each((hooks) => {
      expect(hooks.map(h => h.id)).toEqual(['a']);
    });
  });

  it('should put hooks and maintain sorting order', () => {
    const hookManager = new PriorityHook<() => void>();

    const hook1 = { id: '1', order: 2, hook: vi.fn() };
    const hook2 = { id: '2', order: 1, hook: vi.fn() };
    const hook3 = { id: '3', order: 2, hook: vi.fn() };

    hookManager.put(hook1);
    hookManager.put(hook2);
    hookManager.put(hook3);

    hookManager.each((hooks) => {
      expect(hooks.map(h => h.id)).toEqual(['2', '1', '3']);
    });
  });

  it('should replace hook if id already exists', () => {
    const hookManager = new PriorityHook<() => void>();

    const hook1 = { id: 'same', order: 1, hook: vi.fn() };
    const hook2 = { id: 'same', order: 2, hook: vi.fn() };

    hookManager.put(hook1);
    hookManager.put(hook2);

    hookManager.each((hooks) => {
      expect(hooks).toHaveLength(1);
      expect(hooks[0]).toEqual(hook2); // Newer hook should replace the old one
    });
  });

  it('should delete a hook by id', () => {
    const hookManager = new PriorityHook<() => void>();

    const hook1 = { id: 'toBeDeleted', order: 1, hook: vi.fn() };
    hookManager.put(hook1);

    const deleted = hookManager.del('toBeDeleted');

    expect(deleted).toEqual(hook1);
    hookManager.each((hooks) => {
      expect(hooks).toEqual([]);
    });
  });

  it('should return undefined when deleting a non-existent hook', () => {
    const hookManager = new PriorityHook<() => void>();
    expect(hookManager.del('non-existent')).toBeUndefined();
  });

  it('should sort hooks based on a custom sorter', () => {
    const hookManager = new PriorityHook<() => void>();

    const hook1 = { id: 'a', order: 1, hook: vi.fn() };
    const hook2 = { id: 'b', order: 2, hook: vi.fn() };
    const hook3 = { id: 'c', order: 1, hook: vi.fn() };

    hookManager.put(hook1);
    hookManager.put(hook2);
    hookManager.put(hook3);

    hookManager.sort((a, b) => b.order - a.order); // Reverse order

    hookManager.each((hooks) => {
      expect(hooks.map(h => h.id)).toEqual(['b', 'a', 'c']); // Order desc
    });
  });

  it('should call hooks synchronously and stop on non-null return', () => {
    const hookManager = new PriorityHook<(input: string) => string | undefined>();

    const hook1 = vi.fn(() => undefined);
    const hook2 = vi.fn(() => 'stop');
    const hook3 = vi.fn(() => 'skip');

    hookManager.put({ id: 'hook1', order: 1, hook: hook1 });
    hookManager.put({ id: 'hook2', order: 2, hook: hook2 });
    hookManager.put({ id: 'hook3', order: 3, hook: hook3 });

    const result = hookManager.call('test');

    expect(result).toBe('stop');
    expect(hook1).toHaveBeenCalledWith('test');
    expect(hook2).toHaveBeenCalledWith('test');
    expect(hook3).not.toHaveBeenCalled();
  });

  it('should emit hooks asynchronously and stop on non-null return', async () => {
    const hookManager = new PriorityHook<(input: string) => Promise<string | undefined>>();

    const hook1 = vi.fn(async () => undefined);
    const hook2 = vi.fn(async () => 'stop');
    const hook3 = vi.fn(async () => 'skip');

    hookManager.put({ id: 'hook1', order: 1, hook: hook1 });
    hookManager.put({ id: 'hook2', order: 2, hook: hook2 });
    hookManager.put({ id: 'hook3', order: 3, hook: hook3 });

    const result = await hookManager.emit('test');

    expect(result).toBe('stop');
    expect(hook1).toHaveBeenCalledWith('test');
    expect(hook2).toHaveBeenCalledWith('test');
    expect(hook3).not.toHaveBeenCalled();
  });

  it('should emit hooks asynchronously and handle errors gracefully', async () => {
    const hookManager = new PriorityHook<(input: string) => Promise<string | undefined>>();

    const hook1 = vi.fn(async () => {
      throw new Error('Error in hook1');
    });
    const hook2 = vi.fn(async () => 'result');

    hookManager.put({ id: 'hook1', order: 1, hook: hook1 });
    hookManager.put({ id: 'hook2', order: 2, hook: hook2 });

    const result = await hookManager.emit('test');

    expect(result).toBe('result'); // hook1 fails but execution continues
    expect(hook1).toHaveBeenCalledWith('test');
    expect(hook2).toHaveBeenCalledWith('test');
  });
});
describe('PriorityHook - call and emit tests', () => {
  it('should continue call() when hook returns null or undefined', () => {
    const hookManager = new PriorityHook<(input: string) => string | null | undefined>();

    const hook1 = vi.fn(() => null);
    const hook2 = vi.fn(() => undefined);
    const hook3 = vi.fn(() => 'final');

    hookManager.put({ id: 'hook1', order: 1, hook: hook1 });
    hookManager.put({ id: 'hook2', order: 2, hook: hook2 });
    hookManager.put({ id: 'hook3', order: 3, hook: hook3 });

    const result = hookManager.call('test');

    expect(result).toBe('final');
    expect(hook1).toHaveBeenCalledWith('test');
    expect(hook2).toHaveBeenCalledWith('test');
    expect(hook3).toHaveBeenCalledWith('test');
  });

  it('should stop call() when a hook returns a non-null and non-undefined value', () => {
    const hookManager = new PriorityHook<(input: string) => string | null | undefined>();

    const hook1 = vi.fn(() => null);
    const hook2 = vi.fn(() => 'stop');
    const hook3 = vi.fn(() => 'skip');

    hookManager.put({ id: 'hook1', order: 1, hook: hook1 });
    hookManager.put({ id: 'hook2', order: 2, hook: hook2 });
    hookManager.put({ id: 'hook3', order: 3, hook: hook3 });

    const result = hookManager.call('test');

    expect(result).toBe('stop');
    expect(hook1).toHaveBeenCalledWith('test');
    expect(hook2).toHaveBeenCalledWith('test');
    expect(hook3).not.toHaveBeenCalled(); // 确保 hook3 没有被执行
  });

  it('should continue emit() when hook returns Promise<null> or Promise<undefined>', async () => {
    const hookManager = new PriorityHook<(input: string) => Promise<string | null | undefined>>();

    const hook1 = vi.fn(async () => null);
    const hook2 = vi.fn(async () => undefined);
    const hook3 = vi.fn(async () => 'final');

    hookManager.put({ id: 'hook1', order: 1, hook: hook1 });
    hookManager.put({ id: 'hook2', order: 2, hook: hook2 });
    hookManager.put({ id: 'hook3', order: 3, hook: hook3 });

    const result = await hookManager.emit('test');

    expect(result).toBe('final');
    expect(hook1).toHaveBeenCalledWith('test');
    expect(hook2).toHaveBeenCalledWith('test');
    expect(hook3).toHaveBeenCalledWith('test');
  });

  it('should stop emit() when a hook returns a non-null and non-undefined Promise result', async () => {
    const hookManager = new PriorityHook<(input: string) => Promise<string | null | undefined>>();

    const hook1 = vi.fn(async () => null);
    const hook2 = vi.fn(async () => 'stop');
    const hook3 = vi.fn(async () => 'skip');

    hookManager.put({ id: 'hook1', order: 1, hook: hook1 });
    hookManager.put({ id: 'hook2', order: 2, hook: hook2 });
    hookManager.put({ id: 'hook3', order: 3, hook: hook3 });

    const result = await hookManager.emit('test');

    expect(result).toBe('stop');
    expect(hook1).toHaveBeenCalledWith('test');
    expect(hook2).toHaveBeenCalledWith('test');
    expect(hook3).not.toHaveBeenCalled();
  });

  it('should warn if call() receives a Promise', () => {
    const hookManager = new PriorityHook<(input: string) => string | Promise<string>>();

    // const loggerWarn = vi.fn();
    // logger.mockTypes(() => loggerWarn);
    const loggerWarn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    const hook1 = vi.fn(() => Promise.resolve('async-value'));

    hookManager.put({ id: 'asyncHook', order: 1, hook: hook1 }, false);

    const result = hookManager.call('test');

    expect(result).toBeUndefined();
    expect(loggerWarn).toHaveBeenCalledWith(
      'Synchronous call() received a Promise from hook=%s',
      'asyncHook',
    );
  });

  it('should continue emit() if hook returns Promise<null>', async () => {
    const hookManager = new PriorityHook<(input: string) => Promise<string | null>>();

    const hook1 = vi.fn(async () => null);
    const hook2 = vi.fn(async () => 'final-value');

    hookManager.put({ id: 'hook1', order: 1, hook: hook1 });
    hookManager.put({ id: 'hook2', order: 2, hook: hook2 });

    const result = await hookManager.emit('test');

    expect(result).toBe('final-value');
    expect(hook1).toHaveBeenCalled();
    expect(hook2).toHaveBeenCalled();
  });

  it('should stop emit() if hook returns Promise<value>', async () => {
    const hookManager = new PriorityHook<(input: string) => MayPromise<string | null>>();

    const hook1 = vi.fn(() => 'stop-here');
    const hook2 = vi.fn(async () => 'skip-me');

    hookManager.put({ id: 'hook1', order: 1, hook: hook1 });
    hookManager.put({ id: 'hook2', order: 2, hook: hook2 });

    const result = await hookManager.emit('test');

    expect(result).toBe('stop-here');
    expect(hook1).toHaveBeenCalled();
    expect(hook2).not.toHaveBeenCalled();
  });
});
