import { CHIPS } from './Chips';
import { BLINDS } from './Game';
import { Tournament } from './Tournament';

test('instanciation is correct?', () => {
  const tournament = new Tournament(
    [1, 0, 0],
    BLINDS[1],
    [0, 6, 0],
    6,
    CHIPS[1],
    1000
  );

  // expectedDuration
  let [h, m, s] = tournament.expectedDuration;
  expect(h).toEqual(1);
  expect(m).toEqual(0);
  expect(s).toEqual(0);

  // levelDuration
  [h, m, s] = tournament.levelDuration;
  expect(h).toEqual(0);
  expect(m).toEqual(6);
  expect(s).toEqual(0);

  // timeLeftDuration
  [h, m, s] = tournament.timeLeftDuration;
  expect(h).toEqual(0);
  expect(m).toEqual(6);
  expect(s).toEqual(0);

  // blinds
  const blinds = tournament.blinds;
  expect(blinds.length).toEqual(13);
  expect(blinds[0]).toEqual({ sb: 10, bb: 20 });
  expect(blinds[12]).toEqual({ sb: 1000, bb: 2000 });

  // currentLevel
  const currentLevel = tournament.currentLevel;
  expect(currentLevel).toEqual(0);

  // start
  const start = tournament.start;
  expect(start).toMatch(/[0-2][0-9]h[0-5][0-9]/);

  // end
  const now = new Date('2019-01-09T23:59:30');
  const end = tournament.end(now);
  expect(end).toEqual('00h59');

  // isFinished
  const isFinished = tournament.isFinished;
  expect(isFinished).toBeFalsy();

  // chips
  const chips = tournament.chips;
  expect(chips).toEqual([5, 25, 100, 500, 1000]);

  // startingStack
  const startingStack = tournament.startingStack;
  expect(startingStack).toEqual(1000);

  // nbPlayers
  const nbPlayers = tournament.nbPlayers;
  expect(nbPlayers).toEqual(6);
});

test('setter are correct?', () => {
  const tournament = new Tournament(
    [1, 0, 0],
    BLINDS[1],
    [0, 6, 0],
    6,
    CHIPS[1],
    1000
  );
  const now = new Date('2019-01-09T23:59:30');

  // get/set start
  tournament.start = now;
  const start = tournament.start;
  expect(start).toMatch('23h59');

  // get end
  const end = tournament.end(now);
  expect(end).toMatch('00h59');

  // get expectedDuration
  let [h, m, s] = tournament.expectedDuration;
  expect(h).toEqual(1);
  expect(m).toEqual(0);
  expect(s).toEqual(0);

  // set expectedDuration
  tournament.expectedDuration = [2, 0, 0];
  [h, m, s] = tournament.expectedDuration;
  expect(h).toEqual(2);
  expect(m).toEqual(0);
  expect(s).toEqual(0);

  // get levelDuration
  [h, m, s] = tournament.levelDuration;
  expect(h).toEqual(0);
  expect(m).toEqual(6);
  expect(s).toEqual(0);

  // set levelDuration
  tournament.levelDuration = [0, 12, 0];
  [h, m, s] = tournament.levelDuration;
  expect(h).toEqual(0);
  expect(m).toEqual(12);
  expect(s).toEqual(0);

  // get timeLeftDuration
  [h, m, s] = tournament.timeLeftDuration;
  expect(h).toEqual(0);
  expect(m).toEqual(12);
  expect(s).toEqual(0);
  // timeLeftDuration = levelDuration
  expect(tournament.timeLeftDuration).toEqual(tournament.levelDuration);

  // set timeLeftDuration
  tournament.timeLeftDuration = [0, 5, 30];
  [h, m, s] = tournament.timeLeftDuration
  expect(h).toEqual(0);
  expect(m).toEqual(5);
  expect(s).toEqual(30);
  expect(tournament.levelDuration).not.toEqual(tournament.timeLeftDuration);

  // set wrong timeLeftDuration
  tournament.timeLeftDuration = [1, 10, -1];
  [h, m, s] = tournament.timeLeftDuration
  expect(h).toEqual(0);
  expect(m).toEqual(5);
  expect(s).toEqual(30);

  // get blinds
  expect(tournament.blinds).toEqual(BLINDS[1]);

  // set blinds
  tournament.blinds = BLINDS[1];
  expect(tournament.blinds).toEqual(BLINDS[1]);
  tournament.blinds = BLINDS[1];
  expect(tournament.blinds).toEqual(BLINDS[1]);

  // get currentLevel
  let currentLevel = tournament.currentLevel;
  expect(currentLevel).toEqual(0);

  // set currentLevel
  tournament.currentLevel = 1;
  currentLevel = tournament.currentLevel;
  expect(currentLevel).toEqual(1);

  // set wrong currentLevel
  tournament.currentLevel = 20;
  currentLevel = tournament.currentLevel;
  expect(currentLevel).toEqual(1);
  tournament.currentLevel = -1;
  currentLevel = tournament.currentLevel;
  expect(currentLevel).toEqual(1);

  // get chips
  let chips = tournament.chips;
  expect(chips).toEqual([5, 25, 100, 500, 1000]);

  // set chips
  tournament.chips = [1, 5, 10, 25, 100, 500];
  chips = tournament.chips;
  expect(chips).toEqual([1, 5, 10, 25, 100, 500]);

  // get startingStack
  expect(tournament.startingStack).toEqual(1000);
  
  // set startingStack
  tournament.startingStack = 100;
  expect(tournament.startingStack).toEqual(100);

  // get nbPlayers
  let nbPlayers = tournament.nbPlayers;
  expect(nbPlayers).toEqual(6);

  // set nbPlayers
  tournament.nbPlayers = 8;
  nbPlayers = tournament.nbPlayers;
  expect(nbPlayers).toEqual(8);

  // simulate last level && time left finished
  tournament.currentLevel = 12;
  tournament.timeLeftDuration = [0, 0, 0];
  const isFinished = tournament.isFinished;
  expect(isFinished).toBeTruthy();
});

test('test end property when changing tournament\'s parameters', () => {
  const tournament = new Tournament(
    [1, 0, 0],
    BLINDS[1],
    [0, 6, 0],
    6,
    CHIPS[1],
    1000
  );
  const now = new Date('2019-01-09T23:59:30');

  // get/set start
  tournament.start = now;
  expect(tournament.start).toMatch('23h59');

  // get end
  expect(tournament.end(now)).toMatch('00h59');

  // simulate expectedDuration 2h
  tournament.expectedDuration = [2, 0, 0];
  tournament.levelDuration = [0, 12, 0];
  expect(tournament.end(now)).toMatch('01h59');

  // simulate expectedDuration 1h at 1st level & 1-minute left
  tournament.expectedDuration = [1, 0, 0];
  tournament.levelDuration = [0, 6, 0];
  tournament.timeLeftDuration = [0, 1, 0];
  expect(tournament.end(now)).toMatch('00h54');

  // simulate expectedDuration 3h at 2nd level & 1-minute left
  tournament.expectedDuration = [3, 0, 0];
  tournament.levelDuration = [0, 18, 0];
  tournament.currentLevel = 1;
  tournament.timeLeftDuration = [0, 1, 0];
  expect(tournament.end(now)).toMatch('02h24');

  // simulate expectedDuration 4h30 at 9th level & 1-minute left
  tournament.expectedDuration = [4, 30, 0];
  tournament.levelDuration = [0, 27, 0];
  tournament.currentLevel = 8;
  tournament.timeLeftDuration = [0, 1, 0];
  expect(tournament.end(now)).toMatch('00h27');
});