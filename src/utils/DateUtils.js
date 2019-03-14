let moment = require('moment');

export const TIME_SEPERATOR = ':';
export const HOUR_SEPARATOR = 'h';

export const subtractOneSecond = ([h, m, s]) => {
  if (hasExpired([h, m, s])) {
    return [h, m, s];
  } else {
    const result = moment.duration({
                    hours: h,
                    minutes: m,
                    seconds: s
                  })
                  .subtract(1, 'seconds');
    return [result.hours(), result.minutes(), result.seconds()]
  }
};

export const hasExpired = ([h, m, s]) => {
  return (h === 0 && m === 0 && s === 0);
};

export const isNearTheEndLevel = ([h, m, s]) => {
  return h === 0 && m === 1 && s === 0;
};

export const isTheEndLevel = ([h, m, s]) => {
  return h === 0 && m === 0 && s <= 5;
};

export const padNumber = (myDigit) => {
  return (''+myDigit).padStart(2, '0');
}

export const toDisplayingDuration = ([h, m, s]) => {
  const result = moment.duration({
    hours: h,
    minutes: m,
    seconds: s
  });
  return padNumber(result.minutes())
            + TIME_SEPERATOR
            + padNumber(result.seconds());
};

// TODO add test
// FIXME rename
export const toDisplayingStartTime = () => {
  const now = new Date();
  return padNumber(now.getHours()) + 
          HOUR_SEPARATOR + 
          padNumber(now.getMinutes());
}
// TODO add test
// FIXME rename
export const toDisplayingEndTime = (now, timeLeft, currentLvl, lvlDuration, usuallyEndLvl) => {
  const remainingLvl = usuallyEndLvl - (currentLvl + 1);
  const [h, m, s] = timeLeft;
  const [h2, m2, s2] = lvlDuration;

  const currentLvlDuration = moment.duration()
                               .add(h, 'hours')
                               .add(m, 'minutes')
                               .add(s, 'seconds');
  const remainingLvlDuration = moment.duration()
                                 .add(h2 * remainingLvl, 'hours')
                                 .add(m2 * remainingLvl, 'minutes')
                                 .add(s2 * remainingLvl, 'seconds');
  
  const result = moment.duration({
                    hours: now.getHours(),
                    minutes: now.getMinutes(),
                    seconds: now.getSeconds()
                  })
                 .add(currentLvlDuration)
                 .add(remainingLvlDuration);

return padNumber(result.hours()) + 
        HOUR_SEPARATOR + 
        padNumber(result.minutes());
}