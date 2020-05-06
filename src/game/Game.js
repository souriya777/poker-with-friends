import { Tournament } from './Tournament';
import { CHIPS } from './Chips';

// see https://docs.google.com/spreadsheets/d/1nGHYvef9HzzNzFLP3r9zFiMbMX7tdMbjLZhdbo4nz3w/edit#gid=1707376382
// see https://poker.stackexchange.com/questions/203/looking-for-the-bb-m-math-to-build-good-nlhe-tourney-blind-structures
// see https://www.pokereagles.com/home-poker/tournament-blinds.php
// FIXME not export const ?
export const BLINDS_EAGLES =  [
  [ 
    { sb: 1, bb: 2 },
    { sb: 2, bb: 4 },
    { sb: 3, bb: 6 },
    { sb: 5, bb: 10 },
    { sb: 7, bb: 14 },
    { sb: 10, bb: 20 },
    { sb: 15, bb: 30 },
    { sb: 20, bb: 40 },
    { sb: 30, bb: 60 },
    { sb: 40, bb: 80 },
    { sb: 50, bb: 100 }, // USUALLY END LVL
    { sb: 75, bb: 150 },
    { sb: 100, bb: 200 }, 
  ],
  [ 
    { sb: 10, bb: 20 },
    { sb: 20, bb: 40 },
    { sb: 30, bb: 60 },
    { sb: 50, bb: 100 },
    { sb: 75, bb: 150 },
    { sb: 100, bb: 200 },
    { sb: 150, bb: 300 },
    { sb: 200, bb: 400 },
    { sb: 300, bb: 600 },
    { sb: 400, bb: 800 },
    { sb: 500, bb: 1000 }, // USUALLY END LVL
    { sb: 750, bb: 1500 },
    { sb: 1000, bb: 2000 }, 
  ]
];

export const BLINDS = BLINDS_EAGLES;

// PREF DISPLAYING
export const NB_OF_LEVEL_DISPLAYED = 3;

// [h, m, s] => expectedDuration
export const generateTournament = (
  nbPlayers = 6, 
  [h, m, s] = [3, 0, 0], 
  chips = CHIPS[1]
) => {
  const startingStack = calculateStartingStack(chips);
  const blinds = calculateBlinds(chips);
  const levelDuration = calculateLevelDuration([h, m, s]);
  
  return new Tournament([h, m, s], blinds, levelDuration, nbPlayers, chips, startingStack);
};

export const updateTournament = (tournament, chips, expectedDuration, nbPlayers) => {
  const levelDuration = calculateLevelDuration(expectedDuration);

  tournament.expectedDuration = expectedDuration;
  tournament.levelDuration = levelDuration;
  tournament.chips = chips;
  tournament.nbPlayers = nbPlayers;
  
  // reinit tournament
  tournament.start = new Date();
  tournament.currentLevel = 0;
  tournament.startingStack = calculateStartingStack(chips);
  tournament.blinds = calculateBlinds(chips);

  return tournament;
};

// [h, m, s] => expectedDuration
export const calculateLevelDuration = ([h, m, s]) => {
  // FIXME for testing App
  // return [0, 1, 2];
  // return [0, 0, 6];

  switch(h) {
    case 2 : 
      return (m === 30) ? [0, 15, 0] : [0, 12, 0];
    case 3 : 
      return (m === 30) ? [0, 21, 0] : [0, 18, 0];
    case 4 : 
      return (m === 30) ? [0, 27, 0] : [0, 24, 0];
    default: 
      return (m === 30) ? [0, 9, 0] : [0, 6, 0];
  }
};

export const calculateStartingStack = (chips) => {
  return (chips === CHIPS[0]) ? 200 : 2000;
};

export const calculateBlinds = (chips) => {
  return (chips === CHIPS[0]) ? BLINDS_EAGLES[0] : BLINDS_EAGLES[1];
};