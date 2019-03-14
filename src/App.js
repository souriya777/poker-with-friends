import React, { Component } from 'react';
import { Waypoint } from 'react-waypoint';
import { Link } from 'react-scroll';

// OWN FILES
import './App.css';
import { calculateLevelDuration } from './game/Game';
import { toDisplayingDuration, subtractOneSecond, hasExpired, isNearTheEndLevel, isTheEndLevel } from './utils/DateUtils';

// TODO simplify Game.js, Tournament.js, Chips.js

/////////////////////////////////////
//-------- GLOBAL PARAMETERS --------
/////////////////////////////////////

//-------- GENERAL --------
const ONE_SECOND = 1000;

// TODO dynamize
const TEMP_BLINDS = [ 
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
  { sb: 500, bb: 1000 },
  { sb: 750, bb: 1500 },
  { sb: 1000, bb: 2000 }, 
];

//-------- UI --------
const UI_DEFAULT_TIME_LEFT_DISPLAY = '--:--';

//-------- PERSISTENCE --------
const DB_KEY_TOTAL_DURATION = 'totalDuration';
const DB_KEY_TIME_LEFT = 'timeLeft';
const DB_KEY_CURRENT_LVL = 'currentLvl';

//-------- GAME --------
const GAME_MIN_DURATION = 1;
const GAME_MAX_DURATION = 4.5;
const GAME_STEP_DURATION = .5;


/////////////////////////////////////
//-------- APPLICATION --------
/////////////////////////////////////
class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      //-------- UI --------
      stickyMenuActive: false,
      paused: true,

      //-------- GAME --------
      totalDuration: [0, 0, 0],
      timeLeft: [0, 0, 0],
      currentLvl: 0
    };

    //-------- GENERAL --------
    this.init = this.init.bind(this);

    //-------- UI --------
    this.activateStickyMenu = this.activateStickyMenu.bind(this);
    this.deactivateStickyMenu = this.deactivateStickyMenu.bind(this);
    this.handleTotalDurationChange = this.handleTotalDurationChange.bind(this);
    this.isUserChoiceOK = this.isUserChoiceOK.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);

    //-------- PERSISTENCE --------
    this.updateDb = this.updateDb.bind(this);
    this.readDb = this.readDb.bind(this);

    //-------- GAME --------
    this.loadGame = this.loadGame.bind(this);
    this.decrementTime = this.decrementTime.bind(this);
    this.gotoPreviousLvl = this.gotoPreviousLvl.bind(this);
    this.gotoNextLvl = this.gotoNextLvl.bind(this);
    this.gotoLvl = this.gotoLvl.bind(this);
  }
  
  componentDidMount() {
    console.log('componentDidMount');
    this.init();
  }
  
  //-------- GENERAL --------
  init() {
    console.log('init');

    // load DATABASE's DATA in STATE
    const totalDuration = this.readDb(DB_KEY_TOTAL_DURATION);
    const timeLeft = this.readDb(DB_KEY_TIME_LEFT);
    const currentLvl = this.readDb(DB_KEY_CURRENT_LVL);

    if (totalDuration) {
      this.setState({ totalDuration: totalDuration });
    }
    if (timeLeft) {
      this.setState({ timeLeft: timeLeft });
    } 
    if (currentLvl) {
      this.setState({ currentLvl: currentLvl });
    }
  }

  //-------- UI --------
  activateStickyMenu() {
    console.log('sticky menu');
    this.setState({
      stickyMenuActive: true
    });
  }
  deactivateStickyMenu() {
    console.log('no sticky menu');
    this.setState({
      stickyMenuActive: false
    });
  }
  handleTotalDurationChange(e) {
    console.log('handleTotalDurationChange');
    const input = e.target.value;
    if(! this.isDurationValid(input)) {
      return;
    }
    
    const totalDuration = this.toDuration(e.target.value);
    this.setState({
      totalDuration: totalDuration
    });
  }
  isUserChoiceOK(totalDuration) {
    return this.isDurationValid(totalDuration);
  }
  play() {
    console.log('play');
    this.interval = setInterval(() => this.decrementTime(), ONE_SECOND);

    this.setState({
      paused: false
    });
  }
  pause() {
    console.log('pause');
    clearInterval(this.interval);

    this.setState({
      paused: true
    });
  }
  previous() {
    console.log('previous');
    this.gotoPreviousLvl();
  }
  next() {
    console.log('next');
    this.gotoNextLvl();
  }


  //-------- PERSISTENCE --------
  updateDb(key, val) {
    console.log('updateDb');
    if (val !== undefined) {
      localStorage.setItem(key, JSON.stringify(val));
    }
  }
  readDb(key) {
    console.log('readDb');
    return JSON.parse(localStorage.getItem(key));
  };


  //-------- GAME --------
  loadGame() {
    console.log('loadGame');
    let totalDuration, timeLeft, currentLvl;

    // 2 CASES
    // The 1st time
    // totalDuration is previously in STATE (see. handleTotalDurationChange)
    totalDuration = this.state.totalDuration;
    timeLeft = calculateLevelDuration(totalDuration);
    currentLvl = 0;

    // The other times

    // update STATE
    this.setState({
      totalDuration: totalDuration,
      timeLeft: timeLeft,
      currentLvl: currentLvl
    });

    // update DB
    this.updateDb(DB_KEY_TOTAL_DURATION, totalDuration);
    this.updateDb(DB_KEY_TIME_LEFT, timeLeft);
    this.updateDb(DB_KEY_CURRENT_LVL, currentLvl);
  }
  decrementTime() {
    console.log('decrementTime');
    // subtract 1 sec.
    const timeLeft = this.state.timeLeft
    const newVal = subtractOneSecond(timeLeft)

    // update STATE
    this.setState({
      timeLeft: newVal
    });

    // update DB
    this.updateDb(DB_KEY_TIME_LEFT, newVal);

    // when 00:00 is reached, throw an event
    // stop game OR go to next level
  }
  gotoPreviousLvl() {
    console.log('gotoPreviousLvl');
    const newLvl = this.state.currentLvl - 1;
    this.gotoLvl(newLvl);
  }
  gotoNextLvl() {
    console.log('gotoNextLvl');
    const newLvl = this.state.currentLvl + 1;
    this.gotoLvl(newLvl);
  }
  gotoLvl(lvl) {
    console.log('gotoLvl');

    // FIXME move functionnal code?
    // check if action is possible
    if(lvl < 0 || lvl >= TEMP_BLINDS.length) {
      return;
    }

    // update STATE
    this.setState({currentLvl: lvl});

    // update DB
    this.updateDb(DB_KEY_CURRENT_LVL, lvl)

    // TODO play sound

  }

  //-------- UTILS --------
  isDurationValid(input) {
    console.log('isDurationValid');
    return (input !== '' && !Number.isNaN(input)
            && input >= GAME_MIN_DURATION && input <= GAME_MAX_DURATION 
            && (input % GAME_STEP_DURATION === 0));
  }
  toDisplayingLvl(input) {
    return input + 1;
  }
  // convert 1.5 to [1, 30, 0]
  toDuration(myNumber) {
    const val = myNumber.replace(',', '.');
    const h = Math.trunc(val);
    const m = (val - h) * 60;

    return [h, m, 0];
  }
   // convert [1, 30, 0] to 1.5
  toNumber(duration) {
    const [h, m] = duration;
    return (h === 0 && m === 0) ? '' : h + (m / 60);
  }


  render() {
    // /!\ 2 WARNINGS
    // due to react, some attributs must have been renamed (eg. stroke-linejoin => strokeLinejoin, class => className etc...)

    // TODO split HTML code

    //-------- GAME --------
    const totalDuration = this.state.totalDuration;
    const timeLeft = this.state.timeLeft;
    const currentLvl = this.state.currentLvl;
    const paused = this.state.paused;

    //-------- UI --------
    const totalDurationDisplay = this.toNumber(totalDuration);
    const isUserChoiceOK = this.isUserChoiceOK(totalDurationDisplay);

    const SCROLL_DURATION = 1000;
    const stickyMenuActive = this.state.stickyMenuActive;

    // TODO move in his own component
    let button;
    let text = 'c\'est parti !';
    let cssClass = 'material-btn';
    if (isUserChoiceOK) {
      button = <Link to="game" 
                smooth={true} 
                duration={SCROLL_DURATION} 
                className={cssClass + ' active'} 
                onClick={this.loadGame}>{text}</Link>;
    } else {
      button = <a href="#invalid" className={cssClass}>{text}</a>;
    }

    return (
      <div className="App">
        <header id="parameters">
          <nav className={stickyMenuActive ? 'sticky' : ''}>
            <div className="row">
              <div className="logo">
                {/* smooth scroll */}
                <Link to="parameters" smooth={true} duration={SCROLL_DURATION}>
                  <svg version="1.1" viewBox="0.0 0.0 100.0 100.0" fill="none" stroke="none" strokeLinecap="square" strokeMiterlimit="10" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l100.0 0l0 100.0l-100.0 0l0 -100.0z" clipRule="nonzero"/></clipPath><g clipPath="url(#p.0)"><path fill="#000000" fillOpacity="0.0" d="m0 0l100.0 0l0 100.0l-100.0 0z" fillRule="evenodd"/><path fill="#000000" fillOpacity="0.0" d="m12.414699 5.5564303l72.72441 0l0 72.72441l-72.72441 0z" fillRule="evenodd"/><path stroke="#ffffff" strokeWidth="1.0" strokeLinejoin="round" strokeLinecap="butt" d="m12.414699 5.5564303l72.72441 0l0 72.72441l-72.72441 0z" fillRule="evenodd"/><path fill="#000000" fillOpacity="0.0" d="m20.0 15.509185l60.0 0l0 56.031494l-60.0 0z" fillRule="evenodd"/><path fill="#ffffff" d="m34.5244 17.840553l-6.25 -0.953125l0 -4.000001l10.640625 0q2.890625 0 5.6875 -0.25q4.3125 -0.3125 8.15625 -0.3125q11.59375 0.078125 16.390625 4.328126q4.8125 4.234375 4.8125 12.796875q0 6.390625 -2.96875 11.109375q-2.953125 4.71875 -8.203125 7.203125q-5.234375 2.484375 -12.03125 2.484375q-2.3125 0 -4.71875 -0.109375q-2.40625 -0.125 -2.953125 -0.21875l0 17.609375l10.953125 0.875l0 3.921875l-26.15625 0l0 -3.921875l6.640625 -0.796875l0 -49.765625zm8.5625 27.6875q2.234375 0.390625 7.671875 0.390625q6.328125 0 10.28125 -3.828125q3.953125 -3.84375 3.953125 -12.5625q0 -6.890625 -3.4375 -9.890625q-3.4375 -3.0 -10.71875 -3.0q-2.5625 0 -5.4375 0.328125q-1.765625 0.15625 -2.3125 0.15625l0 28.40625z" fillRule="nonzero"/><path fill="#000000" fillOpacity="0.0" d="m-6.4566927 74.062996l112.91339 0l0 20.377953l-112.91339 0z" fillRule="evenodd"/><path fill="#ffffff" d="m5.5589323 85.14925q1.0625 0 1.671875 0.515625q0.609375 0.5 0.609375 1.390625q0 0.90625 -0.609375 1.421875q-0.609375 0.5 -1.671875 0.5l-1.515625 0l0 1.765625l-0.59375024 0l0 -5.59375l2.1093752 0zm-0.03125 3.3125q0.84375 0 1.28125 -0.359375q0.4375 -0.375 0.4375 -1.046875q0 -0.671875 -0.4375 -1.03125q-0.4375 -0.375 -1.28125 -0.375l-1.484375 0l0 2.8125l1.484375 0zm6.118927 2.328125q-0.828125 0 -1.515625 -0.375q-0.671875 -0.375 -1.046875 -1.015625q-0.375 -0.640625 -0.375 -1.453125q0 -0.8125 0.375 -1.453125q0.375 -0.65625 1.046875 -1.015625q0.6875 -0.375 1.515625 -0.375q0.828125 0 1.5 0.375q0.671875 0.359375 1.046875 1.015625q0.390625 0.640625 0.390625 1.453125q0 0.8125 -0.390625 1.46875q-0.375 0.640625 -1.046875 1.015625q-0.671875 0.359375 -1.5 0.359375zm0 -0.53125q0.671875 0 1.203125 -0.296875q0.53125 -0.296875 0.828125 -0.828125q0.3125 -0.53125 0.3125 -1.1875q0 -0.65625 -0.3125 -1.1875q-0.296875 -0.53125 -0.828125 -0.828125q-0.53125 -0.3125 -1.203125 -0.3125q-0.65625 0 -1.203125 0.3125q-0.546875 0.296875 -0.859375 0.828125q-0.296875 0.53125 -0.296875 1.1875q0 0.65625 0.296875 1.1875q0.3125 0.53125 0.859375 0.828125q0.546875 0.296875 1.203125 0.296875zm5.993163 -2.140625l-1.140625 1.15625l0 1.46875l-0.59374905 0l0 -5.59375l0.59374905 0l0 3.375l3.296875 -3.375l0.671875 0l-2.421875 2.53125l2.59375 3.0625l-0.703125 0l-2.296875 -2.625zm7.9223022 2.109375l0 0.515625l-3.96875 0l0 -5.59375l3.84375 0l0 0.5l-3.25 0l0 2.0l2.90625 0l0 0.5l-2.90625 0l0 2.078125l3.375 0zm5.2113037 0.515625l-1.28125 -1.796875q-0.21875 0.015625 -0.4375 0.015625l-1.515625 0l0 1.78125l-0.59375 0l0 -5.59375l2.109375 0q1.0625 0 1.671875 0.515625q0.609375 0.5 0.609375 1.390625q0 0.65625 -0.34375 1.109375q-0.328125 0.453125 -0.9375 0.65625l1.375 1.921875l-0.65625 0zm-1.75 -2.28125q0.84375 0 1.28125 -0.359375q0.4375 -0.375 0.4375 -1.046875q0 -0.671875 -0.4375 -1.03125q-0.4375 -0.375 -1.28125 -0.375l-1.484375 0l0 2.8125l1.484375 0zm13.489275 -3.3125l-1.875 5.59375l-0.625 0l-1.640625 -4.78125l-1.65625 4.78125l-0.609375 0l-1.890625 -5.59375l0.609375 0l1.609375 4.8125l1.671875 -4.8125l0.5625 0l1.640625 4.828125l1.640625 -4.828125l0.5625 0zm1.2003784 0l0.59375 0l0 5.59375l-0.59375 0l0 -5.59375zm3.5097198 0.5l-1.96875 0l0 -0.5l4.53125 0l0 0.5l-1.96875 0l0 5.09375l-0.59375 0l0 -5.09375zm8.185684 -0.5l0 5.59375l-0.578125 0l0 -2.578125l-3.515625 0l0 2.578125l-0.59375 0l0 -5.59375l0.59375 0l0 2.484375l3.515625 0l0 -2.484375l0.578125 0zm4.5061493 0.5l0 2.203125l2.90625 0l0 0.515625l-2.90625 0l0 2.375l-0.59375 0l0 -5.59375l3.84375 0l0 0.5l-3.25 0zm8.2983055 5.09375l-1.28125 -1.796875q-0.21875 0.015625 -0.4375 0.015625l-1.515625 0l0 1.78125l-0.59375 0l0 -5.59375l2.109375 0q1.0625 0 1.671875 0.515625q0.609375 0.5 0.609375 1.390625q0 0.65625 -0.34375 1.109375q-0.328125 0.453125 -0.9375 0.65625l1.375 1.921875l-0.65625 0zm-1.75 -2.28125q0.84375 0 1.28125 -0.359375q0.4375 -0.375 0.4375 -1.046875q0 -0.671875 -0.4375 -1.03125q-0.4375 -0.375 -1.28125 -0.375l-1.484375 0l0 2.8125l1.484375 0zm3.7057953 -3.3125l0.59375 0l0 5.59375l-0.59375 0l0 -5.59375zm6.38472 5.078125l0 0.515625l-3.96875 0l0 -5.59375l3.84375 0l0 0.5l-3.25 0l0 2.0l2.90625 0l0 0.5l-2.90625 0l0 2.078125l3.375 0zm6.0706787 -5.078125l0 5.59375l-0.484375 0l-3.609375 -4.546875l0 4.546875l-0.59375 0l0 -5.59375l0.5 0l3.609375 4.53125l0 -4.53125l0.578125 0zm1.8164215 0l2.28125 0q0.890625 0 1.5625 0.359375q0.6875 0.34375 1.0625 0.984375q0.375 0.640625 0.375 1.453125q0 0.8125 -0.375 1.453125q-0.375 0.625 -1.0625 0.984375q-0.671875 0.359375 -1.5625 0.359375l-2.28125 0l0 -5.59375zm2.25 5.078125q0.734375 0 1.28125 -0.28125q0.5625 -0.296875 0.859375 -0.8125q0.3125 -0.515625 0.3125 -1.1875q0 -0.671875 -0.3125 -1.1875q-0.296875 -0.515625 -0.859375 -0.8125q-0.546875 -0.296875 -1.28125 -0.296875l-1.65625 0l0 4.578125l1.65625 0zm5.904785 0.5625q-0.625 0 -1.203125 -0.203125q-0.5625 -0.203125 -0.875 -0.53125l0.234375 -0.453125q0.296875 0.3125 0.796875 0.5q0.515625 0.1875 1.046875 0.1875q0.75 0 1.125 -0.28125q0.375 -0.28125 0.375 -0.71875q0 -0.328125 -0.203125 -0.53125q-0.203125 -0.203125 -0.5 -0.3125q-0.296875 -0.109375 -0.8125 -0.234375q-0.640625 -0.15625 -1.015625 -0.296875q-0.375 -0.15625 -0.640625 -0.453125q-0.265625 -0.3125 -0.265625 -0.828125q0 -0.421875 0.21875 -0.765625q0.21875 -0.359375 0.6875 -0.5625q0.46875 -0.203125 1.15625 -0.203125q0.484375 0 0.9375 0.125q0.453125 0.125 0.796875 0.359375l-0.203125 0.46875q-0.34375 -0.21875 -0.75 -0.328125q-0.40625 -0.125 -0.78125 -0.125q-0.734375 0 -1.109375 0.28125q-0.375 0.28125 -0.375 0.734375q0 0.328125 0.203125 0.53125q0.203125 0.203125 0.515625 0.3125q0.3125 0.109375 0.828125 0.234375q0.609375 0.15625 0.984375 0.3125q0.390625 0.140625 0.65625 0.453125q0.265625 0.296875 0.265625 0.796875q0 0.421875 -0.234375 0.78125q-0.21875 0.34375 -0.703125 0.546875q-0.46875 0.203125 -1.15625 0.203125z" fillRule="nonzero"/></g></svg>
                </Link>
              </div>
              <div className="progression">
                <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid" className="icon" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path>
                </svg>
                <span className="hour">d&eacute;but : 20h30 &mdash; fin : <span className={paused ? 'end deleted' : 'end'}>23h00</span> (lvl: <span className="lvl">{this.toDisplayingLvl(currentLvl)}</span>)</span>
              </div>
              <ul className="main-nav">
                {/* smooth scroll */}
                <li><Link to="parameters" smooth={true} duration={SCROLL_DURATION}>Configurer</Link></li>
                <li><Link to="game" smooth={true} duration={SCROLL_DURATION}>Jouer</Link></li>
              </ul>
            </div>
          </nav>
          {/* HOW TO MANAGE CLEAN CODE WITH WAYPOINT? */}
          <Waypoint
            onEnter={this.deactivateStickyMenu}
            onLeave={this.activateStickyMenu}
            topOffset="-30%"
          />
          {/*  */}
          <div className="one-minute-box">
            <div className="slogan">
              <h1>Il suffit d&apos;une minute<br /> pour créer une partie de poker.</h1>
            </div>
            <div className="parameters">
              <form action="" id="parameters-form">
                <input type="number" 
                        placeholder="Durée (H)" 
                        className="total-duration" 
                        value={totalDurationDisplay}
                        onChange={this.handleTotalDurationChange}
                        min="1" max="4.5" step="0.5" required />
                {/* VALIDATION BUTTON */}
                {button}
              </form>
            </div>
          </div>
        </header>
        <section className="section-game" id="game">
          {/* HOW TO MANAGE CLEAN CODE WITH WAYPOINT? */}
          <Waypoint
            onEnter={this.activateStickyMenu}
          />
          <div className="clock">
              <div className={paused ? 'time paused' : 'time'}>{isUserChoiceOK ? toDisplayingDuration(timeLeft) : UI_DEFAULT_TIME_LEFT_DISPLAY}</div>
              <div className="control">
                  {/* PREVIOUS button */}
                  <div onClick={this.previous}>
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid" className="game-button" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path>
                    </svg>
                  </div>
                  {/* PLAY button */}
                  <div className={paused ? 'play-button active' : 'play-button'} onClick={this.play}>
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid" className="game-button" xmlns="http://www.w3.org/2000/svg">
                      <g><path d="M8 5v14l11-7z"></path></g>
                    </svg>
                  </div>
                  {/* PAUSE button */}
                  <div className={paused ? 'pause-button' : 'pause-button active'} onClick={this.pause}>
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid" className="game-button" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
                    </svg>
                  </div>
                  {/* NEXT button */}
                  <div onClick={this.next}>
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid" className="game-button" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path>
                    </svg>
                  </div>
              </div>
          </div>
          <Blinds blinds={TEMP_BLINDS} currentLvl={currentLvl} />
        </section>
      </div>
    );
  }
}

class Blinds extends Component {
  constructor(props) {
    super(props);
    this.html = this.html.bind(this);
  }

  html(elt, index) {
    const currentLvl = this.props.currentLvl;
    let cssClass;

    if (index < currentLvl) {
      cssClass = 'ended';
    } else if (index === currentLvl) {
      cssClass = 'current';
    } else if (index === (currentLvl + 1)) {
        cssClass = 'next-1';
    } else if (index === (currentLvl + 2)) {
      cssClass = 'next-2';
    } else {
      cssClass = 'next';
    }
  
    return <div key={elt.sb} className={cssClass}>{elt.sb} / {elt.bb}</div>;
  }

  render() {
    const blinds = this.props.blinds;
    const blindsList = blinds.map(this.html);
    return (
      <div className="blinds">{blindsList}</div>
    );
  }
}


export default App;
