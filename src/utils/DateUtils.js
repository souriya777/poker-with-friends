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