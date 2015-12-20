import {EventEmitter} from 'events';

/**
 * @typedef TimeState
 * @type {object}
 * @property {number} minutes
 * @property {number} seconds
 */

 const floor = Math.floor;
 const round = Math.round;

/**
 * Internal data structure for time data
 */
class Timer {
  /**
   * @param {TimeState} state
   * @param {EventEmitter} emitter
   * @param {number} intervalID
   */
  constructor(state, emitter, intervalID) {
    const { minutes, seconds } = state;
    this.state = state;
    this.emitter = emitter;
    this.intervalID = intervalID;
    if (typeof emitter === 'undefined') {
      this.emitter = new EventEmitter();
    }
  }

  /**
   * Delegates to composed emitter
   *
   * @param {string} event
   * @param {...*} args
   * @returns {Timer}
   */
  emit(event, ...args) {
    this.emitter.emit(event, ...args);
    return this;
  }

  /**
   * Delegates to composed emitter
   *
   * @param {string} event
   * @param {function} listener
   * @returns {Timer}
   */
  on(event, listener) {
    this.emitter.on(event, listener);
    return this;
  }
}

/**
 * Ensure the time state object is in a valid state
 *
 * @param {TimeState} state
 * @returns {TimeState}
 */
function validate(state) {
  const givenSeconds = state.seconds || 0;
  const modifier = givenSeconds / 60;
  const minutes = (state.minutes || 0) + floor(modifier);
  const seconds = round(modifier % 1 * 60);
  return { minutes, seconds };
}

/**
 * Check timer for expiration
 *
 * @param {Timer} timer
 * @returns {Timer}
 */
function check(timer) {
  const { minutes, seconds } = timer.state;

  if (minutes <= 0 && seconds <= 0) {
    return stop(timer);
  }

  return timer;
}

/**
 * Create a new timer object from a TimeState
 *
 * @param {TimeState} state
 * @returns {Timer}
 */
export function create(state = {}) {
  return new Timer(validate(state));
}

/**
 * Decrement the timer's seconds and return a new timer
 *
 * @param {Timer} timer
 * @returns {Timer}
 */
export function tick(timer) {
  const ticked = timer.state.seconds - 1;
  const seconds = ticked < 0 ? 59 : ticked;
  const minutes = ticked < 0 ? timer.state.minutes - 1 : timer.state.minutes;
  const newTimer = new Timer({minutes, seconds}, timer.emitter, timer.intervalID);
  return newTimer.emit('tick', newTimer);
}

/**
 * Update the state of the timer
 *
 * @param {TimeState} state
 * @returns {Timer}
 */
export function update(timer, state) {
  const validated = validate(state);
  const newTimer = new Timer(validated, timer.emitter, timer.intervalID);
  return newTimer.emit('update', newTimer);
}

/**
 * Start the given timer
 *
 * @param {Timer} timer
 * @returns {Timer}
 */
export function start(timer) {
  const { state, emitter } = timer;

  timer.emit('start', timer);

  let started = new Timer(
    state,
    emitter,
    setInterval(() => started = check(tick(started)), 1000)
  );

  return started;
}

/**
 * Stop the given timer
 *
 * @param {Timer} timer
 * @returns {Timer}
 */
export function stop(timer) {
  const { state, emitter, intervalID } = timer;
  clearInterval(intervalID);
  const stopped = new Timer(state, emitter);
  return stopped.emit('stop', stopped);
}
