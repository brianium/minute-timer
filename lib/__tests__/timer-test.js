import * as timer from '../timer';
import {EventEmitter} from 'events';

describe('timer', function () {
  /**
   * @type {Time}
   */
  let result;

  const minutes = 3;

  beforeEach(() => {
    result = timer.create({
      minutes
    });
  });

  describe('create()', () => {
    it('should return a timer object with the specified target timestamp', () => {
      const seconds = Date.now() / 1000;
      expect(result.timestamp).toBeCloseTo(seconds + minutes * 60);
    });

    it('should initialize with an event emitter', () => {
      expect(result.emitter instanceof EventEmitter).toBe(true);
    });

    describe('when initialized with seconds', () => {
      it('should maintain a proper timestamp', () => {
        const nowInSeconds = Date.now() / 1000;
        const seconds = 30;
        result = timer.create({minutes, seconds});
        expect(result.timestamp).toBeCloseTo(nowInSeconds + seconds + minutes * 60);
      });
    });
  });

  describe('diff()', () => {
    let fromNow;

    beforeEach(() => {
      fromNow = Date.now() + (60 * 1000);
    });

    it('should return a new timer object with a timestamp containing the different', () => {
      const newTimer = timer.diff(result, fromNow);
      const diff = result.timestamp - newTimer.timestamp;
      expect(diff).toBeCloseTo(120);
    });

    it('should emit a diff event on a shared emitter', () => {
      let emitted;
      result.on('diff', diffed => emitted = diffed);
      const diffed = timer.diff(result, fromNow);
      const diff = result.timestamp - emitted.timestamp;
      expect(diff).toBeCloseTo(120);
    });

    describe('when using seconds', () => {
      beforeEach(() => {
        fromNow = Date.now() + 30000 + 60 * 1000
      });

      it('should diff with seconds', () => {
        const newTimer = timer.diff(result, fromNow);
        const diff = result.timestamp - newTimer.timestamp;
        expect(diff).toBeCloseTo(90);
      });
    });
  });
});
