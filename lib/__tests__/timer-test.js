import * as timer from '../timer';

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
      const now = new Date();
      const seconds = now.getTime() / 1000;
      expect(result.timestamp).toBeCloseTo(seconds + minutes * 60);
    });
  });

  describe('diff()', () => {
    it('should return a new timer object with a timestamp containing the different', () => {
      const minuteFromNow = Date.now() + (60 * 1000);
      const newTimer = timer.diff(result, minuteFromNow);
      const diff = result.timestamp - newTimer.timestamp;
      expect(diff).toBeCloseTo(120);
    });
  });
});
