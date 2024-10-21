import { expect, test } from 'vitest';

test('defTypedSession setter', () => {
  const storage = defTypedSession<string>({ key: 'test1' });
  expect(storage.value).toEqual(null);

  storage.value = '1';
  expect(storage.value).toEqual('1');

  storage.value = null;
  expect(storage.value).toEqual(null);
});

test('defTypedSession callback', async () => {
  const ref = { value: '0' };
  const storage = defTypedSession<string>({ key: 'test1', callback: v => (ref.value = v ?? '') });
  expect(storage.value).toEqual(null);
  expect(ref.value).toEqual('');

  storage.value = '1';
  expect(ref.value).toEqual('1');

  storage.value = null;
  expect(ref.value).toEqual('');
});

test('useTypedSession', () => {
  const storage = useTypedSession<string>({ key: 'test2', init: '0' });
  expect(storage.value).toEqual('0');

  storage.value = '1';
  expect(storage.value).toEqual('1');

  storage.value = null;
  expect(storage.value).toEqual(null);
});
