import { HOUR_SEPARATOR, padNumber, hasExpired } from '../utils/DateUtils';
let moment = require('moment');

export class Tournament {
  // [h, m, s] => expectedDuration
  // [h, m, s] => levelDuration
  constructor([h, m, s], blinds, [h2, m2, s2], nbPlayers, chips, startingStack) {
    // pojo initialization
    this._expectedDuration = [h, m, s];
    this._blinds = blinds;
    this._levelDuration = [h2, m2, s2];
    this._nbPlayers = nbPlayers;
    this._chips = chips;
    this._startingStack = startingStack;
    
    // special initialization
    const now = new Date();
    this.start = now;
    this._currentLevel = 0;
    this._timeLeftDuration = this._levelDuration;

    // binding
    this.expectedEndLevel = this.expectedEndLevel.bind(this);
  }

  get expectedDuration() {
    return this._expectedDuration;
  }

  set expectedDuration(expectedDuration) {
    this._expectedDuration = expectedDuration;
  }

  get levelDuration() {
    return this._levelDuration;
  }

  set levelDuration(levelDuration) {
    this._levelDuration = levelDuration;
    // we have to update timeLeftDuration too
    this.timeLeftDuration = levelDuration;
  }

  get timeLeftDuration() {
    return this._timeLeftDuration;
  }

  set timeLeftDuration([h, m, s]) {
    if(h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) {
      return;
    }
    this._timeLeftDuration = [h, m, s];
  }

  get blinds() {
    return this._blinds;
  }

  set blinds(blinds) {
    this._blinds = blinds;
  }

  get currentLevel() {
    return this._currentLevel;
  }

  set currentLevel(level) {
    if(level < 0 || level >= this.blinds.length) {
      return;
    }
    this._currentLevel = level;

    // reset time left duration
    this._timeLeftDuration = this._levelDuration;
  }

  get start() {
    const [h, m] = this._start;
    return padNumber(h) + 
            HOUR_SEPARATOR + 
            padNumber(m);
  }

  set start(now) {
    this._start = [
      now.getHours(), 
      now.getMinutes(), 
      now.getSeconds()
    ];
  }

  // args :
  // - now : current date
  end(now) {
    const endLevelIndex = this.blinds.findIndex(this.expectedEndLevel);
    const remainingLevel = endLevelIndex - (this._currentLevel + 1);
    const [h, m, s] = this.timeLeftDuration;
    const [h2, m2, s2] = this.levelDuration;

    const currentLevelDuration = moment.duration()
                                 .add(h, 'hours')
                                 .add(m, 'minutes')
                                 .add(s, 'seconds');
    const remainingLevelDuration = moment.duration()
                                   .add(h2 * remainingLevel, 'hours')
                                   .add(m2 * remainingLevel, 'minutes')
                                   .add(s2 * remainingLevel, 'seconds');
    
    const result = moment.duration({
                      hours: now.getHours(),
                      minutes: now.getMinutes(),
                      seconds: now.getSeconds()
                    })
                   .add(currentLevelDuration)
                   .add(remainingLevelDuration);

    return padNumber(result.hours()) +
            HOUR_SEPARATOR + 
            padNumber(result.minutes());
  }

  get isFinished() {
    return (this.currentLevel === this.blinds.length - 1) &&
              hasExpired(this.timeLeftDuration);
  }

  get chips() {
    return this._chips;
  }

  set chips(chips) {
    this._chips = chips;
  }

  get startingStack() {
    return this._startingStack;
  }

  set startingStack(stack) {
    this._startingStack = stack;
  }

  get nbPlayers() {
    return this._nbPlayers;
  }

  set nbPlayers(nbPlayers) {
    this._nbPlayers = nbPlayers;
  }

  expectedEndLevel(blind) {
    return blind.bb >= this.startingStack;
  }
};