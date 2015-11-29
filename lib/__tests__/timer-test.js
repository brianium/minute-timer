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
    it('should return a timer object with the given state', () => {
      expect(result.state).toEqual({
        minutes: 3,
        seconds: 0
      })
    });

    it('should initialize with an event emitter', () => {
      expect(result.emitter instanceof EventEmitter).toBe(true);
    });

    describe('when initialized with seconds', () => {
      it('should add additional minutes if seconds exceed 59', () => {
        const seconds = 61;
        const minutes = 0;
        result = timer.create({minutes, seconds});
        expect(result.state.minutes).toBe(1);
        expect(result.state.seconds).toBe(1);
      });
    });
  });

  describe('tick()', () => {
    let fromNow;

    beforeEach(() => {
      fromNow = Date.now() + (60 * 1000);
    });

    it('should return a new timer object with a new state containing the remaining time', () => {
      const newTimer = timer.tick(result);
      expect(newTimer.state).toEqual({
        minutes: 2,
        seconds: 59
      });
    });

    it('should emit a tick event on a shared emitter', () => {
      let ticked;
      result.on('tick', t => ticked = t);
      timer.tick(result);
      expect(ticked.state).toEqual({
        minutes: 2,
        seconds: 59
      });
    });

    describe('when seconds not transitioning minute', () => {
      beforeEach(() => {
        result = timer.create({
          minutes: 3,
          seconds: 1
        });
      });

      it('should maintain the minute state', () => {
        const newTimer = timer.tick(result);
        expect(newTimer.state).toEqual({
          minutes: 3,
          seconds: 0
        });
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

    it('should register a listener to stop when the state reaches 0 for minutes and seconds', () => {
      let stopped;
      result = timer.create({minutes:0, seconds: 1});
      result.on('stop', t => stopped = t);
      const started = timer.start(result);

      timer.tick(started);
      jest.runAllTimers();
      
      expect(stopped.intervalID).toBeUndefined();
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
