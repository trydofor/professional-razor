import { describe, it, expect, vi } from 'vitest';
import { PriorityHook } from '../utils/ClassPriorityHook';

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
    expect(hook3).not.toHaveBeenCalled();
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

    const loggerWarn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    const hook1 = vi.fn(() => Promise.resolve('async-value'));

    hookManager.put({ id: 'asyncHook', order: 1, hook: hook1 });

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

  it('ensures copy-on-write behavior during async emit', async () => {
    const priorityHook = new PriorityHook<(input: string) => MayPromise<string | null>>();
    priorityHook.put({ id: 'a', order: 1, hook: async msg => msg });

    const prevHooks = priorityHook.each(hooks => hooks);

    const emitPromise = priorityHook.emit('test');
    priorityHook.sort();
    await emitPromise;

    const newHooks = priorityHook.each(hooks => hooks);
    expect(prevHooks).not.toBe(newHooks);
  });

  it('logs a warning when call() receives a Promise', () => {
    const loggerSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    const priorityHook = new PriorityHook<(input: string) => MayPromise<string | null>>();
    const asyncHook = vi.fn(async msg => msg + ' Async');

    priorityHook.put({ id: 'async', order: 1, hook: asyncHook as SafeAny });

    priorityHook.call('test');
    expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Synchronous call() received a Promise'), expect.anything());

    loggerSpy.mockRestore();
  });

  it('logs an error when a hook in emit() throws an error', async () => {
    const loggerSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const priorityHook = new PriorityHook<(input: string) => MayPromise<string | null>>();
    const error = new Error('Emit Hook Error');
    const errorHook = vi.fn(async () => {
      throw error;
    });

    priorityHook.put({ id: 'error', order: 1, hook: errorHook });

    await priorityHook.emit('test');

    expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('failed to hook thrown hook'), expect.anything(), error);

    loggerSpy.mockRestore();
  });
});

describe('HookManager.pre', () => {
  it('should return undefined and log warning if hook id not found', () => {
    const loggerWarnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    const manager = new PriorityHook<() => void>();

    const result = manager.pre('non-existent-id', -0.1, vi.fn());

    expect(result).toBeUndefined();
    expect(loggerWarnSpy).toHaveBeenCalledWith('mix hook id=%s not found', 'non-existent-id');

    loggerWarnSpy.mockRestore();
  });

  it('should create a new hook with modified order', () => {
    const manager = new PriorityHook<() => void>();
    const originalHook = vi.fn();
    const newHook = vi.fn();

    manager.put({ id: 'test-hook', order: 10, hook: originalHook, force: true });

    const newId = manager.pre('test-hook', -0.5, newHook);

    expect(newId).toBe('test-hook-0.5');
    const addedHook = manager.get(newId!);

    expect(addedHook).toBeDefined();
    expect(addedHook!.order).toBe(9.5); // 10 + (-0.5)
  });

  it('should call new hook first, then original hook if new hook returns undefined', () => {
    const manager = new PriorityHook<() => void>();
    const originalHook = vi.fn().mockReturnValue('original');
    const newHook = vi.fn().mockReturnValue(undefined);

    manager.put({ id: 'test-hook', order: 10, hook: originalHook, force: true });

    const newId = manager.pre('test-hook', -0.5, newHook);
    const addedHook = manager.get(newId!)!;

    const result = addedHook.hook();

    expect(newHook).toHaveBeenCalled();
    expect(originalHook).toHaveBeenCalled();
    expect(result).toBe('original');
  });

  it('should not call original hook if new hook returns a value', () => {
    const manager = new PriorityHook<() => void>();
    const originalHook = vi.fn();
    const newHook = vi.fn().mockReturnValue('new');

    manager.put({ id: 'test-hook', order: 10, hook: originalHook, force: true });

    const newId = manager.pre('test-hook', -0.5, newHook);
    const addedHook = manager.get(newId!)!;

    const result = addedHook.hook();

    expect(newHook).toHaveBeenCalled();
    expect(originalHook).not.toHaveBeenCalled();
    expect(result).toBe('new');
  });
});

describe('PriorityHook parent chain', () => {
  it('should call parent hooks after current hooks return void', () => {
    const childHook = new PriorityHook<(a?: string) => string | null>([
      { id: 'child1', order: 1, hook: () => null },
      { id: 'child2', order: 2, hook: () => null },
    ]);

    const parentHook = new PriorityHook<() => string | null>([
      { id: 'parent1', order: 1, hook: () => 'parent result' },
    ]);

    childHook.parent = parentHook;

    // Since child hooks return null and undefined, parent hook should be called
    // and its result should be returned
    const result = childHook.call('test arg');
    expect(result).toBe('parent result');
  });

  it('should not call parent hooks if child hook returns non-null value', () => {
    const childHook = new PriorityHook<(a?: string) => string | null>([
      { id: 'child1', order: 1, hook: () => 'child result' },
    ]);

    const parentHook = new PriorityHook<(a?: string) => string | null>([
      { id: 'parent1', order: 1, hook: () => 'parent result' },
    ]);

    childHook.parent = parentHook;

    // Since child hook returns non-null, parent hook should not be called
    const result = childHook.call('test arg');
    expect(result).toBe('child result');
  });
});

describe('PriorityHook parent setter', () => {
  it('should set parent hook correctly', () => {
    const parentHook = new PriorityHook<() => void>([]);
    const childHook = new PriorityHook<() => void>([]);

    childHook.parent = parentHook;
    expect((childHook as SafeAny)._parent).toBe(parentHook);
  });

  it('should ingore when attempting to create circular reference', () => {
    const hook1 = new PriorityHook<() => void>([]);
    const hook2 = new PriorityHook<() => void>([]);
    const hook3 = new PriorityHook<() => void>([]);

    // Create a chain: hook3 -> hook2 -> hook1
    hook3.parent = hook2;
    hook2.parent = hook1;

    // Attempt to create circular reference
    hook1.parent = hook3;
    expect(hook1.parent).toBeUndefined();
  });

  it('should allow setting parent to undefined', () => {
    const hook = new PriorityHook<() => void>([]);
    const parentHook = new PriorityHook<() => void>([]);

    hook.parent = parentHook;
    hook.parent = undefined;
    expect(hook.parent).toBeUndefined();
  });
});
