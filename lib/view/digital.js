/**
 * @param {string} className
 * @param {*} content
 * @returns {HTMLDivElement}
 */
function createComponent(className, content) {
  const element = document.createElement('div');
  element.className = `${className} minute-timer__component`;
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

  return `0${seconds}`;
}

/**
 * @param {Timer} timer
 * @returns {DocumentFragment}
 */
function createTimer(timer) {
  const { minutes, seconds } = timer.state;
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createComponent('minute-timer__minutes', minutes));
  fragment.appendChild(createComponent('minute-timer__colon', ':'));
  fragment.appendChild(createComponent('minute-timer__seconds', formatSeconds(seconds)));
  return fragment;
}

/**
 * Replace the first text node with the given one
 *
 * @param {HTMLElement} element
 * @param {string} newText
 */
function replaceText(element, newText) {
  const nodes = element.childNodes;
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].nodeType === 3) {
      const newNode = document.createTextNode(newText);
      element.replaceChild(newNode, nodes[i]);
      return void 0;
    }
  }
}

/**
 * Update the element to reflect the timer state
 *
 * @param {HTMLElement} element
 * @param {Timer} timer
 */
export function update(element, timer) {
  const { minutes, seconds } = timer.state;
  const minuteView = element.getElementsByClassName('minute-timer__minutes')[0];
  const secondsView = element.getElementsByClassName('minute-timer__seconds')[0];
  replaceText(minuteView, minutes);
  replaceText(secondsView, formatSeconds(seconds));
}

/**
 * Bind an element to a timer
 *
 * @param {HTMLElement} element
 * @param {Timer} timer
 */
export function bind(element, timer) {
  timer.on('tick', ticked => update(element, ticked));
  timer.on('update', updated => update(element, updated));
}

/**
 * Create a dom view tied to a timer
 *
 * @param {HTMLElement} element
 * @param {Timer} timer
 */
export function create(element, timer) {
  element.classList.add('minute-timer');
  const view = createTimer(timer);
  element.appendChild(view);
  bind(element, timer);
}
