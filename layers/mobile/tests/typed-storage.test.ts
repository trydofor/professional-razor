import { flushPromises } from '@vue/test-utils';
import { expect, test } from 'vitest';

test('defineStorage setter', () => {
  const storage = defTypedStorage<string>({ key: 'test1' });
  expect(storage.value).toEqual(Promise.resolve(null));

  storage.value = '1';
  expect(storage.value).toEqual(Promise.resolve('1'));

  storage.value = null;
  expect(storage.value).toEqual(Promise.resolve(null));

  storage.value = Promise.resolve('2');
  expect(storage.value).toEqual(Promise.resolve('2'));

  storage.value = Promise.resolve(null);
  expect(storage.value).toEqual(Promise.resolve(null));
});

test('defineStorage callback', async () => {
  const ref = { value: '0' };
  const storage = defTypedStorage<string>({ key: 'test1', callback: v => (ref.value = v ?? '') });
  expect(storage.value).toEqual(Promise.resolve(null));

  await flushPromises();
  expect(ref.value).toEqual('');

  storage.value = '1';
  await flushPromises();
  expect(ref.value).toEqual('1');

  storage.value = null;
  await flushPromises();
  expect(ref.value).toEqual('');

  storage.value = Promise.resolve('2');
  await flushPromises();
  expect(ref.value).toEqual('2');

  storage.value = Promise.resolve(null);
  await flushPromises();
  expect(ref.value).toEqual('');
});

test('useStorage', () => {
  const storage = useTypedStorage<string>({ key: 'test2', init: '0' });
  expect(storage.value).toEqual('0');

  storage.value = '1';
  expect(storage.value).toEqual('1');

  storage.value = null;
  expect(storage.value).toEqual(null);
});
