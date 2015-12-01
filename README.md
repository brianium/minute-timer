# minute-timer [![Build Status](https://travis-ci.org/brianium/minute-timer.svg?branch=master)](https://travis-ci.org/brianium/minute-timer)

It's a timer! For minutes! Also seconds!

`minute-timer` is a small library for making minute timers. Want to add a tea timer
to your app? Maybe your users need to time a thing? Maybe they just need to stare
at moving numbers!

![default minute timer](https://raw.github.com/brianium/minute-timer/master/minute-timer.png "default minute timer")

## Usage

`minute-timer` exports 2 namespace values:

```js
export const timer = {
  create(state) {
    // state is just an object with minutes and seconds properties
  },
  start(timer) {
    // start the given timer
  },
  stop(timer) {
    // stop the given timer
  },
  tick(timer) {
    // tick the timer - i.e remove a second
  }
}

export const view {
  digital: {
    create(element, timer) {
      // turn the element into a digital timer
    }
  }
}
```

The main export is a UMD module so it can be used via the browser or node:

```js
var minuteTimer = require('minute-timer');
var timer = minuteTimer.timer.create({
  minutes: 3,
  seconds: 30
});

var digital = minuteTimer.view.digital;
digital.create(someHtmlElement, timer);
minuteTimer.timer.start(timer);
```

or in the browser:

```js
var minuteTimer = window.minuteTimer;
var timer = minuteTimer.timer.create({
  minutes: 3,
  seconds: 30
});

var digital = minuteTimer.view.digital;
digital.create(someHtmlElement, timer);
minuteTimer.timer.start(timer);
```

## Events

A timer exposes the following events:

* start - when the timer starts
* stop - when the timer stops
* tick - when the timer ticks by a second


All event listeners will receive the timer instance that generated the event.

## Building

The build relies on browserify and the babelify plugin for transforming es2015
to es 5. The build can be executed by running the npm `build` script

```
$ npm run build
```

## Tests

Tests are written using jest

```
$ npm test
```

## Documentation

Docs can be generated using esdoc. The default npm script outputs a `docs` directory

```
$ npm run docs
```

## Custom Views

Writing your own timer view is pretty easy. Take a look at `lib/view/digital` for an example.
