import { toDisplayingDuration, subtractOneSecond, hasExpired, isNearTheEndLevel, isTheEndLevel } from './DateUtils';

test('toDisplayingDuration: convert a duration into displaying time format (eg. 14:59)', () => {
  const displayingTime = toDisplayingDuration([0, 45, 56]);
  expect(displayingTime).toEqual('45:56');

  const displayingTime2 = toDisplayingDuration([0, 2, 1]);
  expect(displayingTime2).toEqual('02:01');
});

test('subtractOneSecond: decrement duration of 1 second', () => {
  const [h, m, s] = subtractOneSecond([0, 15, 0]);
  expect(h).toEqual(0);
  expect(m).toEqual(14);
  expect(s).toEqual(59);
});

test('subtractOneSecond: decrement duration when duration is 00:00', () => {
  const [h, m, s] = subtractOneSecond([0, 0, 0]);
  expect(h).toEqual(0);
  expect(m).toEqual(0);
  expect(s).toEqual(0);
});

test('hasExpired: time has expired?', () => {
  const finished = hasExpired([0, 0, 0]);
  expect(finished).toBe(true);

  const finished2 = hasExpired([0, 0, 1]);
  expect(finished2).toBe(false);
});

test('test duration, and predict if near the end or not ', () => {
  let expected = isNearTheEndLevel([1, 0, 1]);
  expect(expected).toBeFalsy();

  expected = isNearTheEndLevel([0, 1, 0]);
  expect(expected).toBeTruthy();

  expected = isNearTheEndLevel([0, 0, 59]);
  expect(expected).toBeFalsy();
});

test('test duration, and predict if the end or not ', () => {
  // false cases
  let expected = isTheEndLevel([1, 0, 0]);
  expect(expected).toBeFalsy();

  expected = isTheEndLevel([0, 1, 0]);
  expect(expected).toBeFalsy();
  
  expected = isTheEndLevel([0, 0, 6]);
  expect(expected).toBeFalsy();

  // true cases
  expected = isTheEndLevel([0, 0, 5]);
  expect(expected).toBeTruthy();

  expected = isTheEndLevel([0, 0, 4]);
  expect(expected).toBeTruthy();

  expected = isTheEndLevel([0, 0, 3]);
  expect(expected).toBeTruthy();

  expected = isTheEndLevel([0, 0, 2]);
  expect(expected).toBeTruthy();

  expected = isTheEndLevel([0, 0, 1]);
  expect(expected).toBeTruthy();

  expected = isTheEndLevel([0, 0, 0]);
  expect(expected).toBeTruthy();
});