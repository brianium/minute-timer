import {EventEmitter} from 'events';

/**
 * @param {number}
 * @returns {number}
 */
const floor = Math.floor;

/**
 * @typedef TimeState
 * @type {object}
 * @property {number} minutes
 * @property {number} seconds
 */

/**
 * Convert milliseconds to seconds
 *
 * @param {nunmber} milliseconds
 * @returns {number}
 */
function toSeconds(milliseconds) {
  return milliseconds / 1000;
}

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
    const now = toSeconds(Date.now());
    const { minutes, seconds } = state;
    this.state = state;
    this.emitter = emitter;
    this.intervalID = intervalID;
    this.timestamp = now + seconds + minutes * 60;
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
 * @param {TimeState}
 * @returns {TimeState}
 */
function validate(state) {
  const minutes = state.minutes || 1;
  const seconds = state.seconds || 0;
  return { minutes, seconds };
}

/**
 * Create a new timer object from a specification
 *
 * @param {TimeState} state
 * @returns {Timer}
 */
export function create(state = {}) {
  return new Timer(validate(state));
}

/**
 * Return a new timer with the difference of time applied
 *
 * @param {Timer} timer
 * @param {number} milliseconds
 * @returns {Timer}
 */
export function diff(timer, milliseconds) {
  const target = toSeconds(milliseconds);
  const difference = timer.timestamp - target;

  const minutes = timer.state.minutes - difference / 60;
  const seconds = floor((minutes % 1) * 60);

  const diffed = new Timer({minutes: floor(minutes), seconds}, timer.emitter);
  return diffed.emit('diff', diffed)
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
  return new Timer(state, emitter, setInterval(() => diff(timer, Date.now()), 1000));
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
