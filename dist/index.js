(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.minuteTimer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.timer = undefined;

var _timer = require('./lib/timer');

var api = _interopRequireWildcard(_timer);

var _digital = require('./lib/view/digital');

var digital = _interopRequireWildcard(_digital);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var timer = exports.timer = api;

var view = exports.view = {
  digital: digital
};

},{"./lib/timer":2,"./lib/view/digital":3}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.tick = tick;
exports.start = start;
exports.stop = stop;

var _events = require('events');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef TimeState
 * @type {object}
 * @property {number} minutes
 * @property {number} seconds
 */

var floor = Math.floor;
var round = Math.round;

/**
 * Internal data structure for time data
 */

var Timer = (function () {
  /**
   * @param {TimeState} state
   * @param {EventEmitter} emitter
   * @param {number} intervalID
   */

  function Timer(state, emitter, intervalID) {
    _classCallCheck(this, Timer);

    var minutes = state.minutes;
    var seconds = state.seconds;

    this.state = state;
    this.emitter = emitter;
    this.intervalID = intervalID;
    if (typeof emitter === 'undefined') {
      this.emitter = new _events.EventEmitter();
    }
  }

  /**
   * Delegates to composed emitter
   *
   * @param {string} event
   * @param {...*} args
   * @returns {Timer}
   */

  _createClass(Timer, [{
    key: 'emit',
    value: function emit(event) {
      var _emitter;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      (_emitter = this.emitter).emit.apply(_emitter, [event].concat(args));
      return this;
    }

    /**
     * Delegates to composed emitter
     *
     * @param {string} event
     * @param {function} listener
     * @returns {Timer}
     */

  }, {
    key: 'on',
    value: function on(event, listener) {
      this.emitter.on(event, listener);
      return this;
    }
  }]);

  return Timer;
})();

/**
 * Ensure the time state object is in a valid state
 *
 * @param {TimeState} state
 * @returns {TimeState}
 */

function validate(state) {
  var givenSeconds = state.seconds || 0;
  var modifier = givenSeconds / 60;
  var minutes = (state.minutes || 0) + floor(modifier);
  var seconds = round(modifier % 1 * 60);
  return { minutes: minutes, seconds: seconds };
}

/**
 * Check timer for expiration
 *
 * @param {Timer} timer
 * @returns {Timer}
 */
function check(timer) {
  var _timer$state = timer.state;
  var minutes = _timer$state.minutes;
  var seconds = _timer$state.seconds;

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
function create() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return new Timer(validate(state));
}

/**
 * Decrement the timer's seconds and return a new timer
 *
 * @param {Timer} timer
 * @returns {Timer}
 */
function tick(timer) {
  var ticked = timer.state.seconds - 1;
  var seconds = ticked < 0 ? 59 : ticked;
  var minutes = ticked < 0 ? timer.state.minutes - 1 : timer.state.minutes;
  var newTimer = new Timer({ minutes: minutes, seconds: seconds }, timer.emitter, timer.intervalID);
  return newTimer.emit('tick', newTimer);
}

/**
 * Start the given timer
 *
 * @param {Timer} timer
 * @returns {Timer}
 */
function start(timer) {
  var state = timer.state;
  var emitter = timer.emitter;

  timer.emit('start', timer);

  var started = new Timer(state, emitter, setInterval(function () {
    return started = check(tick(started));
  }, 1000));

  return started;
}

/**
 * Stop the given timer
 *
 * @param {Timer} timer
 * @returns {Timer}
 */
function stop(timer) {
  var state = timer.state;
  var emitter = timer.emitter;
  var intervalID = timer.intervalID;

  clearInterval(intervalID);
  var stopped = new Timer(state, emitter);
  return stopped.emit('stop', stopped);
}

},{"events":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
/**
 * @param {string} className
 * @param {*} content
 * @returns {HTMLDivElement}
 */
function createComponent(className, content) {
  var element = document.createElement('div');
  element.className = className + ' minute-timer__component';
  element.innerHTML = content;
  return element;
}

/**
 * Pad seconds if less than 10
 *
 * @param {number} seconds
 * @return {string}
 */
function formatSeconds(seconds) {
  if (seconds > 9) {
    return seconds;
  }

  return '0' + seconds;
}

/**
 * @param {Timer} timer
 * @returns {DocumentFragment}
 */
function createTimer(timer) {
  var _timer$state = timer.state;
  var minutes = _timer$state.minutes;
  var seconds = _timer$state.seconds;

  var fragment = document.createDocumentFragment();
  fragment.appendChild(createComponent('minute-timer__minutes', minutes));
  fragment.appendChild(createComponent('minute-timer__colon', ':'));
  fragment.appendChild(createComponent('minute-timer__seconds', formatSeconds(seconds)));
  return fragment;
}

/**
 * Update the element to reflect the timer state
 *
 * @param {HTMLElement} element
 * @param {Timer} timer
 */
function update(element, timer) {
  var _timer$state2 = timer.state;
  var minutes = _timer$state2.minutes;
  var seconds = _timer$state2.seconds;

  var minuteView = element.getElementsByClassName('minute-timer__minutes')[0];
  var secondsView = element.getElementsByClassName('minute-timer__seconds')[0];
  minuteView.innerHTML = minutes;
  secondsView.innerHTML = formatSeconds(seconds);
}

/**
 * Create a dom view tied to a timer
 *
 * @param {HTMLElement} element
 * @param {Timer} timer
 */
function create(element, timer) {
  element.classList.add('minute-timer');
  var view = createTimer(timer);
  element.appendChild(view);
  timer.on('tick', function (ticked) {
    return update(element, ticked);
  });
}

},{}],4:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[1])(1)
});