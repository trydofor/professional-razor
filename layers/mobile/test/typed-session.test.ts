import { expect, test } from 'vitest';
// import { defSession } from '@razor/common/utils/typed-session';

test('defineSession setter', () => {
  const storage = defSession<string>({ key: 'test1' });
  expect(storage.value).toEqual(null);

  storage.value = '1';
  expect(storage.value).toEqual('1');

  storage.value = null;
  expect(storage.value).toEqual(null);
});
