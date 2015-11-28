/**
 * @typedef Spec
 * @type {object}
 * @property {number} minutes
 */

/**
 * Convert milliseconds
 *
 * @param {nunmber} milliseconds
 * @return {number}
 */
export function toSeconds(milliseconds) {
  return milliseconds / 1000;
}

export class Timer {
  /**
   * @param {Spec} spec
   */
  constructor(spec) {
    const now = toSeconds(Date.now());
    this.minutes = spec.minutes;
    this.timestamp = now + (this.minutes * 60);
  }
}

/**
 * Create a new timer object from a specification
 *
 * @param {Spec} spec
 * @return {Timer}
 */
export function create(spec) {
  return new Timer(spec);
}

/**
 * Return a new timer with the difference of time applied
 *
 * @param {Timer} timer
 * @param {number} milliseconds
 * @return {Timer}
 */
export function diff(timer, milliseconds) {
  const target = toSeconds(milliseconds);
  const difference = timer.timestamp - target;
  const minutes = difference / 60;
  return new Timer({minutes: timer.minutes - minutes});
}
