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

      it.only('should add additional minutes if seconds exceed 59', () => {
        const seconds = 61;
        const minutes = 0;
        result = timer.create({minutes, seconds});
        expect(result.state.minutes).toBe(1);
        expect(result.state.seconds).toBe(1);
      });
    });

    describe('when initialized with an empty state', () => {
      it('defaults to 1 minute', () => {
        const result = timer.create();
        expect(result.state.minutes).toBe(1);
      });
    });
  });

  describe('diff()', () => {
    let fromNow;

    beforeEach(() => {
      fromNow = Date.now() + (60 * 1000);
    });

    it('should return a new timer object with a timestamp containing the remaining time', () => {
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

      it('should return a timer with a valid sate', () => {
        const newTimer = timer.diff(result, fromNow);
        expect(newTimer.state.seconds).toBe(30);
        expect(newTimer.state.minutes).toBe(1);
      });
    });
  });

  describe('start()', () => {
    it('should set the intervalID of the returned timer', () => {
      const newTimer = timer.start(result);
      expect(newTimer.intervalID).not.toBeUndefined();
    });

    it('should emit a start event', () => {
      let started;
      result.on('start', t => started = t);
      timer.start(result);
      expect(started.state.minutes).toBe(minutes);
    });
  });

  describe('stop()', () => {
    it('returns a new timer with a cleared intervalID', () => {
      const newTimer = timer.start(result);
      const stoppedTimer = timer.stop(newTimer);
      expect(stoppedTimer.intervalID).toBeUndefined();
    });

    it('should emit a stop event', () => {
      let stopped;
      result.on('stop', t => stopped = t);
      timer.stop(timer.start(result));
      expect(stopped.intervalID).toBeUndefined();
    });
  });
});
