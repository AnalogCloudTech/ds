import { Duration } from 'luxon';

export const millisecondsToHuman = (ms = 0) => {
  const dur = Duration.fromObject({ milliseconds: ms });
  return dur.shiftTo('hours', 'minutes', 'seconds', 'milliseconds').toObject();
};

export const toTwoDigits = (num = 0) => {
  if (num < 10) {
    return ('0' + num).slice(-2);
  }
  return num;
};
