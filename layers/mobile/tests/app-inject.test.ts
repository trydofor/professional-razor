import { it, expect } from 'vitest';
import { CapacitorStorage } from '~/utils/app-inject';

it('should override BrowserStorage with CapacitorStorage', async () => {
  console.log('Injected instance:', CapacitorStorage._id);
  const injected = globalInject(StorageLikeAsyncInjectKey);

  expect(injected).not.toBe(BrowserStorage);

  expect(typeof injected.getItem).toBe('function');
  expect(typeof injected.setItem).toBe('function');

  const result = await injected.getItem('nonexistent');
  expect(result).toBeNull();
});
