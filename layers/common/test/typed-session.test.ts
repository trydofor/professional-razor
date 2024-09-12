import { expect, test } from 'vitest';

test('defineSession setter', () => {
  const storage = defSession<string>({ key: 'test1' });
  expect(storage.value).toEqual(null);

  storage.value = '1';
  expect(storage.value).toEqual('1');

  storage.value = null;
  expect(storage.value).toEqual(null);
});

test('defineSession callback', async () => {
  const ref = { value: '0' };
  const storage = defSession<string>({ key: 'test1', callback: v => (ref.value = v ?? '') });
  expect(storage.value).toEqual(null);
  expect(ref.value).toEqual('');

  storage.value = '1';
  expect(ref.value).toEqual('1');

  storage.value = null;
  expect(ref.value).toEqual('');
});

test('useSession', () => {
  const storage = useSession<string>({ key: 'test2', init: '0' });
  expect(storage.value).toEqual('0');

  storage.value = '1';
  expect(storage.value).toEqual('1');

  storage.value = null;
  expect(storage.value).toEqual(null);
});
