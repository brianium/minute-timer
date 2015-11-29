import * as digital from '../digital';
import * as timer from '../../timer';

describe('digital view', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  describe('create()', () => {
    it('should add the minute timer class', () => {
      digital.create(element, timer.create());
      expect(element.className).toBe('minute-timer');
    });

    it('should create a view for the given timer', () => {
      const minutes = 3;
      const seconds = 5;
      const myTimer = timer.create({minutes, seconds});

      digital.create(element, myTimer);

      const minutesView = element.getElementsByClassName('minute-timer__minutes')[0];
      const colonView = element.getElementsByClassName('minute-timer__colon')[0];
      const secondsView = element.getElementsByClassName('minute-timer__seconds')[0];

      expect(minutesView.innerHTML).toBe('3');
      expect(colonView.innerHTML).toBe(':');
      expect(secondsView.innerHTML).toBe('05');
    });

    it('should not pad seconds greater than 9', () => {
      const seconds = 10;
      const myTimer = timer.create({seconds});

      digital.create(element, myTimer);

      const secondsView = element.getElementsByClassName('minute-timer__seconds')[0];

      expect(secondsView.innerHTML).toBe('10');
    });
  });

  describe('when a diff event is triggered', () => {
    it('should update the view', () => {
      const minutes = 3;
      const minuteFromNow = Date.now() + 1000 * 60;
      const myTimer = timer.create({minutes});

      digital.create(element, myTimer);
      timer.diff(myTimer, minuteFromNow);

      const minutesView = element.getElementsByClassName('minute-timer__minutes')[0];

      expect(minutesView.innerHTML).toBe('2');
    });
  });

});
