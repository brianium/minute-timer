import {EventEmitter} from 'events';

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
   */
  constructor(state, emitter) {
    const now = toSeconds(Date.now());
    this.minutes = state.minutes;
    this.seconds = state.seconds || 0;
    this.timestamp = now + this.seconds + this.minutes * 60;
    this.emitter = emitter;
    if (typeof emitter === 'undefined') {
      this.emitter = new EventEmitter();
    }
  }

  /**
   * Delegates to composed emitter
   *
   * @param {string} event
   * @param {...*} args
   * @return
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
 * Create a new timer object from a specification
 *
 * @param {TimeState} state
 * @returns {Timer}
 */
export function create(state) {
  return new Timer(state);
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
  const minutes = difference / 60;
  const diffed = new Timer({minutes: timer.minutes - minutes}, timer.emitter);
  return diffed.emit('diff', diffed)
}
