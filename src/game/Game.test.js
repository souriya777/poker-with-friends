import { CHIPS } from './Chips';
import { BLINDS, generateTournament, updateTournament, calculateStartingStack } from './Game';

test('tournament is generated', () => {
  const tournament = generateTournament(6 ,[3, 0, 0] , CHIPS[1]);

  expect(tournament.expectedDuration).toEqual([3, 0, 0]);
  expect(tournament.blinds).toEqual(BLINDS[1]);
  expect(tournament.levelDuration).toEqual([0, 18, 0]);
  expect(tournament.nbPlayers).toEqual(6);
  expect(tournament.chips).toEqual([5, 25, 100, 500, 1000]);
  expect(tournament.startingStack).toEqual(1000);
});

test('tournament is updated', () => {
  const now = new Date('2019-01-09T23:59:30');

  let tournament = generateTournament(6, [1, 0, 0], CHIPS[1]);

  expect(tournament.expectedDuration).toEqual([1, 0, 0]);
  expect(tournament.levelDuration).toEqual([0, 6, 0]);
  expect(tournament.timeLeftDuration).toEqual([0, 6, 0]);
  expect(tournament.blinds).toEqual(BLINDS[1]);
  expect(tournament.currentLevel).toEqual(0);
  tournament.start = now; // not easy to test date so it's 'en dur'
  expect(tournament.start).toMatch('23h59');
  expect(tournament.end(now)).toMatch('00h59');
  expect(tournament.isFinished).toBeFalsy();
  expect(tournament.chips).toEqual([5, 25, 100, 500, 1000]);
  expect(tournament.startingStack).toEqual(1000);
  expect(tournament.nbPlayers).toEqual(6);

  // update tournament expectedDuration
  tournament = updateTournament(tournament, CHIPS[1], [2, 0, 0], 10);

  expect(tournament.expectedDuration).toEqual([2, 0, 0]);
  expect(tournament.levelDuration).toEqual([0, 12, 0]);
  expect(tournament.timeLeftDuration).toEqual([0, 12, 0]);
  expect(tournament.blinds).toEqual(BLINDS[1]);
  expect(tournament.currentLevel).toEqual(0);
  tournament.start = now; // not easy to test date so it's 'en dur'
  expect(tournament.start).toMatch('23h59');
  expect(tournament.end(now)).toMatch('01h59');
  expect(tournament.isFinished).toBeFalsy();
  expect(tournament.chips).toEqual([5, 25, 100, 500, 1000]);
  expect(tournament.startingStack).toEqual(1000);
  expect(tournament.nbPlayers).toEqual(10);

  // update tournament duration & chips
  tournament = updateTournament(tournament, CHIPS[0], [2, 0, 0], 10);

  expect(tournament.expectedDuration).toEqual([2, 0, 0]);
  expect(tournament.levelDuration).toEqual([0, 12, 0]);
  expect(tournament.timeLeftDuration).toEqual([0, 12, 0]);
  expect(tournament.blinds).toEqual(BLINDS[0]);
  expect(tournament.currentLevel).toEqual(0);
  tournament.start = now; // not easy to test date so it's 'en dur'
  expect(tournament.start).toMatch('23h59');
  expect(tournament.end(now)).toMatch('01h59');
  expect(tournament.isFinished).toBeFalsy();
  expect(tournament.chips).toEqual([1, 5, 10, 25, 100, 500]);
  expect(tournament.startingStack).toEqual(100);
  expect(tournament.nbPlayers).toEqual(10);
});

test('levelDuration is calculated according to expecteDuration', () => {
  const nbPlayers = 6;
  const chips = CHIPS[1];

  let tournament = generateTournament(nbPlayers, [1, 0, 0], chips);
  expect(tournament.levelDuration).toEqual([0, 6, 0]);

  tournament = generateTournament(nbPlayers, [1, 30, 0], chips);
  expect(tournament.levelDuration).toEqual([0, 9, 0]);

  tournament = generateTournament(nbPlayers, [2, 0, 0], chips);
  expect(tournament.levelDuration).toEqual([0, 12, 0]);

  tournament = generateTournament(nbPlayers, [2, 30, 0], chips);
  expect(tournament.levelDuration).toEqual([0, 15, 0]);

  tournament = generateTournament(nbPlayers, [3, 0, 0], chips);
  expect(tournament.levelDuration).toEqual([0, 18, 0]);

  tournament = generateTournament(nbPlayers, [3, 30, 0], chips);
  expect(tournament.levelDuration).toEqual([0, 21, 0]);

  tournament = generateTournament(nbPlayers, [4, 0, 0], chips);
  expect(tournament.levelDuration).toEqual([0, 24, 0]);

  tournament = generateTournament(nbPlayers, [4, 30, 0], chips);
  expect(tournament.levelDuration).toEqual([0, 27, 0]);
});

test('calculate starting stack', () => {
  let startingStack = calculateStartingStack(CHIPS[0]);
  expect(startingStack).toEqual(100);

  startingStack = calculateStartingStack(CHIPS[1]);
  expect(startingStack).toEqual(1000);
});