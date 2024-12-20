import { expect, test } from 'vitest';

test('StrInt type formats', () => {
  // Correct formats (these should pass the type check)
  const good: StrInt[] = [
    '+1234567890',
    '-1234567890',
    '1234567890',
    '+0',
    '-0',
    '0',
    '0B0101',
    '0XFF',
  ];
  expect(good).toBeTruthy();

  // is not assignable to type 'StrInt'
  // const bad: StrInt[] = [
  //   '',
  //   'Infinity',
  //   'NaN',
  //   'a',
  //   '+123.5',
  //   '-123.5',
  //   '3.14e1',
  // ];
});

test('StrNum type formats', () => {
  // Correct formats (these should pass the type check)
  const good: StrNum[] = [
    '+1234567890',
    '-1234567890',
    '1234567890',
    '+123.5',
    '-123.5',
    '123.5',
    '+0',
    '-0',
    '0',
    '3.14e1',
    '0B0101',
    '0XFF',
  ];
  expect(good).toBeTruthy();

  // is not assignable to type 'StrNum'
  // const bad: StrNum[] = [
  //   '',
  //   'Infinity',
  //   'NaN',
  //   'a',
  // ];
});

test('StrDate type formats', () => {
  // Correct formats (these should pass the type check)
  const good: StrDate[] = [
    '222222-3333-4444',
    '2024-12-20',
  ];
  expect(good).toBeTruthy();

  // is not assignable to type 'StrDate'
  // const bad: StrDate[] = [
  //   '',
  //   '-2024-12-20',
  //   '2024',
  //   '2024-',
  //   '2024-12',
  //   '2024-12-',
  //   '2024-12-13.',
  //   'a-b-b',
  // ];
});

test('StrTime type formats', () => {
  // Correct formats (these should pass the type check)
  const good: StrTime[] = [
    '222222:3333:4444',
    '2024:12:20',
    '2024:12:20.567',
  ];
  expect(good).toBeTruthy();

  // is not assignable to type 'StrTime'
  // const bad: StrTime[] = [
  //   '',
  //   '2024:12:',
  //   '2024:12',
  //   '2024:',
  //   '2024',
  //   '2024:12:3.14e1',
  //   'a:b:b',
  // ];
});

test('StrDateTime type formats', () => {
  // Correct formats (these should pass the type check)
  const good: StrDateTime[] = [
    '2024-12-20 22:33:44',
    '2024-12-20T22:33:44',
    '2024-12-20 22:33:44.555',
    '2024-12-20T22:33:44.555',
  ];
  expect(good).toBeTruthy();
});
