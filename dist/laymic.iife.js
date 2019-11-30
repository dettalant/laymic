/*!
 *   laymic.js
 *
 * @author dettalant
 * @version v1.1.0
 * @license MIT License
 */
var laymic = (function (exports) {
  'use strict';

  /**
   * SSR Window 1.0.1
   * Better handling for window object in SSR environment
   * https://github.com/nolimits4web/ssr-window
   *
   * Copyright 2018, Vladimir Kharlampidi
   *
   * Licensed under MIT
   *
   * Released on: July 18, 2018
   */
  var doc = (typeof document === 'undefined') ? {
    body: {},
    addEventListener: function addEventListener() {},
    removeEventListener: function removeEventListener() {},
    activeElement: {
      blur: function blur() {},
      nodeName: '',
    },
    querySelector: function querySelector() {
      return null;
    },
    querySelectorAll: function querySelectorAll() {
      return [];
    },
    getElementById: function getElementById() {
      return null;
    },
    createEvent: function createEvent() {
      return {
        initEvent: function initEvent() {},
      };
    },
    createElement: function createElement() {
      return {
        children: [],
        childNodes: [],
        style: {},
        setAttribute: function setAttribute() {},
        getElementsByTagName: function getElementsByTagName() {
          return [];
        },
      };
    },
    location: { hash: '' },
  } : document; // eslint-disable-line

  var win = (typeof window === 'undefined') ? {
    document: doc,
    navigator: {
      userAgent: '',
    },
    location: {},
    history: {},
    CustomEvent: function CustomEvent() {
      return this;
    },
    addEventListener: function addEventListener() {},
    removeEventListener: function removeEventListener() {},
    getComputedStyle: function getComputedStyle() {
      return {
        getPropertyValue: function getPropertyValue() {
          return '';
        },
      };
    },
    Image: function Image() {},
    Date: function Date() {},
    screen: {},
    setTimeout: function setTimeout() {},
    clearTimeout: function clearTimeout() {},
  } : window; // eslint-disable-line

  /**
   * Dom7 2.1.3
   * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
   * http://framework7.io/docs/dom.html
   *
   * Copyright 2019, Vladimir Kharlampidi
   * The iDangero.us
   * http://www.idangero.us/
   *
   * Licensed under MIT
   *
   * Released on: February 11, 2019
   */

  class Dom7 {
    constructor(arr) {
      const self = this;
      // Create array-like object
      for (let i = 0; i < arr.length; i += 1) {
        self[i] = arr[i];
      }
      self.length = arr.length;
      // Return collection with methods
      return this;
    }
  }

  function $(selector, context) {
    const arr = [];
    let i = 0;
    if (selector && !context) {
      if (selector instanceof Dom7) {
        return selector;
      }
    }
    if (selector) {
        // String
      if (typeof selector === 'string') {
        let els;
        let tempParent;
        const html = selector.trim();
        if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
          let toCreate = 'div';
          if (html.indexOf('<li') === 0) toCreate = 'ul';
          if (html.indexOf('<tr') === 0) toCreate = 'tbody';
          if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
          if (html.indexOf('<tbody') === 0) toCreate = 'table';
          if (html.indexOf('<option') === 0) toCreate = 'select';
          tempParent = doc.createElement(toCreate);
          tempParent.innerHTML = html;
          for (i = 0; i < tempParent.childNodes.length; i += 1) {
            arr.push(tempParent.childNodes[i]);
          }
        } else {
          if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
            // Pure ID selector
            els = [doc.getElementById(selector.trim().split('#')[1])];
          } else {
            // Other selectors
            els = (context || doc).querySelectorAll(selector.trim());
          }
          for (i = 0; i < els.length; i += 1) {
            if (els[i]) arr.push(els[i]);
          }
        }
      } else if (selector.nodeType || selector === win || selector === doc) {
        // Node/element
        arr.push(selector);
      } else if (selector.length > 0 && selector[0].nodeType) {
        // Array of elements or instance of Dom
        for (i = 0; i < selector.length; i += 1) {
          arr.push(selector[i]);
        }
      }
    }
    return new Dom7(arr);
  }

  $.fn = Dom7.prototype;
  $.Class = Dom7;
  $.Dom7 = Dom7;

  function unique(arr) {
    const uniqueArray = [];
    for (let i = 0; i < arr.length; i += 1) {
      if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
    }
    return uniqueArray;
  }

  // Classes and attributes
  function addClass(className) {
    if (typeof className === 'undefined') {
      return this;
    }
    const classes = className.split(' ');
    for (let i = 0; i < classes.length; i += 1) {
      for (let j = 0; j < this.length; j += 1) {
        if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') this[j].classList.add(classes[i]);
      }
    }
    return this;
  }
  function removeClass(className) {
    const classes = className.split(' ');
    for (let i = 0; i < classes.length; i += 1) {
      for (let j = 0; j < this.length; j += 1) {
        if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') this[j].classList.remove(classes[i]);
      }
    }
    return this;
  }
  function hasClass(className) {
    if (!this[0]) return false;
    return this[0].classList.contains(className);
  }
  function toggleClass(className) {
    const classes = className.split(' ');
    for (let i = 0; i < classes.length; i += 1) {
      for (let j = 0; j < this.length; j += 1) {
        if (typeof this[j] !== 'undefined' && typeof this[j].classList !== 'undefined') this[j].classList.toggle(classes[i]);
      }
    }
    return this;
  }
  function attr(attrs, value) {
    if (arguments.length === 1 && typeof attrs === 'string') {
      // Get attr
      if (this[0]) return this[0].getAttribute(attrs);
      return undefined;
    }

    // Set attrs
    for (let i = 0; i < this.length; i += 1) {
      if (arguments.length === 2) {
        // String
        this[i].setAttribute(attrs, value);
      } else {
        // Object
        // eslint-disable-next-line
        for (const attrName in attrs) {
          this[i][attrName] = attrs[attrName];
          this[i].setAttribute(attrName, attrs[attrName]);
        }
      }
    }
    return this;
  }
  // eslint-disable-next-line
  function removeAttr(attr) {
    for (let i = 0; i < this.length; i += 1) {
      this[i].removeAttribute(attr);
    }
    return this;
  }
  function data(key, value) {
    let el;
    if (typeof value === 'undefined') {
      el = this[0];
      // Get value
      if (el) {
        if (el.dom7ElementDataStorage && (key in el.dom7ElementDataStorage)) {
          return el.dom7ElementDataStorage[key];
        }

        const dataKey = el.getAttribute(`data-${key}`);
        if (dataKey) {
          return dataKey;
        }
        return undefined;
      }
      return undefined;
    }

    // Set value
    for (let i = 0; i < this.length; i += 1) {
      el = this[i];
      if (!el.dom7ElementDataStorage) el.dom7ElementDataStorage = {};
      el.dom7ElementDataStorage[key] = value;
    }
    return this;
  }
  // Transforms
  // eslint-disable-next-line
  function transform(transform) {
    for (let i = 0; i < this.length; i += 1) {
      const elStyle = this[i].style;
      elStyle.webkitTransform = transform;
      elStyle.transform = transform;
    }
    return this;
  }
  function transition(duration) {
    if (typeof duration !== 'string') {
      duration = `${duration}ms`; // eslint-disable-line
    }
    for (let i = 0; i < this.length; i += 1) {
      const elStyle = this[i].style;
      elStyle.webkitTransitionDuration = duration;
      elStyle.transitionDuration = duration;
    }
    return this;
  }
  // Events
  function on(...args) {
    let [eventType, targetSelector, listener, capture] = args;
    if (typeof args[1] === 'function') {
      [eventType, listener, capture] = args;
      targetSelector = undefined;
    }
    if (!capture) capture = false;

    function handleLiveEvent(e) {
      const target = e.target;
      if (!target) return;
      const eventData = e.target.dom7EventData || [];
      if (eventData.indexOf(e) < 0) {
        eventData.unshift(e);
      }
      if ($(target).is(targetSelector)) listener.apply(target, eventData);
      else {
        const parents = $(target).parents(); // eslint-disable-line
        for (let k = 0; k < parents.length; k += 1) {
          if ($(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
        }
      }
    }
    function handleEvent(e) {
      const eventData = e && e.target ? e.target.dom7EventData || [] : [];
      if (eventData.indexOf(e) < 0) {
        eventData.unshift(e);
      }
      listener.apply(this, eventData);
    }
    const events = eventType.split(' ');
    let j;
    for (let i = 0; i < this.length; i += 1) {
      const el = this[i];
      if (!targetSelector) {
        for (j = 0; j < events.length; j += 1) {
          const event = events[j];
          if (!el.dom7Listeners) el.dom7Listeners = {};
          if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
          el.dom7Listeners[event].push({
            listener,
            proxyListener: handleEvent,
          });
          el.addEventListener(event, handleEvent, capture);
        }
      } else {
        // Live events
        for (j = 0; j < events.length; j += 1) {
          const event = events[j];
          if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
          if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
          el.dom7LiveListeners[event].push({
            listener,
            proxyListener: handleLiveEvent,
          });
          el.addEventListener(event, handleLiveEvent, capture);
        }
      }
    }
    return this;
  }
  function off(...args) {
    let [eventType, targetSelector, listener, capture] = args;
    if (typeof args[1] === 'function') {
      [eventType, listener, capture] = args;
      targetSelector = undefined;
    }
    if (!capture) capture = false;

    const events = eventType.split(' ');
    for (let i = 0; i < events.length; i += 1) {
      const event = events[i];
      for (let j = 0; j < this.length; j += 1) {
        const el = this[j];
        let handlers;
        if (!targetSelector && el.dom7Listeners) {
          handlers = el.dom7Listeners[event];
        } else if (targetSelector && el.dom7LiveListeners) {
          handlers = el.dom7LiveListeners[event];
        }
        if (handlers && handlers.length) {
          for (let k = handlers.length - 1; k >= 0; k -= 1) {
            const handler = handlers[k];
            if (listener && handler.listener === listener) {
              el.removeEventListener(event, handler.proxyListener, capture);
              handlers.splice(k, 1);
            } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
              el.removeEventListener(event, handler.proxyListener, capture);
              handlers.splice(k, 1);
            } else if (!listener) {
              el.removeEventListener(event, handler.proxyListener, capture);
              handlers.splice(k, 1);
            }
          }
        }
      }
    }
    return this;
  }
  function trigger(...args) {
    const events = args[0].split(' ');
    const eventData = args[1];
    for (let i = 0; i < events.length; i += 1) {
      const event = events[i];
      for (let j = 0; j < this.length; j += 1) {
        const el = this[j];
        let evt;
        try {
          evt = new win.CustomEvent(event, {
            detail: eventData,
            bubbles: true,
            cancelable: true,
          });
        } catch (e) {
          evt = doc.createEvent('Event');
          evt.initEvent(event, true, true);
          evt.detail = eventData;
        }
        // eslint-disable-next-line
        el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
        el.dispatchEvent(evt);
        el.dom7EventData = [];
        delete el.dom7EventData;
      }
    }
    return this;
  }
  function transitionEnd(callback) {
    const events = ['webkitTransitionEnd', 'transitionend'];
    const dom = this;
    let i;
    function fireCallBack(e) {
      /* jshint validthis:true */
      if (e.target !== this) return;
      callback.call(this, e);
      for (i = 0; i < events.length; i += 1) {
        dom.off(events[i], fireCallBack);
      }
    }
    if (callback) {
      for (i = 0; i < events.length; i += 1) {
        dom.on(events[i], fireCallBack);
      }
    }
    return this;
  }
  function outerWidth(includeMargins) {
    if (this.length > 0) {
      if (includeMargins) {
        // eslint-disable-next-line
        const styles = this.styles();
        return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
      }
      return this[0].offsetWidth;
    }
    return null;
  }
  function outerHeight(includeMargins) {
    if (this.length > 0) {
      if (includeMargins) {
        // eslint-disable-next-line
        const styles = this.styles();
        return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
      }
      return this[0].offsetHeight;
    }
    return null;
  }
  function offset() {
    if (this.length > 0) {
      const el = this[0];
      const box = el.getBoundingClientRect();
      const body = doc.body;
      const clientTop = el.clientTop || body.clientTop || 0;
      const clientLeft = el.clientLeft || body.clientLeft || 0;
      const scrollTop = el === win ? win.scrollY : el.scrollTop;
      const scrollLeft = el === win ? win.scrollX : el.scrollLeft;
      return {
        top: (box.top + scrollTop) - clientTop,
        left: (box.left + scrollLeft) - clientLeft,
      };
    }

    return null;
  }
  function styles() {
    if (this[0]) return win.getComputedStyle(this[0], null);
    return {};
  }
  function css(props, value) {
    let i;
    if (arguments.length === 1) {
      if (typeof props === 'string') {
        if (this[0]) return win.getComputedStyle(this[0], null).getPropertyValue(props);
      } else {
        for (i = 0; i < this.length; i += 1) {
          // eslint-disable-next-line
          for (let prop in props) {
            this[i].style[prop] = props[prop];
          }
        }
        return this;
      }
    }
    if (arguments.length === 2 && typeof props === 'string') {
      for (i = 0; i < this.length; i += 1) {
        this[i].style[props] = value;
      }
      return this;
    }
    return this;
  }
  // Iterate over the collection passing elements to `callback`
  function each(callback) {
    // Don't bother continuing without a callback
    if (!callback) return this;
    // Iterate over the current collection
    for (let i = 0; i < this.length; i += 1) {
      // If the callback returns false
      if (callback.call(this[i], i, this[i]) === false) {
        // End the loop early
        return this;
      }
    }
    // Return `this` to allow chained DOM operations
    return this;
  }
  function filter(callback) {
    const matchedItems = [];
    const dom = this;
    for (let i = 0; i < dom.length; i += 1) {
      if (callback.call(dom[i], i, dom[i])) matchedItems.push(dom[i]);
    }
    return new Dom7(matchedItems);
  }
  // eslint-disable-next-line
  function html(html) {
    if (typeof html === 'undefined') {
      return this[0] ? this[0].innerHTML : undefined;
    }

    for (let i = 0; i < this.length; i += 1) {
      this[i].innerHTML = html;
    }
    return this;
  }
  // eslint-disable-next-line
  function text(text) {
    if (typeof text === 'undefined') {
      if (this[0]) {
        return this[0].textContent.trim();
      }
      return null;
    }

    for (let i = 0; i < this.length; i += 1) {
      this[i].textContent = text;
    }
    return this;
  }
  function is(selector) {
    const el = this[0];
    let compareWith;
    let i;
    if (!el || typeof selector === 'undefined') return false;
    if (typeof selector === 'string') {
      if (el.matches) return el.matches(selector);
      else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
      else if (el.msMatchesSelector) return el.msMatchesSelector(selector);

      compareWith = $(selector);
      for (i = 0; i < compareWith.length; i += 1) {
        if (compareWith[i] === el) return true;
      }
      return false;
    } else if (selector === doc) return el === doc;
    else if (selector === win) return el === win;

    if (selector.nodeType || selector instanceof Dom7) {
      compareWith = selector.nodeType ? [selector] : selector;
      for (i = 0; i < compareWith.length; i += 1) {
        if (compareWith[i] === el) return true;
      }
      return false;
    }
    return false;
  }
  function index() {
    let child = this[0];
    let i;
    if (child) {
      i = 0;
      // eslint-disable-next-line
      while ((child = child.previousSibling) !== null) {
        if (child.nodeType === 1) i += 1;
      }
      return i;
    }
    return undefined;
  }
  // eslint-disable-next-line
  function eq(index) {
    if (typeof index === 'undefined') return this;
    const length = this.length;
    let returnIndex;
    if (index > length - 1) {
      return new Dom7([]);
    }
    if (index < 0) {
      returnIndex = length + index;
      if (returnIndex < 0) return new Dom7([]);
      return new Dom7([this[returnIndex]]);
    }
    return new Dom7([this[index]]);
  }
  function append(...args) {
    let newChild;

    for (let k = 0; k < args.length; k += 1) {
      newChild = args[k];
      for (let i = 0; i < this.length; i += 1) {
        if (typeof newChild === 'string') {
          const tempDiv = doc.createElement('div');
          tempDiv.innerHTML = newChild;
          while (tempDiv.firstChild) {
            this[i].appendChild(tempDiv.firstChild);
          }
        } else if (newChild instanceof Dom7) {
          for (let j = 0; j < newChild.length; j += 1) {
            this[i].appendChild(newChild[j]);
          }
        } else {
          this[i].appendChild(newChild);
        }
      }
    }

    return this;
  }
  function prepend(newChild) {
    let i;
    let j;
    for (i = 0; i < this.length; i += 1) {
      if (typeof newChild === 'string') {
        const tempDiv = doc.createElement('div');
        tempDiv.innerHTML = newChild;
        for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
          this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
        }
      } else if (newChild instanceof Dom7) {
        for (j = 0; j < newChild.length; j += 1) {
          this[i].insertBefore(newChild[j], this[i].childNodes[0]);
        }
      } else {
        this[i].insertBefore(newChild, this[i].childNodes[0]);
      }
    }
    return this;
  }
  function next(selector) {
    if (this.length > 0) {
      if (selector) {
        if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
          return new Dom7([this[0].nextElementSibling]);
        }
        return new Dom7([]);
      }

      if (this[0].nextElementSibling) return new Dom7([this[0].nextElementSibling]);
      return new Dom7([]);
    }
    return new Dom7([]);
  }
  function nextAll(selector) {
    const nextEls = [];
    let el = this[0];
    if (!el) return new Dom7([]);
    while (el.nextElementSibling) {
      const next = el.nextElementSibling; // eslint-disable-line
      if (selector) {
        if ($(next).is(selector)) nextEls.push(next);
      } else nextEls.push(next);
      el = next;
    }
    return new Dom7(nextEls);
  }
  function prev(selector) {
    if (this.length > 0) {
      const el = this[0];
      if (selector) {
        if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
          return new Dom7([el.previousElementSibling]);
        }
        return new Dom7([]);
      }

      if (el.previousElementSibling) return new Dom7([el.previousElementSibling]);
      return new Dom7([]);
    }
    return new Dom7([]);
  }
  function prevAll(selector) {
    const prevEls = [];
    let el = this[0];
    if (!el) return new Dom7([]);
    while (el.previousElementSibling) {
      const prev = el.previousElementSibling; // eslint-disable-line
      if (selector) {
        if ($(prev).is(selector)) prevEls.push(prev);
      } else prevEls.push(prev);
      el = prev;
    }
    return new Dom7(prevEls);
  }
  function parent(selector) {
    const parents = []; // eslint-disable-line
    for (let i = 0; i < this.length; i += 1) {
      if (this[i].parentNode !== null) {
        if (selector) {
          if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
        } else {
          parents.push(this[i].parentNode);
        }
      }
    }
    return $(unique(parents));
  }
  function parents(selector) {
    const parents = []; // eslint-disable-line
    for (let i = 0; i < this.length; i += 1) {
      let parent = this[i].parentNode; // eslint-disable-line
      while (parent) {
        if (selector) {
          if ($(parent).is(selector)) parents.push(parent);
        } else {
          parents.push(parent);
        }
        parent = parent.parentNode;
      }
    }
    return $(unique(parents));
  }
  function closest(selector) {
    let closest = this; // eslint-disable-line
    if (typeof selector === 'undefined') {
      return new Dom7([]);
    }
    if (!closest.is(selector)) {
      closest = closest.parents(selector).eq(0);
    }
    return closest;
  }
  function find(selector) {
    const foundElements = [];
    for (let i = 0; i < this.length; i += 1) {
      const found = this[i].querySelectorAll(selector);
      for (let j = 0; j < found.length; j += 1) {
        foundElements.push(found[j]);
      }
    }
    return new Dom7(foundElements);
  }
  function children(selector) {
    const children = []; // eslint-disable-line
    for (let i = 0; i < this.length; i += 1) {
      const childNodes = this[i].childNodes;

      for (let j = 0; j < childNodes.length; j += 1) {
        if (!selector) {
          if (childNodes[j].nodeType === 1) children.push(childNodes[j]);
        } else if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) {
          children.push(childNodes[j]);
        }
      }
    }
    return new Dom7(unique(children));
  }
  function remove() {
    for (let i = 0; i < this.length; i += 1) {
      if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
    }
    return this;
  }
  function add(...args) {
    const dom = this;
    let i;
    let j;
    for (i = 0; i < args.length; i += 1) {
      const toAdd = $(args[i]);
      for (j = 0; j < toAdd.length; j += 1) {
        dom[dom.length] = toAdd[j];
        dom.length += 1;
      }
    }
    return dom;
  }

  /**
   * Swiper 5.2.0
   * Most modern mobile touch slider and framework with hardware accelerated transitions
   * http://swiperjs.com
   *
   * Copyright 2014-2019 Vladimir Kharlampidi
   *
   * Released under the MIT License
   *
   * Released on: October 26, 2019
   */

  const Methods = {
    addClass,
    removeClass,
    hasClass,
    toggleClass,
    attr,
    removeAttr,
    data,
    transform,
    transition: transition,
    on,
    off,
    trigger,
    transitionEnd: transitionEnd,
    outerWidth,
    outerHeight,
    offset,
    css,
    each,
    html,
    text,
    is,
    index,
    eq,
    append,
    prepend,
    next,
    nextAll,
    prev,
    prevAll,
    parent,
    parents,
    closest,
    find,
    children,
    filter,
    remove,
    add,
    styles,
  };

  Object.keys(Methods).forEach((methodName) => {
    $.fn[methodName] = $.fn[methodName] || Methods[methodName];
  });

  const Utils = {
    deleteProps(obj) {
      const object = obj;
      Object.keys(object).forEach((key) => {
        try {
          object[key] = null;
        } catch (e) {
          // no getter for object
        }
        try {
          delete object[key];
        } catch (e) {
          // something got wrong
        }
      });
    },
    nextTick(callback, delay = 0) {
      return setTimeout(callback, delay);
    },
    now() {
      return Date.now();
    },
    getTranslate(el, axis = 'x') {
      let matrix;
      let curTransform;
      let transformMatrix;

      const curStyle = win.getComputedStyle(el, null);

      if (win.WebKitCSSMatrix) {
        curTransform = curStyle.transform || curStyle.webkitTransform;
        if (curTransform.split(',').length > 6) {
          curTransform = curTransform.split(', ').map((a) => a.replace(',', '.')).join(', ');
        }
        // Some old versions of Webkit choke when 'none' is passed; pass
        // empty string instead in this case
        transformMatrix = new win.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
      } else {
        transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
        matrix = transformMatrix.toString().split(',');
      }

      if (axis === 'x') {
        // Latest Chrome and webkits Fix
        if (win.WebKitCSSMatrix) curTransform = transformMatrix.m41;
        // Crazy IE10 Matrix
        else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
        // Normal Browsers
        else curTransform = parseFloat(matrix[4]);
      }
      if (axis === 'y') {
        // Latest Chrome and webkits Fix
        if (win.WebKitCSSMatrix) curTransform = transformMatrix.m42;
        // Crazy IE10 Matrix
        else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
        // Normal Browsers
        else curTransform = parseFloat(matrix[5]);
      }
      return curTransform || 0;
    },
    parseUrlQuery(url) {
      const query = {};
      let urlToParse = url || win.location.href;
      let i;
      let params;
      let param;
      let length;
      if (typeof urlToParse === 'string' && urlToParse.length) {
        urlToParse = urlToParse.indexOf('?') > -1 ? urlToParse.replace(/\S*\?/, '') : '';
        params = urlToParse.split('&').filter((paramsPart) => paramsPart !== '');
        length = params.length;

        for (i = 0; i < length; i += 1) {
          param = params[i].replace(/#\S+/g, '').split('=');
          query[decodeURIComponent(param[0])] = typeof param[1] === 'undefined' ? undefined : decodeURIComponent(param[1]) || '';
        }
      }
      return query;
    },
    isObject(o) {
      return typeof o === 'object' && o !== null && o.constructor && o.constructor === Object;
    },
    extend(...args) {
      const to = Object(args[0]);
      for (let i = 1; i < args.length; i += 1) {
        const nextSource = args[i];
        if (nextSource !== undefined && nextSource !== null) {
          const keysArray = Object.keys(Object(nextSource));
          for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
            const nextKey = keysArray[nextIndex];
            const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
            if (desc !== undefined && desc.enumerable) {
              if (Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
                Utils.extend(to[nextKey], nextSource[nextKey]);
              } else if (!Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
                to[nextKey] = {};
                Utils.extend(to[nextKey], nextSource[nextKey]);
              } else {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
      }
      return to;
    },
  };

  const Support = (function Support() {
    return {
      touch: (win.Modernizr && win.Modernizr.touch === true) || (function checkTouch() {
        return !!((win.navigator.maxTouchPoints > 0) || ('ontouchstart' in win) || (win.DocumentTouch && doc instanceof win.DocumentTouch));
      }()),

      pointerEvents: !!win.PointerEvent && ('maxTouchPoints' in win.navigator) && win.navigator.maxTouchPoints > 0,

      observer: (function checkObserver() {
        return ('MutationObserver' in win || 'WebkitMutationObserver' in win);
      }()),

      passiveListener: (function checkPassiveListener() {
        let supportsPassive = false;
        try {
          const opts = Object.defineProperty({}, 'passive', {
            // eslint-disable-next-line
            get() {
              supportsPassive = true;
            },
          });
          win.addEventListener('testPassiveListener', null, opts);
        } catch (e) {
          // No support
        }
        return supportsPassive;
      }()),

      gestures: (function checkGestures() {
        return 'ongesturestart' in win;
      }()),
    };
  }());

  class SwiperClass {
    constructor(params = {}) {
      const self = this;
      self.params = params;

      // Events
      self.eventsListeners = {};

      if (self.params && self.params.on) {
        Object.keys(self.params.on).forEach((eventName) => {
          self.on(eventName, self.params.on[eventName]);
        });
      }
    }

    on(events, handler, priority) {
      const self = this;
      if (typeof handler !== 'function') return self;
      const method = priority ? 'unshift' : 'push';
      events.split(' ').forEach((event) => {
        if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
        self.eventsListeners[event][method](handler);
      });
      return self;
    }

    once(events, handler, priority) {
      const self = this;
      if (typeof handler !== 'function') return self;
      function onceHandler(...args) {
        handler.apply(self, args);
        self.off(events, onceHandler);
        if (onceHandler.f7proxy) {
          delete onceHandler.f7proxy;
        }
      }
      onceHandler.f7proxy = handler;
      return self.on(events, onceHandler, priority);
    }

    off(events, handler) {
      const self = this;
      if (!self.eventsListeners) return self;
      events.split(' ').forEach((event) => {
        if (typeof handler === 'undefined') {
          self.eventsListeners[event] = [];
        } else if (self.eventsListeners[event] && self.eventsListeners[event].length) {
          self.eventsListeners[event].forEach((eventHandler, index) => {
            if (eventHandler === handler || (eventHandler.f7proxy && eventHandler.f7proxy === handler)) {
              self.eventsListeners[event].splice(index, 1);
            }
          });
        }
      });
      return self;
    }

    emit(...args) {
      const self = this;
      if (!self.eventsListeners) return self;
      let events;
      let data;
      let context;
      if (typeof args[0] === 'string' || Array.isArray(args[0])) {
        events = args[0];
        data = args.slice(1, args.length);
        context = self;
      } else {
        events = args[0].events;
        data = args[0].data;
        context = args[0].context || self;
      }
      const eventsArray = Array.isArray(events) ? events : events.split(' ');
      eventsArray.forEach((event) => {
        if (self.eventsListeners && self.eventsListeners[event]) {
          const handlers = [];
          self.eventsListeners[event].forEach((eventHandler) => {
            handlers.push(eventHandler);
          });
          handlers.forEach((eventHandler) => {
            eventHandler.apply(context, data);
          });
        }
      });
      return self;
    }

    useModulesParams(instanceParams) {
      const instance = this;
      if (!instance.modules) return;
      Object.keys(instance.modules).forEach((moduleName) => {
        const module = instance.modules[moduleName];
        // Extend params
        if (module.params) {
          Utils.extend(instanceParams, module.params);
        }
      });
    }

    useModules(modulesParams = {}) {
      const instance = this;
      if (!instance.modules) return;
      Object.keys(instance.modules).forEach((moduleName) => {
        const module = instance.modules[moduleName];
        const moduleParams = modulesParams[moduleName] || {};
        // Extend instance methods and props
        if (module.instance) {
          Object.keys(module.instance).forEach((modulePropName) => {
            const moduleProp = module.instance[modulePropName];
            if (typeof moduleProp === 'function') {
              instance[modulePropName] = moduleProp.bind(instance);
            } else {
              instance[modulePropName] = moduleProp;
            }
          });
        }
        // Add event listeners
        if (module.on && instance.on) {
          Object.keys(module.on).forEach((moduleEventName) => {
            instance.on(moduleEventName, module.on[moduleEventName]);
          });
        }

        // Module create callback
        if (module.create) {
          module.create.bind(instance)(moduleParams);
        }
      });
    }

    static set components(components) {
      const Class = this;
      if (!Class.use) return;
      Class.use(components);
    }

    static installModule(module, ...params) {
      const Class = this;
      if (!Class.prototype.modules) Class.prototype.modules = {};
      const name = module.name || (`${Object.keys(Class.prototype.modules).length}_${Utils.now()}`);
      Class.prototype.modules[name] = module;
      // Prototype
      if (module.proto) {
        Object.keys(module.proto).forEach((key) => {
          Class.prototype[key] = module.proto[key];
        });
      }
      // Class
      if (module.static) {
        Object.keys(module.static).forEach((key) => {
          Class[key] = module.static[key];
        });
      }
      // Callback
      if (module.install) {
        module.install.apply(Class, params);
      }
      return Class;
    }

    static use(module, ...params) {
      const Class = this;
      if (Array.isArray(module)) {
        module.forEach((m) => Class.installModule(m));
        return Class;
      }
      return Class.installModule(module, ...params);
    }
  }

  function updateSize () {
    const swiper = this;
    let width;
    let height;
    const $el = swiper.$el;
    if (typeof swiper.params.width !== 'undefined') {
      width = swiper.params.width;
    } else {
      width = $el[0].clientWidth;
    }
    if (typeof swiper.params.height !== 'undefined') {
      height = swiper.params.height;
    } else {
      height = $el[0].clientHeight;
    }
    if ((width === 0 && swiper.isHorizontal()) || (height === 0 && swiper.isVertical())) {
      return;
    }

    // Subtract paddings
    width = width - parseInt($el.css('padding-left'), 10) - parseInt($el.css('padding-right'), 10);
    height = height - parseInt($el.css('padding-top'), 10) - parseInt($el.css('padding-bottom'), 10);

    Utils.extend(swiper, {
      width,
      height,
      size: swiper.isHorizontal() ? width : height,
    });
  }

  function updateSlides () {
    const swiper = this;
    const params = swiper.params;

    const {
      $wrapperEl, size: swiperSize, rtlTranslate: rtl, wrongRTL,
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
    const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
    const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
    let snapGrid = [];
    const slidesGrid = [];
    const slidesSizesGrid = [];

    function slidesForMargin(slideIndex) {
      if (!params.cssMode) return true;
      if (slideIndex === slides.length - 1) {
        return false;
      }
      return true;
    }

    let offsetBefore = params.slidesOffsetBefore;
    if (typeof offsetBefore === 'function') {
      offsetBefore = params.slidesOffsetBefore.call(swiper);
    }

    let offsetAfter = params.slidesOffsetAfter;
    if (typeof offsetAfter === 'function') {
      offsetAfter = params.slidesOffsetAfter.call(swiper);
    }

    const previousSnapGridLength = swiper.snapGrid.length;
    const previousSlidesGridLength = swiper.snapGrid.length;

    let spaceBetween = params.spaceBetween;
    let slidePosition = -offsetBefore;
    let prevSlideSize = 0;
    let index = 0;
    if (typeof swiperSize === 'undefined') {
      return;
    }
    if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
      spaceBetween = (parseFloat(spaceBetween.replace('%', '')) / 100) * swiperSize;
    }

    swiper.virtualSize = -spaceBetween;

    // reset margins
    if (rtl) slides.css({ marginLeft: '', marginTop: '' });
    else slides.css({ marginRight: '', marginBottom: '' });

    let slidesNumberEvenToRows;
    if (params.slidesPerColumn > 1) {
      if (Math.floor(slidesLength / params.slidesPerColumn) === slidesLength / swiper.params.slidesPerColumn) {
        slidesNumberEvenToRows = slidesLength;
      } else {
        slidesNumberEvenToRows = Math.ceil(slidesLength / params.slidesPerColumn) * params.slidesPerColumn;
      }
      if (params.slidesPerView !== 'auto' && params.slidesPerColumnFill === 'row') {
        slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, params.slidesPerView * params.slidesPerColumn);
      }
    }

    // Calc slides
    let slideSize;
    const slidesPerColumn = params.slidesPerColumn;
    const slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
    const numFullColumns = Math.floor(slidesLength / params.slidesPerColumn);
    for (let i = 0; i < slidesLength; i += 1) {
      slideSize = 0;
      const slide = slides.eq(i);
      if (params.slidesPerColumn > 1) {
        // Set slides order
        let newSlideOrderIndex;
        let column;
        let row;
        if (params.slidesPerColumnFill === 'row' && params.slidesPerGroup > 1) {
          const groupIndex = Math.floor(i / (params.slidesPerGroup * params.slidesPerColumn));
          const slideIndexInGroup = i - params.slidesPerColumn * params.slidesPerGroup * groupIndex;
          const columnsInGroup = groupIndex === 0
            ? params.slidesPerGroup
            : Math.min(Math.ceil((slidesLength - groupIndex * slidesPerColumn * params.slidesPerGroup) / slidesPerColumn), params.slidesPerGroup);
          row = Math.floor(slideIndexInGroup / columnsInGroup);
          column = (slideIndexInGroup - row * columnsInGroup) + groupIndex * params.slidesPerGroup;

          newSlideOrderIndex = column + ((row * slidesNumberEvenToRows) / slidesPerColumn);
          slide
            .css({
              '-webkit-box-ordinal-group': newSlideOrderIndex,
              '-moz-box-ordinal-group': newSlideOrderIndex,
              '-ms-flex-order': newSlideOrderIndex,
              '-webkit-order': newSlideOrderIndex,
              order: newSlideOrderIndex,
            });
        } else if (params.slidesPerColumnFill === 'column') {
          column = Math.floor(i / slidesPerColumn);
          row = i - (column * slidesPerColumn);
          if (column > numFullColumns || (column === numFullColumns && row === slidesPerColumn - 1)) {
            row += 1;
            if (row >= slidesPerColumn) {
              row = 0;
              column += 1;
            }
          }
        } else {
          row = Math.floor(i / slidesPerRow);
          column = i - (row * slidesPerRow);
        }
        slide.css(
          `margin-${swiper.isHorizontal() ? 'top' : 'left'}`,
          (row !== 0 && params.spaceBetween) && (`${params.spaceBetween}px`)
        );
      }
      if (slide.css('display') === 'none') continue; // eslint-disable-line

      if (params.slidesPerView === 'auto') {
        const slideStyles = win.getComputedStyle(slide[0], null);
        const currentTransform = slide[0].style.transform;
        const currentWebKitTransform = slide[0].style.webkitTransform;
        if (currentTransform) {
          slide[0].style.transform = 'none';
        }
        if (currentWebKitTransform) {
          slide[0].style.webkitTransform = 'none';
        }
        if (params.roundLengths) {
          slideSize = swiper.isHorizontal()
            ? slide.outerWidth(true)
            : slide.outerHeight(true);
        } else {
          // eslint-disable-next-line
          if (swiper.isHorizontal()) {
            const width = parseFloat(slideStyles.getPropertyValue('width'));
            const paddingLeft = parseFloat(slideStyles.getPropertyValue('padding-left'));
            const paddingRight = parseFloat(slideStyles.getPropertyValue('padding-right'));
            const marginLeft = parseFloat(slideStyles.getPropertyValue('margin-left'));
            const marginRight = parseFloat(slideStyles.getPropertyValue('margin-right'));
            const boxSizing = slideStyles.getPropertyValue('box-sizing');
            if (boxSizing && boxSizing === 'border-box') {
              slideSize = width + marginLeft + marginRight;
            } else {
              slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight;
            }
          } else {
            const height = parseFloat(slideStyles.getPropertyValue('height'));
            const paddingTop = parseFloat(slideStyles.getPropertyValue('padding-top'));
            const paddingBottom = parseFloat(slideStyles.getPropertyValue('padding-bottom'));
            const marginTop = parseFloat(slideStyles.getPropertyValue('margin-top'));
            const marginBottom = parseFloat(slideStyles.getPropertyValue('margin-bottom'));
            const boxSizing = slideStyles.getPropertyValue('box-sizing');
            if (boxSizing && boxSizing === 'border-box') {
              slideSize = height + marginTop + marginBottom;
            } else {
              slideSize = height + paddingTop + paddingBottom + marginTop + marginBottom;
            }
          }
        }
        if (currentTransform) {
          slide[0].style.transform = currentTransform;
        }
        if (currentWebKitTransform) {
          slide[0].style.webkitTransform = currentWebKitTransform;
        }
        if (params.roundLengths) slideSize = Math.floor(slideSize);
      } else {
        slideSize = (swiperSize - ((params.slidesPerView - 1) * spaceBetween)) / params.slidesPerView;
        if (params.roundLengths) slideSize = Math.floor(slideSize);

        if (slides[i]) {
          if (swiper.isHorizontal()) {
            slides[i].style.width = `${slideSize}px`;
          } else {
            slides[i].style.height = `${slideSize}px`;
          }
        }
      }
      if (slides[i]) {
        slides[i].swiperSlideSize = slideSize;
      }
      slidesSizesGrid.push(slideSize);


      if (params.centeredSlides) {
        slidePosition = slidePosition + (slideSize / 2) + (prevSlideSize / 2) + spaceBetween;
        if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - (swiperSize / 2) - spaceBetween;
        if (i === 0) slidePosition = slidePosition - (swiperSize / 2) - spaceBetween;
        if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
        if (params.roundLengths) slidePosition = Math.floor(slidePosition);
        if ((index) % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
      } else {
        if (params.roundLengths) slidePosition = Math.floor(slidePosition);
        if ((index) % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
        slidePosition = slidePosition + slideSize + spaceBetween;
      }

      swiper.virtualSize += slideSize + spaceBetween;

      prevSlideSize = slideSize;

      index += 1;
    }
    swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
    let newSlidesGrid;

    if (
      rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
      $wrapperEl.css({ width: `${swiper.virtualSize + params.spaceBetween}px` });
    }
    if (params.setWrapperSize) {
      if (swiper.isHorizontal()) $wrapperEl.css({ width: `${swiper.virtualSize + params.spaceBetween}px` });
      else $wrapperEl.css({ height: `${swiper.virtualSize + params.spaceBetween}px` });
    }

    if (params.slidesPerColumn > 1) {
      swiper.virtualSize = (slideSize + params.spaceBetween) * slidesNumberEvenToRows;
      swiper.virtualSize = Math.ceil(swiper.virtualSize / params.slidesPerColumn) - params.spaceBetween;
      if (swiper.isHorizontal()) $wrapperEl.css({ width: `${swiper.virtualSize + params.spaceBetween}px` });
      else $wrapperEl.css({ height: `${swiper.virtualSize + params.spaceBetween}px` });
      if (params.centeredSlides) {
        newSlidesGrid = [];
        for (let i = 0; i < snapGrid.length; i += 1) {
          let slidesGridItem = snapGrid[i];
          if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
          if (snapGrid[i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
        }
        snapGrid = newSlidesGrid;
      }
    }

    // Remove last grid elements depending on width
    if (!params.centeredSlides) {
      newSlidesGrid = [];
      for (let i = 0; i < snapGrid.length; i += 1) {
        let slidesGridItem = snapGrid[i];
        if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
        if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
          newSlidesGrid.push(slidesGridItem);
        }
      }
      snapGrid = newSlidesGrid;
      if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
        snapGrid.push(swiper.virtualSize - swiperSize);
      }
    }
    if (snapGrid.length === 0) snapGrid = [0];

    if (params.spaceBetween !== 0) {
      if (swiper.isHorizontal()) {
        if (rtl) slides.filter(slidesForMargin).css({ marginLeft: `${spaceBetween}px` });
        else slides.filter(slidesForMargin).css({ marginRight: `${spaceBetween}px` });
      } else slides.filter(slidesForMargin).css({ marginBottom: `${spaceBetween}px` });
    }

    if (params.centeredSlides && params.centeredSlidesBounds) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach((slideSizeValue) => {
        allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
      });
      allSlidesSize -= params.spaceBetween;
      const maxSnap = allSlidesSize - swiperSize;
      snapGrid = snapGrid.map((snap) => {
        if (snap < 0) return -offsetBefore;
        if (snap > maxSnap) return maxSnap + offsetAfter;
        return snap;
      });
    }

    if (params.centerInsufficientSlides) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach((slideSizeValue) => {
        allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
      });
      allSlidesSize -= params.spaceBetween;
      if (allSlidesSize < swiperSize) {
        const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
        snapGrid.forEach((snap, snapIndex) => {
          snapGrid[snapIndex] = snap - allSlidesOffset;
        });
        slidesGrid.forEach((snap, snapIndex) => {
          slidesGrid[snapIndex] = snap + allSlidesOffset;
        });
      }
    }

    Utils.extend(swiper, {
      slides,
      snapGrid,
      slidesGrid,
      slidesSizesGrid,
    });

    if (slidesLength !== previousSlidesLength) {
      swiper.emit('slidesLengthChange');
    }
    if (snapGrid.length !== previousSnapGridLength) {
      if (swiper.params.watchOverflow) swiper.checkOverflow();
      swiper.emit('snapGridLengthChange');
    }
    if (slidesGrid.length !== previousSlidesGridLength) {
      swiper.emit('slidesGridLengthChange');
    }

    if (params.watchSlidesProgress || params.watchSlidesVisibility) {
      swiper.updateSlidesOffset();
    }
  }

  function updateAutoHeight (speed) {
    const swiper = this;
    const activeSlides = [];
    let newHeight = 0;
    let i;
    if (typeof speed === 'number') {
      swiper.setTransition(speed);
    } else if (speed === true) {
      swiper.setTransition(swiper.params.speed);
    }
    // Find slides currently in view
    if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
      for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
        const index = swiper.activeIndex + i;
        if (index > swiper.slides.length) break;
        activeSlides.push(swiper.slides.eq(index)[0]);
      }
    } else {
      activeSlides.push(swiper.slides.eq(swiper.activeIndex)[0]);
    }

    // Find new height from highest slide in view
    for (i = 0; i < activeSlides.length; i += 1) {
      if (typeof activeSlides[i] !== 'undefined') {
        const height = activeSlides[i].offsetHeight;
        newHeight = height > newHeight ? height : newHeight;
      }
    }

    // Update Height
    if (newHeight) swiper.$wrapperEl.css('height', `${newHeight}px`);
  }

  function updateSlidesOffset () {
    const swiper = this;
    const slides = swiper.slides;
    for (let i = 0; i < slides.length; i += 1) {
      slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
    }
  }

  function updateSlidesProgress (translate = (this && this.translate) || 0) {
    const swiper = this;
    const params = swiper.params;

    const { slides, rtlTranslate: rtl } = swiper;

    if (slides.length === 0) return;
    if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();

    let offsetCenter = -translate;
    if (rtl) offsetCenter = translate;

    // Visible Slides
    slides.removeClass(params.slideVisibleClass);

    swiper.visibleSlidesIndexes = [];
    swiper.visibleSlides = [];

    for (let i = 0; i < slides.length; i += 1) {
      const slide = slides[i];
      const slideProgress = (
        (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0)) - slide.swiperSlideOffset
      ) / (slide.swiperSlideSize + params.spaceBetween);
      if (params.watchSlidesVisibility) {
        const slideBefore = -(offsetCenter - slide.swiperSlideOffset);
        const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
        const isVisible = (slideBefore >= 0 && slideBefore < swiper.size - 1)
                  || (slideAfter > 1 && slideAfter <= swiper.size)
                  || (slideBefore <= 0 && slideAfter >= swiper.size);
        if (isVisible) {
          swiper.visibleSlides.push(slide);
          swiper.visibleSlidesIndexes.push(i);
          slides.eq(i).addClass(params.slideVisibleClass);
        }
      }
      slide.progress = rtl ? -slideProgress : slideProgress;
    }
    swiper.visibleSlides = $(swiper.visibleSlides);
  }

  function updateProgress (translate) {
    const swiper = this;
    if (typeof translate === 'undefined') {
      const multiplier = swiper.rtlTranslate ? -1 : 1;
      // eslint-disable-next-line
      translate = (swiper && swiper.translate && (swiper.translate * multiplier)) || 0;
    }
    const params = swiper.params;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    let { progress, isBeginning, isEnd } = swiper;
    const wasBeginning = isBeginning;
    const wasEnd = isEnd;
    if (translatesDiff === 0) {
      progress = 0;
      isBeginning = true;
      isEnd = true;
    } else {
      progress = (translate - swiper.minTranslate()) / (translatesDiff);
      isBeginning = progress <= 0;
      isEnd = progress >= 1;
    }
    Utils.extend(swiper, {
      progress,
      isBeginning,
      isEnd,
    });

    if (params.watchSlidesProgress || params.watchSlidesVisibility) swiper.updateSlidesProgress(translate);

    if (isBeginning && !wasBeginning) {
      swiper.emit('reachBeginning toEdge');
    }
    if (isEnd && !wasEnd) {
      swiper.emit('reachEnd toEdge');
    }
    if ((wasBeginning && !isBeginning) || (wasEnd && !isEnd)) {
      swiper.emit('fromEdge');
    }

    swiper.emit('progress', progress);
  }

  function updateSlidesClasses () {
    const swiper = this;

    const {
      slides, params, $wrapperEl, activeIndex, realIndex,
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;

    slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);

    let activeSlide;
    if (isVirtual) {
      activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`);
    } else {
      activeSlide = slides.eq(activeIndex);
    }

    // Active classes
    activeSlide.addClass(params.slideActiveClass);

    if (params.loop) {
      // Duplicate to all looped slides
      if (activeSlide.hasClass(params.slideDuplicateClass)) {
        $wrapperEl
          .children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`)
          .addClass(params.slideDuplicateActiveClass);
      } else {
        $wrapperEl
          .children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`)
          .addClass(params.slideDuplicateActiveClass);
      }
    }
    // Next Slide
    let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);
    if (params.loop && nextSlide.length === 0) {
      nextSlide = slides.eq(0);
      nextSlide.addClass(params.slideNextClass);
    }
    // Prev Slide
    let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);
    if (params.loop && prevSlide.length === 0) {
      prevSlide = slides.eq(-1);
      prevSlide.addClass(params.slidePrevClass);
    }
    if (params.loop) {
      // Duplicate to all looped slides
      if (nextSlide.hasClass(params.slideDuplicateClass)) {
        $wrapperEl
          .children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`)
          .addClass(params.slideDuplicateNextClass);
      } else {
        $wrapperEl
          .children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`)
          .addClass(params.slideDuplicateNextClass);
      }
      if (prevSlide.hasClass(params.slideDuplicateClass)) {
        $wrapperEl
          .children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`)
          .addClass(params.slideDuplicatePrevClass);
      } else {
        $wrapperEl
          .children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`)
          .addClass(params.slideDuplicatePrevClass);
      }
    }
  }

  function updateActiveIndex (newActiveIndex) {
    const swiper = this;
    const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    const {
      slidesGrid, snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex,
    } = swiper;
    let activeIndex = newActiveIndex;
    let snapIndex;
    if (typeof activeIndex === 'undefined') {
      for (let i = 0; i < slidesGrid.length; i += 1) {
        if (typeof slidesGrid[i + 1] !== 'undefined') {
          if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - ((slidesGrid[i + 1] - slidesGrid[i]) / 2)) {
            activeIndex = i;
          } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
            activeIndex = i + 1;
          }
        } else if (translate >= slidesGrid[i]) {
          activeIndex = i;
        }
      }
      // Normalize slideIndex
      if (params.normalizeSlideIndex) {
        if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
      }
    }
    if (snapGrid.indexOf(translate) >= 0) {
      snapIndex = snapGrid.indexOf(translate);
    } else {
      snapIndex = Math.floor(activeIndex / params.slidesPerGroup);
    }
    if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
    if (activeIndex === previousIndex) {
      if (snapIndex !== previousSnapIndex) {
        swiper.snapIndex = snapIndex;
        swiper.emit('snapIndexChange');
      }
      return;
    }

    // Get real index
    const realIndex = parseInt(swiper.slides.eq(activeIndex).attr('data-swiper-slide-index') || activeIndex, 10);

    Utils.extend(swiper, {
      snapIndex,
      realIndex,
      previousIndex,
      activeIndex,
    });
    swiper.emit('activeIndexChange');
    swiper.emit('snapIndexChange');
    if (previousRealIndex !== realIndex) {
      swiper.emit('realIndexChange');
    }
    if (swiper.initialized || swiper.runCallbacksOnInit) {
      swiper.emit('slideChange');
    }
  }

  function updateClickedSlide (e) {
    const swiper = this;
    const params = swiper.params;
    const slide = $(e.target).closest(`.${params.slideClass}`)[0];
    let slideFound = false;
    if (slide) {
      for (let i = 0; i < swiper.slides.length; i += 1) {
        if (swiper.slides[i] === slide) slideFound = true;
      }
    }

    if (slide && slideFound) {
      swiper.clickedSlide = slide;
      if (swiper.virtual && swiper.params.virtual.enabled) {
        swiper.clickedIndex = parseInt($(slide).attr('data-swiper-slide-index'), 10);
      } else {
        swiper.clickedIndex = $(slide).index();
      }
    } else {
      swiper.clickedSlide = undefined;
      swiper.clickedIndex = undefined;
      return;
    }
    if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
      swiper.slideToClickedSlide();
    }
  }

  var update = {
    updateSize,
    updateSlides,
    updateAutoHeight,
    updateSlidesOffset,
    updateSlidesProgress,
    updateProgress,
    updateSlidesClasses,
    updateActiveIndex,
    updateClickedSlide,
  };

  function getTranslate (axis = this.isHorizontal() ? 'x' : 'y') {
    const swiper = this;

    const {
      params, rtlTranslate: rtl, translate, $wrapperEl,
    } = swiper;

    if (params.virtualTranslate) {
      return rtl ? -translate : translate;
    }
    if (params.cssMode) {
      return translate;
    }

    let currentTranslate = Utils.getTranslate($wrapperEl[0], axis);
    if (rtl) currentTranslate = -currentTranslate;

    return currentTranslate || 0;
  }

  function setTranslate (translate, byController) {
    const swiper = this;
    const {
      rtlTranslate: rtl, params, $wrapperEl, wrapperEl, progress,
    } = swiper;
    let x = 0;
    let y = 0;
    const z = 0;

    if (swiper.isHorizontal()) {
      x = rtl ? -translate : translate;
    } else {
      y = translate;
    }

    if (params.roundLengths) {
      x = Math.floor(x);
      y = Math.floor(y);
    }

    if (params.cssMode) {
      wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
    } else if (!params.virtualTranslate) {
      $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
    }
    swiper.previousTranslate = swiper.translate;
    swiper.translate = swiper.isHorizontal() ? x : y;

    // Check if we need to update progress
    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (translate - swiper.minTranslate()) / (translatesDiff);
    }
    if (newProgress !== progress) {
      swiper.updateProgress(translate);
    }

    swiper.emit('setTranslate', swiper.translate, byController);
  }

  function minTranslate () {
    return (-this.snapGrid[0]);
  }

  function maxTranslate () {
    return (-this.snapGrid[this.snapGrid.length - 1]);
  }

  function translateTo (translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
    const swiper = this;

    const {
      params,
      wrapperEl,
    } = swiper;

    if (swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }

    const minTranslate = swiper.minTranslate();
    const maxTranslate = swiper.maxTranslate();
    let newTranslate;
    if (translateBounds && translate > minTranslate) newTranslate = minTranslate;
    else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;
    else newTranslate = translate;

    // Update progress
    swiper.updateProgress(newTranslate);

    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      if (speed === 0) {
        wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
      } else {
        // eslint-disable-next-line
        if (wrapperEl.scrollTo) {
          wrapperEl.scrollTo({
            [isH ? 'left' : 'top']: -newTranslate,
            behavior: 'smooth',
          });
        } else {
          wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
        }
      }
      return true;
    }

    if (speed === 0) {
      swiper.setTransition(0);
      swiper.setTranslate(newTranslate);
      if (runCallbacks) {
        swiper.emit('beforeTransitionStart', speed, internal);
        swiper.emit('transitionEnd');
      }
    } else {
      swiper.setTransition(speed);
      swiper.setTranslate(newTranslate);
      if (runCallbacks) {
        swiper.emit('beforeTransitionStart', speed, internal);
        swiper.emit('transitionStart');
      }
      if (!swiper.animating) {
        swiper.animating = true;
        if (!swiper.onTranslateToWrapperTransitionEnd) {
          swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
            if (!swiper || swiper.destroyed) return;
            if (e.target !== this) return;
            swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
            swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
            swiper.onTranslateToWrapperTransitionEnd = null;
            delete swiper.onTranslateToWrapperTransitionEnd;
            if (runCallbacks) {
              swiper.emit('transitionEnd');
            }
          };
        }
        swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
        swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
      }
    }

    return true;
  }

  var translate = {
    getTranslate,
    setTranslate,
    minTranslate,
    maxTranslate,
    translateTo,
  };

  function setTransition (duration, byController) {
    const swiper = this;

    if (!swiper.params.cssMode) {
      swiper.$wrapperEl.transition(duration);
    }

    swiper.emit('setTransition', duration, byController);
  }

  function transitionStart (runCallbacks = true, direction) {
    const swiper = this;
    const { activeIndex, params, previousIndex } = swiper;
    if (params.cssMode) return;
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }

    let dir = direction;
    if (!dir) {
      if (activeIndex > previousIndex) dir = 'next';
      else if (activeIndex < previousIndex) dir = 'prev';
      else dir = 'reset';
    }

    swiper.emit('transitionStart');

    if (runCallbacks && activeIndex !== previousIndex) {
      if (dir === 'reset') {
        swiper.emit('slideResetTransitionStart');
        return;
      }
      swiper.emit('slideChangeTransitionStart');
      if (dir === 'next') {
        swiper.emit('slideNextTransitionStart');
      } else {
        swiper.emit('slidePrevTransitionStart');
      }
    }
  }

  function transitionEnd$1 (runCallbacks = true, direction) {
    const swiper = this;
    const { activeIndex, previousIndex, params } = swiper;
    swiper.animating = false;
    if (params.cssMode) return;
    swiper.setTransition(0);

    let dir = direction;
    if (!dir) {
      if (activeIndex > previousIndex) dir = 'next';
      else if (activeIndex < previousIndex) dir = 'prev';
      else dir = 'reset';
    }

    swiper.emit('transitionEnd');

    if (runCallbacks && activeIndex !== previousIndex) {
      if (dir === 'reset') {
        swiper.emit('slideResetTransitionEnd');
        return;
      }
      swiper.emit('slideChangeTransitionEnd');
      if (dir === 'next') {
        swiper.emit('slideNextTransitionEnd');
      } else {
        swiper.emit('slidePrevTransitionEnd');
      }
    }
  }

  var transition$1 = {
    setTransition,
    transitionStart,
    transitionEnd: transitionEnd$1,
  };

  function slideTo (index = 0, speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    let slideIndex = index;
    if (slideIndex < 0) slideIndex = 0;

    const {
      params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl,
    } = swiper;
    if (swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }

    let snapIndex = Math.floor(slideIndex / params.slidesPerGroup);
    if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

    if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) {
      swiper.emit('beforeSlideChangeStart');
    }

    const translate = -snapGrid[snapIndex];

    // Update progress
    swiper.updateProgress(translate);

    // Normalize slideIndex
    if (params.normalizeSlideIndex) {
      for (let i = 0; i < slidesGrid.length; i += 1) {
        if (-Math.floor(translate * 100) >= Math.floor(slidesGrid[i] * 100)) {
          slideIndex = i;
        }
      }
    }
    // Directions locks
    if (swiper.initialized && slideIndex !== activeIndex) {
      if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) {
        return false;
      }
      if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
        if ((activeIndex || 0) !== slideIndex) return false;
      }
    }

    let direction;
    if (slideIndex > activeIndex) direction = 'next';
    else if (slideIndex < activeIndex) direction = 'prev';
    else direction = 'reset';


    // Update Index
    if ((rtl && -translate === swiper.translate) || (!rtl && translate === swiper.translate)) {
      swiper.updateActiveIndex(slideIndex);
      // Update Height
      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }
      swiper.updateSlidesClasses();
      if (params.effect !== 'slide') {
        swiper.setTranslate(translate);
      }
      if (direction !== 'reset') {
        swiper.transitionStart(runCallbacks, direction);
        swiper.transitionEnd(runCallbacks, direction);
      }
      return false;
    }
    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      if (speed === 0) {
        wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -translate;
      } else {
        // eslint-disable-next-line
        if (wrapperEl.scrollTo) {
          wrapperEl.scrollTo({
            [isH ? 'left' : 'top']: -translate,
            behavior: 'smooth',
          });
        } else {
          wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -translate;
        }
      }
      return true;
    }

    if (speed === 0) {
      swiper.setTransition(0);
      swiper.setTranslate(translate);
      swiper.updateActiveIndex(slideIndex);
      swiper.updateSlidesClasses();
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    } else {
      swiper.setTransition(speed);
      swiper.setTranslate(translate);
      swiper.updateActiveIndex(slideIndex);
      swiper.updateSlidesClasses();
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.transitionStart(runCallbacks, direction);
      if (!swiper.animating) {
        swiper.animating = true;
        if (!swiper.onSlideToWrapperTransitionEnd) {
          swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
            if (!swiper || swiper.destroyed) return;
            if (e.target !== this) return;
            swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
            swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
            swiper.onSlideToWrapperTransitionEnd = null;
            delete swiper.onSlideToWrapperTransitionEnd;
            swiper.transitionEnd(runCallbacks, direction);
          };
        }
        swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
        swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
      }
    }

    return true;
  }

  function slideToLoop (index = 0, speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    let newIndex = index;
    if (swiper.params.loop) {
      newIndex += swiper.loopedSlides;
    }

    return swiper.slideTo(newIndex, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function slideNext (speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    const { params, animating } = swiper;
    if (params.loop) {
      if (animating) return false;
      swiper.loopFix();
      // eslint-disable-next-line
      swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
      return swiper.slideTo(swiper.activeIndex + params.slidesPerGroup, speed, runCallbacks, internal);
    }
    return swiper.slideTo(swiper.activeIndex + params.slidesPerGroup, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function slidePrev (speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    const {
      params, animating, snapGrid, slidesGrid, rtlTranslate,
    } = swiper;

    if (params.loop) {
      if (animating) return false;
      swiper.loopFix();
      // eslint-disable-next-line
      swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
    }
    const translate = rtlTranslate ? swiper.translate : -swiper.translate;
    function normalize(val) {
      if (val < 0) return -Math.floor(Math.abs(val));
      return Math.floor(val);
    }
    const normalizedTranslate = normalize(translate);
    const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
    const normalizedSlidesGrid = slidesGrid.map((val) => normalize(val));

    const currentSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate)];
    let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
    if (typeof prevSnap === 'undefined' && params.cssMode) {
      snapGrid.forEach((snap) => {
        if (!prevSnap && normalizedTranslate >= snap) prevSnap = snap;
      });
    }
    let prevIndex;
    if (typeof prevSnap !== 'undefined') {
      prevIndex = slidesGrid.indexOf(prevSnap);
      if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
    }
    return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function slideReset (speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function slideToClosest (speed = this.params.speed, runCallbacks = true, internal, threshold = 0.5) {
    const swiper = this;
    let index = swiper.activeIndex;
    const snapIndex = Math.floor(index / swiper.params.slidesPerGroup);

    const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;

    if (translate >= swiper.snapGrid[snapIndex]) {
      // The current translate is on or after the current snap index, so the choice
      // is between the current index and the one after it.
      const currentSnap = swiper.snapGrid[snapIndex];
      const nextSnap = swiper.snapGrid[snapIndex + 1];
      if ((translate - currentSnap) > (nextSnap - currentSnap) * threshold) {
        index += swiper.params.slidesPerGroup;
      }
    } else {
      // The current translate is before the current snap index, so the choice
      // is between the current index and the one before it.
      const prevSnap = swiper.snapGrid[snapIndex - 1];
      const currentSnap = swiper.snapGrid[snapIndex];
      if ((translate - prevSnap) <= (currentSnap - prevSnap) * threshold) {
        index -= swiper.params.slidesPerGroup;
      }
    }
    index = Math.max(index, 0);
    index = Math.min(index, swiper.snapGrid.length - 1);

    return swiper.slideTo(index, speed, runCallbacks, internal);
  }

  function slideToClickedSlide () {
    const swiper = this;
    const { params, $wrapperEl } = swiper;

    const slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
    let slideToIndex = swiper.clickedIndex;
    let realIndex;
    if (params.loop) {
      if (swiper.animating) return;
      realIndex = parseInt($(swiper.clickedSlide).attr('data-swiper-slide-index'), 10);
      if (params.centeredSlides) {
        if (
          (slideToIndex < swiper.loopedSlides - (slidesPerView / 2))
          || (slideToIndex > (swiper.slides.length - swiper.loopedSlides) + (slidesPerView / 2))
        ) {
          swiper.loopFix();
          slideToIndex = $wrapperEl
            .children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`)
            .eq(0)
            .index();

          Utils.nextTick(() => {
            swiper.slideTo(slideToIndex);
          });
        } else {
          swiper.slideTo(slideToIndex);
        }
      } else if (slideToIndex > swiper.slides.length - slidesPerView) {
        swiper.loopFix();
        slideToIndex = $wrapperEl
          .children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`)
          .eq(0)
          .index();

        Utils.nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else {
      swiper.slideTo(slideToIndex);
    }
  }

  var slide = {
    slideTo,
    slideToLoop,
    slideNext,
    slidePrev,
    slideReset,
    slideToClosest,
    slideToClickedSlide,
  };

  function loopCreate () {
    const swiper = this;
    const { params, $wrapperEl } = swiper;
    // Remove duplicated slides
    $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();

    let slides = $wrapperEl.children(`.${params.slideClass}`);

    if (params.loopFillGroupWithBlank) {
      const blankSlidesNum = params.slidesPerGroup - (slides.length % params.slidesPerGroup);
      if (blankSlidesNum !== params.slidesPerGroup) {
        for (let i = 0; i < blankSlidesNum; i += 1) {
          const blankNode = $(doc.createElement('div')).addClass(`${params.slideClass} ${params.slideBlankClass}`);
          $wrapperEl.append(blankNode);
        }
        slides = $wrapperEl.children(`.${params.slideClass}`);
      }
    }

    if (params.slidesPerView === 'auto' && !params.loopedSlides) params.loopedSlides = slides.length;

    swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
    swiper.loopedSlides += params.loopAdditionalSlides;
    if (swiper.loopedSlides > slides.length) {
      swiper.loopedSlides = slides.length;
    }

    const prependSlides = [];
    const appendSlides = [];
    slides.each((index, el) => {
      const slide = $(el);
      if (index < swiper.loopedSlides) appendSlides.push(el);
      if (index < slides.length && index >= slides.length - swiper.loopedSlides) prependSlides.push(el);
      slide.attr('data-swiper-slide-index', index);
    });
    for (let i = 0; i < appendSlides.length; i += 1) {
      $wrapperEl.append($(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
    }
    for (let i = prependSlides.length - 1; i >= 0; i -= 1) {
      $wrapperEl.prepend($(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
    }
  }

  function loopFix () {
    const swiper = this;
    const {
      activeIndex, slides, loopedSlides, allowSlidePrev, allowSlideNext, snapGrid, rtlTranslate: rtl,
    } = swiper;
    let newIndex;
    swiper.allowSlidePrev = true;
    swiper.allowSlideNext = true;

    const snapTranslate = -snapGrid[activeIndex];
    const diff = snapTranslate - swiper.getTranslate();


    // Fix For Negative Oversliding
    if (activeIndex < loopedSlides) {
      newIndex = (slides.length - (loopedSlides * 3)) + activeIndex;
      newIndex += loopedSlides;
      const slideChanged = swiper.slideTo(newIndex, 0, false, true);
      if (slideChanged && diff !== 0) {
        swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
      }
    } else if (activeIndex >= slides.length - loopedSlides) {
      // Fix For Positive Oversliding
      newIndex = -slides.length + activeIndex + loopedSlides;
      newIndex += loopedSlides;
      const slideChanged = swiper.slideTo(newIndex, 0, false, true);
      if (slideChanged && diff !== 0) {
        swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
      }
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
  }

  function loopDestroy () {
    const swiper = this;
    const { $wrapperEl, params, slides } = swiper;
    $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
    slides.removeAttr('data-swiper-slide-index');
  }

  var loop = {
    loopCreate,
    loopFix,
    loopDestroy,
  };

  function setGrabCursor (moving) {
    const swiper = this;
    if (Support.touch || !swiper.params.simulateTouch || (swiper.params.watchOverflow && swiper.isLocked) || swiper.params.cssMode) return;
    const el = swiper.el;
    el.style.cursor = 'move';
    el.style.cursor = moving ? '-webkit-grabbing' : '-webkit-grab';
    el.style.cursor = moving ? '-moz-grabbin' : '-moz-grab';
    el.style.cursor = moving ? 'grabbing' : 'grab';
  }

  function unsetGrabCursor () {
    const swiper = this;
    if (Support.touch || (swiper.params.watchOverflow && swiper.isLocked) || swiper.params.cssMode) return;
    swiper.el.style.cursor = '';
  }

  var grabCursor = {
    setGrabCursor,
    unsetGrabCursor,
  };

  function appendSlide (slides) {
    const swiper = this;
    const { $wrapperEl, params } = swiper;
    if (params.loop) {
      swiper.loopDestroy();
    }
    if (typeof slides === 'object' && 'length' in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) $wrapperEl.append(slides[i]);
      }
    } else {
      $wrapperEl.append(slides);
    }
    if (params.loop) {
      swiper.loopCreate();
    }
    if (!(params.observer && Support.observer)) {
      swiper.update();
    }
  }

  function prependSlide (slides) {
    const swiper = this;
    const { params, $wrapperEl, activeIndex } = swiper;

    if (params.loop) {
      swiper.loopDestroy();
    }
    let newActiveIndex = activeIndex + 1;
    if (typeof slides === 'object' && 'length' in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) $wrapperEl.prepend(slides[i]);
      }
      newActiveIndex = activeIndex + slides.length;
    } else {
      $wrapperEl.prepend(slides);
    }
    if (params.loop) {
      swiper.loopCreate();
    }
    if (!(params.observer && Support.observer)) {
      swiper.update();
    }
    swiper.slideTo(newActiveIndex, 0, false);
  }

  function addSlide (index, slides) {
    const swiper = this;
    const { $wrapperEl, params, activeIndex } = swiper;
    let activeIndexBuffer = activeIndex;
    if (params.loop) {
      activeIndexBuffer -= swiper.loopedSlides;
      swiper.loopDestroy();
      swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
    }
    const baseLength = swiper.slides.length;
    if (index <= 0) {
      swiper.prependSlide(slides);
      return;
    }
    if (index >= baseLength) {
      swiper.appendSlide(slides);
      return;
    }
    let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;

    const slidesBuffer = [];
    for (let i = baseLength - 1; i >= index; i -= 1) {
      const currentSlide = swiper.slides.eq(i);
      currentSlide.remove();
      slidesBuffer.unshift(currentSlide);
    }

    if (typeof slides === 'object' && 'length' in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) $wrapperEl.append(slides[i]);
      }
      newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
    } else {
      $wrapperEl.append(slides);
    }

    for (let i = 0; i < slidesBuffer.length; i += 1) {
      $wrapperEl.append(slidesBuffer[i]);
    }

    if (params.loop) {
      swiper.loopCreate();
    }
    if (!(params.observer && Support.observer)) {
      swiper.update();
    }
    if (params.loop) {
      swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
    } else {
      swiper.slideTo(newActiveIndex, 0, false);
    }
  }

  function removeSlide (slidesIndexes) {
    const swiper = this;
    const { params, $wrapperEl, activeIndex } = swiper;

    let activeIndexBuffer = activeIndex;
    if (params.loop) {
      activeIndexBuffer -= swiper.loopedSlides;
      swiper.loopDestroy();
      swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
    }
    let newActiveIndex = activeIndexBuffer;
    let indexToRemove;

    if (typeof slidesIndexes === 'object' && 'length' in slidesIndexes) {
      for (let i = 0; i < slidesIndexes.length; i += 1) {
        indexToRemove = slidesIndexes[i];
        if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
        if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
      }
      newActiveIndex = Math.max(newActiveIndex, 0);
    } else {
      indexToRemove = slidesIndexes;
      if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
      if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
      newActiveIndex = Math.max(newActiveIndex, 0);
    }

    if (params.loop) {
      swiper.loopCreate();
    }

    if (!(params.observer && Support.observer)) {
      swiper.update();
    }
    if (params.loop) {
      swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
    } else {
      swiper.slideTo(newActiveIndex, 0, false);
    }
  }

  function removeAllSlides () {
    const swiper = this;

    const slidesIndexes = [];
    for (let i = 0; i < swiper.slides.length; i += 1) {
      slidesIndexes.push(i);
    }
    swiper.removeSlide(slidesIndexes);
  }

  var manipulation = {
    appendSlide,
    prependSlide,
    addSlide,
    removeSlide,
    removeAllSlides,
  };

  const Device = (function Device() {
    const platform = win.navigator.platform;
    const ua = win.navigator.userAgent;

    const device = {
      ios: false,
      android: false,
      androidChrome: false,
      desktop: false,
      iphone: false,
      ipod: false,
      ipad: false,
      edge: false,
      ie: false,
      firefox: false,
      macos: false,
      windows: false,
      cordova: !!(win.cordova || win.phonegap),
      phonegap: !!(win.cordova || win.phonegap),
      electron: false,
    };

    const screenWidth = win.screen.width;
    const screenHeight = win.screen.height;

    const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line
    let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
    const ie = ua.indexOf('MSIE ') >= 0 || ua.indexOf('Trident/') >= 0;
    const edge = ua.indexOf('Edge/') >= 0;
    const firefox = ua.indexOf('Gecko/') >= 0 && ua.indexOf('Firefox/') >= 0;
    const windows = platform === 'Win32';
    const electron = ua.toLowerCase().indexOf('electron') >= 0;
    let macos = platform === 'MacIntel';

    // iPadOs 13 fix
    if (!ipad
      && macos
      && Support.touch
      && (
        (screenWidth === 1024 && screenHeight === 1366) // Pro 12.9
        || (screenWidth === 834 && screenHeight === 1194) // Pro 11
        || (screenWidth === 834 && screenHeight === 1112) // Pro 10.5
        || (screenWidth === 768 && screenHeight === 1024) // other
      )
    ) {
      ipad = ua.match(/(Version)\/([\d.]+)/);
      macos = false;
    }

    device.ie = ie;
    device.edge = edge;
    device.firefox = firefox;

    // Android
    if (android && !windows) {
      device.os = 'android';
      device.osVersion = android[2];
      device.android = true;
      device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
    }
    if (ipad || iphone || ipod) {
      device.os = 'ios';
      device.ios = true;
    }
    // iOS
    if (iphone && !ipod) {
      device.osVersion = iphone[2].replace(/_/g, '.');
      device.iphone = true;
    }
    if (ipad) {
      device.osVersion = ipad[2].replace(/_/g, '.');
      device.ipad = true;
    }
    if (ipod) {
      device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
      device.ipod = true;
    }
    // iOS 8+ changed UA
    if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
      if (device.osVersion.split('.')[0] === '10') {
        device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
      }
    }

    // Webview
    device.webView = !!((iphone || ipad || ipod) && (ua.match(/.*AppleWebKit(?!.*Safari)/i) || win.navigator.standalone))
      || (win.matchMedia && win.matchMedia('(display-mode: standalone)').matches);
    device.webview = device.webView;
    device.standalone = device.webView;

    // Desktop
    device.desktop = !(device.ios || device.android) || electron;
    if (device.desktop) {
      device.electron = electron;
      device.macos = macos;
      device.windows = windows;
      if (device.macos) {
        device.os = 'macos';
      }
      if (device.windows) {
        device.os = 'windows';
      }
    }

    // Pixel Ratio
    device.pixelRatio = win.devicePixelRatio || 1;

    // Export object
    return device;
  }());

  function onTouchStart (event) {
    const swiper = this;
    const data = swiper.touchEventsData;
    const { params, touches } = swiper;

    if (swiper.animating && params.preventInteractionOnTransition) {
      return;
    }
    let e = event;
    if (e.originalEvent) e = e.originalEvent;
    const $targetEl = $(e.target);

    if (params.touchEventsTarget === 'wrapper') {
      if (!$targetEl.closest(swiper.wrapperEl).length) return;
    }
    data.isTouchEvent = e.type === 'touchstart';
    if (!data.isTouchEvent && 'which' in e && e.which === 3) return;
    if (!data.isTouchEvent && 'button' in e && e.button > 0) return;
    if (data.isTouched && data.isMoved) return;
    if (params.noSwiping && $targetEl.closest(params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`)[0]) {
      swiper.allowClick = true;
      return;
    }
    if (params.swipeHandler) {
      if (!$targetEl.closest(params.swipeHandler)[0]) return;
    }

    touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
    touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
    const startX = touches.currentX;
    const startY = touches.currentY;

    // Do NOT start if iOS edge swipe is detected. Otherwise iOS app (UIWebView) cannot swipe-to-go-back anymore

    const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
    const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
    if (
      edgeSwipeDetection
      && ((startX <= edgeSwipeThreshold)
      || (startX >= win.screen.width - edgeSwipeThreshold))
    ) {
      return;
    }

    Utils.extend(data, {
      isTouched: true,
      isMoved: false,
      allowTouchCallbacks: true,
      isScrolling: undefined,
      startMoving: undefined,
    });

    touches.startX = startX;
    touches.startY = startY;
    data.touchStartTime = Utils.now();
    swiper.allowClick = true;
    swiper.updateSize();
    swiper.swipeDirection = undefined;
    if (params.threshold > 0) data.allowThresholdMove = false;
    if (e.type !== 'touchstart') {
      let preventDefault = true;
      if ($targetEl.is(data.formElements)) preventDefault = false;
      if (
        doc.activeElement
        && $(doc.activeElement).is(data.formElements)
        && doc.activeElement !== $targetEl[0]
      ) {
        doc.activeElement.blur();
      }

      const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
      if (params.touchStartForcePreventDefault || shouldPreventDefault) {
        e.preventDefault();
      }
    }
    swiper.emit('touchStart', e);
  }

  function onTouchMove (event) {
    const swiper = this;
    const data = swiper.touchEventsData;
    const { params, touches, rtlTranslate: rtl } = swiper;
    let e = event;
    if (e.originalEvent) e = e.originalEvent;
    if (!data.isTouched) {
      if (data.startMoving && data.isScrolling) {
        swiper.emit('touchMoveOpposite', e);
      }
      return;
    }
    if (data.isTouchEvent && e.type === 'mousemove') return;
    const targetTouch = e.type === 'touchmove' && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
    const pageX = e.type === 'touchmove' ? targetTouch.pageX : e.pageX;
    const pageY = e.type === 'touchmove' ? targetTouch.pageY : e.pageY;
    if (e.preventedByNestedSwiper) {
      touches.startX = pageX;
      touches.startY = pageY;
      return;
    }
    if (!swiper.allowTouchMove) {
      // isMoved = true;
      swiper.allowClick = false;
      if (data.isTouched) {
        Utils.extend(touches, {
          startX: pageX,
          startY: pageY,
          currentX: pageX,
          currentY: pageY,
        });
        data.touchStartTime = Utils.now();
      }
      return;
    }
    if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
      if (swiper.isVertical()) {
        // Vertical
        if (
          (pageY < touches.startY && swiper.translate <= swiper.maxTranslate())
          || (pageY > touches.startY && swiper.translate >= swiper.minTranslate())
        ) {
          data.isTouched = false;
          data.isMoved = false;
          return;
        }
      } else if (
        (pageX < touches.startX && swiper.translate <= swiper.maxTranslate())
        || (pageX > touches.startX && swiper.translate >= swiper.minTranslate())
      ) {
        return;
      }
    }
    if (data.isTouchEvent && doc.activeElement) {
      if (e.target === doc.activeElement && $(e.target).is(data.formElements)) {
        data.isMoved = true;
        swiper.allowClick = false;
        return;
      }
    }
    if (data.allowTouchCallbacks) {
      swiper.emit('touchMove', e);
    }
    if (e.targetTouches && e.targetTouches.length > 1) return;

    touches.currentX = pageX;
    touches.currentY = pageY;

    const diffX = touches.currentX - touches.startX;
    const diffY = touches.currentY - touches.startY;
    if (swiper.params.threshold && Math.sqrt((diffX ** 2) + (diffY ** 2)) < swiper.params.threshold) return;

    if (typeof data.isScrolling === 'undefined') {
      let touchAngle;
      if ((swiper.isHorizontal() && touches.currentY === touches.startY) || (swiper.isVertical() && touches.currentX === touches.startX)) {
        data.isScrolling = false;
      } else {
        // eslint-disable-next-line
        if ((diffX * diffX) + (diffY * diffY) >= 25) {
          touchAngle = (Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180) / Math.PI;
          data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : (90 - touchAngle > params.touchAngle);
        }
      }
    }
    if (data.isScrolling) {
      swiper.emit('touchMoveOpposite', e);
    }
    if (typeof data.startMoving === 'undefined') {
      if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
        data.startMoving = true;
      }
    }
    if (data.isScrolling) {
      data.isTouched = false;
      return;
    }
    if (!data.startMoving) {
      return;
    }
    swiper.allowClick = false;
    if (!params.cssMode) {
      e.preventDefault();
    }
    if (params.touchMoveStopPropagation && !params.nested) {
      e.stopPropagation();
    }

    if (!data.isMoved) {
      if (params.loop) {
        swiper.loopFix();
      }
      data.startTranslate = swiper.getTranslate();
      swiper.setTransition(0);
      if (swiper.animating) {
        swiper.$wrapperEl.trigger('webkitTransitionEnd transitionend');
      }
      data.allowMomentumBounce = false;
      // Grab Cursor
      if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
        swiper.setGrabCursor(true);
      }
      swiper.emit('sliderFirstMove', e);
    }
    swiper.emit('sliderMove', e);
    data.isMoved = true;

    let diff = swiper.isHorizontal() ? diffX : diffY;
    touches.diff = diff;

    diff *= params.touchRatio;
    if (rtl) diff = -diff;

    swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
    data.currentTranslate = diff + data.startTranslate;

    let disableParentSwiper = true;
    let resistanceRatio = params.resistanceRatio;
    if (params.touchReleaseOnEdges) {
      resistanceRatio = 0;
    }
    if ((diff > 0 && data.currentTranslate > swiper.minTranslate())) {
      disableParentSwiper = false;
      if (params.resistance) data.currentTranslate = (swiper.minTranslate() - 1) + ((-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio);
    } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) data.currentTranslate = (swiper.maxTranslate() + 1) - ((swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio);
    }

    if (disableParentSwiper) {
      e.preventedByNestedSwiper = true;
    }

    // Directions locks
    if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }
    if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }


    // Threshold
    if (params.threshold > 0) {
      if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
        if (!data.allowThresholdMove) {
          data.allowThresholdMove = true;
          touches.startX = touches.currentX;
          touches.startY = touches.currentY;
          data.currentTranslate = data.startTranslate;
          touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
          return;
        }
      } else {
        data.currentTranslate = data.startTranslate;
        return;
      }
    }

    if (!params.followFinger || params.cssMode) return;

    // Update active index in free mode
    if (params.freeMode || params.watchSlidesProgress || params.watchSlidesVisibility) {
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    if (params.freeMode) {
      // Velocity
      if (data.velocities.length === 0) {
        data.velocities.push({
          position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
          time: data.touchStartTime,
        });
      }
      data.velocities.push({
        position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
        time: Utils.now(),
      });
    }
    // Update progress
    swiper.updateProgress(data.currentTranslate);
    // Update translate
    swiper.setTranslate(data.currentTranslate);
  }

  function onTouchEnd (event) {
    const swiper = this;
    const data = swiper.touchEventsData;

    const {
      params, touches, rtlTranslate: rtl, $wrapperEl, slidesGrid, snapGrid,
    } = swiper;
    let e = event;
    if (e.originalEvent) e = e.originalEvent;
    if (data.allowTouchCallbacks) {
      swiper.emit('touchEnd', e);
    }
    data.allowTouchCallbacks = false;
    if (!data.isTouched) {
      if (data.isMoved && params.grabCursor) {
        swiper.setGrabCursor(false);
      }
      data.isMoved = false;
      data.startMoving = false;
      return;
    }
    // Return Grab Cursor
    if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(false);
    }

    // Time diff
    const touchEndTime = Utils.now();
    const timeDiff = touchEndTime - data.touchStartTime;

    // Tap, doubleTap, Click
    if (swiper.allowClick) {
      swiper.updateClickedSlide(e);
      swiper.emit('tap click', e);
      if (timeDiff < 300 && (touchEndTime - data.lastClickTime) < 300) {
        swiper.emit('doubleTap doubleClick', e);
      }
    }

    data.lastClickTime = Utils.now();
    Utils.nextTick(() => {
      if (!swiper.destroyed) swiper.allowClick = true;
    });

    if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
      data.isTouched = false;
      data.isMoved = false;
      data.startMoving = false;
      return;
    }
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;

    let currentPos;
    if (params.followFinger) {
      currentPos = rtl ? swiper.translate : -swiper.translate;
    } else {
      currentPos = -data.currentTranslate;
    }

    if (params.cssMode) {
      return;
    }

    if (params.freeMode) {
      if (currentPos < -swiper.minTranslate()) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      if (currentPos > -swiper.maxTranslate()) {
        if (swiper.slides.length < snapGrid.length) {
          swiper.slideTo(snapGrid.length - 1);
        } else {
          swiper.slideTo(swiper.slides.length - 1);
        }
        return;
      }

      if (params.freeModeMomentum) {
        if (data.velocities.length > 1) {
          const lastMoveEvent = data.velocities.pop();
          const velocityEvent = data.velocities.pop();

          const distance = lastMoveEvent.position - velocityEvent.position;
          const time = lastMoveEvent.time - velocityEvent.time;
          swiper.velocity = distance / time;
          swiper.velocity /= 2;
          if (Math.abs(swiper.velocity) < params.freeModeMinimumVelocity) {
            swiper.velocity = 0;
          }
          // this implies that the user stopped moving a finger then released.
          // There would be no events with distance zero, so the last event is stale.
          if (time > 150 || (Utils.now() - lastMoveEvent.time) > 300) {
            swiper.velocity = 0;
          }
        } else {
          swiper.velocity = 0;
        }
        swiper.velocity *= params.freeModeMomentumVelocityRatio;

        data.velocities.length = 0;
        let momentumDuration = 1000 * params.freeModeMomentumRatio;
        const momentumDistance = swiper.velocity * momentumDuration;

        let newPosition = swiper.translate + momentumDistance;
        if (rtl) newPosition = -newPosition;

        let doBounce = false;
        let afterBouncePosition;
        const bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeModeMomentumBounceRatio;
        let needsLoopFix;
        if (newPosition < swiper.maxTranslate()) {
          if (params.freeModeMomentumBounce) {
            if (newPosition + swiper.maxTranslate() < -bounceAmount) {
              newPosition = swiper.maxTranslate() - bounceAmount;
            }
            afterBouncePosition = swiper.maxTranslate();
            doBounce = true;
            data.allowMomentumBounce = true;
          } else {
            newPosition = swiper.maxTranslate();
          }
          if (params.loop && params.centeredSlides) needsLoopFix = true;
        } else if (newPosition > swiper.minTranslate()) {
          if (params.freeModeMomentumBounce) {
            if (newPosition - swiper.minTranslate() > bounceAmount) {
              newPosition = swiper.minTranslate() + bounceAmount;
            }
            afterBouncePosition = swiper.minTranslate();
            doBounce = true;
            data.allowMomentumBounce = true;
          } else {
            newPosition = swiper.minTranslate();
          }
          if (params.loop && params.centeredSlides) needsLoopFix = true;
        } else if (params.freeModeSticky) {
          let nextSlide;
          for (let j = 0; j < snapGrid.length; j += 1) {
            if (snapGrid[j] > -newPosition) {
              nextSlide = j;
              break;
            }
          }

          if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === 'next') {
            newPosition = snapGrid[nextSlide];
          } else {
            newPosition = snapGrid[nextSlide - 1];
          }
          newPosition = -newPosition;
        }
        if (needsLoopFix) {
          swiper.once('transitionEnd', () => {
            swiper.loopFix();
          });
        }
        // Fix duration
        if (swiper.velocity !== 0) {
          if (rtl) {
            momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
          } else {
            momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
          }
          if (params.freeModeSticky) {
            // If freeModeSticky is active and the user ends a swipe with a slow-velocity
            // event, then durations can be 20+ seconds to slide one (or zero!) slides.
            // It's easy to see this when simulating touch with mouse events. To fix this,
            // limit single-slide swipes to the default slide duration. This also has the
            // nice side effect of matching slide speed if the user stopped moving before
            // lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
            // For faster swipes, also apply limits (albeit higher ones).
            const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
            const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];
            if (moveDistance < currentSlideSize) {
              momentumDuration = params.speed;
            } else if (moveDistance < 2 * currentSlideSize) {
              momentumDuration = params.speed * 1.5;
            } else {
              momentumDuration = params.speed * 2.5;
            }
          }
        } else if (params.freeModeSticky) {
          swiper.slideToClosest();
          return;
        }

        if (params.freeModeMomentumBounce && doBounce) {
          swiper.updateProgress(afterBouncePosition);
          swiper.setTransition(momentumDuration);
          swiper.setTranslate(newPosition);
          swiper.transitionStart(true, swiper.swipeDirection);
          swiper.animating = true;
          $wrapperEl.transitionEnd(() => {
            if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
            swiper.emit('momentumBounce');

            swiper.setTransition(params.speed);
            swiper.setTranslate(afterBouncePosition);
            $wrapperEl.transitionEnd(() => {
              if (!swiper || swiper.destroyed) return;
              swiper.transitionEnd();
            });
          });
        } else if (swiper.velocity) {
          swiper.updateProgress(newPosition);
          swiper.setTransition(momentumDuration);
          swiper.setTranslate(newPosition);
          swiper.transitionStart(true, swiper.swipeDirection);
          if (!swiper.animating) {
            swiper.animating = true;
            $wrapperEl.transitionEnd(() => {
              if (!swiper || swiper.destroyed) return;
              swiper.transitionEnd();
            });
          }
        } else {
          swiper.updateProgress(newPosition);
        }

        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      } else if (params.freeModeSticky) {
        swiper.slideToClosest();
        return;
      }

      if (!params.freeModeMomentum || timeDiff >= params.longSwipesMs) {
        swiper.updateProgress();
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }
      return;
    }

    // Find current slide
    let stopIndex = 0;
    let groupSize = swiper.slidesSizesGrid[0];
    for (let i = 0; i < slidesGrid.length; i += params.slidesPerGroup) {
      if (typeof slidesGrid[i + params.slidesPerGroup] !== 'undefined') {
        if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + params.slidesPerGroup]) {
          stopIndex = i;
          groupSize = slidesGrid[i + params.slidesPerGroup] - slidesGrid[i];
        }
      } else if (currentPos >= slidesGrid[i]) {
        stopIndex = i;
        groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
      }
    }

    // Find current slide size
    const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;

    if (timeDiff > params.longSwipesMs) {
      // Long touches
      if (!params.longSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      if (swiper.swipeDirection === 'next') {
        if (ratio >= params.longSwipesRatio) swiper.slideTo(stopIndex + params.slidesPerGroup);
        else swiper.slideTo(stopIndex);
      }
      if (swiper.swipeDirection === 'prev') {
        if (ratio > (1 - params.longSwipesRatio)) swiper.slideTo(stopIndex + params.slidesPerGroup);
        else swiper.slideTo(stopIndex);
      }
    } else {
      // Short swipes
      if (!params.shortSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
      if (!isNavButtonTarget) {
        if (swiper.swipeDirection === 'next') {
          swiper.slideTo(stopIndex + params.slidesPerGroup);
        }
        if (swiper.swipeDirection === 'prev') {
          swiper.slideTo(stopIndex);
        }
      } else if (e.target === swiper.navigation.nextEl) {
        swiper.slideTo(stopIndex + params.slidesPerGroup);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  }

  function onResize () {
    const swiper = this;

    const { params, el } = swiper;

    if (el && el.offsetWidth === 0) return;

    // Breakpoints
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }

    // Save locks
    const { allowSlideNext, allowSlidePrev, snapGrid } = swiper;

    // Disable locks on resize
    swiper.allowSlideNext = true;
    swiper.allowSlidePrev = true;

    swiper.updateSize();
    swiper.updateSlides();

    swiper.updateSlidesClasses();
    if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
      swiper.slideTo(swiper.slides.length - 1, 0, false, true);
    } else {
      swiper.slideTo(swiper.activeIndex, 0, false, true);
    }

    if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
      swiper.autoplay.run();
    }
    // Return locks after resize
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;

    if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
  }

  function onClick (e) {
    const swiper = this;
    if (!swiper.allowClick) {
      if (swiper.params.preventClicks) e.preventDefault();
      if (swiper.params.preventClicksPropagation && swiper.animating) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
  }

  function onScroll () {
    const swiper = this;
    const { wrapperEl } = swiper;
    swiper.previousTranslate = swiper.translate;
    swiper.translate = swiper.isHorizontal() ? -wrapperEl.scrollLeft : -wrapperEl.scrollTop;
    // eslint-disable-next-line
    if (swiper.translate === -0) swiper.translate = 0;

    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();

    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (swiper.translate - swiper.minTranslate()) / (translatesDiff);
    }
    if (newProgress !== swiper.progress) {
      swiper.updateProgress(swiper.translate);
    }

    swiper.emit('setTranslate', swiper.translate, false);
  }

  let dummyEventAttached = false;
  function dummyEventListener() {}

  function attachEvents() {
    const swiper = this;
    const {
      params, touchEvents, el, wrapperEl,
    } = swiper;

    swiper.onTouchStart = onTouchStart.bind(swiper);
    swiper.onTouchMove = onTouchMove.bind(swiper);
    swiper.onTouchEnd = onTouchEnd.bind(swiper);
    if (params.cssMode) {
      swiper.onScroll = onScroll.bind(swiper);
    }

    swiper.onClick = onClick.bind(swiper);

    const capture = !!params.nested;

    // Touch Events
    if (!Support.touch && Support.pointerEvents) {
      el.addEventListener(touchEvents.start, swiper.onTouchStart, false);
      doc.addEventListener(touchEvents.move, swiper.onTouchMove, capture);
      doc.addEventListener(touchEvents.end, swiper.onTouchEnd, false);
    } else {
      if (Support.touch) {
        const passiveListener = touchEvents.start === 'touchstart' && Support.passiveListener && params.passiveListeners ? { passive: true, capture: false } : false;
        el.addEventListener(touchEvents.start, swiper.onTouchStart, passiveListener);
        el.addEventListener(touchEvents.move, swiper.onTouchMove, Support.passiveListener ? { passive: false, capture } : capture);
        el.addEventListener(touchEvents.end, swiper.onTouchEnd, passiveListener);
        if (touchEvents.cancel) {
          el.addEventListener(touchEvents.cancel, swiper.onTouchEnd, passiveListener);
        }
        if (!dummyEventAttached) {
          doc.addEventListener('touchstart', dummyEventListener);
          dummyEventAttached = true;
        }
      }
      if ((params.simulateTouch && !Device.ios && !Device.android) || (params.simulateTouch && !Support.touch && Device.ios)) {
        el.addEventListener('mousedown', swiper.onTouchStart, false);
        doc.addEventListener('mousemove', swiper.onTouchMove, capture);
        doc.addEventListener('mouseup', swiper.onTouchEnd, false);
      }
    }
    // Prevent Links Clicks
    if (params.preventClicks || params.preventClicksPropagation) {
      el.addEventListener('click', swiper.onClick, true);
    }
    if (params.cssMode) {
      wrapperEl.addEventListener('scroll', swiper.onScroll);
    }

    // Resize handler
    swiper.on((Device.ios || Device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate'), onResize, true);
  }

  function detachEvents() {
    const swiper = this;

    const {
      params, touchEvents, el, wrapperEl,
    } = swiper;

    const capture = !!params.nested;

    // Touch Events
    if (!Support.touch && Support.pointerEvents) {
      el.removeEventListener(touchEvents.start, swiper.onTouchStart, false);
      doc.removeEventListener(touchEvents.move, swiper.onTouchMove, capture);
      doc.removeEventListener(touchEvents.end, swiper.onTouchEnd, false);
    } else {
      if (Support.touch) {
        const passiveListener = touchEvents.start === 'onTouchStart' && Support.passiveListener && params.passiveListeners ? { passive: true, capture: false } : false;
        el.removeEventListener(touchEvents.start, swiper.onTouchStart, passiveListener);
        el.removeEventListener(touchEvents.move, swiper.onTouchMove, capture);
        el.removeEventListener(touchEvents.end, swiper.onTouchEnd, passiveListener);
        if (touchEvents.cancel) {
          el.removeEventListener(touchEvents.cancel, swiper.onTouchEnd, passiveListener);
        }
      }
      if ((params.simulateTouch && !Device.ios && !Device.android) || (params.simulateTouch && !Support.touch && Device.ios)) {
        el.removeEventListener('mousedown', swiper.onTouchStart, false);
        doc.removeEventListener('mousemove', swiper.onTouchMove, capture);
        doc.removeEventListener('mouseup', swiper.onTouchEnd, false);
      }
    }
    // Prevent Links Clicks
    if (params.preventClicks || params.preventClicksPropagation) {
      el.removeEventListener('click', swiper.onClick, true);
    }

    if (params.cssMode) {
      wrapperEl.removeEventListener('scroll', swiper.onScroll);
    }

    // Resize handler
    swiper.off((Device.ios || Device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate'), onResize);
  }

  var events = {
    attachEvents,
    detachEvents,
  };

  function setBreakpoint () {
    const swiper = this;
    const {
      activeIndex, initialized, loopedSlides = 0, params, $el,
    } = swiper;
    const breakpoints = params.breakpoints;
    if (!breakpoints || (breakpoints && Object.keys(breakpoints).length === 0)) return;

    // Get breakpoint for window width and update parameters
    const breakpoint = swiper.getBreakpoint(breakpoints);

    if (breakpoint && swiper.currentBreakpoint !== breakpoint) {
      const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
      if (breakpointOnlyParams) {
        ['slidesPerView', 'spaceBetween', 'slidesPerGroup', 'slidesPerColumn'].forEach((param) => {
          const paramValue = breakpointOnlyParams[param];
          if (typeof paramValue === 'undefined') return;
          if (param === 'slidesPerView' && (paramValue === 'AUTO' || paramValue === 'auto')) {
            breakpointOnlyParams[param] = 'auto';
          } else if (param === 'slidesPerView') {
            breakpointOnlyParams[param] = parseFloat(paramValue);
          } else {
            breakpointOnlyParams[param] = parseInt(paramValue, 10);
          }
        });
      }

      const breakpointParams = breakpointOnlyParams || swiper.originalParams;
      const wasMultiRow = params.slidesPerColumn > 1;
      const isMultiRow = breakpointParams.slidesPerColumn > 1;
      if (wasMultiRow && !isMultiRow) {
        $el.removeClass(`${params.containerModifierClass}multirow ${params.containerModifierClass}multirow-column`);
      } else if (!wasMultiRow && isMultiRow) {
        $el.addClass(`${params.containerModifierClass}multirow`);
        if (breakpointParams.slidesPerColumnFill === 'column') {
          $el.addClass(`${params.containerModifierClass}multirow-column`);
        }
      }

      const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
      const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);

      if (directionChanged && initialized) {
        swiper.changeDirection();
      }

      Utils.extend(swiper.params, breakpointParams);

      Utils.extend(swiper, {
        allowTouchMove: swiper.params.allowTouchMove,
        allowSlideNext: swiper.params.allowSlideNext,
        allowSlidePrev: swiper.params.allowSlidePrev,
      });

      swiper.currentBreakpoint = breakpoint;

      if (needsReLoop && initialized) {
        swiper.loopDestroy();
        swiper.loopCreate();
        swiper.updateSlides();
        swiper.slideTo((activeIndex - loopedSlides) + swiper.loopedSlides, 0, false);
      }

      swiper.emit('breakpoint', breakpointParams);
    }
  }

  function getBreakpoint (breakpoints) {
    // Get breakpoint for window width
    if (!breakpoints) return undefined;
    let breakpoint = false;
    const points = [];
    Object.keys(breakpoints).forEach((point) => {
      points.push(point);
    });
    points.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      if (point <= win.innerWidth) {
        breakpoint = point;
      }
    }
    return breakpoint || 'max';
  }

  var breakpoints = { setBreakpoint, getBreakpoint };

  function addClasses () {
    const swiper = this;
    const {
      classNames, params, rtl, $el,
    } = swiper;
    const suffixes = [];

    suffixes.push('initialized');
    suffixes.push(params.direction);

    if (params.freeMode) {
      suffixes.push('free-mode');
    }
    if (params.autoHeight) {
      suffixes.push('autoheight');
    }
    if (rtl) {
      suffixes.push('rtl');
    }
    if (params.slidesPerColumn > 1) {
      suffixes.push('multirow');
      if (params.slidesPerColumnFill === 'column') {
        suffixes.push('multirow-column');
      }
    }
    if (Device.android) {
      suffixes.push('android');
    }
    if (Device.ios) {
      suffixes.push('ios');
    }

    if (params.cssMode) {
      suffixes.push('css-mode');
    }

    suffixes.forEach((suffix) => {
      classNames.push(params.containerModifierClass + suffix);
    });

    $el.addClass(classNames.join(' '));
  }

  function removeClasses () {
    const swiper = this;
    const { $el, classNames } = swiper;

    $el.removeClass(classNames.join(' '));
  }

  var classes = { addClasses, removeClasses };

  function loadImage (imageEl, src, srcset, sizes, checkForComplete, callback) {
    let image;
    function onReady() {
      if (callback) callback();
    }
    if (!imageEl.complete || !checkForComplete) {
      if (src) {
        image = new win.Image();
        image.onload = onReady;
        image.onerror = onReady;
        if (sizes) {
          image.sizes = sizes;
        }
        if (srcset) {
          image.srcset = srcset;
        }
        if (src) {
          image.src = src;
        }
      } else {
        onReady();
      }
    } else {
      // image already loaded...
      onReady();
    }
  }

  function preloadImages () {
    const swiper = this;
    swiper.imagesToLoad = swiper.$el.find('img');
    function onReady() {
      if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper.destroyed) return;
      if (swiper.imagesLoaded !== undefined) swiper.imagesLoaded += 1;
      if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
        if (swiper.params.updateOnImagesReady) swiper.update();
        swiper.emit('imagesReady');
      }
    }
    for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
      const imageEl = swiper.imagesToLoad[i];
      swiper.loadImage(
        imageEl,
        imageEl.currentSrc || imageEl.getAttribute('src'),
        imageEl.srcset || imageEl.getAttribute('srcset'),
        imageEl.sizes || imageEl.getAttribute('sizes'),
        true,
        onReady
      );
    }
  }

  var images = {
    loadImage,
    preloadImages,
  };

  function checkOverflow() {
    const swiper = this;
    const params = swiper.params;
    const wasLocked = swiper.isLocked;
    const lastSlidePosition = swiper.slides.length > 0 && (params.slidesOffsetBefore + (params.spaceBetween * (swiper.slides.length - 1)) + ((swiper.slides[0]).offsetWidth) * swiper.slides.length);

    if (params.slidesOffsetBefore && params.slidesOffsetAfter && lastSlidePosition) {
      swiper.isLocked = lastSlidePosition <= swiper.size;
    } else {
      swiper.isLocked = swiper.snapGrid.length === 1;
    }

    swiper.allowSlideNext = !swiper.isLocked;
    swiper.allowSlidePrev = !swiper.isLocked;

    // events
    if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? 'lock' : 'unlock');

    if (wasLocked && wasLocked !== swiper.isLocked) {
      swiper.isEnd = false;
      swiper.navigation.update();
    }
  }

  var checkOverflow$1 = { checkOverflow };

  var defaults = {
    init: true,
    direction: 'horizontal',
    touchEventsTarget: 'container',
    initialSlide: 0,
    speed: 300,
    cssMode: false,
    //
    preventInteractionOnTransition: false,

    // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
    edgeSwipeDetection: false,
    edgeSwipeThreshold: 20,

    // Free mode
    freeMode: false,
    freeModeMomentum: true,
    freeModeMomentumRatio: 1,
    freeModeMomentumBounce: true,
    freeModeMomentumBounceRatio: 1,
    freeModeMomentumVelocityRatio: 1,
    freeModeSticky: false,
    freeModeMinimumVelocity: 0.02,

    // Autoheight
    autoHeight: false,

    // Set wrapper width
    setWrapperSize: false,

    // Virtual Translate
    virtualTranslate: false,

    // Effects
    effect: 'slide', // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'

    // Breakpoints
    breakpoints: undefined,

    // Slides grid
    spaceBetween: 0,
    slidesPerView: 1,
    slidesPerColumn: 1,
    slidesPerColumnFill: 'column',
    slidesPerGroup: 1,
    centeredSlides: false,
    centeredSlidesBounds: false,
    slidesOffsetBefore: 0, // in px
    slidesOffsetAfter: 0, // in px
    normalizeSlideIndex: true,
    centerInsufficientSlides: false,

    // Disable swiper and hide navigation when container not overflow
    watchOverflow: false,

    // Round length
    roundLengths: false,

    // Touches
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: true,
    shortSwipes: true,
    longSwipes: true,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: true,
    allowTouchMove: true,
    threshold: 0,
    touchMoveStopPropagation: false,
    touchStartPreventDefault: true,
    touchStartForcePreventDefault: false,
    touchReleaseOnEdges: false,

    // Unique Navigation Elements
    uniqueNavElements: true,

    // Resistance
    resistance: true,
    resistanceRatio: 0.85,

    // Progress
    watchSlidesProgress: false,
    watchSlidesVisibility: false,

    // Cursor
    grabCursor: false,

    // Clicks
    preventClicks: true,
    preventClicksPropagation: true,
    slideToClickedSlide: false,

    // Images
    preloadImages: true,
    updateOnImagesReady: true,

    // loop
    loop: false,
    loopAdditionalSlides: 0,
    loopedSlides: null,
    loopFillGroupWithBlank: false,

    // Swiping/no swiping
    allowSlidePrev: true,
    allowSlideNext: true,
    swipeHandler: null, // '.swipe-handler',
    noSwiping: true,
    noSwipingClass: 'swiper-no-swiping',
    noSwipingSelector: null,

    // Passive Listeners
    passiveListeners: true,

    // NS
    containerModifierClass: 'swiper-container-', // NEW
    slideClass: 'swiper-slide',
    slideBlankClass: 'swiper-slide-invisible-blank',
    slideActiveClass: 'swiper-slide-active',
    slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
    slideVisibleClass: 'swiper-slide-visible',
    slideDuplicateClass: 'swiper-slide-duplicate',
    slideNextClass: 'swiper-slide-next',
    slideDuplicateNextClass: 'swiper-slide-duplicate-next',
    slidePrevClass: 'swiper-slide-prev',
    slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
    wrapperClass: 'swiper-wrapper',

    // Callbacks
    runCallbacksOnInit: true,
  };

  /* eslint no-param-reassign: "off" */

  const prototypes = {
    update,
    translate,
    transition: transition$1,
    slide,
    loop,
    grabCursor,
    manipulation,
    events,
    breakpoints,
    checkOverflow: checkOverflow$1,
    classes,
    images,
  };

  const extendedDefaults = {};

  class Swiper extends SwiperClass {
    constructor(...args) {
      let el;
      let params;
      if (args.length === 1 && args[0].constructor && args[0].constructor === Object) {
        params = args[0];
      } else {
        [el, params] = args;
      }
      if (!params) params = {};

      params = Utils.extend({}, params);
      if (el && !params.el) params.el = el;

      super(params);

      Object.keys(prototypes).forEach((prototypeGroup) => {
        Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
          if (!Swiper.prototype[protoMethod]) {
            Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
          }
        });
      });

      // Swiper Instance
      const swiper = this;
      if (typeof swiper.modules === 'undefined') {
        swiper.modules = {};
      }
      Object.keys(swiper.modules).forEach((moduleName) => {
        const module = swiper.modules[moduleName];
        if (module.params) {
          const moduleParamName = Object.keys(module.params)[0];
          const moduleParams = module.params[moduleParamName];
          if (typeof moduleParams !== 'object' || moduleParams === null) return;
          if (!(moduleParamName in params && 'enabled' in moduleParams)) return;
          if (params[moduleParamName] === true) {
            params[moduleParamName] = { enabled: true };
          }
          if (
            typeof params[moduleParamName] === 'object'
            && !('enabled' in params[moduleParamName])
          ) {
            params[moduleParamName].enabled = true;
          }
          if (!params[moduleParamName]) params[moduleParamName] = { enabled: false };
        }
      });

      // Extend defaults with modules params
      const swiperParams = Utils.extend({}, defaults);
      swiper.useModulesParams(swiperParams);

      // Extend defaults with passed params
      swiper.params = Utils.extend({}, swiperParams, extendedDefaults, params);
      swiper.originalParams = Utils.extend({}, swiper.params);
      swiper.passedParams = Utils.extend({}, params);

      // Save Dom lib
      swiper.$ = $;

      // Find el
      const $el = $(swiper.params.el);
      el = $el[0];

      if (!el) {
        return undefined;
      }

      if ($el.length > 1) {
        const swipers = [];
        $el.each((index, containerEl) => {
          const newParams = Utils.extend({}, params, { el: containerEl });
          swipers.push(new Swiper(newParams));
        });
        return swipers;
      }

      el.swiper = swiper;
      $el.data('swiper', swiper);

      // Find Wrapper
      let $wrapperEl;
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        $wrapperEl = $(el.shadowRoot.querySelector(`.${swiper.params.wrapperClass}`));
        // Children needs to return slot items
        $wrapperEl.children = (options) => $el.children(options);
      } else {
        $wrapperEl = $el.children(`.${swiper.params.wrapperClass}`);
      }
      // Extend Swiper
      Utils.extend(swiper, {
        $el,
        el,
        $wrapperEl,
        wrapperEl: $wrapperEl[0],

        // Classes
        classNames: [],

        // Slides
        slides: $(),
        slidesGrid: [],
        snapGrid: [],
        slidesSizesGrid: [],

        // isDirection
        isHorizontal() {
          return swiper.params.direction === 'horizontal';
        },
        isVertical() {
          return swiper.params.direction === 'vertical';
        },
        // RTL
        rtl: (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
        rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
        wrongRTL: $wrapperEl.css('display') === '-webkit-box',

        // Indexes
        activeIndex: 0,
        realIndex: 0,

        //
        isBeginning: true,
        isEnd: false,

        // Props
        translate: 0,
        previousTranslate: 0,
        progress: 0,
        velocity: 0,
        animating: false,

        // Locks
        allowSlideNext: swiper.params.allowSlideNext,
        allowSlidePrev: swiper.params.allowSlidePrev,

        // Touch Events
        touchEvents: (function touchEvents() {
          const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
          let desktop = ['mousedown', 'mousemove', 'mouseup'];
          if (Support.pointerEvents) {
            desktop = ['pointerdown', 'pointermove', 'pointerup'];
          }
          swiper.touchEventsTouch = {
            start: touch[0],
            move: touch[1],
            end: touch[2],
            cancel: touch[3],
          };
          swiper.touchEventsDesktop = {
            start: desktop[0],
            move: desktop[1],
            end: desktop[2],
          };
          return Support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
        }()),
        touchEventsData: {
          isTouched: undefined,
          isMoved: undefined,
          allowTouchCallbacks: undefined,
          touchStartTime: undefined,
          isScrolling: undefined,
          currentTranslate: undefined,
          startTranslate: undefined,
          allowThresholdMove: undefined,
          // Form elements to match
          formElements: 'input, select, option, textarea, button, video',
          // Last click time
          lastClickTime: Utils.now(),
          clickTimeout: undefined,
          // Velocities
          velocities: [],
          allowMomentumBounce: undefined,
          isTouchEvent: undefined,
          startMoving: undefined,
        },

        // Clicks
        allowClick: true,

        // Touches
        allowTouchMove: swiper.params.allowTouchMove,

        touches: {
          startX: 0,
          startY: 0,
          currentX: 0,
          currentY: 0,
          diff: 0,
        },

        // Images
        imagesToLoad: [],
        imagesLoaded: 0,

      });

      // Install Modules
      swiper.useModules();

      // Init
      if (swiper.params.init) {
        swiper.init();
      }

      // Return app instance
      return swiper;
    }

    slidesPerViewDynamic() {
      const swiper = this;
      const {
        params, slides, slidesGrid, size: swiperSize, activeIndex,
      } = swiper;
      let spv = 1;
      if (params.centeredSlides) {
        let slideSize = slides[activeIndex].swiperSlideSize;
        let breakLoop;
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          if (slides[i] && !breakLoop) {
            slideSize += slides[i].swiperSlideSize;
            spv += 1;
            if (slideSize > swiperSize) breakLoop = true;
          }
        }
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          if (slides[i] && !breakLoop) {
            slideSize += slides[i].swiperSlideSize;
            spv += 1;
            if (slideSize > swiperSize) breakLoop = true;
          }
        }
      } else {
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          if (slidesGrid[i] - slidesGrid[activeIndex] < swiperSize) {
            spv += 1;
          }
        }
      }
      return spv;
    }

    update() {
      const swiper = this;
      if (!swiper || swiper.destroyed) return;
      const { snapGrid, params } = swiper;
      // Breakpoints
      if (params.breakpoints) {
        swiper.setBreakpoint();
      }
      swiper.updateSize();
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();

      function setTranslate() {
        const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
        const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
        swiper.setTranslate(newTranslate);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }
      let translated;
      if (swiper.params.freeMode) {
        setTranslate();
        if (swiper.params.autoHeight) {
          swiper.updateAutoHeight();
        }
      } else {
        if ((swiper.params.slidesPerView === 'auto' || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
          translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
        } else {
          translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
        }
        if (!translated) {
          setTranslate();
        }
      }
      if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
        swiper.checkOverflow();
      }
      swiper.emit('update');
    }

    changeDirection(newDirection, needUpdate = true) {
      const swiper = this;
      const currentDirection = swiper.params.direction;
      if (!newDirection) {
        // eslint-disable-next-line
        newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
      }
      if ((newDirection === currentDirection) || (newDirection !== 'horizontal' && newDirection !== 'vertical')) {
        return swiper;
      }

      swiper.$el
        .removeClass(`${swiper.params.containerModifierClass}${currentDirection}`)
        .addClass(`${swiper.params.containerModifierClass}${newDirection}`);

      swiper.params.direction = newDirection;

      swiper.slides.each((slideIndex, slideEl) => {
        if (newDirection === 'vertical') {
          slideEl.style.width = '';
        } else {
          slideEl.style.height = '';
        }
      });

      swiper.emit('changeDirection');
      if (needUpdate) swiper.update();

      return swiper;
    }

    init() {
      const swiper = this;
      if (swiper.initialized) return;

      swiper.emit('beforeInit');

      // Set breakpoint
      if (swiper.params.breakpoints) {
        swiper.setBreakpoint();
      }

      // Add Classes
      swiper.addClasses();

      // Create loop
      if (swiper.params.loop) {
        swiper.loopCreate();
      }

      // Update size
      swiper.updateSize();

      // Update slides
      swiper.updateSlides();

      if (swiper.params.watchOverflow) {
        swiper.checkOverflow();
      }

      // Set Grab Cursor
      if (swiper.params.grabCursor) {
        swiper.setGrabCursor();
      }

      if (swiper.params.preloadImages) {
        swiper.preloadImages();
      }

      // Slide To Initial Slide
      if (swiper.params.loop) {
        swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit);
      } else {
        swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit);
      }

      // Attach events
      swiper.attachEvents();

      // Init Flag
      swiper.initialized = true;

      // Emit
      swiper.emit('init');
    }

    destroy(deleteInstance = true, cleanStyles = true) {
      const swiper = this;
      const {
        params, $el, $wrapperEl, slides,
      } = swiper;

      if (typeof swiper.params === 'undefined' || swiper.destroyed) {
        return null;
      }

      swiper.emit('beforeDestroy');

      // Init Flag
      swiper.initialized = false;

      // Detach events
      swiper.detachEvents();

      // Destroy loop
      if (params.loop) {
        swiper.loopDestroy();
      }

      // Cleanup styles
      if (cleanStyles) {
        swiper.removeClasses();
        $el.removeAttr('style');
        $wrapperEl.removeAttr('style');
        if (slides && slides.length) {
          slides
            .removeClass([
              params.slideVisibleClass,
              params.slideActiveClass,
              params.slideNextClass,
              params.slidePrevClass,
            ].join(' '))
            .removeAttr('style')
            .removeAttr('data-swiper-slide-index');
        }
      }

      swiper.emit('destroy');

      // Detach emitter events
      Object.keys(swiper.eventsListeners).forEach((eventName) => {
        swiper.off(eventName);
      });

      if (deleteInstance !== false) {
        swiper.$el[0].swiper = null;
        swiper.$el.data('swiper', null);
        Utils.deleteProps(swiper);
      }
      swiper.destroyed = true;

      return null;
    }

    static extendDefaults(newDefaults) {
      Utils.extend(extendedDefaults, newDefaults);
    }

    static get extendedDefaults() {
      return extendedDefaults;
    }

    static get defaults() {
      return defaults;
    }

    static get Class() {
      return SwiperClass;
    }

    static get $() {
      return $;
    }
  }

  var Device$1 = {
    name: 'device',
    proto: {
      device: Device,
    },
    static: {
      device: Device,
    },
  };

  var Support$1 = {
    name: 'support',
    proto: {
      support: Support,
    },
    static: {
      support: Support,
    },
  };

  const Browser = (function Browser() {
    function isSafari() {
      const ua = win.navigator.userAgent.toLowerCase();
      return (ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0);
    }
    return {
      isEdge: !!win.navigator.userAgent.match(/Edge/g),
      isSafari: isSafari(),
      isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(win.navigator.userAgent),
    };
  }());

  var Browser$1 = {
    name: 'browser',
    proto: {
      browser: Browser,
    },
    static: {
      browser: Browser,
    },
  };

  var Resize = {
    name: 'resize',
    create() {
      const swiper = this;
      Utils.extend(swiper, {
        resize: {
          resizeHandler() {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            swiper.emit('beforeResize');
            swiper.emit('resize');
          },
          orientationChangeHandler() {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            swiper.emit('orientationchange');
          },
        },
      });
    },
    on: {
      init() {
        const swiper = this;
        // Emit resize
        win.addEventListener('resize', swiper.resize.resizeHandler);

        // Emit orientationchange
        win.addEventListener('orientationchange', swiper.resize.orientationChangeHandler);
      },
      destroy() {
        const swiper = this;
        win.removeEventListener('resize', swiper.resize.resizeHandler);
        win.removeEventListener('orientationchange', swiper.resize.orientationChangeHandler);
      },
    },
  };

  const Observer = {
    func: win.MutationObserver || win.WebkitMutationObserver,
    attach(target, options = {}) {
      const swiper = this;

      const ObserverFunc = Observer.func;
      const observer = new ObserverFunc((mutations) => {
        // The observerUpdate event should only be triggered
        // once despite the number of mutations.  Additional
        // triggers are redundant and are very costly
        if (mutations.length === 1) {
          swiper.emit('observerUpdate', mutations[0]);
          return;
        }
        const observerUpdate = function observerUpdate() {
          swiper.emit('observerUpdate', mutations[0]);
        };

        if (win.requestAnimationFrame) {
          win.requestAnimationFrame(observerUpdate);
        } else {
          win.setTimeout(observerUpdate, 0);
        }
      });

      observer.observe(target, {
        attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
        childList: typeof options.childList === 'undefined' ? true : options.childList,
        characterData: typeof options.characterData === 'undefined' ? true : options.characterData,
      });

      swiper.observer.observers.push(observer);
    },
    init() {
      const swiper = this;
      if (!Support.observer || !swiper.params.observer) return;
      if (swiper.params.observeParents) {
        const containerParents = swiper.$el.parents();
        for (let i = 0; i < containerParents.length; i += 1) {
          swiper.observer.attach(containerParents[i]);
        }
      }
      // Observe container
      swiper.observer.attach(swiper.$el[0], { childList: swiper.params.observeSlideChildren });

      // Observe wrapper
      swiper.observer.attach(swiper.$wrapperEl[0], { attributes: false });
    },
    destroy() {
      const swiper = this;
      swiper.observer.observers.forEach((observer) => {
        observer.disconnect();
      });
      swiper.observer.observers = [];
    },
  };

  var Observer$1 = {
    name: 'observer',
    params: {
      observer: false,
      observeParents: false,
      observeSlideChildren: false,
    },
    create() {
      const swiper = this;
      Utils.extend(swiper, {
        observer: {
          init: Observer.init.bind(swiper),
          attach: Observer.attach.bind(swiper),
          destroy: Observer.destroy.bind(swiper),
          observers: [],
        },
      });
    },
    on: {
      init() {
        const swiper = this;
        swiper.observer.init();
      },
      destroy() {
        const swiper = this;
        swiper.observer.destroy();
      },
    },
  };

  const Keyboard = {
    handle(event) {
      const swiper = this;
      const { rtlTranslate: rtl } = swiper;
      let e = event;
      if (e.originalEvent) e = e.originalEvent; // jquery fix
      const kc = e.keyCode || e.charCode;
      // Directions locks
      if (!swiper.allowSlideNext && ((swiper.isHorizontal() && kc === 39) || (swiper.isVertical() && kc === 40) || kc === 34)) {
        return false;
      }
      if (!swiper.allowSlidePrev && ((swiper.isHorizontal() && kc === 37) || (swiper.isVertical() && kc === 38) || kc === 33)) {
        return false;
      }
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
        return undefined;
      }
      if (doc.activeElement && doc.activeElement.nodeName && (doc.activeElement.nodeName.toLowerCase() === 'input' || doc.activeElement.nodeName.toLowerCase() === 'textarea')) {
        return undefined;
      }
      if (swiper.params.keyboard.onlyInViewport && (kc === 33 || kc === 34 || kc === 37 || kc === 39 || kc === 38 || kc === 40)) {
        let inView = false;
        // Check that swiper should be inside of visible area of window
        if (swiper.$el.parents(`.${swiper.params.slideClass}`).length > 0 && swiper.$el.parents(`.${swiper.params.slideActiveClass}`).length === 0) {
          return undefined;
        }
        const windowWidth = win.innerWidth;
        const windowHeight = win.innerHeight;
        const swiperOffset = swiper.$el.offset();
        if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
        const swiperCoord = [
          [swiperOffset.left, swiperOffset.top],
          [swiperOffset.left + swiper.width, swiperOffset.top],
          [swiperOffset.left, swiperOffset.top + swiper.height],
          [swiperOffset.left + swiper.width, swiperOffset.top + swiper.height],
        ];
        for (let i = 0; i < swiperCoord.length; i += 1) {
          const point = swiperCoord[i];
          if (
            point[0] >= 0 && point[0] <= windowWidth
            && point[1] >= 0 && point[1] <= windowHeight
          ) {
            inView = true;
          }
        }
        if (!inView) return undefined;
      }
      if (swiper.isHorizontal()) {
        if (kc === 33 || kc === 34 || kc === 37 || kc === 39) {
          if (e.preventDefault) e.preventDefault();
          else e.returnValue = false;
        }
        if (((kc === 34 || kc === 39) && !rtl) || ((kc === 33 || kc === 37) && rtl)) swiper.slideNext();
        if (((kc === 33 || kc === 37) && !rtl) || ((kc === 34 || kc === 39) && rtl)) swiper.slidePrev();
      } else {
        if (kc === 33 || kc === 34 || kc === 38 || kc === 40) {
          if (e.preventDefault) e.preventDefault();
          else e.returnValue = false;
        }
        if (kc === 34 || kc === 40) swiper.slideNext();
        if (kc === 33 || kc === 38) swiper.slidePrev();
      }
      swiper.emit('keyPress', kc);
      return undefined;
    },
    enable() {
      const swiper = this;
      if (swiper.keyboard.enabled) return;
      $(doc).on('keydown', swiper.keyboard.handle);
      swiper.keyboard.enabled = true;
    },
    disable() {
      const swiper = this;
      if (!swiper.keyboard.enabled) return;
      $(doc).off('keydown', swiper.keyboard.handle);
      swiper.keyboard.enabled = false;
    },
  };

  var keyboard = {
    name: 'keyboard',
    params: {
      keyboard: {
        enabled: false,
        onlyInViewport: true,
      },
    },
    create() {
      const swiper = this;
      Utils.extend(swiper, {
        keyboard: {
          enabled: false,
          enable: Keyboard.enable.bind(swiper),
          disable: Keyboard.disable.bind(swiper),
          handle: Keyboard.handle.bind(swiper),
        },
      });
    },
    on: {
      init() {
        const swiper = this;
        if (swiper.params.keyboard.enabled) {
          swiper.keyboard.enable();
        }
      },
      destroy() {
        const swiper = this;
        if (swiper.keyboard.enabled) {
          swiper.keyboard.disable();
        }
      },
    },
  };

  const Pagination = {
    update() {
      // Render || Update Pagination bullets/items
      const swiper = this;
      const rtl = swiper.rtl;
      const params = swiper.params.pagination;
      if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
      const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
      const $el = swiper.pagination.$el;
      // Current/Total
      let current;
      const total = swiper.params.loop ? Math.ceil((slidesLength - (swiper.loopedSlides * 2)) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
      if (swiper.params.loop) {
        current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);
        if (current > slidesLength - 1 - (swiper.loopedSlides * 2)) {
          current -= (slidesLength - (swiper.loopedSlides * 2));
        }
        if (current > total - 1) current -= total;
        if (current < 0 && swiper.params.paginationType !== 'bullets') current = total + current;
      } else if (typeof swiper.snapIndex !== 'undefined') {
        current = swiper.snapIndex;
      } else {
        current = swiper.activeIndex || 0;
      }
      // Types
      if (params.type === 'bullets' && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
        const bullets = swiper.pagination.bullets;
        let firstIndex;
        let lastIndex;
        let midIndex;
        if (params.dynamicBullets) {
          swiper.pagination.bulletSize = bullets.eq(0)[swiper.isHorizontal() ? 'outerWidth' : 'outerHeight'](true);
          $el.css(swiper.isHorizontal() ? 'width' : 'height', `${swiper.pagination.bulletSize * (params.dynamicMainBullets + 4)}px`);
          if (params.dynamicMainBullets > 1 && swiper.previousIndex !== undefined) {
            swiper.pagination.dynamicBulletIndex += (current - swiper.previousIndex);
            if (swiper.pagination.dynamicBulletIndex > (params.dynamicMainBullets - 1)) {
              swiper.pagination.dynamicBulletIndex = params.dynamicMainBullets - 1;
            } else if (swiper.pagination.dynamicBulletIndex < 0) {
              swiper.pagination.dynamicBulletIndex = 0;
            }
          }
          firstIndex = current - swiper.pagination.dynamicBulletIndex;
          lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
          midIndex = (lastIndex + firstIndex) / 2;
        }
        bullets.removeClass(`${params.bulletActiveClass} ${params.bulletActiveClass}-next ${params.bulletActiveClass}-next-next ${params.bulletActiveClass}-prev ${params.bulletActiveClass}-prev-prev ${params.bulletActiveClass}-main`);
        if ($el.length > 1) {
          bullets.each((index, bullet) => {
            const $bullet = $(bullet);
            const bulletIndex = $bullet.index();
            if (bulletIndex === current) {
              $bullet.addClass(params.bulletActiveClass);
            }
            if (params.dynamicBullets) {
              if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
                $bullet.addClass(`${params.bulletActiveClass}-main`);
              }
              if (bulletIndex === firstIndex) {
                $bullet
                  .prev()
                  .addClass(`${params.bulletActiveClass}-prev`)
                  .prev()
                  .addClass(`${params.bulletActiveClass}-prev-prev`);
              }
              if (bulletIndex === lastIndex) {
                $bullet
                  .next()
                  .addClass(`${params.bulletActiveClass}-next`)
                  .next()
                  .addClass(`${params.bulletActiveClass}-next-next`);
              }
            }
          });
        } else {
          const $bullet = bullets.eq(current);
          const bulletIndex = $bullet.index();
          $bullet.addClass(params.bulletActiveClass);
          if (params.dynamicBullets) {
            const $firstDisplayedBullet = bullets.eq(firstIndex);
            const $lastDisplayedBullet = bullets.eq(lastIndex);
            for (let i = firstIndex; i <= lastIndex; i += 1) {
              bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
            }
            if (swiper.params.loop) {
              if (bulletIndex >= bullets.length - params.dynamicMainBullets) {
                for (let i = params.dynamicMainBullets; i >= 0; i -= 1) {
                  bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
                }
                bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
              } else {
                $firstDisplayedBullet
                  .prev()
                  .addClass(`${params.bulletActiveClass}-prev`)
                  .prev()
                  .addClass(`${params.bulletActiveClass}-prev-prev`);
                $lastDisplayedBullet
                  .next()
                  .addClass(`${params.bulletActiveClass}-next`)
                  .next()
                  .addClass(`${params.bulletActiveClass}-next-next`);
              }
            } else {
              $firstDisplayedBullet
                .prev()
                .addClass(`${params.bulletActiveClass}-prev`)
                .prev()
                .addClass(`${params.bulletActiveClass}-prev-prev`);
              $lastDisplayedBullet
                .next()
                .addClass(`${params.bulletActiveClass}-next`)
                .next()
                .addClass(`${params.bulletActiveClass}-next-next`);
            }
          }
        }
        if (params.dynamicBullets) {
          const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
          const bulletsOffset = (((swiper.pagination.bulletSize * dynamicBulletsLength) - (swiper.pagination.bulletSize)) / 2) - (midIndex * swiper.pagination.bulletSize);
          const offsetProp = rtl ? 'right' : 'left';
          bullets.css(swiper.isHorizontal() ? offsetProp : 'top', `${bulletsOffset}px`);
        }
      }
      if (params.type === 'fraction') {
        $el.find(`.${params.currentClass}`).text(params.formatFractionCurrent(current + 1));
        $el.find(`.${params.totalClass}`).text(params.formatFractionTotal(total));
      }
      if (params.type === 'progressbar') {
        let progressbarDirection;
        if (params.progressbarOpposite) {
          progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
        } else {
          progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
        }
        const scale = (current + 1) / total;
        let scaleX = 1;
        let scaleY = 1;
        if (progressbarDirection === 'horizontal') {
          scaleX = scale;
        } else {
          scaleY = scale;
        }
        $el.find(`.${params.progressbarFillClass}`).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper.params.speed);
      }
      if (params.type === 'custom' && params.renderCustom) {
        $el.html(params.renderCustom(swiper, current + 1, total));
        swiper.emit('paginationRender', swiper, $el[0]);
      } else {
        swiper.emit('paginationUpdate', swiper, $el[0]);
      }
      $el[swiper.params.watchOverflow && swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
    },
    render() {
      // Render Container
      const swiper = this;
      const params = swiper.params.pagination;
      if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
      const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;

      const $el = swiper.pagination.$el;
      let paginationHTML = '';
      if (params.type === 'bullets') {
        const numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - (swiper.loopedSlides * 2)) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
        for (let i = 0; i < numberOfBullets; i += 1) {
          if (params.renderBullet) {
            paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
          } else {
            paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
          }
        }
        $el.html(paginationHTML);
        swiper.pagination.bullets = $el.find(`.${params.bulletClass}`);
      }
      if (params.type === 'fraction') {
        if (params.renderFraction) {
          paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
        } else {
          paginationHTML = `<span class="${params.currentClass}"></span>`
          + ' / '
          + `<span class="${params.totalClass}"></span>`;
        }
        $el.html(paginationHTML);
      }
      if (params.type === 'progressbar') {
        if (params.renderProgressbar) {
          paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
        } else {
          paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
        }
        $el.html(paginationHTML);
      }
      if (params.type !== 'custom') {
        swiper.emit('paginationRender', swiper.pagination.$el[0]);
      }
    },
    init() {
      const swiper = this;
      const params = swiper.params.pagination;
      if (!params.el) return;

      let $el = $(params.el);
      if ($el.length === 0) return;

      if (
        swiper.params.uniqueNavElements
        && typeof params.el === 'string'
        && $el.length > 1
        && swiper.$el.find(params.el).length === 1
      ) {
        $el = swiper.$el.find(params.el);
      }

      if (params.type === 'bullets' && params.clickable) {
        $el.addClass(params.clickableClass);
      }

      $el.addClass(params.modifierClass + params.type);

      if (params.type === 'bullets' && params.dynamicBullets) {
        $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
        swiper.pagination.dynamicBulletIndex = 0;
        if (params.dynamicMainBullets < 1) {
          params.dynamicMainBullets = 1;
        }
      }
      if (params.type === 'progressbar' && params.progressbarOpposite) {
        $el.addClass(params.progressbarOppositeClass);
      }

      if (params.clickable) {
        $el.on('click', `.${params.bulletClass}`, function onClick(e) {
          e.preventDefault();
          let index = $(this).index() * swiper.params.slidesPerGroup;
          if (swiper.params.loop) index += swiper.loopedSlides;
          swiper.slideTo(index);
        });
      }

      Utils.extend(swiper.pagination, {
        $el,
        el: $el[0],
      });
    },
    destroy() {
      const swiper = this;
      const params = swiper.params.pagination;
      if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
      const $el = swiper.pagination.$el;

      $el.removeClass(params.hiddenClass);
      $el.removeClass(params.modifierClass + params.type);
      if (swiper.pagination.bullets) swiper.pagination.bullets.removeClass(params.bulletActiveClass);
      if (params.clickable) {
        $el.off('click', `.${params.bulletClass}`);
      }
    },
  };

  var pagination = {
    name: 'pagination',
    params: {
      pagination: {
        el: null,
        bulletElement: 'span',
        clickable: false,
        hideOnClick: false,
        renderBullet: null,
        renderProgressbar: null,
        renderFraction: null,
        renderCustom: null,
        progressbarOpposite: false,
        type: 'bullets', // 'bullets' or 'progressbar' or 'fraction' or 'custom'
        dynamicBullets: false,
        dynamicMainBullets: 1,
        formatFractionCurrent: (number) => number,
        formatFractionTotal: (number) => number,
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active',
        modifierClass: 'swiper-pagination-', // NEW
        currentClass: 'swiper-pagination-current',
        totalClass: 'swiper-pagination-total',
        hiddenClass: 'swiper-pagination-hidden',
        progressbarFillClass: 'swiper-pagination-progressbar-fill',
        progressbarOppositeClass: 'swiper-pagination-progressbar-opposite',
        clickableClass: 'swiper-pagination-clickable', // NEW
        lockClass: 'swiper-pagination-lock',
      },
    },
    create() {
      const swiper = this;
      Utils.extend(swiper, {
        pagination: {
          init: Pagination.init.bind(swiper),
          render: Pagination.render.bind(swiper),
          update: Pagination.update.bind(swiper),
          destroy: Pagination.destroy.bind(swiper),
          dynamicBulletIndex: 0,
        },
      });
    },
    on: {
      init() {
        const swiper = this;
        swiper.pagination.init();
        swiper.pagination.render();
        swiper.pagination.update();
      },
      activeIndexChange() {
        const swiper = this;
        if (swiper.params.loop) {
          swiper.pagination.update();
        } else if (typeof swiper.snapIndex === 'undefined') {
          swiper.pagination.update();
        }
      },
      snapIndexChange() {
        const swiper = this;
        if (!swiper.params.loop) {
          swiper.pagination.update();
        }
      },
      slidesLengthChange() {
        const swiper = this;
        if (swiper.params.loop) {
          swiper.pagination.render();
          swiper.pagination.update();
        }
      },
      snapGridLengthChange() {
        const swiper = this;
        if (!swiper.params.loop) {
          swiper.pagination.render();
          swiper.pagination.update();
        }
      },
      destroy() {
        const swiper = this;
        swiper.pagination.destroy();
      },
      click(e) {
        const swiper = this;
        if (
          swiper.params.pagination.el
          && swiper.params.pagination.hideOnClick
          && swiper.pagination.$el.length > 0
          && !$(e.target).hasClass(swiper.params.pagination.bulletClass)
        ) {
          const isHidden = swiper.pagination.$el.hasClass(swiper.params.pagination.hiddenClass);
          if (isHidden === true) {
            swiper.emit('paginationShow', swiper);
          } else {
            swiper.emit('paginationHide', swiper);
          }
          swiper.pagination.$el.toggleClass(swiper.params.pagination.hiddenClass);
        }
      },
    },
  };

  const Lazy = {
    loadInSlide(index, loadInDuplicate = true) {
      const swiper = this;
      const params = swiper.params.lazy;
      if (typeof index === 'undefined') return;
      if (swiper.slides.length === 0) return;
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

      const $slideEl = isVirtual
        ? swiper.$wrapperEl.children(`.${swiper.params.slideClass}[data-swiper-slide-index="${index}"]`)
        : swiper.slides.eq(index);

      let $images = $slideEl.find(`.${params.elementClass}:not(.${params.loadedClass}):not(.${params.loadingClass})`);
      if ($slideEl.hasClass(params.elementClass) && !$slideEl.hasClass(params.loadedClass) && !$slideEl.hasClass(params.loadingClass)) {
        $images = $images.add($slideEl[0]);
      }
      if ($images.length === 0) return;

      $images.each((imageIndex, imageEl) => {
        const $imageEl = $(imageEl);
        $imageEl.addClass(params.loadingClass);

        const background = $imageEl.attr('data-background');
        const src = $imageEl.attr('data-src');
        const srcset = $imageEl.attr('data-srcset');
        const sizes = $imageEl.attr('data-sizes');

        swiper.loadImage($imageEl[0], (src || background), srcset, sizes, false, () => {
          if (typeof swiper === 'undefined' || swiper === null || !swiper || (swiper && !swiper.params) || swiper.destroyed) return;
          if (background) {
            $imageEl.css('background-image', `url("${background}")`);
            $imageEl.removeAttr('data-background');
          } else {
            if (srcset) {
              $imageEl.attr('srcset', srcset);
              $imageEl.removeAttr('data-srcset');
            }
            if (sizes) {
              $imageEl.attr('sizes', sizes);
              $imageEl.removeAttr('data-sizes');
            }
            if (src) {
              $imageEl.attr('src', src);
              $imageEl.removeAttr('data-src');
            }
          }

          $imageEl.addClass(params.loadedClass).removeClass(params.loadingClass);
          $slideEl.find(`.${params.preloaderClass}`).remove();
          if (swiper.params.loop && loadInDuplicate) {
            const slideOriginalIndex = $slideEl.attr('data-swiper-slide-index');
            if ($slideEl.hasClass(swiper.params.slideDuplicateClass)) {
              const originalSlide = swiper.$wrapperEl.children(`[data-swiper-slide-index="${slideOriginalIndex}"]:not(.${swiper.params.slideDuplicateClass})`);
              swiper.lazy.loadInSlide(originalSlide.index(), false);
            } else {
              const duplicatedSlide = swiper.$wrapperEl.children(`.${swiper.params.slideDuplicateClass}[data-swiper-slide-index="${slideOriginalIndex}"]`);
              swiper.lazy.loadInSlide(duplicatedSlide.index(), false);
            }
          }
          swiper.emit('lazyImageReady', $slideEl[0], $imageEl[0]);
        });

        swiper.emit('lazyImageLoad', $slideEl[0], $imageEl[0]);
      });
    },
    load() {
      const swiper = this;
      const {
        $wrapperEl, params: swiperParams, slides, activeIndex,
      } = swiper;
      const isVirtual = swiper.virtual && swiperParams.virtual.enabled;
      const params = swiperParams.lazy;

      let slidesPerView = swiperParams.slidesPerView;
      if (slidesPerView === 'auto') {
        slidesPerView = 0;
      }

      function slideExist(index) {
        if (isVirtual) {
          if ($wrapperEl.children(`.${swiperParams.slideClass}[data-swiper-slide-index="${index}"]`).length) {
            return true;
          }
        } else if (slides[index]) return true;
        return false;
      }
      function slideIndex(slideEl) {
        if (isVirtual) {
          return $(slideEl).attr('data-swiper-slide-index');
        }
        return $(slideEl).index();
      }

      if (!swiper.lazy.initialImageLoaded) swiper.lazy.initialImageLoaded = true;
      if (swiper.params.watchSlidesVisibility) {
        $wrapperEl.children(`.${swiperParams.slideVisibleClass}`).each((elIndex, slideEl) => {
          const index = isVirtual ? $(slideEl).attr('data-swiper-slide-index') : $(slideEl).index();
          swiper.lazy.loadInSlide(index);
        });
      } else if (slidesPerView > 1) {
        for (let i = activeIndex; i < activeIndex + slidesPerView; i += 1) {
          if (slideExist(i)) swiper.lazy.loadInSlide(i);
        }
      } else {
        swiper.lazy.loadInSlide(activeIndex);
      }
      if (params.loadPrevNext) {
        if (slidesPerView > 1 || (params.loadPrevNextAmount && params.loadPrevNextAmount > 1)) {
          const amount = params.loadPrevNextAmount;
          const spv = slidesPerView;
          const maxIndex = Math.min(activeIndex + spv + Math.max(amount, spv), slides.length);
          const minIndex = Math.max(activeIndex - Math.max(spv, amount), 0);
          // Next Slides
          for (let i = activeIndex + slidesPerView; i < maxIndex; i += 1) {
            if (slideExist(i)) swiper.lazy.loadInSlide(i);
          }
          // Prev Slides
          for (let i = minIndex; i < activeIndex; i += 1) {
            if (slideExist(i)) swiper.lazy.loadInSlide(i);
          }
        } else {
          const nextSlide = $wrapperEl.children(`.${swiperParams.slideNextClass}`);
          if (nextSlide.length > 0) swiper.lazy.loadInSlide(slideIndex(nextSlide));

          const prevSlide = $wrapperEl.children(`.${swiperParams.slidePrevClass}`);
          if (prevSlide.length > 0) swiper.lazy.loadInSlide(slideIndex(prevSlide));
        }
      }
    },
  };

  var lazy = {
    name: 'lazy',
    params: {
      lazy: {
        enabled: false,
        loadPrevNext: false,
        loadPrevNextAmount: 1,
        loadOnTransitionStart: false,

        elementClass: 'swiper-lazy',
        loadingClass: 'swiper-lazy-loading',
        loadedClass: 'swiper-lazy-loaded',
        preloaderClass: 'swiper-lazy-preloader',
      },
    },
    create() {
      const swiper = this;
      Utils.extend(swiper, {
        lazy: {
          initialImageLoaded: false,
          load: Lazy.load.bind(swiper),
          loadInSlide: Lazy.loadInSlide.bind(swiper),
        },
      });
    },
    on: {
      beforeInit() {
        const swiper = this;
        if (swiper.params.lazy.enabled && swiper.params.preloadImages) {
          swiper.params.preloadImages = false;
        }
      },
      init() {
        const swiper = this;
        if (swiper.params.lazy.enabled && !swiper.params.loop && swiper.params.initialSlide === 0) {
          swiper.lazy.load();
        }
      },
      scroll() {
        const swiper = this;
        if (swiper.params.freeMode && !swiper.params.freeModeSticky) {
          swiper.lazy.load();
        }
      },
      resize() {
        const swiper = this;
        if (swiper.params.lazy.enabled) {
          swiper.lazy.load();
        }
      },
      scrollbarDragMove() {
        const swiper = this;
        if (swiper.params.lazy.enabled) {
          swiper.lazy.load();
        }
      },
      transitionStart() {
        const swiper = this;
        if (swiper.params.lazy.enabled) {
          if (swiper.params.lazy.loadOnTransitionStart || (!swiper.params.lazy.loadOnTransitionStart && !swiper.lazy.initialImageLoaded)) {
            swiper.lazy.load();
          }
        }
      },
      transitionEnd() {
        const swiper = this;
        if (swiper.params.lazy.enabled && !swiper.params.lazy.loadOnTransitionStart) {
          swiper.lazy.load();
        }
      },
      slideChange() {
        const swiper = this;
        if (swiper.params.lazy.enabled && swiper.params.cssMode) {
          swiper.lazy.load();
        }
      },
    },
  };

  // Swiper Class

  const components = [
    Device$1,
    Support$1,
    Browser$1,
    Resize,
    Observer$1,
    
  ];

  if (typeof Swiper.use === 'undefined') {
    Swiper.use = Swiper.Class.use;
    Swiper.installModule = Swiper.Class.installModule;
  }

  Swiper.use(components);

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var screenfull = createCommonjsModule(function (module) {
  /*!
  * screenfull
  * v5.0.0 - 2019-09-09
  * (c) Sindre Sorhus; MIT License
  */
  (function () {

  	var document = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {};
  	var isCommonjs =  module.exports;

  	var fn = (function () {
  		var val;

  		var fnMap = [
  			[
  				'requestFullscreen',
  				'exitFullscreen',
  				'fullscreenElement',
  				'fullscreenEnabled',
  				'fullscreenchange',
  				'fullscreenerror'
  			],
  			// New WebKit
  			[
  				'webkitRequestFullscreen',
  				'webkitExitFullscreen',
  				'webkitFullscreenElement',
  				'webkitFullscreenEnabled',
  				'webkitfullscreenchange',
  				'webkitfullscreenerror'

  			],
  			// Old WebKit
  			[
  				'webkitRequestFullScreen',
  				'webkitCancelFullScreen',
  				'webkitCurrentFullScreenElement',
  				'webkitCancelFullScreen',
  				'webkitfullscreenchange',
  				'webkitfullscreenerror'

  			],
  			[
  				'mozRequestFullScreen',
  				'mozCancelFullScreen',
  				'mozFullScreenElement',
  				'mozFullScreenEnabled',
  				'mozfullscreenchange',
  				'mozfullscreenerror'
  			],
  			[
  				'msRequestFullscreen',
  				'msExitFullscreen',
  				'msFullscreenElement',
  				'msFullscreenEnabled',
  				'MSFullscreenChange',
  				'MSFullscreenError'
  			]
  		];

  		var i = 0;
  		var l = fnMap.length;
  		var ret = {};

  		for (; i < l; i++) {
  			val = fnMap[i];
  			if (val && val[1] in document) {
  				for (i = 0; i < val.length; i++) {
  					ret[fnMap[0][i]] = val[i];
  				}
  				return ret;
  			}
  		}

  		return false;
  	})();

  	var eventNameMap = {
  		change: fn.fullscreenchange,
  		error: fn.fullscreenerror
  	};

  	var screenfull = {
  		request: function (element) {
  			return new Promise(function (resolve, reject) {
  				var onFullScreenEntered = function () {
  					this.off('change', onFullScreenEntered);
  					resolve();
  				}.bind(this);

  				this.on('change', onFullScreenEntered);

  				element = element || document.documentElement;

  				Promise.resolve(element[fn.requestFullscreen]()).catch(reject);
  			}.bind(this));
  		},
  		exit: function () {
  			return new Promise(function (resolve, reject) {
  				if (!this.isFullscreen) {
  					resolve();
  					return;
  				}

  				var onFullScreenExit = function () {
  					this.off('change', onFullScreenExit);
  					resolve();
  				}.bind(this);

  				this.on('change', onFullScreenExit);

  				Promise.resolve(document[fn.exitFullscreen]()).catch(reject);
  			}.bind(this));
  		},
  		toggle: function (element) {
  			return this.isFullscreen ? this.exit() : this.request(element);
  		},
  		onchange: function (callback) {
  			this.on('change', callback);
  		},
  		onerror: function (callback) {
  			this.on('error', callback);
  		},
  		on: function (event, callback) {
  			var eventName = eventNameMap[event];
  			if (eventName) {
  				document.addEventListener(eventName, callback, false);
  			}
  		},
  		off: function (event, callback) {
  			var eventName = eventNameMap[event];
  			if (eventName) {
  				document.removeEventListener(eventName, callback, false);
  			}
  		},
  		raw: fn
  	};

  	if (!fn) {
  		if (isCommonjs) {
  			module.exports = {isEnabled: false};
  		} else {
  			window.screenfull = {isEnabled: false};
  		}

  		return;
  	}

  	Object.defineProperties(screenfull, {
  		isFullscreen: {
  			get: function () {
  				return Boolean(document[fn.fullscreenElement]);
  			}
  		},
  		element: {
  			enumerable: true,
  			get: function () {
  				return document[fn.fullscreenElement];
  			}
  		},
  		isEnabled: {
  			enumerable: true,
  			get: function () {
  				// Coerce to boolean in case of old WebKit
  				return Boolean(document[fn.fullscreenEnabled]);
  			}
  		}
  	});

  	if (isCommonjs) {
  		module.exports = screenfull;
  	} else {
  		window.screenfull = screenfull;
  	}
  })();
  });
  var screenfull_1 = screenfull.isEnabled;

  /**
   * 最大公約数を計算する
   * ユークリッドの互除法を使用
   * @param  x 最終的に出力される公約数
   * @param  y 直前の計算での残余。これが0になるまで処理を続ける
   * @return   計算結果の最大公約数
   */
  const calcGCD = (x, y) => {
      while (y !== 0) {
          const tx = x;
          x = y;
          y = tx % y;
      }
      return x;
  };
  let _viewerCntNum = 0;
  /**
   * インスタンスで固有のviewerIdを出力するための関数
   * 呼び出されるたびにインクリメントするだけ
   * @return  固有のviewerId数値
   */
  const viewerCnt = () => {
      return _viewerCntNum++;
  };
  /**
   * 一定時間ウェイトを取る
   * @param  ms ウェイト秒数。ミリ秒で指定
   * @return    Promiseに包まれたsetTimeout戻り値
   */
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  // /**
  //  * 画像をimg要素として読み取る
  //  * @param   path 画像path文字列
  //  * @return       Promiseに包まれたHTMLImageElement
  //  */
  // export const readImage = (path: string): Promise<HTMLImageElement> => {
  //   return new Promise((res, rej) => {
  //     const img = new Image();
  //     img.onload = () => res(img);
  //     img.onerror = (e) => rej(e);
  //     img.src = path;
  //   })
  // }
  const isMobile = () => {
      const regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Mobile|Opera Mini/i;
      return regex.test(window.navigator.userAgent);
  };
  const isExistTouchEvent = () => {
      return "ontouchmove" in window;
  };
  const isSupportedPassive = () => {
      let passive = false;
      const options = Object.defineProperty({}, "passive", {
          get() { passive = true; }
      });
      const testFunc = () => { };
      window.addEventListener("test", testFunc, options);
      window.removeEventListener("test", testFunc);
      return passive;
  };
  const passiveFalseOption = (isSupportedPassive()) ? { passive: false } : false;
  const isMultiTouch = (e) => {
      return e.targetTouches.length > 1;
  };
  /**
   * requestAnimationFrameを用いて呼び出し頻度を下げた関数を返す
   * addEventListener第二引数に用いられることを想定。
   *
   * 使用例
   * ```javascript
   *  el.addEventListener("mousemove", rafThrottle((e) => {
   *    console.log(e);
   *  }))
   * ```
   *
   * @param  callback 頻度を下げて呼び出されるコールバック関数
   * @return          イベントデータを受け取る関数
   */
  const rafThrottle = function (callback) {
      let requestId = 0;
      return function (ev) {
          if (requestId)
              return;
          requestId = requestAnimationFrame(() => {
              requestId = 0;
              callback.call(this, ev);
          });
      };
  };
  const isHTMLElementArray = (array) => {
      let bool = true;
      if (Array.isArray(array) && array.length > 0) {
          array.forEach(v => {
              const b = v instanceof HTMLElement;
              if (!b)
                  bool = false;
          });
      }
      else {
          bool = false;
      }
      return bool;
  };
  const isBarWidth = (s) => {
      return s === "auto" || s === "none" || s === "tint" || s === "bold" || s === "medium";
  };
  const compareString = (s, cmp, success) => {
      return s.toLowerCase() === cmp.toLowerCase() ? success : undefined;
  };
  const excludeHashLocation = () => location.protocol + "//" + location.host + location.pathname + location.search;
  const calcWindowVH = (el = document.documentElement) => {
      const vh = window.innerHeight * 0.01;
      el.style.setProperty("--js-vh", vh + "px");
  };
  const isLaymicPages = (pages) => {
      return "pages" in pages && Array.isArray(pages.pages);
  };
  // /**
  //  * ViewerPages内はじめのHTMLImageElementのsrcを取得する
  //  * @param  pages laymicに指定された全ページ
  //  * @return       取得したsrc文字列。取得できなければ空欄を返す
  //  */
  // export const getBeginningSrc = (pages: ViewerPages): string => {
  //   let result = "";
  //   for (let p of pages) {
  //     if (typeof p === "string") {
  //       result = p;
  //       break;
  //     } else if (p instanceof HTMLImageElement) {
  //       result = p.dataset.src || p.src;
  //       break;
  //     }
  //   }
  //   return result;
  // }
  const orientationChangeFuncs = [];
  const orientationChangeHandler = () => {
      orientationChangeFuncs.forEach(func => func());
  };
  const getDeviceOrientation = () => {
      let orientation = "unknown";
      if (screen.orientation) {
          const type = screen.orientation.type;
          if (type.includes("landscape"))
              orientation = "landscape";
          if (type.includes("portrait"))
              orientation = "portrait";
      }
      else if (window.orientation) {
          orientation = (parseInt(window.orientation.toString(), 10) % 180)
              ? "landscape"
              : "portrait";
      }
      return orientation;
  };

  // svg namespace
  const SVG_NS = "http://www.w3.org/2000/svg";
  // svg xlink namespace
  const SVG_XLINK_NS = "http://www.w3.org/1999/xlink";
  // mangaViewerで用いるDOMを生成するやつ
  class DOMBuilder {
      constructor(icons, classNames, stateNames) {
          // 使用するアイコンセット
          this.icons = this.defaultMangaViewerIcons;
          this.classNames = this.defaultLaymicClassNames;
          this.stateNames = this.defaultLaymicStateClassNames;
          if (icons)
              this.icons = Object.assign(this.icons, icons);
          if (classNames)
              this.classNames = Object.assign(this.classNames, classNames);
          if (stateNames)
              this.stateNames = Object.assign(this.stateNames, stateNames);
      }
      get defaultLaymicClassNames() {
          return {
              root: "laymic_root",
              slider: "laymic_slider",
              // uiボタンクラス名
              uiButton: "laymic_uiButton",
              // 空スライドクラス名
              emptySlide: "laymic_emptySlide",
              pagination: "laymic_pagination",
              controller: {
                  controller: "laymic_controller",
                  controllerTop: "laymic_controllerTop",
                  controllerBottom: "laymic_controllerBottom",
                  progressbar: "laymic_progressbar",
              },
              buttons: {
                  direction: "laymic_direction",
                  fullscreen: "laymic_fullscreen",
                  thumbs: "laymic_showThumbs",
                  preference: "laymic_showPreference",
                  close: "laymic_close",
                  help: "laymic_showHelp",
                  nextPage: "laymic_paginationNext",
                  prevPage: "laymic_paginationPrev",
                  zoom: "laymic_zoom",
              },
              svg: {
                  icon: "laymic_svgIcon",
                  defaultProp: "laymic_svgDefaultProp",
                  container: "laymic_svgContainer",
              },
              checkbox: {
                  container: "laymic_checkbox",
                  label: "laymic_checkboxLabel",
                  iconWrapper: "laymic_checkboxIconWrapper",
              },
              select: {
                  container: "laymic_select",
                  label: "laymic_selectLabel",
                  wrapper: "laymic_selectWrapper",
                  item: "laymic_selectItem",
              },
              thumbs: {
                  container: "laymic_thumbs",
                  wrapper: "laymic_thumbsWrapper",
                  item: "laymic_thumbItem",
                  slideThumb: "laymic_slideThumb",
                  imgThumb: "laymic_imgThumb",
                  lazyload: "laymic_lazyload",
                  lazyloading: "laymic_lazyloading",
                  lazyloaded: "laymic_lazyloaded",
              },
              preference: {
                  container: "laymic_preference",
                  wrapper: "laymic_preferenceWrapper",
                  button: "laymic_preferenceButton",
                  paginationVisibility: "laymic_preferencePaginationVisibility",
                  isAutoFullscreen: "laymic_preferenceIsAutoFullscreen",
              },
              help: {
                  container: "laymic_help",
                  wrapper: "laymic_helpWrapper",
                  vertImg: "laymic_helpVertImg",
                  horizImg: "laymic_helpHorizImg",
              },
              zoom: {
                  controller: "laymic_zoomController",
                  wrapper: "laymic_zoomWrapper",
              }
          };
      }
      get defaultLaymicStateClassNames() {
          return {
              active: "laymic_isActive",
              hidden: "laymic_isHidden",
              showHelp: "laymic_isShowHelp",
              showThumbs: "laymic_isShowThumbs",
              showPreference: "laymic_isShowPreference",
              singleSlide: "laymic_isSingleSlide",
              vertView: "laymic_isVertView",
              visibleUI: "laymic_isVisibleUI",
              visiblePagination: "laymic_isVisiblePagination",
              fullscreen: "laymic_isFullscreen",
              unsupportedFullscreen: "laymic_isUnsupportedFullscreen",
              ltr: "laymic_isLTR",
              mobile: "laymic_isMobile",
              zoomed: "laymic_isZoomed",
          };
      }
      /**
       * 初期状態でのアイコンセットを返す
       * @return アイコンをひとまとめにしたオブジェクト
       */
      get defaultMangaViewerIcons() {
          // material.io: close
          const close = {
              id: "laymic_svgClose",
              className: "icon_close",
              viewBox: "0 0 24 24",
              pathDs: [
                  "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              ]
          };
          // material.io: fullscreen
          const fullscreen = {
              id: "laymic_svgFullscreen",
              className: "icon_fullscreen",
              viewBox: "0 0 24 24",
              pathDs: [
                  "M6 15H4v5h5v-2H6zM4 9h2V6h3V4H4zm14 9h-3v2h5v-5h-2zM15 4v2h3v3h2V4z",
              ]
          };
          // material.io: fullscreen-exit
          const exitFullscreen = {
              id: "laymic_svgExitFullscreen",
              className: "icon_exitFullscreen",
              viewBox: "0 0 24 24",
              pathDs: [
                  "M4 17h3v3h2v-5H4zM7 7H4v2h5V4H7zm8 13h2v-3h3v-2h-5zm2-13V4h-2v5h5V7z"
              ]
          };
          const showThumbs = {
              id: "laymic_svgThumbs",
              className: "icon_showThumbs",
              viewBox: "0 0 24 24",
              pathDs: [
                  "M4 4c-1.108 0-2 .892-2 2v12c0 1.108.892 2 2 2h16c1.108 0 2-.892 2-2V6c0-1.108-.892-2-2-2H4zm0 2h16v12H4V6zm1 1v4h4V7H5zm5 0v4h4V7h-4zm5 0v4h4V7h-4zM5 13v4h4v-4H5zm5 0v4h4v-4h-4zm5 0v4h4v-4h-4z",
              ]
          };
          // material.io: settings_applications(modified)
          const preference = {
              id: "laymic_svgPreference",
              className: "icon_showPreference",
              viewBox: "0 0 24 24",
              pathDs: [
                  "M4.283 14.626l1.6 2.76c.106.173.306.24.492.173l1.986-.8c.414.32.854.586 1.347.786l.293 2.12c.04.186.2.333.4.333h3.2c.2 0 .359-.147.399-.347l.293-2.12c.48-.2.933-.466 1.347-.786l1.986.8c.186.067.386 0 .493-.173l1.6-2.76c.106-.173.053-.386-.094-.52l-1.693-1.319c.04-.253.054-.52.054-.773 0-.267-.027-.52-.054-.786l1.693-1.32c.147-.12.2-.347.094-.52l-1.6-2.76a.408.408 0 00-.493-.173l-1.986.8a5.657 5.657 0 00-1.347-.786L14 4.335a.414.414 0 00-.4-.333h-3.2c-.199 0-.359.147-.399.347l-.293 2.12c-.48.2-.947.452-1.347.772l-1.986-.8a.408.408 0 00-.493.174l-1.6 2.759c-.106.173-.053.387.094.52l1.693 1.32c-.04.266-.067.52-.067.786 0 .267.027.52.053.786l-1.692 1.32a.408.408 0 00-.08.52zM12 9.721A2.287 2.287 0 0114.28 12 2.287 2.287 0 0112 14.28 2.287 2.287 0 019.722 12a2.287 2.287 0 012.28-2.28z"
              ]
          };
          const horizView = {
              id: "laymic_svgHorizView",
              className: "icon_horizView",
              viewBox: "0 0 24 24",
              pathDs: [
                  "M4 4c-1.108 0-2 .892-2 2v12c0 1.108.892 2 2 2h16c1.108 0 2-.892 2-2V6c0-1.108-.892-2-2-2H4zm0 2h16v12H4V6zm2 1v10h5V7H6zm7 0v10h5V7h-5z"
              ]
          };
          const vertView = {
              id: "laymic_svgVertView",
              className: "icon_vertView",
              viewBox: "0 0 24 24",
              pathDs: [
                  "M4 4c-1.108 0-2 .892-2 2v12c0 1.108.892 2 2 2h16c1.108 0 2-.892 2-2V6c0-1.108-.892-2-2-2H4zm0 2h16v12H4V6zm2 1v4h12V7H6zm0 6v4h12v-4H6z"
              ]
          };
          // material.io: check_box(modified)
          const checkboxInner = {
              id: "laymic_svgCheckBoxInner",
              className: "icon_checkBoxInner",
              viewBox: "0 0 24 24",
              pathDs: [
                  "M17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z"
              ]
          };
          // material.io: check_box(modified)
          const checkboxOuter = {
              id: "laymic_svgCheckBoxOuter",
              className: "icon_checkBoxOuter",
              viewBox: "0 0 24 24",
              pathDs: [
                  "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
              ]
          };
          // material.io: help(modified)
          const showHelp = {
              id: "laymic_svgShowHelp",
              className: "icon_showHelp",
              viewBox: "0 0 24 24",
              pathDs: [
                  "M12 6.4a3.2 3.2 0 00-3.2 3.2h1.6c0-.88.72-1.6 1.6-1.6.88 0 1.6.72 1.6 1.6 0 .44-.176.84-.472 1.128l-.992 1.008A3.22 3.22 0 0011.2 14v.4h1.6c0-1.2.36-1.68.936-2.264l.72-.736a2.545 2.545 0 00.744-1.8A3.2 3.2 0 0012 6.4zm-.8 9.6v1.6h1.6V16z",
                  "M12 3a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9zm0 1.445A7.555 7.555 0 0119.555 12 7.555 7.555 0 0112 19.555 7.555 7.555 0 014.445 12 7.555 7.555 0 0112 4.445z"
              ]
          };
          // material.io: zoom_in(modified)
          const zoomIn = {
              id: "laymic_svgZoomIn",
              className: "icon_zoomIn",
              viewBox: "0 0 24 24",
              pathDs: [
                  "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
                  "M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z",
              ]
          };
          return {
              close,
              fullscreen,
              exitFullscreen,
              showThumbs,
              preference,
              horizView,
              vertView,
              checkboxInner,
              checkboxOuter,
              showHelp,
              zoomIn,
          };
      }
      /**
       * swiper-container要素を返す
       * @param  className 要素のclass名として付記される文字列
       * @param  pages     要素が内包することになるimg src配列
       * @param  isLTR     左から右に流れる形式を取るならtrue
       * @return           swiper-container要素
       */
      createSwiperContainer(pages, isLTR, isFirstSlideEmpty, isAppendEmptySlide) {
          const swiperEl = this.createDiv();
          swiperEl.className = "swiper-container " + this.classNames.slider;
          swiperEl.dir = (isLTR) ? "" : "rtl";
          const wrapperEl = this.createDiv();
          wrapperEl.className = "swiper-wrapper";
          // isFirstSlideEmpty引数がtrueならば
          // 空の要素を一番目に入れる
          if (isFirstSlideEmpty) {
              const emptyEl = this.createEmptySlideEl();
              wrapperEl.appendChild(emptyEl);
          }
          for (let p of pages) {
              const divEl = this.createDiv();
              divEl.className = "swiper-slide";
              if (p instanceof Element) {
                  divEl.appendChild(p);
              }
              else {
                  const imgEl = new Image();
                  imgEl.dataset.src = p;
                  imgEl.className = "swiper-lazy";
                  divEl.appendChild(imgEl);
              }
              wrapperEl.appendChild(divEl);
          }
          // isAppendEmptySlide引数がtrueならば
          // 空の要素を最後に入れる
          if (isAppendEmptySlide) {
              const emptyEl = this.createEmptySlideEl();
              wrapperEl.appendChild(emptyEl);
          }
          swiperEl.appendChild(wrapperEl);
          return swiperEl;
      }
      /**
       * 漫画ビューワーコントローラー要素を返す
       * @param  id    要素のid名となる文字列
       * @param  isLTR 左から右に流れる形式を取るならtrue
       * @return       [コントローラー要素, コントローラー要素が内包するボタンオブジェクト]
       */
      createViewerController() {
          const btnClassNames = this.classNames.buttons;
          const ctrlClassNames = this.classNames.controller;
          const ctrlEl = this.createDiv();
          ctrlEl.className = ctrlClassNames.controller;
          const progressEl = this.createDiv();
          progressEl.className = "swiper-pagination " + ctrlClassNames.progressbar;
          const ctrlTopEl = this.createDiv();
          ctrlTopEl.className = ctrlClassNames.controllerTop;
          const direction = this.createButton();
          direction.classList.add(btnClassNames.direction);
          [
              this.createSvgUseElement(this.icons.vertView),
              this.createSvgUseElement(this.icons.horizView),
          ].forEach(icon => direction.appendChild(icon));
          const fullscreen = this.createButton();
          [
              this.createSvgUseElement(this.icons.fullscreen),
              this.createSvgUseElement(this.icons.exitFullscreen),
          ].forEach(icon => fullscreen.appendChild(icon));
          fullscreen.classList.add(btnClassNames.fullscreen);
          const thumbs = this.createButton();
          [
              this.createSvgUseElement(this.icons.showThumbs),
          ].forEach(icon => thumbs.appendChild(icon));
          thumbs.classList.add(btnClassNames.thumbs);
          const preference = this.createButton();
          preference.classList.add(btnClassNames.preference);
          const preferenceIcon = this.createSvgUseElement(this.icons.preference);
          preference.appendChild(preferenceIcon);
          const close = this.createButton();
          close.classList.add(btnClassNames.close);
          const closeIcon = this.createSvgUseElement(this.icons.close);
          close.appendChild(closeIcon);
          const help = this.createButton();
          help.classList.add(btnClassNames.help);
          const helpIcon = this.createSvgUseElement(this.icons.showHelp);
          help.appendChild(helpIcon);
          const zoom = this.createButton();
          zoom.classList.add(btnClassNames.zoom);
          [
              this.createSvgUseElement(this.icons.zoomIn),
          ].forEach(icon => zoom.appendChild(icon));
          [
              help,
              direction,
              thumbs,
              zoom,
              fullscreen,
              preference,
              close
          ].forEach(btn => ctrlTopEl.appendChild(btn));
          const paginationClass = this.classNames.pagination;
          const nextPage = this.createButton(`${paginationClass} ${btnClassNames.nextPage} swiper-button-next`);
          const prevPage = this.createButton(`${paginationClass} ${btnClassNames.prevPage} swiper-button-prev`);
          const uiButtons = {
              help,
              close,
              thumbs,
              zoom,
              fullscreen,
              preference,
              direction,
              nextPage,
              prevPage
          };
          const ctrlBottomEl = this.createDiv();
          ctrlBottomEl.className = ctrlClassNames.controllerBottom;
          [
              ctrlTopEl,
              ctrlBottomEl,
              progressEl,
              nextPage,
              prevPage,
          ].forEach(el => ctrlEl.appendChild(el));
          return [ctrlEl, uiButtons];
      }
      createZoomWrapper() {
          const zoomWrapper = this.createDiv();
          zoomWrapper.className = this.classNames.zoom.wrapper;
          return zoomWrapper;
      }
      /**
       * use要素を内包したSVGElementを返す
       * @param  linkId    xlink:hrefに指定するid名
       * @param  className 返す要素に追加するクラス名
       * @return           SVGElement
       */
      createSvgUseElement(icon) {
          const svgClassNames = this.classNames.svg;
          const svgEl = document.createElementNS(SVG_NS, "svg");
          svgEl.setAttribute("class", `${svgClassNames.icon} ${icon.className}`);
          svgEl.setAttribute("role", "img");
          const useEl = document.createElementNS(SVG_NS, "use");
          useEl.setAttribute("class", svgClassNames.defaultProp);
          useEl.setAttributeNS(SVG_XLINK_NS, "xlink:href", "#" + icon.id);
          svgEl.appendChild(useEl);
          return svgEl;
      }
      /**
       * 漫画ビューワーが用いるアイコンを返す
       * use要素を用いたsvg引用呼び出しを使うための前処理
       * @return 漫画ビューワーが使うアイコンを詰め込んだsvg要素
       */
      createSVGIcons() {
          const svgCtn = document.createElementNS(SVG_NS, "svg");
          svgCtn.setAttributeNS(null, "version", "1.1");
          svgCtn.setAttribute("xmlns", SVG_NS);
          svgCtn.setAttribute("xmlns:xlink", SVG_XLINK_NS);
          svgCtn.setAttribute("class", this.classNames.svg.container);
          const defs = document.createElementNS(SVG_NS, "defs");
          Object.values(this.icons).forEach(icon => {
              if (!this.isIconData(icon)) {
                  return;
              }
              const symbol = document.createElementNS(SVG_NS, "symbol");
              symbol.setAttribute("id", icon.id);
              symbol.setAttribute("viewBox", icon.viewBox);
              icon.pathDs.forEach(d => {
                  const path = document.createElementNS(SVG_NS, "path");
                  path.setAttribute("d", d);
                  symbol.appendChild(path);
              });
              defs.appendChild(symbol);
          });
          svgCtn.appendChild(defs);
          // 画面上に表示させないためのスタイル定義
          svgCtn.style.height = "1px";
          svgCtn.style.width = "1px";
          svgCtn.style.position = "absolute";
          svgCtn.style.left = "-9px";
          return svgCtn;
      }
      /**
       * 空のdiv要素を返す
       * @return div要素
       */
      createDiv() {
          return document.createElement("div");
      }
      /**
       * 空のbutton要素を返す
       * @return button要素
       */
      createButton(className = this.classNames.uiButton) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = className;
          return btn;
      }
      createSpan() {
          return document.createElement("span");
      }
      createParagraph() {
          return document.createElement("p");
      }
      createCheckBoxButton(label, className = "") {
          const checkboxClassNames = this.classNames.checkbox;
          const btn = this.createButton(`${checkboxClassNames.container} ${className}`);
          const labelEl = this.createSpan();
          labelEl.className = checkboxClassNames.label;
          labelEl.textContent = label;
          const wrapperEl = this.createDiv();
          wrapperEl.className = checkboxClassNames.iconWrapper;
          [
              this.createSvgUseElement(this.icons.checkboxOuter),
              this.createSvgUseElement(this.icons.checkboxInner),
          ].forEach(el => wrapperEl.appendChild(el));
          [
              labelEl,
              wrapperEl,
          ].forEach(el => btn.appendChild(el));
          btn.addEventListener("click", e => {
              btn.classList.toggle(this.stateNames.active);
              e.stopPropagation();
          });
          return btn;
      }
      createSelectButton(label, values, className = "") {
          const selectClassNames = this.classNames.select;
          const btn = this.createButton(`${selectClassNames.container} ${className}`);
          const labelEl = this.createSpan();
          labelEl.className = selectClassNames.label;
          labelEl.textContent = label;
          const wrapperEl = this.createDiv();
          wrapperEl.className = selectClassNames.wrapper;
          values.forEach((item, i) => {
              const el = this.createDiv();
              el.className = `${selectClassNames.item} ${selectClassNames.item + i}`;
              el.textContent = item;
              el.dataset.itemIdx = i.toString();
              wrapperEl.appendChild(el);
          });
          [
              labelEl,
              wrapperEl,
          ].forEach(el => btn.appendChild(el));
          btn.addEventListener("click", e => {
              btn.classList.toggle(this.stateNames.active);
              e.stopPropagation();
          });
          return btn;
      }
      createEmptySlideEl() {
          const emptyEl = this.createDiv();
          emptyEl.className = "swiper-slide " + this.classNames.emptySlide;
          return emptyEl;
      }
      /**
       * IconData形式のオブジェクトであるかを判別する
       * type guard用の関数
       * @param  icon 型診断を行う対象
       * @return      IconDataであるならtrue
       */
      isIconData(icon) {
          return typeof icon.id === "string"
              && typeof icon.viewBox === "string"
              && Array.isArray(icon.pathDs);
      }
  }

  class LaymicPreference {
      constructor(builder, rootEl) {
          this.PREFERENCE_KEY = "laymic_preferenceData";
          // preference save data
          this.data = this.defaultPreferenceData;
          this.builder = builder;
          const containerEl = builder.createDiv();
          const preferenceClassNames = this.builder.classNames.preference;
          containerEl.className = preferenceClassNames.container;
          const wrapperEl = builder.createDiv();
          wrapperEl.className = preferenceClassNames.wrapper;
          const preferenceBtnClass = preferenceClassNames.button;
          const isAutoFullscreen = builder.createCheckBoxButton("ビューワー展開時の自動全画面化", `${preferenceBtnClass} ${preferenceClassNames.isAutoFullscreen}`);
          const isDisableTapSlidePage = builder.createCheckBoxButton("タップデバイスでのタップページ送りを無効化", preferenceBtnClass);
          const progressBarWidths = [
              "初期値",
              "非表示",
              "細い",
              "普通",
              "太い"
          ];
          const progressBarWidth = builder.createSelectButton("進捗バー表示設定", progressBarWidths, preferenceBtnClass);
          const uiVisibilityValues = [
              "初期値",
              "非表示",
              "表示",
          ];
          const paginationVisibility = builder.createSelectButton("ページ送りボタン表示設定", uiVisibilityValues, `${preferenceBtnClass} ${preferenceClassNames.paginationVisibility}`);
          const descriptionEl = builder.createDiv();
          [
              "",
              "※1: 一部設定値は次回ページ読み込み時に適用されます",
              "※2: 自動全画面処理はビューワー展開ボタンクリック時にしか動きません",
          ].forEach(s => {
              const p = builder.createParagraph();
              p.textContent = s;
              descriptionEl.appendChild(p);
          });
          [
              progressBarWidth,
              paginationVisibility,
              isAutoFullscreen,
              isDisableTapSlidePage,
              descriptionEl
          ].forEach(el => wrapperEl.appendChild(el));
          containerEl.appendChild(wrapperEl);
          this.rootEl = rootEl;
          this.el = containerEl;
          this.wrapperEl = wrapperEl;
          this.buttons = {
              isAutoFullscreen,
              isDisableTapSlidePage,
              progressBarWidth,
              paginationVisibility,
          };
          // 各種イベントをボタンに適用
          this.applyEventListeners();
      }
      get defaultPreferenceData() {
          return {
              isAutoFullscreen: false,
              isDisableTapSlidePage: false,
              progressBarWidth: "auto",
              paginationVisibility: "auto",
          };
      }
      get isAutoFullscreen() {
          return this.data.isAutoFullscreen;
      }
      set isAutoFullscreen(bool) {
          this.data.isAutoFullscreen = bool;
          this.savePreferenceData();
      }
      get isDisableTapSlidePage() {
          return this.data.isDisableTapSlidePage;
      }
      set isDisableTapSlidePage(bool) {
          this.data.isDisableTapSlidePage = bool;
          this.savePreferenceData();
          this.dispatchPreferenceUpdateEvent("isDisableTapSlidePage");
      }
      get progressBarWidth() {
          return this.data.progressBarWidth;
      }
      set progressBarWidth(Width) {
          this.data.progressBarWidth = Width;
          this.savePreferenceData();
          this.dispatchPreferenceUpdateEvent("progressBarWidth");
      }
      get paginationVisibility() {
          return this.data.paginationVisibility;
      }
      set paginationVisibility(visibility) {
          this.data.paginationVisibility = visibility;
          this.savePreferenceData();
          this.dispatchPreferenceUpdateEvent("paginationVisibility");
      }
      savePreferenceData() {
          localStorage.setItem(this.PREFERENCE_KEY, JSON.stringify(this.data));
      }
      dispatchPreferenceUpdateEvent(detail) {
          const ev = new CustomEvent("LaymicPreferenceUpdate", {
              detail
          });
          this.rootEl.dispatchEvent(ev);
      }
      /**
       * localStorageから設定データを読み込む
       */
      loadPreferenceData() {
          const dataStr = localStorage.getItem(this.PREFERENCE_KEY);
          let data = this.defaultPreferenceData;
          if (dataStr) {
              try {
                  data = JSON.parse(dataStr);
              }
              catch (e) {
                  console.error(e);
                  localStorage.removeItem(this.PREFERENCE_KEY);
              }
          }
          return data;
      }
      /**
       * preferenceと関係する項目をセットする
       * 主にページ読み込み直後にLaymicクラスから呼び出される
       */
      applyPreferenceValues() {
          // 更新前のデータをdeep copy
          const oldData = Object.assign(this.data);
          // 設定値をlocalStorageの値と同期させる
          this.data = this.loadPreferenceData();
          const dispatchs = [];
          // 新旧で値が異なっていればdispatchsに追加
          if (oldData.progressBarWidth !== this.data.progressBarWidth)
              dispatchs.push("progressBarWidth");
          if (oldData.paginationVisibility !== this.data.paginationVisibility)
              dispatchs.push("paginationVisibility");
          if (oldData.isDisableTapSlidePage !== this.data.isDisableTapSlidePage)
              dispatchs.push("isDisableTapSlidePage");
          dispatchs.forEach(s => this.dispatchPreferenceUpdateEvent(s));
          // 読み込んだpreference値を各ボタン状態に適用
          this.overwritePreferenceElValues();
      }
      /**
       * 現在のpreference状態をボタン状態に適用する
       * 主に初期化時に用いる関数
       */
      overwritePreferenceElValues() {
          const { isAutoFullscreen, isDisableTapSlidePage, paginationVisibility, progressBarWidth, } = this.buttons;
          const { active } = this.builder.stateNames;
          if (this.isAutoFullscreen) {
              isAutoFullscreen.classList.add(active);
          }
          else {
              isAutoFullscreen.classList.remove(active);
          }
          if (this.isDisableTapSlidePage) {
              isDisableTapSlidePage.classList.add(active);
          }
          else {
              isDisableTapSlidePage.classList.remove(active);
          }
          const uiVisibilityValues = [
              "auto",
              "hidden",
              "visible",
          ];
          const barWidthValues = [
              "auto",
              "none",
              "tint",
              "medium",
              "bold",
          ];
          [
              {
                  // pagination visibility
                  els: this.getSelectItemEls(paginationVisibility),
                  idx: uiVisibilityValues.indexOf(this.paginationVisibility)
              },
              {
                  // progress bar width
                  els: this.getSelectItemEls(progressBarWidth),
                  idx: barWidthValues.indexOf(this.progressBarWidth)
              }
          ].forEach(obj => {
              const { els, idx } = obj;
              if (isHTMLElementArray(els) && els[idx]) {
                  els[idx].style.order = "-1";
              }
          });
      }
      /**
       * 各種ボタンイベントを登録する
       * インスタンス生成時に一度だけ呼び出される
       */
      applyEventListeners() {
          this.buttons.isAutoFullscreen.addEventListener("click", () => {
              this.isAutoFullscreen = !this.isAutoFullscreen;
          });
          this.buttons.isDisableTapSlidePage.addEventListener("click", () => {
              this.isDisableTapSlidePage = !this.isDisableTapSlidePage;
          });
          const paginationVisibilityHandler = (e, el, itemEls) => {
              if (!(e.target instanceof HTMLElement))
                  return;
              const idx = parseInt(e.target.dataset.itemIdx || "", 10);
              if (idx === 0) {
                  // auto
                  this.paginationVisibility = "auto";
              }
              else if (idx === 1) {
                  // horizontal
                  this.paginationVisibility = "hidden";
              }
              else if (idx === 2) {
                  // vertical
                  this.paginationVisibility = "visible";
              }
              itemEls.forEach(el => el.style.order = "");
              el.style.order = "-1";
          };
          const progressBarWidthHandler = (e, el, itemEls) => {
              if (!(e.target instanceof HTMLElement))
                  return;
              const idx = parseInt(e.target.dataset.itemIdx || "", 10);
              if (idx === 0) {
                  // auto
                  this.progressBarWidth = "auto";
              }
              else if (idx === 1) {
                  // horizontal
                  this.progressBarWidth = "none";
              }
              else if (idx === 2) {
                  // vertical
                  this.progressBarWidth = "tint";
              }
              else if (idx === 3) {
                  this.progressBarWidth = "medium";
              }
              else if (idx === 4) {
                  this.progressBarWidth = "bold";
              }
              itemEls.forEach(el => el.style.order = "");
              el.style.order = "-1";
          };
          // 各種selectButton要素のイベントリスナーを登録
          [
              {
                  el: this.buttons.paginationVisibility,
                  callback: (e, el, itemEls) => paginationVisibilityHandler(e, el, itemEls)
              },
              {
                  el: this.buttons.progressBarWidth,
                  callback: (e, el, itemEls) => progressBarWidthHandler(e, el, itemEls)
              },
          ].forEach(obj => {
              const { el: parentEl, callback } = obj;
              const els = this.getSelectItemEls(parentEl);
              if (isHTMLElementArray(els)) {
                  els.forEach(el => el.addEventListener("click", e => {
                      // 親要素がアクティブな時 === selectButtonが選択された時
                      // この時だけ処理を動かす
                      const isActive = parentEl.classList.contains(this.builder.stateNames.active);
                      if (isActive) {
                          callback(e, el, els);
                      }
                  }));
              }
          });
          // preference wrapperのクリックイベント
          this.wrapperEl.addEventListener("click", e => {
              // セレクトボタン要素を全て非アクティブ化
              this.deactivateSelectButtons();
              // クリックイベントをpreference containerへ伝播させない
              e.stopPropagation();
          });
          // preference containerのクリックイベント
          this.el.addEventListener("click", () => {
              this.deactivateSelectButtons();
              this.hidePreference();
          });
      }
      /**
       * 設定画面を表示する
       */
      showPreference() {
          this.rootEl.classList.add(this.builder.stateNames.showPreference);
      }
      /**
       * 設定画面を非表示とする
       */
      hidePreference() {
          this.rootEl.classList.remove(this.builder.stateNames.showPreference);
      }
      /**
       * 全てのセレクトボタンを非アクティブ状態にする
       * 設定画面が閉じられる際に呼び出される
       */
      deactivateSelectButtons() {
          [
              this.buttons.progressBarWidth,
              this.buttons.paginationVisibility,
          ].forEach(el => el.classList.remove(this.builder.stateNames.active));
      }
      /**
       * 入力した要素内部にあるselectItem要素を配列として返す
       * @param  el selectButtonを想定した引数
       * @return    クラス名で抽出したElement配列
       */
      getSelectItemEls(el) {
          const selectItemClass = this.builder.classNames.select.item;
          return Array.from(el.getElementsByClassName(selectItemClass) || []);
      }
      /**
       * BarWidthの値から進捗バー幅数値を取得する
       * @param  widthStr BarWidth値
       * @return          対応する数値
       */
      getBarWidth(widthStr = "auto") {
          let width = 8;
          if (widthStr === "none") {
              width = 0;
          }
          else if (widthStr === "tint") {
              width = 4;
          }
          else if (widthStr === "bold") {
              width = 12;
          }
          return width;
      }
  }

  class LaymicThumbnails {
      constructor(builder, rootEl, pages, thumbPages, state) {
          this.builder = builder;
          const thumbsClassNames = this.builder.classNames.thumbs;
          const thumbsEl = builder.createDiv();
          thumbsEl.className = thumbsClassNames.container;
          // 初期状態では表示しないようにしておく
          thumbsEl.style.display = "none";
          const wrapperEl = builder.createDiv();
          wrapperEl.className = thumbsClassNames.wrapper;
          const thumbEls = [];
          const loopLen = pages.length;
          // idxを使いたいので古めかしいforループを使用
          for (let i = 0; i < loopLen; i++) {
              const p = pages[i];
              const t = thumbPages[i] || "";
              let el;
              if (t !== "" || typeof p === "string") {
                  let src = "";
                  if (t !== "") {
                      src = t;
                  }
                  else if (typeof p === "string") {
                      src = p;
                  }
                  const img = new Image();
                  img.dataset.src = src;
                  img.className = `${thumbsClassNames.lazyload} ${thumbsClassNames.imgThumb}`;
                  el = img;
              }
              else {
                  // thumbs用にnodeをコピー
                  const slideEl = p.cloneNode(true);
                  if (!(slideEl instanceof Element))
                      continue;
                  el = slideEl;
                  el.classList.add(thumbsClassNames.slideThumb);
              }
              el.classList.add(thumbsClassNames.item);
              thumbEls.push(el);
              wrapperEl.appendChild(el);
          }
          thumbsEl.appendChild(wrapperEl);
          this.el = thumbsEl;
          this.wrapperEl = wrapperEl;
          this.thumbEls = thumbEls;
          this.state = state;
          this.rootEl = rootEl;
          [
              {
                  label: "--thumb-item-height",
                  num: this.state.thumbItemHeight
              },
              {
                  label: "--thumb-item-width",
                  num: this.state.thumbItemWidth,
              },
              {
                  label: "--thumb-item-gap",
                  num: this.state.thumbItemGap
              },
              {
                  label: "--thumbs-wrapper-padding",
                  num: this.state.thumbsWrapperPadding
              }
          ].forEach(obj => this.wrapperEl.style.setProperty(obj.label, obj.num + "px"));
          this.applyEventListeners();
      }
      /**
       * 読み込み待ち状態のimg elementを全て読み込む
       * いわゆるlazyload処理
       */
      revealImgs() {
          const { lazyload, lazyloading, lazyloaded } = this.builder.classNames.thumbs;
          this.thumbEls.forEach(el => {
              if (!(el instanceof HTMLImageElement)) {
                  return;
              }
              const s = el.dataset.src;
              if (s) {
                  // 読み込み中はクラス名を変更
                  el.classList.replace(lazyload, lazyloading);
                  // 読み込みが終わるとクラス名を再変更
                  el.addEventListener("load", () => {
                      el.classList.replace(lazyloading, lazyloaded);
                  });
                  el.src = s;
              }
          });
      }
      /**
       * thumbsWrapperElのwidthを計算し、
       * 折り返しが発生しないようなら横幅の値を書き換える
       */
      cssThumbsWrapperWidthUpdate(rootEl) {
          const { offsetWidth: ow } = rootEl;
          // thumb item offset width
          const tW = this.state.thumbItemWidth;
          // thumbs length
          const tLen = this.wrapperEl.children.length;
          // thumbs grid gap
          const tGaps = this.state.thumbItemGap * (tLen - 1);
          // thumbs wrapper padding
          const tWPadding = this.state.thumbsWrapperPadding * 2;
          const thumbsWrapperWidth = tW * tLen + tGaps + tWPadding;
          const widthStyleStr = (ow * 0.9 > thumbsWrapperWidth)
              ? thumbsWrapperWidth + "px"
              : "";
          this.wrapperEl.style.width = widthStyleStr;
      }
      showThumbs() {
          if (this.el.style.display === "none") {
              // ページ読み込み後一度だけ動作する
              this.el.style.display = "";
              this.revealImgs();
          }
          this.rootEl.classList.add(this.builder.stateNames.showThumbs);
      }
      hideThumbs() {
          this.rootEl.classList.remove(this.builder.stateNames.showThumbs);
      }
      /**
       * 各種イベントリスナーの登録
       */
      applyEventListeners() {
          // サムネイルwrapperクリック時にサムネイル表示が消えないようにする
          this.wrapperEl.addEventListener("click", e => {
              e.stopPropagation();
          });
          // サムネイル表示中オーバーレイ要素でのクリックイベント
          this.el.addEventListener("click", () => {
              this.hideThumbs();
          });
      }
  }

  const vertHelpImg = "data:image/png;base64,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";
  const horizHelpImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoCAMAAAB6fSTWAAAA3lBMVEUyMjIAAAD///9AQEC/v79gYGCfn5/8/PwjIyMiIiIFBQUZGRn39/c0NDQICAjv7+/o6OiAgIAYGBgvLy/f39/5+fnz8/OHh4ePj48QEBAgICAoKChXV1dISEjX19fPz89QUFC3t7c4ODh4eHhwcHCnp6doaGjHx8evr6+Xl5fr6+va2tqTk5Pl5eVUVFRERERaWlqgoKBNTU15eXm0tLSUlJQ7OzvMzMzh4eG6urqcnJwsLCzj4+Nzc3N8fHysrKxlZWXx8fF2dnYTExMMDAyLi4tiYmLU1NTDw8OkpKRTPDbfAABanUlEQVR42uzTsREAEADAQEr7L2wDpyX/MyRjAt8zOgQYHQKMDgFGhwCjQ4DRIcDoEGB0CDA6BBgdAowOAUaHAKNDgNEhwOgQYHQIMDoEGB0CjA4BRocAo0OA0SHA6BBgdAgwOgQYHQKMDgFGhwCjQ4DRIcDoEHA7+ho87FQATzM6Rg8wOkYPMDpGDzA6Rg8wOkYPMDpGDzA6Rg8wOkYPMDpGDzA6Rg8wOkYPMDpGDzA6Rg8wOkYPMDpGDzA6Rg8wOkYPMDpGDzA6Rg8wOkYPMDpGDzA6Rg8wOkYPMDpGDzA6Rg8wOkYPMDpGDzA6Rg/Y7NOxDYMwAABBuyNKlzKrZP+9IkRFAaK1/m6HEx3RA0RH9ADRET1AdEQPEB3RA0RH9ADRET1AdEQPEB3RA0RH9ADRET1AdEQPEB3RA0RH9ADRET1AdEQPEB3RA0RH9ADRET1AdEQPEB3RA0RH9ADRET1AdEQPEB3RA0RH9ADRET1AdEQPEB3RA0RH9ADRET1AdEQPEB3RA0RH9ADRET1AdEQPEB3RA0RH9ADRET1AdEQPEB3RA0RH9ADRET1AdEQPEB3RA0RH9ADRET1AdEQPEB3RA0RH9ADRET1AdEQPEP3ku6XNaxu712+sSfSTCbc+Y03zCdHh8B5rmk+IDqKLToboohMguugEiC46AaKLToDof/burDdtIArDcM8Zw0Xkjs0isKGYrRRINwmpqFKrqlGr/v+f1A52XB/imdgRCQJ/7w0U0yg3TzheGAM6akCADuioAQE6oKMGBOiAjhoQoAM6akCADuioAQE6oKMGBOiAjhoQoAM6akCADuioAQH6FUO/edYIXVCAfsXQnzVAv6gA/Zqh18YI6NcaoAN6IUC/1gAd0AsB+rUG6IBeCNCvNUAH9EKAfq0BOqAXAvRrDdCvGnohnEdvdIB+zdARAnRAR80J0JsHXfeoWuPf5K6rShrbN6CTBuhZgF7WTRTuqEr796tf5KzFJbXtG0rrWv8GvGsRcgToWYBe1hfmoIr03lfmlX5+6C3bpogZ0p0BehqgP0x/MOZuP9Fj7UPzxs3vx6CHXqGkAF1uqA99yFxPulaq05m/IwTojYd+E/GhYPfo3M6HxPRuMypfsGyoCz2eVpGulJp1OpHnhZzmK0KA3nToEWfduaV/+85Zq5tzQJ/k0m1utedzaWGXEKA3HPok5DT39L7/yFmDP/Ty0OM5d8xDYmaPEZWXsKUtIUBvOHSa5dKDnWNuF86d0Oeq0NCgtWyoDn1kfsclEY3Nh3YSU2ltlk29JH2MCQF606GTGuTT+8w2t+ef5/7Psxx1X93vnc/MH6QelfYuB77qtFSXaOLDOaAD+n2Tj49M7/t8/3zQorNA1/P7vfOIp7bRfdSZKVVQ3YNzQAf0QrtbeUTOPbef5fRaPM2OqumOJmdy3uc+nAM6oGepu1z6JzquF+Zze+r8LKfXRgEze5oqF/cPzkeEAB3Qs3b/p/cZyfZfhfNzQU+H/w5VTa/hHNABvfL0vhBz+xmhU5vZi6lqGzgHdEB/2D7grKA4vb8Sc/tZoet+RJVrwzmgA3rl6V31c+ctEr3IeXRZDOfuAP0+QHdJDx5M769z54OflHaG02v1i+Ac0AHd1v72aHp/HRb2zy8IegfOAR3QK03vu5pzuzyPLlsS0cQ7Kjk5dOk8hHNAB3Sb9LvC9P6qxtxe32jr1NCl86BHCNAB3ZLKp/fbH/bvq1XnK5eHegHo0vlYKXwZHdAB3TW9s21urw/9BKfX6jrXs+2as5IhPt4BHdBlkwGLzNx+QdA7bFqtWRYuCQE6oBdSoXTeoguCHrGtZEEI0AG9bCWKdP/8gqC3WbZOj+6nvSEE6ID+v8//p/c76bw69K6SDcWVceNngC6dh5FaUJpuzdnkTwgBOqDnLYLcS/CGqDb09Imr9nNA15v8t94qEo02B+lYJBLQAV2uM1FYR+5CoMcep/Xf0MPemi0RIUAHdLGus7juvT70iVcsG6fzfy9PD3005UP+UlNZW7NNEwJ0QJfrOrvXkatjdMim0xyMG8flL/f50Mo2nsc+M88IATqgi7ldTu/1ocvVWb1TQd9My6T3gnRqX7iP1L0lBOiAXlzXefDhzrkKdHWjE/Na60TQe6ULx419Nq1jsrfETjqgA/rxus7+n8Iq0OGnJ0NPF1dP9Kmgm8lgrssvlNnqHL7qWn4qAnRAP1rXeWZfBbo69JbP7I+pLvQNicTB874uG8zzuXzimTf5m8XDT/QhIUBvPHSxrrNzFejq0IfpNWm1oCszhVNZPd92l0W9mqRP4jbft42Pb/aCOygDOqCrr/L7avIeLrOnQNfZrZTqQ+9TSXFy8PvYKs95/e7RLRhxvTugNx66WNfZtQp0deiLJHVeE/qI/0UlzcXg7vj22tQL0sdYDP1TQoDecOhiXWfHKtDVoeshp87rQtdmQO/aLmVX5Mr815V5Mva4eGuXro+za4AO6GJ9ONcq0NWhqyT7abWh01rck0XsBuSvW8++cZLh7hTePkrMBlwYB+gNhy7WdbavAl0duvLYFC7oCdCHJTvp4zWbliRyHseL8i+yqMA8HRMC9L/s3dl2mlAYhuH+H2haSxHQVNE4a9TO7WpN0zFpTIf7v6FWgYiAW6CuNit8z1GSleQob9gM+6fQoYfnOiunQKcMvaZjrdeSPKE7RnBXPGCOjOA8YO8R3XDD5/QzkVaZ+9EZOkPfWrd/3zMFOl3obhcrZVNyhS4TAOi1xefYVsod5aYFoOeEssepl7nB59wZesFDj6zb1VOgU4UurXpkeJOdKXTHC3s6sfslu9mDpzqUvcZY0W1b+8NpImBxPiRDL3jo0XW7egr0i1ShS9uyTVmr1fXGeGxFuz5VhS5aFTFzV1LQkcBouEIMvdChL2LX27Ou3tXHaROBuay0Za2sDF3aXWwbDCUVd4KoaplvbWHoRQ89vG5PNQX6sp8tdLHgG8nK1NAbdn9eXZevUOrhhjXPkOqwXMVGfcKLcAydocuzlHOdNQu+SSVb6Do8VScY9RIqX8U5sW19ZtsnLcnG1MZ2WW/Y9ljjrXOGztBXlr9inatX74NW1sETtbHd1JtjV9ZGuMGxrAfH0NcYuif+xJlxIfu8NADgp/uXL1nsIzATOjCG7mHoiaWnfB/LSwt464hKx5v8qORqtt3QJzbPnQ+PoXsYevLqPeX7WPrWOa9f3xUMvXChy3Ih6dSuhO4Ihl680KmAGDpDpwJg6AydCoChFz107Yt9g1u47yyGXvDQr7rYuBa6oxh6wUP/eIyN10J3FEMveOgdhPzk9s67iqEXPPRThDxtyf/kaJrGywSpMfQAQ9+viZDqQv4hvi/t7zD0AEPfqzJD2Ilk42hhbYlj6LcDQy926O4Zwj5LNiWElSP9B9oM/b9j6MUL3bluBj9gjh8j7Od98XXeNSq5Qy9hS5mh/3cMvXihfwCqb185IvKid4RtT561RaT97acBlGSvjh42Yui3FkMvXOiLS6ycjWrXx4irn7ycf8LKj5bkEBTb1de6DP1WYOhFC93UkZYtOQTFlvwPGfqtwNCLFnoJqX2qSchhQ3e0uAaAgRbFm+s7MPQAQ49zzpDeL8kuqLujDr2EtHiY34Wh+xh6nI0sXoqCs/PYewpAY+i3CUMvVuit58jifJnxJKB889+ktT90S0+hy9B3Yugehh5VmSPRsXGMJEcXuUJvAnAjoZtO/MIbr9D9DYYeYOhR2hHinrwuPaotLmaXiOsu999Ej99K7wGIdtpCr9Fm6IfE0H0MPeoUMcevP8paZTE4QpTVluxcAN1op0MAZYZ+SAzdx9CjnAEijkayMUfE5VhyGANoRDvtAGgy9INi6B6GHmcb2GKrTuE/aZKDYwDQwp0G9Y8Y+iExdB9DT/CijpC3y+0/h6cIOf+Ya5vqBEA13KnRONFOdAD9WL+OptRm6AoM3cfQk9zXsdFRnMTPr3LtXhsjvEg/QUgrFnoJSmWGrsDQfQw90XKGwFm05YfvEfiQbz/6HAAsV3w1bEyj72fcH3rwjZSAofsYerI5AnOJOkfgWnJsU3UHWNHkxgyBem3PL+huP0TDwtUYeoChJzLfIvBNol7/3exnx/IW7iFD29b1mW2XeN3twBi6j6EnWp4rRkeVQ0v3PIYG0JAtnBl3CzD04oVemSmW52//djf6GCMJYei3A0MvXuhSRkBfyjb3KQJfJJ+hhDH024GhFy50s2kgcLyQbSfHCBjXTo5xz46WzJUd3BpDz4uhexh6ggdfEfJBtix/IkTXst9eKyFZt7XzV1hljaHnwdB9DD3uUQ9hxyUJG2GL8c08VOiYKs4jRgw9F4buYegxJxa2PXkjG+PHiBi0s9xH974yBWDoIT0AGEuyOoAOQ8+FoXsYetTwCFHVz0vxXF0biHkt2UUea5cJAMvcvaUVzib0ASdDpsfQPQw96hESPP18z61cDRufkOBUsqsB6JqhTxUH9D4ASzwlDozLhKH7GHpU5QOSVN/XP10iydSUHGZbZeuKA7o0AUwYeh4MPcDQY1oWsjBeiIqzY5ldMwDDEU9fuTDoAihFB0byefd0GLqnoKFXVGxk8dWsqFwgohw/TptdAD3VKh8t3kfPhaH7GHrcwx7SezysKH3fFbpjABhvHsPTRLFyt/jATD4M3VfU0EXlO9Kbp3hexkocwD4CYGj+t8CWHUwLAE4Zei4M3cfQE5jnSOvpw7QPp8cznQGotqRmKK/o9bFitBh6Hgzdx9CTaI+xcnl+UT5GgrOLD8+xNpb8obtdAN1W3et9lwHWdJOh58DQfQw90WsAz5sLUyovuoiqNq5E2p/PAEydPKEH2gaAKgCjo7zhDgvAwGTo2TF0H0NP1H47KPkNLy+eI+zo3X1ZM7X5dCG5Qg/04SnJTlMAllMHUGbo2TF0H0NPtlzKjTLCPl1JoOJKztADDaw01T+Ovncer7sMPSOGHihq6Fl8QdhZJZPvqtBbU6xUR8r5cr1gJHRdY+hZMfTf7N1bj6tUGMbxvA8Hb5BzbIFCD3RK6yHxmGji4cqo3/8LOaV9w7CANbRCrc77vzFT2s3eE39QWAu49EGh39QKbzuS0v179I2Ha0WuuRltvWzl1CtfCvRbEuicQH+/Tz/Bm34nmga6u7wYR90xpW75my1L7sjM9psT6JxAf7/0c+VatSmg89f2knIf55yFQp1tR3Qpq8AV5ktwLjfqrODc0SBJSaBzAv393D/Q9Mm3ND71AvJFA/3gAYC/I6LkBZe2lktvihy0n7q496DJSUhSEuicQB/RC5rijG7K6pvrnuz9i+yrTYsFe6dd49zrTLFNDgUGO5KkJtA5gT6i7Jfvymu/GsTdDT0Mrq7Lvoeyb1qbF9OldtH+6KG3FUlqAp0T6PPWvYC8XDioi3f0JsNEXdWaIVsk1Fdm5EEQ2GYrlyQ1gc4J9JnrDnzvL8wtUopeADgREZd6XkrSP0mgcwJ9hvTQ3RjwD9RTenKW9CZDzqP/wwQ6J9BnrffZ5Rt/71J/oXz/njSBzgn0fyHR/JQJdIEufYAEukCXPkACXaBLHyCBLtClD5BAF+jSB0igC3TpAyTQBbr0ARLoAl36AAn0DwU9/+HLdqevqdX++oamT0maopCfQal59dYE+iWBrhZA7S9qVUHta7qxnfGazI/TXRegvnpvAv2SQFf79b2nj5v/GHqOcyd6zibegz4Oen4ySE2gXxPoj4fuxqh70qeaM6xpc43XojmhJz4QLzNqJdCvCfTHQz/h2ka7X7257P5PTgh96KAEAMwZofOvtShTahLoAv3fgm4AQAW+y8RAFm7Ovv+TGli67cZu4HHuSKhTASDWb9IWALbNtidUXuUF/YUAZzfUBbpAHw39G2r15z+D7hYACvcAAHH4/NAtDDQA1wbgUbej+rp+BbZmQX/hvgD3EtE1gS7QtdD937jjgVoFx9+4z+6AvgDg7K5n96uEBsrN3goAvtlfqf0kAKw1n5wKuglgPbSnnwk6F508XDvu6JxAF+h66N/TiIrboecAEPCuD2uWPveZMgMA0jtWkQ9sKooB6NXAnacPQ3+BvHcrVvKC5lVeoG1lAmhGNQS6QNdD39KIvrgZeuQ0d3rdAkCswTcl9IDXe/8qAMAgzhqAHgNYULcdAOweMI5umHhzAkSgC/RHQ+eHMjgZ1bkVAPgRPQK6CaB8BHQPwH7oZFk+N3SmzhsbgS7Q/wXoqd96eltiAoBn0PzQEwBIHwF98FkSHgBrZujcZl249JpAF+j/AvQ0Vv5k9wUAnA3NDn0DoKJ/Dj19D3o4+A29AlDODp0L6ZxAF+iPh56su6fflji3dOeGfgJwuHEVO+MQnMwKSG+AnvK7eg8eAs0wujJinoXKq1xG4xPonEB/GPSoYOfd57YUO2rSWLj7//oYcMJbHiJVoSm7FTr1ZfdDt9CfPbiAbkmgXxLoj4J+cNh5u5UDDO/rMrYwkN28UTeBdgNg/d701ywITNNHN+MG6BEA71+HHhllYEZEJNAF+kOhuzbYudquwLkqG/oOrYfObxyjR+9mh/6qqNlXh61VVP3j9fHgTKGldmZQvTL+oeQFDurWYwbSU2MV2Lyx8lMiEugCXXs9+k80ongs9Kxg5z0lNs45QaKB7ncnlRQTQ08V3+YpOBi79uL2Ksx+6ObgL9YmTZveLwOh8+7j33erIDiZZox2/CxagS7Qe8q/PPfDYdTef+QdZg4eO+9vdVnuBckgdFt5sbuc02wa1J+K9gdxzi8AbBvfk0Ev34O+rX8FYc/2oQCAPQ11xEAvRCTQBfqD2sSo8zbGUHkFpj4RdPUT3SXdD+4PRsYv9k9tc8ZBv2vAIEKds0zpTaEP+EkFwLFooD3axeZiXf83FeicQJ+7zRp1jqn9/lw6V+rlo6GPBZkDiG+BvrsJelL0XWbqrgHsKfR1+/QI3HobrAwiWtXO5Ri9SaDPm1Hh0jaztNApPKHOelbo1mjo2+vBdXADdNcE4Odmm3qyBRC7RJGnm2/gAeZLkEd0LXeuzgU6J9BnLXNQ56+Ics3FpiW9Fm0BnOhZoZcsu/nxqNujLwFrJHQelTCa4xw74QEJJyJi6euM+orC9o8en3MX6JxAn7c9H3mPspSvK/dpoS8AvCgn0TXQXQfAZgx0Fo2y/lzJ33GyE8B/Bkt3AnfcFQVeRK8JdE6gz5zJzPWWuJCeFvoLgOW70FOGXgJwMmWbF1BfyQJ8so3V2xRVaF/yk15e8PekL4kb5wKdE+gzF5bJXTPWVcjb7hzYxXjoW4Nb3A3dZKha6C4Anw9alvSmYAB6ZDu16Jw417b5It51Ss3LS56oNxifvnOu7xHonECfvwmg9zcWutKd0OP2ZaaLgbd5AFyiCurs+kUvdNdE3TEkpdBHbFGrvACw0DvfAnB4oyHQOYE+Vf9P6EFzo3Tl+lN7wNwaQE4lAJSdr/7WwFmM2DK6lXZnWr5bemuXdNl4uxqBzgn0x6aHPs0UWBW6MjPuJuhHoLCawepEf40Ke14HAFC4nevRjd4PVCuyxs7WDVPStUTrelyBzgn0h6eH/mQn40zwsHipzEQ/9kNvyDoZtfIHLlR3DaLx0PUFyoWAAp0T6FP1/4Re1T8w+WrETehCB5es7lk6vHMR/FD8TWTMbwwnygzexgh0TqBP1f8TelzL4WHxhQLd0lxiUvYMsBf6f+s//ZVtAGB98gA4l9ULdE6gP6LQ4DpjZE3ZM0L3AATsFEb3JHy3MAbgbfqOno+zQs8dcHIXWDWBrrb/+cfXvvqGRmTW7403pGv0EegTQd8yWjDnAIBHCvT+f3i4sFdh79n4/ZzQIw9NzdieQBfok91h5n8HvaBLCx5Tc331rQ4Ag0YXAkA0DXS9c88sWs+qFegC/VHQ8zFPUCvvgj79zLgdALwEhrEJ1gDguDzavSKuGVYf2xKAR/NBZ+eFxX/bPdUJdIE+OfSnPRnXTg89RLst79CdRH1XSmNzHd0NX3hrpIk3UNpb5sMpXeK/7pJeE+gC/b8FXTPXfWLoZKJVzrvIlpwMAFwa2wkAoqkPblTnMX/F2PK7BbpA/29B72/6mXGshqsM4h16qI6WOTS2AwAcaQLoOufbhK7ZAl2gf0ToI0/GcXlwMk1zGQR51kws3fecshvZzuGzY3NMmGHnSyKBLtD/w9Bzc7ByGuj6SgCI3c5tKEwaV+7xDn2Ok3Hs3KKmpUAX6P896LoeAN1SRqtuPQo+4FzhTgld75wC3rAI9L/Zu9OmJaEwjOPdF2BT0WGzQSBc0CRr2tepqRdtU9//CxXoySTAA0JR3P9ePdYRbeb3oIflMPQOoM/HAD02S/4/XFN1vfVgJy9xuRy6qnNaA7DpRwydoZ+Bfv0YnXR8XIxhj+7lznVRcruIJZ1NbCxkWTH1AV06NwtPrx0OF8gCzWHoDL0MOm7J8IZO0q8e/+r/h77+dW1Ia6E7jqPddnJdtjjL3JBrV3jUD3TpvOywPWab7Kwfx9FtAC5DZ+gF6IWe0Elfcax36CtNpnwySeWR9+JPcmBNUYpfl0JI8Wszqi/0beybRiTr9oQZ6VxhlaaIoTP0eugTOklvBN3VChW0FYparZR42SKL1RkmsqzoOJl9bCWoNh8yP6BergaQ83xx6a3jCmkMnaH3CN1AoyZDgr5GXhqeusozZ0Lhtsty1eVeoMtfRQaV5Vs46TZDZ+jDhW7rCs1LodsNB1btFn36Weg4zp0f4ybONqCzhRk1fUnHejhhJrY2VJG2yc77yWcVtIRn3Rl6r9BjvVHrDifjLp8rCBawY2pdYk48OtbP4TWX6uPDawy9NAfFvtFJKYoZ1F2Dgk7B7lJH/UBXj6HvY+jFwkfFIjrp5qNiPWGI5R6+4T+Uj6gOHELylXT9Uhn6IYbOcQydoXOjiaEzdG4EMXSGzo0ghs7QuRHE0Bk6N4IYOkPnRhBDZ+jcCGLoDJ0bQQydoXMjiKGPCPqNh0abnn6iASeWxDF0hv6z8MW9q2jTrfkHQYPtDhYacQydoe/7qONqy3DVbyXdlXeV6bENAOhMnaEz9Lzrs8z5rTZ/fowzl0qo//zVl56JPD2hyxP6XZf+0xj6SKC/tDLmLcqH4blQvua6PfSAmrecYp8v6NImgLWmYX1iqYuhH2Lox7bIzbYoG4b71/qHHkLfutQ0sbaQN43pstbIckgx+f7+jRj6SKA7OfTPD2837fGrbOSDK/1DX6MdnGCGfZOALmiJLF0w9CFFKjH0Y37GFbepcdefZyPtm/1DTwFgTS2KUuTZraXLb/vTgOrTfhQx9OoYukK9Q39MjRN/CnqErJBatc6Z+tQyuVqCdXbzADBh6NUx9F9j6BU3rtSpZVEK3KXWiQUAmBox9GFFKjH0fwn6HAC21Lp1Kqh1d7HfOkMfWKQSQ/+HoHsAYAbKR7Zq86hR4g6yHGLoQ4tUYujl0MX7Z4feh0SkHX98S0Qfnsm2fxK6jybr+xuoz6AGBauDc4Y+uEglhl4OPQBk2p6Y7AvRdUBm/0noUwC4rQ69O+nB4uCcoQ8vUomhN4AueVy/BdnrPwg9AQBLdAZ9R9Rovh1bYugDjFRi6D1Dd+sXSy4+FlF1OzRSE+tVTdHsmTz78M4Z+hAjlRj6Mefqj3C7PfSOV1MtZstXc2Gx1cy5ZjVy7jL0MzH0PqOzPcuvaDGGCl2TcwIXdtts5nxpotGAEAB2DL06ht5ndLZ3GfR7j4cKfQIAPl2a0YxtMAFaQHcYenUMXaG+oVsdQ49P1/K3dVn5Y2uqSlgA4NGFOc3UJnMADYcAwIahV8fQf+0/gd7ZrHsMAHO6sF2j+XbhA42hawBgMPTqGPqvMfTT7hYuXHOX1DB5CZu5JbW8OfLmuyZclwCgMfTqGPqvjQP6GsCMFHLNjKhLh4Rjmgk1zLAAwE4aXe4GTEQjrgYAJLXQh3n/OobO0CvPjHtwIXQHgKN8y4k7dCi2M7EuNSm4i6xUcZQnL2CPK7jWzgKEddBDa0MDjKGPELr49uTQnYiIHv788dtLInrzRPb5Qui+KvTpyUF01258wWpsI2snSKXoLvatXGoIfQYAouY9ixTmEO8jx9BHCF25C6HfAbBVnYpbFGa8MCPVghkgv57fPrvBcIJ99rL5N+07AKbnfrnNB3gbfIbO0HuDngKIVafiNr8dJluSWlsbkF/PExNposQck4CaQ18AWNW8Zw1ZBg0uhs7Qe4OeAYxUp+IE/ZIOQPEjcJJKuBljCwDuuJWbmuHQIiZqAd0EsKscKb918B6doe8bB3QAEIpTcbsiGLWPwN5dyCbyqQBrXT4ysLHP3hK1gR4BwKZipLzgdTrEVSAY+gihi8/+oc8hET06/pg9kePLPlwG3QMwVZ2K8+gkzQSAu8rM5daTee1N3pfIshxB7aBvAWBZNVLsP4gkNMAY+gih/6EbT2wkVYWpuLR0TTVslJhb6y3k1oVfe5P3dcY8IGoJPZccVI1cDfULOkNn6D2eMJM53ChOxd0uf9jUqCJhpNhnzgK59ZNj5POEStptAqK20F0AWFSNnCBrRoOMoTP0TqDHv120IiwAntpUnC2oWDAFgKmgsryZjUN3wiO5wllvTtfrrWyl5OLIo/PVACfiGDpDbwVd/bRwi862rtoNJjnXXZnyKWS6V4Y1WiAvjbqFnj9tXDoyWA3aOUMfDfSrfxq6DuCO4lRcWLn0OZKSXb0sjSuwijvIs5adQZcvaFE6MlwM2zlDHwt0B53cYUY9TSqtL66YXfc0Z4asuSjf1cPaRVVYJUpMw86gy4NzRtlIzx64c4Y+Fuh+Dr3nPXpxv7tQnIpb/qJY2zoTfYpjfumeNTVEPVbNAqyQOoQ+AwBblIw0zKE7Z+ijgo7bfwz6RAJWmYojTbvtOHf1BcpKqNhkF53HGi4sjzqEHueaN7+PdFfIuzNg5wx9XNB73aMX9WBF1SWa4fxohfPNRTusIqIOoUcWAKS/jzQs5A3y6lSGztB7gy6dmy5Vt0N9pj5xYs9Dlt8Wa4fQ3SkAmFFx5GqFPGuY95tg6Ay93Zlx6s6xpZoSVDXV/a0WyJed8/L+OvTSZZsMQDYPadgx9O/s3XuPq0QYBvC8D5Q1ZuTaWKC00HtrvJuY6FFj9Gji9/9CWmAKnQXKdLdb1r7P+Ydts4e+J/M7Qwdm5gGh24cvyxw+IaLvqx+XRBR+KeNdCX0FXMYzb+jEN162pLPYLgCk9p2hT+dKSQr0fUQDD0N/QOg60Yce7/o4Jw9lXNP0vMyIqTGJfG79ntAzR46qN0J3hvl4O0Nn6DeEPqpQdCY2955nGD5dSAonu/N39C1kSY039K0hTktl6Ayd6HbQs1QurkqvlGDh012hy/1W93bjxm3ujN5DGPpDQU9IO59K6BrMxYhukLtBpzhtmSETjCeD/3bO0B8P+tMfHwLdfGYef/OrPtA9FJlP6TUyHOgU7RJ632HoDwL91xy6+Fw/+Tas4152Lbl+y2tkSNDffxj6g0CfiaennOxVwU8f++5vcPDpBrkZVjmT/v8ehv4g0CMTT9dQL34J277iAnqlMNZLYegyDL2WD+NCuv6fJ+DwkTjvOgz9UaDTjwuB6/LVhJ2/9zD0h4FO9veT8Jr88IE47z0M/XGgcx44DJ2hcx4gDJ2hcx4gDJ2hcx4gDJ2hcx4gDJ2hcx4gDJ2hcx4gDJ2hvzxGRpcSkUZ8wzCmdIfIEyuvKMfvohSGztBfPSnmI6riF/PX7CxcU5kY5joe3oQy3534HSeWr6jH73BuHENn6C+OAUDUGIdwt8Vuqm59cxXHrnd0Z5neSUcIBNdBH1wpDJ2h3zp7AD+c776SlrPTZ1RkobT3Ec5i3UeHL7Cnq6APrhSGztBl/Gx0TbI/L/0jKwsyh+VmTLOqjdviiH5wOlZAwNAHHeoThl7Ln95XT7gmT+NJN/UDgOWzDr24dhf2aa9011YmkNeyuosO20VK10EfWikMnaEX+fgP8HRdAOsjtSdQmvIaQHZaWSo5/V9woNuNYMXG2jtEpJk1kLWd2DeKTAAsGo6nwyqFoTP0In/ka8Vc+edpS+3ZAa5PRIkvu0nZT2ZH3vI1GNQVCUsV1e0qNv5jITdhnQekFxdpK8sRumMNqxSGztCLAn/BS5aMSyNqirEsdjcY5VfsYmUTkVdtlxwBSKX4MXVmpOkqNE0XSoQejwzYXg99UKUwdIZe5Pty+TftFF36Fx+oIbHjxr4LmEREG+RulgJVP5kCiMph+fXrQt/ieYRNOknh2q3Q5TfvOQC34Xg1qFIYOkMv8jeOzr/7OtHOT8ff/Nyg54nmwHxT7iUcFBuZ2+P68Pqh6N19gXNTvqFmKmGpotpc+coOrAKASTrJgDXRVYNxQyuFoTP0Mr8fueJX0s8hh/5N21bCci/hXWHaAhCeKQmL4Tmvo89r0dUdE8gN7b1kSRQVH0Qne9ltNg69TTugD64Uhs7Qz6D/Qfr5WYWu7kk2t8tv4XuiBMDOJpl4Hi6LK3jhv7YOIzOWZ90zsCSNBEDY9YE6oA+tFIbO0G8KnQIHwKocVhcBxQ7gxOo1bVINPE/lrWc1K00dakIADml26P6LoA+nFIbO0G8LnQyRAyevuEbfliPu9m4djfTGql+oIwWwJ43EwOE5VyG/Uc8vQx9MKQydod8UumzHbhwLwI3yofewfBLF2epC9ztuPk+pOxEAbDX7zaD5r7HyuhYXHpgxpoMphaEz9CbokfdDz/wWX4ROFoB0IW+f2aFdPImC/axp2Hl15Q026/IIOuDTKdNYazqLTFZBx6VYQymFoTP0RuifoHeMy9DtHfLslLaakNbczhfqOCh3pCyMN5l2h06hDvShlMLQGfobQM8H4AAx9cNx7VumY5PulK+Z2Z4VdcdVLnfNblFyOoua9CRRfhj1sqTKaiClMHSGfkPo6rXmmkxgVq1DcSBN6FdHnlFEio5J7+ksMpH6WZqKGFopDJ2h1/L3U/7AzC2gBwIw8/a+qdahCIi053ZenwOABSk6PO0OPesDfWClMHSGXs+3nx+l/3YL6GZx79wWZU8UAFioRm4bF8CIahkrLyhJmse1LRyz14J+11IYehGGfkry+ZHrLXr0kWyIC2AkO/Ts9kbUy11b1ZFoTWeRy+BU/affMdl0SjJ3LYWhF2Hot4fuO7IPXBcHiZySGprhtj9032hNt6zImJkAdkuqBQAMreks5SeX0i8NnQ+lFIbO0N8G+gIQI8/zLDMFHCLflQ4sQPSDLllpyzI8E1XMMCkRTZV70Up2zbNAN5DxLkIfSikMnaHfHPoezxIUWqzy7XH/++j6OuKDg2dxD0G5LKXTZzqLeuUusa3kQ38ts9KtgZTC0Bn67aFv8SzrpGrLJjDvf3tNslKjypKZLtCS+SreAthdms6iZg2INYC9CyCrf/CG44GUwtAZ+u2hx6jielk8Aky3gr4DzMJBtaJitw6r97wQeyLkMg2eBUB4mzGquF1rUQbN79kusMlPNQMglpegD6EUhs7Q26H7m+96ZjPthE4rzxsZxlK23qm73qOCPpbQq1itN5/1dMTzosPzpuXjbGE+lOUtBE5Zazz9Ks8yK05lAXD9C9CHUApDZ+gt0DWjQu9uvXYCQNSgWyr0Hn/J0jCW1e6EDTrkghfjmRxCry7Fo+0cZZytxnSWAplbnipyAde+AH0ApTB0hn4H6MGWEkB4si0LIFTGtFY9dIyB8bkJVYed45jYJ6DYUJXlaWBrt+zZoUtkE3mqGbDOj9smq1pEAyiFoTP0t4EemxsvLlvvHIhsgZFsyz6AldK2X0eHBQCjCqgq116gjOU3ja2nLR06pqdTWa7dfXttCKUQQ2fobwPdAGCUrdcEMrL2p7YcAEj63l4zpv11LM++tqYNw1suZJx1v+kstAWQVqeKVtQNfQilEENn6B3Q//xr0jN/xRegJwBkjx4CIS39U1vOABh9b6/Bmskrexcwz03kbylLXdSBCr9hbkookGdu9JnO4qu31C7dRx9AKUTE0Bn6zW+vybZpl+04A9KqVRfvxf2hkwxUHWoEAKP2AC7Chgd5TPL3yONESoe+bVmQMVVO2nk8gFKOYegM/S2ge4CQ7TgGENVa9QSA3Q69rYuMAWy6dMQARO0BXLiROqxefu+duciPLk9nCQAg04E+gFKOYegM/S2gW8D41I6dcysb1Y5MtxwDQNilY1a73B01NX/vNAEssoBNn+ksSwB70oF+/1LyMHSG/hbQTcA8teMFMKm16hRAqgdd/rBSX1VRLmpXu2bDOhiwJKXUVzr0wo0aCwi0oN+/lCIMnaG/AfQxsDm14wOwqLVqAQCZNvQQQKK86qs7lTnV4iti+nwX50Jts6ywZbLtXv0o3ffR715KEYbO0NWlpG6wwowN4HBqx2vAqVr1FMcstKEv8LxznbgHg05xAOQkJk0roK8B4NB7OovMOmj4WO2x7l7KMQydoTcuDvn0w+tCXwJYndpxBiA+/VQ+DZtoQo8EINRXLQA1reUbHgDsm6523UhjOouMHvT7liLD0Bn6W6wCuwYwq/rws0v1CSASQCz7Q5fHpvrqBhDKEPlmuwCAeaTgcNCx8tIGCPpDn5kNcc08q/uWIsPQ/2Xv7tuTtsI4jnP/wkOlaZ4pJCkEWh5btd3mrNNtnVYv3ft/QzMJp0BI4KSCLOT++s/gKt2o/ewckpMchv4zoNcBWE+/xxqA9tOjKRDQADDMPNC1HoBh8tkq4Kx4FTleGo7qpt1ZpKGL3MHEevoOVdSt/8NbETF0hv4ToDuAsfR77Dimt3yyrUO+Cqh5oJsAYCWfDYBJ2gLwXgLHZYQjcCWuT5WGfmkAurhhvQFAbbuHfysihs7Q9w/dBzBd+j1evhLTBlCLDzJJQhf/hPbaV+jAlNZ5zFYZaG1sxGGpCCgv9Kvl/aaGulh1fqi3koyhM/RM6I+zl5LNThbQM1S0kzrmj4YAfHF5FoKxn3xt2vmqMQD0NPEVAthwfW2oPRyZyTGwhzDHovWE2X5O6G7MsKNRnFVHDN8/0FtJxtAZ+k/YNlmpop8BfSrOELcRZ4xM0+wripu5QNyKVOn20vfBrNs1p1L7CF+JKbDE7iyS0DUz3lbuYtlggDD1ikQHeCsihk4Mfb/QRYqVAX0xRb1SsVwWdHeuSqF5XSzn05ZsPdKkbdpubZwHujY0Ym8+iZbn7xOL6FBvRcTQiRj6nqGL0qHbSwu3vToWVRNXgohmMR9dSbv1pNQyb8+B3qfsHBhaDuhjA1FTlxL5AcIM92BvRcTQwxj6AaG7DtSFEGtcxbyr1NeIg9SBR4vqy4Mkbc+qW0QSu7NIQQ8QFXRpPW0Wr+490FtZxNCjGPoa9M4HO3cPz4FOvjqglZRau/o9P0uHNgHaGi3nDc3vrzHNC4t+PCVQtRzQFRWAc0HpXei4IjrAW0nE0OMY+lOvG2Hqef5a4Qv1CmUkbpuSfNSvEUm9RuQPfNprHolk/rMuYAwpM/9q21v5v8XQywHdvm40Wo3nhq+PVLb6Lh1TDL0c0GmExjOptxottIkrdgy9JNC9+1h6/j+NBqblG9CPLYZeEuj0YXSO53X9/pS4gsfQywKdmrftznMyz4grfAy9NNC5MsfQGTpXghg6Qz/eLMUjjqEz9KNOqQJwxsQxdIZ+vHUBBAYw0og7JujNlBj61rQX9l17Nns/m7VrttekY8nXodukDcCrfY4OOiX/MPRtnfz25roFUcuY/nZCx1EV6Mf7pKoWcUcFnUf0fD3+U20hWeOPu890BKlQxS1u+GP6kUHnET1P2sU3pNb4dlf8j7U2EIitnTvEHRV0HtFz9OKhgawao1M6SJaiKP6uDsVNxOXideKOCjqP6PLVHDyl3795eHh4c6/jqZvXdIhq2BVLH9DF/V5M4o4KOo/osmmmirjzSefWfqSwR/v29/tzxH1sayTV/xQ6GfPtGgLAJu6ooPOILpn2EnHqm1ta7XbaQtysST8l5Xv+7qGb8dx9DFSJOy7oPKLLpb1H3BtlHXOzW0Xc7z9HOgRueeiWst7YXMnWJkB13AF6x3WrGIa+Hq+MS635pYEw3fxMaT2aOsIa5rOl7xl6DVtTu9oIYQ4vd2fo5YQ+RJTRXZ0O0aLuO0SN6bkdHDrUGnm1+tUlcQy9lNB/1RF279O8z/2Z8+rVq5vfX7s0z+4hLP82AuJyscND55NqDL3U0B/vERZUnmwOVMS1Bmc07/IGYfePlCOtoz5tDHoA6NWnegAwJI6hlxd6GysbANJYxaLz2hP/a4S1STqx96hxSaI9H4yzKaMOAPCknaGXGPrbCHDrCfTwHKLVvb9rreixL+88QJzaJ9oHdPkCACj+Mt5tMfR5DH2tZh1h72nerYrV9O5i07WwlySZNsBTYzoodBcAAuIYemmhX0YDeu9E/PXfI2pi3rUDhC02ZfEcADBkv/cIYT0974zf2j30Ph+LY+jboJ+NJm8rhSvnJ/S/aN64AQDXQzcU9ylGWqN5fyPsb5Kqg7CxmMDXNZLMA4DZTqF3+FhcEaF/urnYP/SF8wbuiyedJGt+BYB3nng4BYCGMDFUVzbw9l8BQFWKrImw2mIKP3DzQDd3Cj0AAF4nUzDon85xfbF/6AvnKKB0kqzSWplYe+8i2ZpwPwKAG29lZLyukOz5rg6FaVOEBZLSLwFguEvoPgBMiCsU9O/OIaTvF7pwXkTplGdRnP6W5p19BIALEt1Fss9ontIS472U88Hqvv+OTTIpAFDbJfQ2AFwRVyTooXMhfb/QhfNCSifJ3gNAoNE8+9+H7y1Adlf/P2DdAMAvks4dN/GBXe1LHzlTdgnd4Jl74aCHzoX0/UIXzospneRyvwHAA2X1OjFXnwLAt89SznV/7SM7TNlZ/+VG6Arlqcsz98JBF86F9P1BF84LKp3kOnU285tFRhIjs3Mq5dym5caIGmlyh/G8TdA9fUg5mvLMvWjQhXMhfZ/QY+dFlU5y+dcAUMsc0HUA+LTEtQVA9SWcq93kuKoiLPCkzoVpG6BrE6g+SWcD4Ds8Fwq6cL6QvkfoSefArFKcSK4PHwHgV0qvbwBAz1qSfw4AH7afV0N3HZwhVtptX2jj0AbobQA9Lc+Azvd9LRT0rgEkpO8P+rrzP84qxYnkenueDf3zX9cCZgK6vXk8zpokeD3IrJILAAw2QFfEv0CuLg/oRYNeqelr0vcF/aTYzncA/XGKMPUfWoN+Rlm5U2xg6FYRNdnITgUwy4ZuGWLVjlwBD+iFg54mfT/Qm78U27nsj8POnLqf/hH/gPu03MXmqbvXE87T00aIMpQtq1uGmdDdCK5jkWQ1HtALCD1N+j6gN38vuPMfPhjXfImwV10SyRyM8/Rt0+ohtp1nGwNAPwu6Vo3gXpJkvsoDehGhZ0mXh14O5/lOr/1Na91+jEDd0WpfAODdKWXV37osRtERNfEovUiymwV9kO8DutYDAIevRC8c9Azp8tDL4Vz2x/E4EVetJPolfdx9iIx+pszqULu0Mb+HKL2WfZFqQBnQ68gzQIuvV4grHPR06fLQy+Fc9sfRFEtgEz06APD1NKkwQvpvkzLTJjZtyZ0iru5mzdw7qdCF24FGko0RNiOugNBTpctDL4fzSi4KH99Sog+N1KtXbsXTP5aJOOcy4yB5NxW6O8jpvAaeuBcYepp0eejlcC4NvaKmntk+u3FunK9r/l+Kpe8/WF9HXC31YF1AadC9IKfzK4TpvNFaUaGnSZeGXg7nlXxHq25Ok0+fvHjxwkuSeuFIXNMilR/ECD1azTUE/zXotpHTuYkwle/9WlzoadJJrko5nFdIti+Qv83SJ4SZtIO0OgBcpK6rM7QU6DU1n3N3JJbcc8WFniL9A0lVKYdzeehn8Xp2n1Y6vfjea4tWOnEA4J1NO2msok6pF74MaQ26NZC8+E106bDzY4C+Lv1POemVcjiXhi5u4vyeVvoVABq3aV/ZoR11WU2q9XVx5XgCuvjbHuY83Kez86JDf670SjmcV3J40yPUd7RctwHgXKHl7hoIn/RpX1kOAKh+EvpgMGerkFz9AJjPU7iiQ3+m9Eo5nOeA3vwCMSPfCF1xdjCgS2zsYmZtqtbzSCqlirgp74N+DND/Y+9ul9s0wjAM8z5IOHUJICRXAgl9Wki2G9vJuEnappOkSSc9/yNqEVpZ4kPsKmwGxN5/Om3qpu3MpVfAsnuadK0ZzoUOWZyww1SPQde+IWrikpzYijmDktDF2OprbOuQ6iygnyRda4ZzEehs+fl47/+e/uHDh1d3b2mX9h5R9gPJiT1an1nZ0O02ceR3eti2Uo/Vzgb6KdK1ZjjXSKS/sOnuDbEsP+oZ3Zsxoi5CklSITOc0NxFluDzMV2A5I1KdD/QTpGvNcC4G3foDm26vKbPLv26x6bdLkhI7121tZX7dcALi6gZxZl9dnZ8XdHHpGqfzp3o710go6zXiZjqle2gh7uaSpOVPcq6quz1uttYKAOy+2mbi7KALS9f4nC9faPWOxPIGiLM/Phyy+hJ8/IxNF799JYl5qxF9b24P47Z6h+UcoYtK1/icXzbm2GRW/wLb/u3rw5j016E+WGGb2afq11UrZM4VuqB0jc95c85H3/XpPVgX9runjx8/Pq3sC7B66vbWeVU76GLSNT7nDYROL2dXyOvq6U9SnVX1gy4kXeNy3kjoRI9jZPftkVRnVg2hi0jXeJw3FTp9bT/dIpn9NLok1blVR+gC0jUO582FTvR13p859hXiruxXT535V1KdX7WEzitdQefo8qd5+Jvx+vVr49fwpa+G+ZnWLOjqq7uqodUSOq9zdTNOpaovdG7n6vGaSlVb6PzO1YKZwro/U6Kf1X7J51j9oAs4V0tgi3p59/sXOujL73cvSXV21Q66iHP1UktBwStg5tJe7gx4pVaQn191gy7kXL2merz5HQDEM53NcwC4O4/tWnx12mJtoYs5VxtPFM7zqN9d2uZunJ/HTLcWJtexLYn3XDtn+ulQL+iCztVWUkXzPK7lbp23AOBMZroBwB4m9VMifQLj4M+B3sCn86tW0EWdq80hjxQ4YF0Eu81gWU7tZ7rbA9BzD8f1JGF4kDz6cQkAXRLM0v+v2k8r6gRd2Lna7plnnsMOaVto4xxmutWPgHdNALMD56lTIYbm4RkSrnl8L3td1y3KCABaVOVqBF3cuTrAgWeeXz3Srser0me6rnskqeGNSxnNx8DKIholxnWISHWY3l96dXD0sulSbgMA8CjVGECPqlx9oJ/gXB3JxD3PJc307hIRgTbJyFrBXliUSgeANbtMf2ZrLRF1k7qUR5v9HQ6AQdGFP6Vbb/56lasN9FOcq0MWeee5pJkemIDTMgHDovLr523pfr09ucW1AcySvwAjdUS74z3/uu1Sfi0Ak7xJT1WuLtBPcq6OTc7ubXKe5830t5RI2Lk5jW/m96n0dMSthpRsub3yDgGnnT4gxqAk/gEb6AVHuK4ArPMOpKj0zfqaQD/92ORmSCeRHpLzPH+mP9D31AKm0R9dB+hS2XmD3PObrPH2yntieHRQNyXdmgD2Ymd+QsfqIfszaw4Alb59WQ/oKee3fM5Jo2ZIpxLmeekz3TJhWuyb7TWV3zD3INUu4tlsEStf+hTbe3quXajVzhn5LgBU+olkLaCnnY+IL42aIZ34e7hNz/P8mX77QCen7+5ntyNaMho5ObcTluw2eLZ0I8Kpbwv1OAPASmcN8x6jjfI+AdpU4eoAPcO5Rnxp1AzpdPo8L3em6z7tmu+sLaQdtO5FojOeibkmZi5lppvoxJ8+RzPyBvc87+J9QRWuBtCznPNDb4Z0OnmelznTrYEJ3Hg7hCbQZQymJKlrEwBCSrQIKa8gpBOh+7n33FpVP6G9+tCznAtAb4b0k+d5mTPdmyHKme89dJpY8T3pCUlr7jCVYgWtvcYAnNZ+izzolJWhoEtwLgK9GdJPnedlznRvgjhzunfc6bjTXgJjn+TltcYWfWdt8HxadAHYCjpLtnMh6M2QTlzpe/P8ExX0aW+m61ScNcOucLfoHJtaHpWamzha2aWsAqts6DqAXu7inQFVuIpDz3JePnS6fF1z6afN81Jn+hJRYxvYf9bsTfs37SGVXAv2NRXlm4YM6C3KqrP5+QpXbehZzmVApxfLeksve56Lz/QBokL2Bd6wSF4hAPSmdLwZ0Plh0BcKesnO5UD/6WW9pZc8z8VnegdR7eev8DOPZDU02drXIroIfxT0toIuwbkE6Fpa+o1Wn4Tm+e0n4uzTLedMb2NvxfgaURNp0t0l4swjjl0HAEbSoM8V9LIKnLRzedBT0t+91epTMY477PqHuPsHz9LdIuezg1c/0euSrOaTxNrXdEv2b1Q29Nl2QU5HQS+rv39JOpcJPZJeV+caFfbogNULiLOgB5bzWOS894xuwB6zSSt0kHhon/GmqulTbq5+UD8irB82PDLRB0BbQZcgnTmXBj2WXlPnGhU3/QWsX94QV2/2fmRa5Nwepi7Z0Slwxt0wd+0r9JxlrsnXT9zDf1wbhRn50C0TwFRBlyCdOZcGPZZeT+cakdBMfx8QR8F7gXlud9M3xoGllftD/OUYCk0wd8l8BwBWub+jcSJ0n/2GC7bVHOtaLZgpQTpzLhM6k15L5xqR6EwveZ6bQXrTiaiJLw06dceA41I6a8W+YuRDD1qs1BLY/EWwFgCH3fcf0F4dBb0E6cy5VOhMeh2da8TVKDHTuef5qOi5GoI0QwdRdiANOnlrc56/dmdKBwV7pI3M/4w+FWYDsIhWqffl+gp6CdKZc7nQmfQaOteIr/vETOec5/dF62TQpnR+RCrth7ETakHZdSkjA1F9ofvrS76H7hMAAS2Qeil1qd5HL0E6cy4XOpO+qp9zjUh8pr856pxrnntr5jwrr4VNK5dkl3beIiHoYwA63zrfSQcAxlbqffRKH+ZUfeja33cjTTL05pyPXjDTxea5P850ntxfGY5sAmnnPU8Ius+5FVQb28whHeSozSHLSEEvC3r+TBef5+TbR52zx9nSL1/Tny09n4SgLxBluFSQayLzs81S2z2zFHSZEZ000wPKLCia56xp4bIY3camlU8/InfFnAtB9xxsshdU0BqbFhkP2MdU5RT0pkHPmOni85xlwAzoaMPxbk9m+c0d5lwM+gCsccBxdKM9zbonuaYqp6A3Djrdf07M9Nx5/vm+8FSkLhXkrRFneCS5kcmci0GfAsByYSJq7R+X3jdGbubd+Guqcgp686DTfWKm587zeyqjDuJ6c5KZuwZboyMGvWvGJzENV4gyFySaCwDq2ORNCrrMSKxR4jo95/p8ROU0tRHXJnmFNtiL8CLQ2feA9t5H0swlsQaVP2NRQW8k9MRMlzbPWcMJomyfJMWmMXBDJATd6u8vvZuPhW8osFdcllTpFPRGQqdR4jpd0jxnWQYAjEhSvpHYioIb+tRhzuOsmxOG+k31v7kr6A2FfjDTp7RtKmWes3fNDBJKnDlWQxKB7oW99CrdkSk61ENU/p67gt5Y6PvX6Vc6bdKvJMxz1rxlkYyGjDm7i8YJ3Q3Xmc8Q2QPBiUV8zU0AmFK1U9CbCn1vpn97QZtefNub57XIC1cQGOcM+jrybCNu4GXtadFzia/ArsNAV9CbC30309/5tM1/t5vndWi6NMHqtUXWyHYioYhazjPPc7N9ke/tGFtU8RT0/9i7zyY3rTAMw34fQJs45FCzFEmAupQyjtO7k3Hq//9DCaAjIdHZ3TEbvfcXj89qcRmuPXRuF/rxSFQ8vT48bo59O/S/lisV58x1j2tkpfQ1orVds3SHOhUc5C0uY4+h3zB0+vxezufFOf3+cxp7cx0XzEWfa2R1HYAniB7KU6wN+XCN0cfQbxk6JWY8vT7l/Rzmc9rh1H5GXVvpqfP5XE91WjY9KKG5yDJGfmaNoTN0Ut6jq94b9fMTZI6OLHfVnesyQuZc7p7rh8RugqwoAdUWeiby3PFvtzP0m4f+bLMAxJZDnRMecLpqR9NxTF1YlqUpeYmVNjk+WQ6wqS4PMi+g5xBDZ+jPMnHY2tQn5+Jye/uA9lSqLXCRtXsOm+0MnaHfUP7lU6mnGx0tadTydB31ORzOYOgM/aYSJkyHis19NUJ9etB8QdzkuczmDJ2h31KzKKRyU0XRrLS9mmalzRRFGf0lMMTQZQydK/Y8Dpt1jqHLGDrHMXSGzt1MDJ2hczcQQ2fo3A3E0Bk6dwMxdIbO3UAMnaFzNxBDZ+j08iVx//MY+q1Dn3/6d/SX6n9D3P85hn7b0L/4Cx+5f0cfA9++omHZiqJMa8fbWhI3MIYuY+htfYp7K8UoXr0BLBpQ+R1H82lpXNRynkNXrbDx58PwbJueKPkXfRbPnGDotw5dvMHf75/ImRdch0OP4QdX41ts7Ib3jTu1ixvecr1xEQXDv3/e7d/9XGLoNwz9B3z1kk69uMfPJBsO3QGwuRrfAYagimwdwP5x/Thza6MiTxU0qCSGEXb5dz+bLQCGfrvQ53DfUqE/cT8l2WDoPgDnPC7t+1TVCgCcZj9BR6yKsrYm1zeYb2hQWwBqT+jj3gJg6LcLfYcv6CIVf1DecOjCBPZX4z6g21SVe57Q7RoPW3MXXM2LhaY0sxaqqqIqU/WtgPo22ztEMYAVQ3/3UZcYelMOfqLLPsd3LylrOPQ1gOXluK3XTejz04RuT6BULU5JxcVh8U+7aEJzlDPUiTVf0pBCE4jzv5luM/R3HnWJoTf1c2m1C3QcSQ2HHgFxYbx5Qt/LCT3RATMoLW66QJYr6qHTHrIof3rrQlDnpnTdBMAqX6pf2sVugCs/wtAZ+rkxQP8Dv9BVEV6RbAh0TyT5hK4Ectw6CAOwiLRV5YNZ9WxCFynQydXilhOp+WpGN9Ws4/fYlvJfzgBN04Np2FRo5hDZBqCH5OiAbtc7lQOlEYbO0M+NAfo/2NJVKhLqnVYwuo9ze7qxzsY3Sx07IBIkzNLrTouz5lQHMCsszl5HyNL9sIbLlZzSmHdYNr6INQKABcmcg4lY5Dsf+/ygos/Qe8fQi40B+g/ybNpbRfmAsuIHzeihAQDpHHkA4MwBqBukKURW+fHJCgBTFGdqWy5uvoFkno61Qw9FecwF3KT2RaylZzrHALDODyfCIdtwtwFD7x1DLzYG6L/ga0p7tftNj2eUZuI9kvWHLhYZFXkqXUmhBymfQ35Abkeys6wZyRYANlc74aYVELVDX/oRtNKXQwCYU0VL34TsPGtn9HX7NKWHRMTQe8fQi40B+jf4K9to/iQjtSSiD/GZ6HUFSJYHYJGd6hJx/jB0NQWTQ6dUup8p0h26KCmcqw4VZQYATgG6eVBI1gz9AGBT+WVd0FXhdmOg0OLqLUv7fEqPBBFDH0HUJYbelPgEqaS1jlSEl1357vedyotNKIiAfSbYoiN0sk0gUS53eDfqf5kAItVFsZ1cqjGZk6wV+hyAUfrypHTRi0gOEWSmp6bOS8fz50Tr/ZyIoY8i6hJDb4G6E0TWRwDw0ev0Gtj79x4EPT+m5keAKST07FfjOCQ7oK4kW2qcUCEl9uaN0IUBQLn+sgtgTeemO5xbzMgCsBN0alk8lcfQRxJ1iaE3t8eByLs7Qn8b40vq01zNMuQJr9UZ/4zO0FNRGUSHZHNUFKkpcVHtZ9EEnfYAvKuxKQBM6ZwwcMw4TIm2KWqbztnIsxj6iKIuMfTm3n6CX8jKoU/CGAsakiFX4JM57KgInVLBvmciPJnTJTlVVTfZa4vF8XvXZQ9bOVILXQMQXY2t5dgp/7hTkMifNVdHDQxk6VOGPp6oSwy9pQ9UfP8mhx4Z2P9OA3JwsQIHBqAvE29K4UnaDoiFX9xLdxQlrFyUPit7sAD4jdBDAAjrZnmZrUvlREsdQFI+C5AOLxj6eKIuMfS2hHeHY7pFg1pfQk8AbGeAlelzj2u4Pk0VG4Ka27jOlQdJdtUInVwA2nlMbjQs6aJZcjJvVNxQtwGwBoAZQx9N1CWG3l74PbJ2Ng1rL6EXbl4TOiIJPUO1zed1jZqzg6s98vLkW4YujU4uxmYAXKprAWAnKq5yTw4AjClDH0vUJYbeIQtZr2lgxgV0L7++TQVCkZLJEUaaZXnuBWBbqWh69ICDpWUDa+sQI81uhr4GEJ/GJH2vyZwRUgV0zTYBRAFDH0nUJYbeIQ9Z/9CwlihCd/IT0coGWBEAhCimB7Xn5k6LcVBRTA3Q5TcFcuxqy71Uhlmj63wAK9oCwL7a6UIp5F0PKB5Df/GCoRcbH/Q3n79+/asY+u26QkTTtRUB+g7IrbgAhHvGagJaO3QyUW7bBF26VuRY25b7BsCuetvGItpVn2PT0B5Df/GCoRcbH3T3N+B+0l/6EbIRyiXJTIoAhIeUuOpvlxmkffl2U1kkHTgGrjI8aoae61zJsZYt9xkA3amGfpCbFHOGPoqoSwy9O/RM1/2fyad+8rL3lnu+W5sgT1etuQnYKgDHVgKiZbQRRAoOdqdd3qVmWQc1y7csbUnUCt0HsJdjxxl+StXFNY+wWx+X56OwC9/4k0kOyBGG/uIFQy82PuhZd9HHuPvN7/GSJg8wkbUQNlTVspTM1x5INgAU+QjIOCAh5bVAL9cOXYO+185jSwBqw4l/3W5YdL67EQk+GDeCqEsMvSd03AOAsf0j/tZ723XL/ZAqN4EDFToYh9CTh7zCKJfe7kY+j6k39FC5HAu0/Yyq8wEc6hctT+hhz9BHEHWJofeCLtPT/fW7r36n9hLAzVbg5OoOklAQbU9jQQyYTvtB7In00B16b03CAOA0L3qFtFXpyv5V6ePljzB0hn5uLNDFywrod/cZd43aWwBevgJPAEu5LOUyUbISI0qUi6law3XDoNuK0nzOS5mWD8XFbYtWAUDjxz2/+6hLDL256de779cHVHfnd7vOfZqvwLa+0NDapD/0wHPDBuga2ppUXOjaJtE2AItf4DCCqEsMvbEwvgPu3QdA94FIrsAzuzf08um1soe5CbjBI0KP67bcySp8OIFHDH0EUZcYekPyTnT9rgb6p9SWrQNW4UEvqVcXwE7NMwCoF60aj22VodsTpMVBLfS5qjad8yrvNRuAUX+0wiIpvfXFaWW48mMDoE8D6h1DlzH0xt6gsXboPoDwagW2srE8qzx59oOuGchylUc7GBcAiOtvz7E6K63/44dA38f9pTN0GUNv7HCHpr7uMqHvqAK6oDzlJEfEK9EbuhYdmWuPeNTdqT/DHgGYvRvozpAXvzJ0GUNv7NXHD4PuA0iuV+BJAbrQJaoV4C57QRdr88z8EaHPa6ELAHDeDXT5nMpeMXQZQ2/uh4+GQpcTekxV0CNpeg/o4vhR3ekB3bYMybz+JjJvCHQFgFv/xkfxtND3DQ/vcBk6Q38a6D9+h4YO1NwKQFJauRdI88RpBU5Kt5i0XzBj6shStUousiHQw2rO8kcUPR10BcCOqnJ0AFCoZwxdxtBbsvQHQLd1RJVvU8VpUg/zST+5mq/azqPnxWub6NGhBwAwrbtiznti6C5VFETyv7tfDF3G0Fuy44fto6/LK7cB7GMAunbajQ9TQnPqBd21JMbmm8hW/aDLF0HVbT4rTwg9BACqaDFww52hyxh6W9v7B0C3XVFauQMA62ABAL7cj99lv5F1uWAmdqjYypuLOkq9ofvV59eECcCkJ4QudAA2lZpg4IY7Q5cx9LaEejccOoXllTt/P7qYAMDmyEoe59ZWot95dJkKYPtY0OcAkFTf2+M/JXTaVZ2nFxtAjveMocsYemtfGN0vmGk3kMMWx2lKOU7p8o0oPkxtEPRISngM6BRXbSgnAKDbTwrdkzvp5fdErWhADP1f9u6uR00gCsBwzgHZxE4GD7J1EeRLFGzStBfeNGnTNGnS9v//oSI4rCiRgXUTE89zrZJJfBmFARQOvdf03/NNQw/VkWULqZmNRdqsPPPGhC4QcXKz0GO8fE0q1IT+XqGrnd5Owiu5FngwgTE4dIVD7zf/3n9Ri37o8eu3dgslJ8eDWO0E3DEzuo+lVc813/qhg1mVLkFRT5TN5fuGDhssRX4TPs3wQKxgFA5d4dA1vDzfMPSo/TiWwMaK7RxXnhV6oW/g1LZzydr40J2qrzCGo1WCBzOn53OTnkvf1WKAng1jvqF4Qi8R1uwUxuHQFQ5dwzLETs80PPRJ6/evZ2FJmIhoynqV+VovdPfyNLMELVuN0NV9ZmcWBRNauFgRac8gtVzfvGHjhZ0HI3HoCoeu48dH7PLJGBz6Upwe0AqqQENfHkovZHWcLu0K3TNKWXRyR3Z0KTMq2THECK6iwIFKoRM6+C6ey314/9DBD7EtSWE0Dl3h0HX8/osdnn5Oh4buRa+nwWRWt2TJ45Scb21EFzpC37UbWWIXgqtyRNciii3NNWbODtsWsn+QM7NX2LufmUTYmO2W8AYcusKhawm6pnQ7hoGhL6ue644Wdv0hQfvfAXWFnmEjg1KEl/KeDlvdrkGDb9mohJmjNcgbHSIIiMyCKHhr5Ry6wqFrme6f8NyTOR0a+rZ5DmmKtcKHmlfHK5yuJFJUElmFkOAZ2/LgugxPzEHPimhTEK183UHe++2iOHQO/Spjhuc+f4GhocMG7fnJBGv50PAWAhG3nUl46pksKRz5MRFZZqWgtaExAoENgqE49PsFOjh0TYtf7Tld/IlBW3NmW0YqSWmKFwdalmsrvnzX7UgjICLTojnoGzhI3ZfdIw6dQy993ez3SfKtlCT7/b/sA7yN5wG7Kxw6h84eAIfOobMHwKFz6OwBcOgcOnsAHDqH/p99OhAAAAAAEORvPcjlEAOii86A6KIzILroDIguOgOii86A6KIzILroDIguOgOii86A6KIzILroDIguOgOii86A6KIzILroxD4d2gAIBAAMBPdYJKuw/14EhYJgP72boQ0wutEJMLrRCTC60QkwutEJMLrRCTC60QkwutEJMLrRCTC60QkwutEJMLrRCTC60QkwutEJMLrRCTC60QkwutEJMLrRCTC60QkwutEJMLrRCdiXOa1/dEY/Rtr6bnDbzmVORufxVQBTMzpGDzA6Rg8wOkYPMDpGDzA6Rg8wOkYPMDpGDzA6Rg+42Lu7prSBMIrjm5OUdmxEwBCkL2pXTSGYyqAztFM7dqZ1gO//hfpsAAWLmtvNc3633J7/DGxIwtCJoSvA0ImhK8DQiaErwNCJoSvA0ImhK8DQiaErwNCJoSvA0ImhK8DQiaErwNCJoSvA0ImhK8DQiaErwNCJoSvA0GlzDaHTZOi1w9BpyWaNGVbiqH3K0GuFoZMzuetiW2t4yNDrg6GTMeMIuwwOGXpdMHSyDazFURQleHTRZ+j1wNDVy3KU8sWvTlD6GJ6ta08sQ68Fhq7dEKXp9fYaPl+gFJ8z9Dpg6Mot4OTX/6+h8wWlQZ+h+4+hq2Zv4NyEO9fw5gDO1yZD9x5D18zO4TSeW0PnZPk5Q/ceQ9csgtN+fg2dBM45Q/cdQ1esDZFmL63hwwFEHDJ0zzF0vSYpRPvlNRzGEK2OIa8xdL2mENFraziDc2TIawxdrR5EfvXaGprHEPGVIZ8xdK1sDpG9vobPcBqGfMbQtcogplXWMIDIDfmMoWv1A6JXZQ0Wzm9DHmPoSoVdAN2rSmtIIO4MeYyhK9WGmFdbQw+iMOQxhq7UHKJdbQ0WTmjIXwxdqRHEuOIaWhBvDPmLoSuVQ4QV1xBB3BvyF0PXyUJ0q66hATE05C+GrtMEoqi6hjaP3X3H0HX6DTGtuoY3EDeG/MXQdWLoyjB0ncrQZ1XXcMav7r5j6Do98xt97/1Pu//ub/DEEQ/jfMfQdbqCSM22fXsZnRzPpoPsT7DlgpfXfMfQlcohTs2mcHiSJHmatpLRwP5/HT0z5C+GrlQEcb3V+eJWMoeQ1OdhsKHFv8D6jqErdQ+xMI/2L78XKVbS5Me74IHlTS3eY+hKjSFyax58mhUxHuRJby9YG/LQ3XsMXasRxC/zoFEc4FGaTD8GK80DPnjCewxdq/vtZ8CG8yLGhmR0Gqx84qOk/MfQtQq7W0fpk1mBTbfJGe9dqxGGrtY9xMisfDtuYVORHO0FpQyiZQ35jKGrZXOI4Tr00dPQL5ehf4ghzg15jaHrlcHJdofeWoceQSRNQ15j6IotINLJi6G3IWLLlyx6jqFrNoVI7DL0fFfoQ742uR4YumZhATEPd4Seu9CbAziDgKH7jqGrNu5CJOPdofdP4CR9hu49hq5blkJ0e7tCH7fgJIcBQ/ceQ1duMoMT9Z6GXtyiFPUDhu4/hq6dvUPpbYxNb7E0bAYMvQYYOl2neFYWBAy9Dv6xd69NaQNRAIa3C5aOXbp0Jkk7HSHIqGjiwUu94KVaLy34//9Q0VIFix21fEj2vM83mHx9B5Kc2UPoMFs3dra3X94QehgIHSO7e7F9rLYzypzQA0HouLPdqE1nnm0sviH0YBA67vRybycl0SahB4TQQegKEDoIXQFCxzj0CzvJEXpQCB2ErgChYxx68nfoH96fnLy7WiT08iN0zAw9jjavlm6GaXq4/OlkkdDLjtAxM/RatLfaihq3m9ii7to1oZccoeOJ0KOocfdVkkX5x2uDUiN0PBX6xCa2nD0tJUfomBm6jRqTL9W7bWPqld1ee4sD3kuJ0DEO3T0KfTL8LPpc7x0PB3nrcG/lwKB0CB2zQ/fTc3Ld/YGId14k2usZlA2hYzr02Rqnp5LdXhEnmXS3DUqG0PGc0L2It2NOqk0zclDZqtQNSoHQ8ZzQnbjJ6jfrnaWNo+7h8PxbxaAECB3j0GP7L7Wp6tOF45ZIkohE1e/8qpcAoeM+9GfL+oO+ZO73HXvrK6UXH6Hj5aFfyMMtu5PWmkHRETrGodfsszmRZOLDsGlQcISOl4deE2cf+NMzg4IjdLw8dDt1rZMjhuWKjtBVqzdX9nc2Ltudceiv00j57150hK5Zeyfti0h/sL6w9D+htxiKLTpCV2ztUCRL4rt3ZOe5fbUsJ/SiI3S9FlLx7n7CVQg9ZISuVqUqzv6REHrYCF2ts763D2qEHjRC16qzLM7Op3RP6IVH6Fo1U2+nEXrACF2rdsvZObkg9MIjdK16+dxCTwi98Ahdq92BJ3Q9CF2rSlUcoatB6Grti7fz4Qi98Ahdrd1UHKFrQeh6fexnhK4FoetVqUpi5yEm9MIjdMVWIontHNQIvfAIXbGDdfGErgOha7bdEmfngNALj9A1q78VT+gqELpq7VQcoWtA6Lr9OPWErgGh67Y1FMfDOAUIXbnLKCN0BQhduYNlSRiYCR+ha/czl5gR2OARunadVfGEHjxCV683EEfooSN09eqb4jl4InSEjmZXHKEHjtBhzvoZoQeO0GEqR5Jw3HPYCB3GrOUSs8AhaIQOYzrn4gk9aISOke2BOJYshozQMVI/Fk/oIfvF3t3vNA2FARwuHwZDimv0rA6QD0kQU3ISg8qIAZREMrn/GzIKYQxNXOc/Le/zXMP7y9t0Z6dC55eTcS6F/oQJnd9enw2E/oQJnf/+QlMl9M4TOrcuUrNw6Lv7Bd0mdG6dflr01Mwwj3cKuk3o3Hm26N3Pdf56UNBtQufOwU1ulhfRpHcFHSd0pnc/p3q5vTL/WCnoOKFzb7TQ+7jB+WVB1wmdeztvF1jppVdxfSB0pt7sVu0Xer4u6DyhM7V5mAatF/rEj+g9IHSmllYmqWy70L9sFHSe0JlaevE5NS0X+vGHgu4TOg+n4dVRu/dxTb5xWKYPhM7DaVi/bLXS6zzxf5ZeEDoz07C12mKlD3P6WNAHQmd2Gr4dV/Pv87ORB/d+EDqz07B5mKq5dnrZ5HR9WtALQufRNGy/T6n5V+rDusl5fGGf94XQeTwNW6NJSuk8V1XTDAZXdVkO15bX1oZlWddXV4NB01RVzmd7o5OCvhA6f0zD99Pr1fEjuzP2jg4vThyU6RGh85dpWH/5fHvW/oydFQ/t/SJ05pqGgl4TOkIPQOgIPQChI/QAhI7QAxA6Qg9A6Ag9AKEj9ACEjtADEDpCD0DoCD0AoSP0AISO0AMQOkIPQOgIPQChI/QAhI7QAxA6Qg9A6Ag9AKEj9ACEjtADEDpCD0DodCr0jbm5Vl7oCB2hI/RohI7QAxA6Qg9A6Ag9AKEj9ACEjtADEDpCD0DodCp0bgmdB4SO0BE6QkfocQgdoQcgdIQegNARegA/2acDAQAAAABB/taDXA6JjugDoiP6gOiIPiA6og+IjugDoiP6gOiIPiA6og+IjugDoiP6gOiIPiA6og+IjugDoiP6gOiIPiA6og+IjugDoiP6gOiIPiA6og+IjugDoiP6gOiIPiA6og+IjugDoiP6gOiIPiA6og+IjugDoiP6gOiIPiA6og+IjugDoiP6gOiIPiA6og+IjugDoiP6gOiIPiA6og+IjugDoiP6gOiIPiA6og+IjugDoiP6gOiIPiA6og+IjugDoiP6gOiIPiA6og+IjugDoiP6gOiIPiA6og+IjugDoiP6gOiIPiA6og+IjugDsU/HRgCDQAwEHbr/immBYUj4221BOqEj9AChI/QAoSP0AKEj9AChI/QAoSP0AKEj9AChI/QAoSP0AKEj9AChI/QAoSP0AKEj9AChI/QAoSP0AKEj9AChI/QAoSP0AKEj9AChI/QAoSP0AKEj9AChI/QAoSP0AKEj9AChI/QAoSP0AKEj9AChI/QAoSP0AKEj9AChI/QAoSP0AKEj9AChI/QAoSP0AKEj9AChI/QAoSP0AKEj9AChI/QAoSP0AKEj9AChI/QAoSP0gMuh/x8PE/pYJ6G7w1SWHWs7dGA8oUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BKz26UAAAAAAQJC/9SCXQ6LDgOgwIDoMiA4DosOA6DAgOgyIDgOiw4DoMCA6DIgOA6LDgOgwIDoMiA4DosOA6DAgOgyIDgOiw4DoMCA6DIgOAwGKq748SV9BYAAAAABJRU5ErkJggg==";

  class LaymicHelp {
      constructor(builder, rootEl) {
          this.ISDISPLAYED_KEY = "laymic_isHelpDisplayed";
          // 表示済みか否かを判別するbool
          this._isDisplayed = false;
          this.rootEl = rootEl;
          this.builder = builder;
          const helpClassNames = builder.classNames.help;
          const containerEl = builder.createDiv();
          containerEl.className = helpClassNames.container;
          const wrapperEl = builder.createDiv();
          wrapperEl.className = helpClassNames.wrapper;
          [
              {
                  src: horizHelpImg,
                  className: helpClassNames.horizImg
              },
              {
                  src: vertHelpImg,
                  className: helpClassNames.vertImg
              }
          ].forEach(obj => {
              const img = new Image();
              img.src = obj.src;
              img.className = obj.className;
              wrapperEl.appendChild(img);
          });
          containerEl.appendChild(wrapperEl);
          this.el = containerEl;
          this.wrapperEl = containerEl;
          // 各種イベントをボタンに適用
          this.applyEventListeners();
          this.loadIsDisplayedData();
          if (!this.isDisplayed) {
              this.showHelp();
          }
      }
      loadIsDisplayedData() {
          const isDisplayedStr = localStorage.getItem(this.ISDISPLAYED_KEY) || "";
          if (isDisplayedStr === "true") {
              this._isDisplayed = true;
          }
      }
      get isDisplayed() {
          return this._isDisplayed;
      }
      set isHelpDisplayed(bool) {
          this._isDisplayed = bool;
          localStorage.setItem(this.ISDISPLAYED_KEY, "true");
      }
      showHelp() {
          this.rootEl.classList.add(this.builder.stateNames.showHelp);
      }
      hideHelp() {
          this.rootEl.classList.remove(this.builder.stateNames.showHelp);
          this.isHelpDisplayed = true;
      }
      applyEventListeners() {
          this.el.addEventListener("click", () => {
              this.hideHelp();
          });
      }
  }

  class LaymicZoom {
      constructor(builder, rootEl) {
          this.state = this.defaultLaymicZoomStates;
          const zoomEl = builder.createDiv();
          zoomEl.className = builder.classNames.zoom.controller;
          this.controller = zoomEl;
          this.rootEl = rootEl;
          this.wrapper = builder.createZoomWrapper();
          this.builder = builder;
          this.applyEventListeners();
      }
      /**
       * LaymicZoomStatesのデフォルト値を返す
       * @return LaymicZoomStatesデフォルト値
       */
      get defaultLaymicZoomStates() {
          return {
              zoomRatio: 1.0,
              minRatio: 1.0,
              maxRatio: 3.0,
              isSwiped: false,
              isMouseDown: false,
              pastX: 0,
              pastY: 0,
              zoomRect: {
                  t: 0,
                  l: 0,
                  w: 800,
                  h: 600,
              },
              pastDistance: 1
          };
      }
      /**
       * 現在ズームがなされているかを返す
       * @return zoomRatioが1以上ならばtrue
       */
      get isZoomed() {
          return this.state.zoomRatio > 1;
      }
      /**
       * 現在のzoomRatioの値を返す
       * @return zoomRatioの値
       */
      get zoomRatio() {
          return this.state.zoomRatio;
      }
      /**
       * タッチされた二点間の距離を返す
       * reference: https://github.com/nolimits4web/swiper/blob/master/src/components/zoom/zoom.js
       *
       * @return 二点間の距離
       */
      getDistanceBetweenTouches(e) {
          // タッチ数が2点に満たない場合は1を返す
          if (e.targetTouches.length < 2)
              return 0;
          const { clientX: x0, clientY: y0 } = e.targetTouches[0];
          const { clientX: x1, clientY: y1 } = e.targetTouches[1];
          const distance = ((x1 - x0) ** 2) + ((y1 - y0) ** 2);
          return Math.sqrt(Math.abs(distance));
      }
      /**
       * タッチされた二点の座標の中心点から、
       * 正規化された拡大時中心点を返す
       *
       * @param  e TouchEvent
       * @return   [betweenX, betweenY]
       */
      getNormalizedPosBetweenTouches(e) {
          if (e.targetTouches.length < 2)
              return [0.5, 0.5];
          const { l: rl, t: rt, w: rw, h: rh } = this.state.zoomRect;
          const { clientX: x0, clientY: y0 } = e.targetTouches[0];
          const { clientX: x1, clientY: y1 } = e.targetTouches[1];
          const rx = Math.abs(rl);
          const ry = Math.abs(rt);
          // between x
          const bx = ((x0 + rx) + (x1 + ry)) / 2;
          // between y
          const by = ((y0 + ry) + (y1 + ry)) / 2;
          return [bx / rw, by / rh];
      }
      /**
       * 画面中央座標を正規化して返す
       * @return [centeringX, centeringY]
       */
      getNormalizedCurrentCenter() {
          const { innerWidth: cw, innerHeight: ch } = window;
          // const {clientWidth: cw, clientHeight: ch} = this.rootEl;
          const { l: rx, t: ry, w: rw, h: rh } = this.state.zoomRect;
          const maxX = rw - cw;
          const maxY = rh - ch;
          // `0 / 0`とした際はNaNとなってバグが出るので
          // max値に1を足しておく
          const nx = Math.abs(rx) / (maxX + 1);
          const ny = Math.abs(ry) / (maxY + 1);
          // 戻り値が[0, 0]の場合は[0.5, 0.5]を返す
          return (nx !== 0 || ny !== 0) ? [nx, ny] : [0.5, 0.5];
      }
      /**
       * 現在のzoomRatioの値からscale設定値を生成する
       * @return css transformに用いる設定値
       */
      get scaleProperty() {
          return `scale(${this.state.zoomRatio})`;
      }
      /**
       * 現在のzoomRectの値からtranslate設定値を生成する
       * @return css transformに用いる設定値
       */
      get translateProperty() {
          return `translate(${this.state.zoomRect.l}px, ${this.state.zoomRect.t}px)`;
      }
      /**
       * touchstartに対して登録する処理まとめ
       * @param  e タッチイベント
       */
      touchStartHandler(e) {
          e.stopPropagation();
          this.state.isSwiped = false;
          // for swipe
          const { clientX: x, clientY: y } = e.targetTouches[0];
          this.updatePastPos(x, y);
          // for pinch out/in
          this.updatePastDistance(e);
      }
      /**
       * touchmoveイベントに対して登録する処理まとめ
       * @param  e タッチイベント
       */
      touchMoveHandler(e) {
          e.stopPropagation();
          e.preventDefault();
          if (isMultiTouch(e)) {
              // multi touch
              this.pinchZoom(e);
          }
          else {
              // single touch
              const { clientX: x, clientY: y } = e.targetTouches[0];
              this.state.isSwiped = true;
              this.setTranslate(x, y);
              this.updatePastPos(x, y);
          }
      }
      /**
       * もろもろのEventListenerを登録する
       * インスタンス生成時に一度だけ呼ばれることを想定
       */
      applyEventListeners() {
          if (isMobile()) {
              this.controller.addEventListener("touchstart", e => this.touchStartHandler(e));
              this.controller.addEventListener("touchmove", rafThrottle(e => this.touchMoveHandler(e)), passiveFalseOption);
              this.controller.addEventListener("touchend", (e) => {
                  e.stopPropagation();
                  if (this.state.isSwiped || this.isZoomed)
                      return;
                  // ズーム倍率が1の場合はズームモードを終了させる
                  this.disable();
              });
          }
          else {
              this.controller.addEventListener("click", () => {
                  // ドラッグ操作がなされている場合は処理をスキップ
                  if (this.state.isSwiped)
                      return;
                  // zoom要素クリックでzoom解除
                  this.disable();
              });
              this.controller.addEventListener("mousedown", e => {
                  this.state.isMouseDown = true;
                  this.state.isSwiped = false;
                  this.updatePastPos(e.clientX, e.clientY);
              });
              [
                  "mouseup",
                  "mouseleave"
              ].forEach(ev => this.controller.addEventListener(ev, () => {
                  this.state.isMouseDown = false;
              }));
              this.controller.addEventListener("mousemove", rafThrottle(e => {
                  // mousedown状況下でなければスキップ
                  if (!this.state.isMouseDown)
                      return;
                  this.state.isSwiped = true;
                  this.setTranslate(e.clientX, e.clientY);
                  this.updatePastPos(e.clientX, e.clientY);
              }));
          }
      }
      /**
       * 過去の座標値を更新する
       * @param  x 新しいx座標
       * @param  y 新しいy座標
       */
      updatePastPos(x, y) {
          this.state.pastX = x;
          this.state.pastY = y;
      }
      /**
       * controller要素のサイズを取得する
       * @return PageRectの形式に整えられたサイズ値
       */
      getControllerRect() {
          const rect = this.controller.getBoundingClientRect();
          return {
              t: rect.top,
              l: rect.left,
              w: rect.width,
              h: rect.height,
          };
      }
      /**
       * 指定された座標に応じてwrapperのtranslateの値を動かす
       * @param  currentX x座標
       * @param  currentY y座標
       */
      setTranslate(currentX, currentY) {
          const { clientWidth: cw, clientHeight: ch } = this.rootEl;
          const { pastX, pastY, zoomRect } = this.state;
          const { t: ry, l: rx, w: rw, h: rh } = zoomRect;
          const x = pastX - currentX;
          const y = pastY - currentY;
          // これ以上の数値にはならないしきい値
          const maxX = -(rw - cw);
          const maxY = -(rh - ch);
          const calcX = rx - x;
          const calcY = ry - y;
          let translateX = calcX;
          if (calcX < maxX) {
              // maxXより小さければmaxXを返す
              translateX = maxX;
          }
          else if (calcX > 0) {
              // 0より大きければ0を返す
              translateX = 0;
          }
          let translateY = calcY;
          if (calcY < maxY) {
              translateY = maxY;
          }
          else if (calcY > 0) {
              translateY = 0;
          }
          zoomRect.l = translateX;
          zoomRect.t = translateY;
          this.wrapper.style.transform = `${this.translateProperty} ${this.scaleProperty}`;
      }
      /**
       * ピンチズーム処理を行う
       * @param  e タッチイベント
       */
      pinchZoom(e) {
          const distance = this.getDistanceBetweenTouches(e);
          const { innerWidth: iw, innerHeight: ih } = window;
          // 画面サイズの対角線上距離を最大距離とする
          const maxD = Math.sqrt(iw ** 2 + ih ** 2);
          const pinchD = distance - this.state.pastDistance;
          const { minRatio, maxRatio } = this.state;
          // 計算値そのままでは動作が硬いので
          // 感度を6倍にしてスマホブラウザ操作感と近づける
          const ratio = this.state.zoomRatio + (pinchD / maxD) * 6;
          // maxRatio~minRatio間に収まるよう調整
          const zoomRatio = Math.max(Math.min(ratio, maxRatio), minRatio);
          // タッチ座標と画面中央座標を取得し、
          // その平均値をズームの中心座標とする
          const [bx, by] = this.getNormalizedPosBetweenTouches(e);
          const [cx, cy] = this.getNormalizedCurrentCenter();
          const zoomX = (bx + cx) / 2;
          const zoomY = (by + cy) / 2;
          this.enableZoom(zoomRatio, zoomX, zoomY);
          this.state.pastDistance = distance;
      }
      /**
       * zoomRectの値を更新する
       * translateXとtranslateYの値を入力していれば自前で計算し、
       * そうでないなら`getControllerRect()`を呼び出す
       *
       * @param  translateX 新たなleft座標
       * @param  translateY 新たなtop座標
       */
      updateZoomRect(translateX, translateY) {
          let zoomRect;
          if (translateX !== void 0 && translateY !== void 0) {
              const { clientHeight: rootCH, clientWidth: rootCW } = this.rootEl;
              const ratio = this.state.zoomRatio;
              zoomRect = {
                  l: translateX,
                  t: translateY,
                  w: rootCW * ratio,
                  h: rootCH * ratio
              };
          }
          else {
              zoomRect = this.getControllerRect();
          }
          this.state.zoomRect = zoomRect;
      }
      updatePastDistance(e) {
          const distance = this.getDistanceBetweenTouches(e);
          this.state.pastDistance = distance;
      }
      /**
       * ズームモードに入る
       * @param  zoomRatio ズーム倍率
       * @param  zoomX     正規化されたズーム時中央横座標
       * @param  zoomY     正規化されたズーム時中央縦座標
       */
      enable(zoomRatio = 1.5, zoomX = 0.5, zoomY = 0.5) {
          this.enableController();
          this.enableZoom(zoomRatio, zoomX, zoomY);
      }
      /**
       * 拡大縮小処理を行う
       * @param  zoomRatio ズーム倍率
       * @param  zoomX     正規化されたズーム時中央横座標
       * @param  zoomY     正規化されたズーム時中央縦座標
       */
      enableZoom(zoomRatio = 1.5, zoomX = 0.5, zoomY = 0.5) {
          const { clientWidth: cw, clientHeight: ch } = this.rootEl;
          const translateX = -((cw * zoomRatio - cw) * zoomX);
          const translateY = -((ch * zoomRatio - ch) * zoomY);
          this.state.zoomRatio = zoomRatio;
          this.updateZoomRect(translateX, translateY);
          // 引数を省略した場合は中央寄せでズームする
          this.wrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomRatio})`;
      }
      /**
       * ズーム時操作要素を前面に出す
       */
      enableController() {
          const zoomed = this.builder.stateNames.zoomed;
          this.wrapper.classList.add(zoomed);
      }
      /**
       * ズームモードから抜ける
       */
      disable() {
          const zoomed = this.builder.stateNames.zoomed;
          this.wrapper.classList.remove(zoomed);
          this.state.zoomRatio = 1.0;
          this.wrapper.style.transform = "";
      }
  }

  Swiper.use([keyboard, pagination, lazy]);
  class Laymic {
      constructor(laymicPages, options = {}) {
          // mangaViewer内部で用いるステートまとめ
          this.state = this.defaultMangaViewerStates;
          // 初期化引数を保管
          this.initOptions = options;
          const builder = new DOMBuilder(options.icons, options.classNames, options.stateNames);
          const rootEl = builder.createDiv();
          const { stateNames, classNames } = builder;
          this.builder = builder;
          const [pages, thumbPages] = (isLaymicPages(laymicPages))
              ? [laymicPages.pages, laymicPages.thumbs || []]
              : [laymicPages, []];
          if (this.state.viewerIdx === 0) {
              // 一つのページにつき一度だけの処理
              const svgCtn = builder.createSVGIcons();
              document.body.appendChild(svgCtn);
              // 向き変更イベント自体は一度のみ登録する
              window.addEventListener("orientationchange", () => orientationChangeHandler());
          }
          if (options.pageWidth && options.pageHeight) {
              // ページサイズ数値が指定されていた場合の処理
              const [pw, ph] = [options.pageWidth, options.pageHeight];
              this.setPageSize(pw, ph);
          }
          this.preference = new LaymicPreference(builder, rootEl);
          // 省略表記だとバグが起きそうなので
          // undefinedでないかだけ確認する
          if (options.isLTR !== void 0)
              this.state.isLTR = options.isLTR;
          if (options.vertPageMargin !== void 0)
              this.state.vertPageMargin = options.vertPageMargin;
          if (options.horizPageMargin !== void 0)
              this.state.horizPageMargin = options.horizPageMargin;
          if (options.isFirstSlideEmpty !== void 0)
              this.state.isFirstSlideEmpty = options.isFirstSlideEmpty;
          if (options.viewerPadding !== void 0)
              this.state.viewerPadding = options.viewerPadding;
          if (options.isInstantOpen !== void 0)
              this.state.isInstantOpen = options.isInstantOpen;
          // ここからは省略表記で存在確認
          if (options.viewerId)
              this.state.viewerId = options.viewerId;
          const pagesLen = (this.state.isFirstSlideEmpty)
              ? pages.length + 1
              : pages.length;
          if (options.isAppendEmptySlide === false || !(pagesLen % 2)) {
              // 強制的にオフ設定がなされているか
              // 合計ページ数が偶数の場合はスライドを追加しない
              this.state.isAppendEmptySlide = false;
          }
          this.thumbs = new LaymicThumbnails(builder, rootEl, pages, thumbPages, this.state);
          this.help = new LaymicHelp(builder, rootEl);
          this.zoom = new LaymicZoom(builder, rootEl);
          // 画像読み込みなどを防ぐため初期状態ではdisplay: noneにしておく
          rootEl.style.display = "none";
          rootEl.classList.add(classNames.root, stateNames.visibleUI);
          if (this.state.isLTR)
              rootEl.classList.add(stateNames.ltr);
          if (this.state.isMobile)
              rootEl.classList.add(stateNames.mobile);
          // fullscreen非対応なら全画面ボタンを非表示化する
          if (!screenfull.isEnabled)
              rootEl.classList.add(stateNames.unsupportedFullscreen);
          const [controllerEl, uiButtons] = builder.createViewerController();
          const swiperEl = builder.createSwiperContainer(pages, this.state.isLTR, this.state.isFirstSlideEmpty, this.state.isAppendEmptySlide);
          [
              controllerEl,
              swiperEl,
              this.thumbs.el,
              this.preference.el,
              this.help.el,
          ].forEach(el => this.zoom.wrapper.appendChild(el));
          rootEl.appendChild(this.zoom.wrapper);
          controllerEl.appendChild(this.zoom.controller);
          this.el = {
              rootEl,
              swiperEl,
              controllerEl,
              buttons: uiButtons,
          };
          // 各種css変数の更新
          this.cssProgressBarWidthUpdate();
          this.cssViewerPaddingUpdate();
          this.cssJsVhUpdate();
          // 一旦DOMから外していたroot要素を再度放り込む
          document.body.appendChild(this.el.rootEl);
          const conf = (this.isMobile2pView)
              ? this.swiper2pHorizViewConf
              : this.swiperResponsiveHorizViewConf;
          this.swiper = new Swiper(this.el.swiperEl, conf);
          if (options.viewerDirection === "vertical")
              this.enableVerticalView();
          // 各種イベントの登録
          this.applyEventListeners();
          // location.hashにmangaViewerIdと同値が指定されている場合は
          // 即座に開く
          if (this.state.isInstantOpen && location.hash === "#" + this.state.viewerId) {
              this.open(true);
          }
      }
      /**
       * swiper-containerの要素サイズを返す
       * @return 要素サイズオブジェクト
       */
      get swiperElRect() {
          const { height: h, width: w, left: l, top: t, } = this.el.rootEl.getBoundingClientRect();
          return {
              w,
              h,
              l,
              t
          };
      }
      /**
       * 初期状態のmangaViewerステートオブジェクトを返す
       * @return this.stateの初期値
       */
      get defaultMangaViewerStates() {
          const { innerHeight: ih, innerWidth: iw, } = window;
          const pageSize = {
              w: 720,
              h: 1024
          };
          const viewerIdx = viewerCnt();
          return {
              viewerPadding: 10,
              // デフォルト値としてウィンドウ幅を指定
              swiperRect: {
                  l: 0,
                  t: 0,
                  w: iw,
                  h: ih,
              },
              viewerId: "laymic",
              // インスタンスごとに固有のid数字
              viewerIdx,
              pageSize,
              thresholdWidth: pageSize.w,
              pageAspect: {
                  w: 45,
                  h: 64
              },
              isLTR: false,
              isVertView: false,
              // 空白をつけた左始めがデフォルト設定
              isFirstSlideEmpty: true,
              // 全ページ数が奇数でいて見開き2p表示の場合
              // 最終ページとして空白ページを追加する
              isAppendEmptySlide: true,
              vertPageMargin: 10,
              horizPageMargin: 0,
              // mediumと同じ数値
              progressBarWidth: 8,
              thumbItemHeight: 128,
              thumbItemWidth: 96,
              thumbItemGap: 16,
              thumbsWrapperPadding: 16,
              isMobile: isExistTouchEvent(),
              isInstantOpen: true,
              bodyScrollTop: 0,
              isActive: false,
              deviceOrientation: getDeviceOrientation(),
          };
      }
      get swiper2pHorizViewConf() {
          return {
              direction: "horizontal",
              speed: 200,
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: this.state.horizPageMargin,
              on: {
                  reachBeginning: () => this.changePaginationVisibility(),
                  resize: () => {
                      this.switchSingleSlideState();
                      this.cssJsVhUpdate();
                      this.viewUpdate();
                  },
                  slideChange: () => {
                      this.hideViewerUI();
                      this.changePaginationVisibility();
                  },
              },
              pagination: {
                  el: ".swiper-pagination",
                  type: "progressbar",
              },
              keyboard: true,
              preloadImages: false,
              lazy: {
                  loadPrevNext: true,
                  loadPrevNextAmount: 4,
              },
          };
      }
      get swiperResponsiveHorizViewConf() {
          const breakpoints = {};
          const thresholdWidth = this.state.thresholdWidth;
          breakpoints[thresholdWidth] = {
              slidesPerView: 2,
              slidesPerGroup: 2,
          };
          const conf = this.swiper2pHorizViewConf;
          conf.slidesPerView = 1;
          conf.slidesPerGroup = 1;
          conf.breakpoints = breakpoints;
          return conf;
      }
      get swiperVertViewConf() {
          return {
              direction: "vertical",
              spaceBetween: this.state.vertPageMargin,
              speed: 200,
              keyboard: true,
              freeMode: true,
              freeModeMomentumRatio: 0.36,
              freeModeMomentumVelocityRatio: 1,
              freeModeMinimumVelocity: 0.02,
              on: {
                  reachBeginning: () => this.changePaginationVisibility(),
                  resize: () => {
                      this.switchSingleSlideState();
                      this.cssJsVhUpdate();
                      this.viewUpdate();
                  },
                  slideChange: () => {
                      this.hideViewerUI();
                      this.changePaginationVisibility();
                  },
              },
              pagination: {
                  el: ".swiper-pagination",
                  type: "progressbar",
              },
              preloadImages: false,
              lazy: {
                  loadPrevNext: true,
                  loadPrevNextAmount: 4,
              },
          };
      }
      /**
       * 横読み2p表示するか否かの判定を行う
       * @return  2p表示する解像度ならばtrue
       */
      get isDoubleSlideHorizView() {
          return this.isMobile2pView || this.state.thresholdWidth <= window.innerWidth;
      }
      /**
       * モバイル端末での強制2p見開き表示モードか否かを判定する
       * @return 2p見開き表示条件ならばtrue
       */
      get isMobile2pView() {
          return this.state.isMobile && this.state.deviceOrientation === "landscape";
      }
      /**
       * オーバーレイ表示を展開させる
       * @param  isDisableFullscreen trueならば全画面化処理を無効化する
       */
      open(isDisableFullscreen = false) {
          const isFullscreen = !isDisableFullscreen && this.preference.isAutoFullscreen;
          // ページ読み込み後一度目の展開時にのみtrue
          const isInitialOpen = this.el.rootEl.style.display === "none";
          // display:none状態の場合でだけ動く部分
          if (isInitialOpen) {
              this.el.rootEl.style.display = "";
              sleep(5).then(() => {
                  // slideが追加された後に処理を行う必要があるため
                  // sleepを噛ませて非同期処理とする
                  this.switchSingleSlideState();
              });
          }
          // preferenceかinitOptionの値を適用する
          this.preference.applyPreferenceValues();
          // キーボードイベントが停止していたならば再開させる
          if (this.swiper.keyboard && !this.swiper.keyboard.enabled) {
              this.swiper.keyboard.enable();
          }
          // 全画面化条件を満たしているなら全画面化
          if (isFullscreen) {
              // 全画面化ハンドラ内部で呼び出されているので
              // this.viewUpdate()は不要
              this.fullscreenHandler();
          }
          else {
              // 全画面化しない場合は表示更新のみ行う
              this.viewUpdate();
          }
          // オーバーレイ要素の表示
          this.showRootEl();
          // オーバーレイ下要素のスクロール停止
          this.disableBodyScroll();
          // swiperのfreeModeには
          // 「lazyloadとfreeModeを併用した際初期画像の読み込みが行われない」
          // 不具合があるようなので手動で画像読み込み
          if (this.state.isVertView && this.swiper.activeIndex === 0 && this.swiper.lazy) {
              this.swiper.lazy.load();
          }
          // 履歴を追加せずにhash値を書き換える
          if (this.state.isInstantOpen) {
              const newUrl = excludeHashLocation() + "#" + this.state.viewerId;
              window.location.replace(newUrl);
          }
          // アクティブ状態に変更
          this.state.isActive = true;
      }
      /**
       * オーバーレイ表示を閉じる
       */
      close(isHashChange = true) {
          this.hideRootEl();
          // 閉じていてもキーボード操作を受け付けてしまう不具合対処
          if (this.swiper.keyboard) {
              this.swiper.keyboard.disable();
          }
          // フルスクリーン状態にあるならそれを解除
          if (document.fullscreenElement) {
              this.fullscreenHandler();
          }
          // オーバーレイ下要素のスクロール再開
          this.enableBodyScroll();
          if (this.state.isInstantOpen
              && location.hash
              && isHashChange) {
              // 履歴を残さずhashを削除する
              const newUrl = excludeHashLocation() + "#";
              window.location.replace(newUrl);
          }
          // 非アクティブ状態に変更
          this.state.isActive = false;
      }
      laymicPreferenceUpdateHandler(e) {
          if (e.detail === "progressBarWidth") {
              // progressBarWidth数値を取得する
              const w = this.preference.getBarWidth(this.preference.progressBarWidth);
              this.state.progressBarWidth = w;
              // 設定した値を画面に適用する
              this.cssProgressBarWidthUpdate();
              this.viewUpdate();
          }
          else if (e.detail === "paginationVisibility") {
              // ページ送り表示設定
              // pagination visibility
              const pv = this.preference.paginationVisibility;
              // isVisiblePagination
              const isVP = this.initOptions.isVisiblePagination;
              const isVisible = pv === "visible" || pv !== "hidden" && isVP;
              const vpClass = this.builder.stateNames.visiblePagination;
              if (isVisible) {
                  this.el.rootEl.classList.add(vpClass);
              }
              else {
                  this.el.rootEl.classList.remove(vpClass);
              }
          }
          else if (e.detail === "isDisableTapSlidePage") {
              if (this.state.isMobile && this.preference.isDisableTapSlidePage) {
                  // モバイル環境で設定値がtrueの際にのみ動作
                  this.disablePagination();
              }
              else {
                  this.enablePagination();
              }
          }
          else {
              console.log("manga viewer update event");
          }
      }
      /**
       * 各種イベントの登録
       * インスタンス生成時に一度だけ呼び出されることを想定
       */
      applyEventListeners() {
          this.el.buttons.help.addEventListener("click", () => {
              this.help.showHelp();
              this.hideViewerUI();
          });
          // 縦読み/横読み切り替えボタン
          this.el.buttons.direction.addEventListener("click", () => {
              if (!this.state.isVertView) {
                  this.enableVerticalView();
              }
              else {
                  this.disableVerticalView();
              }
          });
          // サムネイル表示ボタン
          this.el.buttons.thumbs.addEventListener("click", () => {
              this.thumbs.showThumbs();
              this.hideViewerUI();
          });
          // サムネイルのクリックイベント
          // 各サムネイルとswiper各スライドとを紐づける
          this.thumbs.thumbEls.forEach((el, i) => el.addEventListener("click", () => {
              this.thumbs.hideThumbs();
              this.swiper.slideTo(i);
          }));
          const zoomHandler = () => {
              if (this.zoom.isZoomed) {
                  // ズーム時
                  this.zoom.disable();
              }
              else {
                  // 非ズーム時
                  this.zoom.enable();
              }
              this.hideViewerUI();
          };
          // ズームボタンのクリックイベント
          this.el.buttons.zoom.addEventListener("click", zoomHandler);
          // 全画面化ボタンのクリックイベント
          this.el.buttons.fullscreen.addEventListener("click", () => {
              this.fullscreenHandler();
          });
          // 設定ボタンのクリックイベント
          this.el.buttons.preference.addEventListener("click", () => {
              this.preference.showPreference();
              // UIを閉じておく
              this.hideViewerUI();
          });
          // オーバーレイ終了ボタンのクリックイベント
          this.el.buttons.close.addEventListener("click", () => {
              this.close();
          });
          this.el.buttons.nextPage.addEventListener("click", () => {
              this.swiper.slideNext();
          });
          this.el.buttons.prevPage.addEventListener("click", () => {
              this.swiper.slidePrev();
          });
          // swiperElと周囲余白にあたるcontrollerElへの各種イベント登録
          [
              this.el.swiperEl,
              this.el.controllerEl
          ].forEach(el => {
              // クリック時のイベント
              el.addEventListener("click", e => {
                  if (this.state.isMobile && this.preference.isDisableTapSlidePage) {
                      // モバイルブラウザでのタップページ送り無効化設定時は
                      // viewerUIのトグルだけ行う
                      this.toggleViewerUI();
                  }
                  else {
                      this.slideClickHandler(e);
                  }
              });
              // ダブルクリック時のイベント
              // el.addEventListener("dblclick", zoomHandler)
              // マウス操作時のイベント
              el.addEventListener("mousemove", rafThrottle(e => {
                  this.slideMouseHoverHandler(e);
              }));
              // マウスホイールでのイベント
              // swiper純正のマウスホイール処理は動作がすっとろいので自作
              el.addEventListener("wheel", rafThrottle(e => {
                  // 上下ホイール判定
                  // || RTL時の左右ホイール判定
                  // || LTR時の左右ホイール判定
                  const isNext = e.deltaY > 0
                      || !this.state.isLTR && e.deltaX < 0
                      || this.state.isLTR && e.deltaX > 0;
                  const isPrev = e.deltaY < 0
                      || !this.state.isLTR && e.deltaX > 0
                      || this.state.isLTR && e.deltaX < 0;
                  if (isNext) {
                      // 進む
                      this.swiper.slideNext();
                  }
                  else if (isPrev) {
                      // 戻る
                      this.swiper.slidePrev();
                  }
              }));
              if (this.state.isMobile) {
                  el.addEventListener("touchstart", e => {
                      this.zoom.updatePastDistance(e);
                  });
                  el.addEventListener("touchmove", rafThrottle(e => {
                      // マルチタッチでない場合と全画面状態でない場合は早期リターン
                      if (!isMultiTouch(e))
                          return;
                      e.preventDefault();
                      this.zoom.pinchZoom(e);
                  }), passiveFalseOption);
                  el.addEventListener("touchend", () => {
                      if (this.zoom.isZoomed) {
                          this.zoom.enableController();
                          this.hideViewerUI();
                      }
                  });
              }
          });
          // ユーザビリティのため「クリックしても何も起きない」
          // 場所ではイベント伝播を停止させる
          Array.from(this.el.controllerEl.children).forEach(el => el.addEventListener("click", e => e.stopPropagation()));
          // カスタムイベント登録
          this.el.rootEl.addEventListener("LaymicPreferenceUpdate", ((e) => this.laymicPreferenceUpdateHandler(e)));
          // orientationchangeイベント登録
          orientationChangeFuncs.push(this.orientationChange.bind(this));
      }
      /**
       * swiper instanceを再初期化する
       * @param  swiperConf 初期化時に指定するswiperOption
       * @param  idx        初期化時に指定するindex数値
       */
      reinitSwiperInstance(swiperConf, idx = 0) {
          const conf = Object.assign(swiperConf, {
              initialSlide: idx
          });
          // swiperインスタンスを一旦破棄してからre-init
          this.swiper.destroy(true, true);
          this.swiper = new Swiper(this.el.swiperEl, conf);
          this.viewUpdate();
          if (this.swiper.lazy)
              this.swiper.lazy.load();
      }
      /**
       * 縦読み表示へと切り替える
       */
      enableVerticalView() {
          const vertView = this.builder.stateNames.vertView;
          this.state.isVertView = true;
          this.el.rootEl.classList.add(vertView);
          const isFirstSlideEmpty = this.state.isFirstSlideEmpty;
          // if (isFirstSlideEmpty) {
          //   this.removeFirstEmptySlide();
          // }
          const activeIdx = this.swiper.activeIndex;
          // 横読み2p表示を行う解像度であり、
          // 一番目に空要素を入れる設定が有効な場合はindex数値を1減らす
          const idx = (isFirstSlideEmpty
              && activeIdx !== 0
              && this.isDoubleSlideHorizView)
              ? activeIdx - 1
              : activeIdx;
          // 読み進めたページ数を引き継ぎつつ再初期化
          this.reinitSwiperInstance(this.swiperVertViewConf, idx);
      }
      /**
       * 横読み表示へと切り替える
       */
      disableVerticalView() {
          const vertView = this.builder.stateNames.vertView;
          this.state.isVertView = false;
          this.el.rootEl.classList.remove(vertView);
          const isFirstSlideEmpty = this.state.isFirstSlideEmpty;
          // 横読み2p表示を行う解像度であり、
          // 一番目に空要素を入れる設定が有効な場合はindex数値を1減らす
          const activeIdx = this.swiper.activeIndex;
          const idx = (isFirstSlideEmpty && this.isDoubleSlideHorizView)
              ? activeIdx + 1
              : activeIdx;
          // 読み進めたページ数を引き継ぎつつ再初期化
          this.reinitSwiperInstance(this.swiperResponsiveHorizViewConf, idx);
      }
      /**
       * 画面幅に応じて、横読み時の
       * 「1p表示 <-> 2p表示」を切り替える
       */
      switchSingleSlideState() {
          // swiperが初期化されていないなら早期リターン
          if (!this.swiper)
              return;
          const rootEl = this.el.rootEl;
          const state = this.builder.stateNames.singleSlide;
          const isFirstSlideEmpty = this.state.isFirstSlideEmpty;
          const isAppendEmptySlide = this.state.isAppendEmptySlide;
          if (this.isDoubleSlideHorizView) {
              // 横読み時2p表示
              if (isFirstSlideEmpty)
                  this.prependFirstEmptySlide();
              if (isAppendEmptySlide)
                  this.appendLastEmptySlide();
              rootEl.classList.remove(state);
          }
          else {
              // 横読み時1p表示
              if (isFirstSlideEmpty)
                  this.removeFirstEmptySlide();
              if (isAppendEmptySlide)
                  this.removeLastEmptySlide();
              rootEl.classList.add(state);
          }
          this.swiper.update();
      }
      /**
       * 1p目空スライドを削除する
       */
      removeFirstEmptySlide() {
          if (this.swiper.slides.length === 0)
              return;
          const firstSlide = this.swiper.slides[0];
          const emptySlide = this.builder.classNames.emptySlide;
          const hasEmptySlide = firstSlide.classList.contains(emptySlide);
          if (hasEmptySlide) {
              // スライドを消す前のindexを取得
              const idx = this.swiper.activeIndex;
              this.swiper.removeSlide(0);
              // 縦読み時のみの処理
              if (this.state.isVertView) {
                  // 直感的には妙な処理だけどこれで問題なく動く
                  // removeSlide()を行う前のindex数値を入力して
                  // 一つずらしている形
                  this.swiper.slideTo(idx);
              }
              // this.swiper.updateSlides();
              // this.swiper.updateProgress();
          }
      }
      /**
       * 空スライドを1p目に追加する
       * 重複して追加しないように、空スライドが存在しない場合のみ追加する
       */
      prependFirstEmptySlide() {
          const firstSlide = this.swiper.slides[0];
          if (!firstSlide)
              return;
          const emptySlide = this.builder.classNames.emptySlide;
          const hasEmptySlide = firstSlide.classList.contains(emptySlide);
          if (!hasEmptySlide) {
              const emptyEl = this.builder.createEmptySlideEl();
              this.swiper.prependSlide(emptyEl);
              // 縦読み時のみの処理
              if (this.state.isVertView) {
                  // emptySlideはdisplay:noneを指定しているため
                  // 縦読みモードでは計算にいれずともよい
                  // そのため追加した要素分1つ後ろにずらしている
                  const idx = this.swiper.activeIndex - 1;
                  this.swiper.slideTo(idx);
              }
              // this.swiper.updateSlides();
              // this.swiper.updateProgress();
          }
      }
      /**
       * 最終p空白スライドを削除する
       */
      removeLastEmptySlide() {
          if (this.swiper.slides.length === 0)
              return;
          const lastIdx = this.swiper.slides.length - 1;
          const lastSlide = this.swiper.slides[lastIdx];
          const emptySlide = this.builder.classNames.emptySlide;
          const hasEmptySlide = lastSlide.classList.contains(emptySlide);
          if (hasEmptySlide) {
              this.swiper.removeSlide(lastIdx);
          }
          // this.swiper.updateSlides();
          // this.swiper.updateProgress();
      }
      /**
       * 最終pに空白スライドを追加する
       */
      appendLastEmptySlide() {
          if (this.swiper.slides.length === 0)
              return;
          const lastIdx = this.swiper.slides.length - 1;
          const lastSlide = this.swiper.slides[lastIdx];
          const emptySlide = this.builder.classNames.emptySlide;
          const hasEmptySlide = lastSlide.classList.contains(emptySlide);
          if (!hasEmptySlide) {
              const emptyEl = this.builder.createEmptySlideEl();
              this.swiper.appendSlide(emptyEl);
              const isMove = this.swiper.activeIndex !== 0;
              if (!this.state.isVertView && isMove) {
                  const idx = this.swiper.activeIndex + 2;
                  this.swiper.slideTo(idx);
              }
              // this.swiper.updateSlides();
              // this.swiper.updateProgress();
          }
      }
      /**
       * 入力したMouseEventが
       * mangaViewer画面のクリックポイントに重なっているかを返す
       *
       * 横読み時   : 左側クリックで進む、右側クリックで戻る
       * 横読みLTR時: 右側クリックで進む、左側クリックで戻る
       * 縦読み時   : 下側クリックで進む、上側クリックで戻る
       *
       * @param  e mouse event
       * @return   [次に進むクリックポイントに重なっているか, 前に戻るクリックポイントに重なっているか]
       */
      getClickPoint(e) {
          const { l, t, w, h } = this.state.swiperRect;
          const [x, y] = [e.clientX - l, e.clientY - t];
          let [isNextClick, isPrevClick] = [false, false];
          if (this.state.isVertView) {
              // 縦読み時処理
              isNextClick = y > h * 0.80;
              isPrevClick = y < h * 0.20;
          }
          else if (this.state.isLTR) {
              // 横読みLTR時処理
              isNextClick = x > w * 0.80;
              isPrevClick = x < w * 0.20;
          }
          else {
              // 通常横読み時処理
              isNextClick = x < w * 0.20;
              isPrevClick = x > w * 0.80;
          }
          return [isNextClick, isPrevClick];
      }
      /**
       * mangaViewer画面をクリックした際のイベントハンドラ
       *
       * クリック判定基準についてはgetClickPoint()を参照のこと
       *
       * @param  e  mouse event
       */
      slideClickHandler(e) {
          const [isNextClick, isPrevClick] = this.getClickPoint(e);
          if (isNextClick && !this.swiper.isEnd) {
              // 進めるページがある状態で進む側をクリックした際の処理
              this.swiper.slideNext();
              this.hideViewerUI();
          }
          else if (isPrevClick && !this.swiper.isBeginning) {
              // 戻れるページがある状態で戻る側をクリックした際の処理
              // freeModeでslidePrev()を使うとなんかバグがあるっぽいので
              // 手動計算して動かす
              const idx = (this.swiper.activeIndex !== 0)
                  ? this.swiper.activeIndex - 1
                  : 0;
              this.swiper.slideTo(idx);
              this.hideViewerUI();
          }
          else {
              this.toggleViewerUI();
          }
      }
      /**
       * クリックポイント上にマウス座標が重なっていたならマウスホバー処理を行う
       * @param  e  mouse event
       */
      slideMouseHoverHandler(e) {
          const [isNextClick, isPrevClick] = this.getClickPoint(e);
          const { nextPage, prevPage } = this.el.buttons;
          const active = this.builder.stateNames.active;
          const { controllerEl, swiperEl } = this.el;
          /**
           * swiperElとcontrollerElにおける
           * カーソル状態を一括設定する
           * @param isPointer trueならばポインターが乗っかっている状態とみなす
           */
          const setCursorStyle = (isPointer) => {
              const cursor = (isPointer) ? "pointer" : "";
              controllerEl.style.cursor = cursor;
              swiperEl.style.cursor = cursor;
          };
          if (isNextClick && !this.swiper.isEnd) {
              // 進めるページがある状態で進む側クリックポイントと重なった際の処理
              nextPage.classList.add(active);
              setCursorStyle(true);
          }
          else if (isPrevClick && !this.swiper.isBeginning) {
              // 戻れるページがある状態で戻る側クリックポイントと重なった際の処理
              prevPage.classList.add(active);
              setCursorStyle(true);
          }
          else {
              // どちらでもない場合の処理
              nextPage.classList.remove(active);
              prevPage.classList.remove(active);
              setCursorStyle(false);
          }
      }
      /**
       * ページ送りボタンの表示/非表示設定を切り替えるハンドラ
       *
       * disablePagination()で強制非表示化がなされている場合は
       * どうあがいても非表示となる
       */
      changePaginationVisibility() {
          const hidden = this.builder.stateNames.hidden;
          const { prevPage, nextPage } = this.el.buttons;
          const { isBeginning, isEnd } = this.swiper;
          if (isBeginning) {
              prevPage.classList.add(hidden);
          }
          else {
              prevPage.classList.remove(hidden);
          }
          if (isEnd) {
              nextPage.classList.add(hidden);
          }
          else {
              nextPage.classList.remove(hidden);
          }
      }
      /**
       * ビューワー操作UIをトグルさせる
       */
      toggleViewerUI() {
          this.el.rootEl.classList.toggle(this.builder.stateNames.visibleUI);
      }
      /**
       * ビューワー操作UIを非表示化する
       */
      hideViewerUI() {
          const stateName = this.builder.stateNames.visibleUI;
          if (this.el.rootEl.classList.contains(stateName)) {
              this.el.rootEl.classList.remove(stateName);
          }
      }
      /**
       * mangaViewer表示を更新する
       * 主にswiperの表示を更新するための関数
       */
      viewUpdate() {
          if (!this.el) {
              console.error("this.elが定義前に呼び出された");
              return;
          }
          this.state.swiperRect = this.swiperElRect;
          this.cssPageSizeUpdate();
          this.cssPageRealSizeUpdate();
          if (this.thumbs)
              this.thumbs.cssThumbsWrapperWidthUpdate(this.el.rootEl);
          if (this.zoom)
              this.zoom.updateZoomRect();
          if (this.swiper)
              this.swiper.update();
      }
      /**
       * 全画面化ボタンのイベントハンドラ
       *
       * 非全画面状態ならば全画面化させて、
       * 全画面状態であるならそれを解除する
       */
      fullscreenHandler() {
          // フルスクリーン切り替え後に呼び出される関数
          const postToggleFullscreen = () => {
              if (!screenfull.isEnabled)
                  return;
              const fsClass = this.builder.stateNames.fullscreen;
              if (screenfull.isFullscreen) {
                  // 全画面有効時
                  this.el.rootEl.classList.add(fsClass);
              }
              else {
                  // 通常時
                  this.el.rootEl.classList.remove(fsClass);
              }
              this.swiper.slideTo(this.swiper.activeIndex);
              this.viewUpdate();
          };
          if (screenfull.isEnabled) {
              screenfull.toggle(this.el.rootEl)
                  // 0.1秒ウェイトを取る
                  .then(() => sleep(150))
                  // フルスクリーン切り替え後処理
                  .then(() => postToggleFullscreen());
          }
      }
      /**
       * css変数として表示可能ページ最大サイズを登録する
       */
      cssPageSizeUpdate() {
          const { w: aw, h: ah } = this.state.pageAspect;
          const { offsetWidth: ow, offsetHeight: oh } = this.el.rootEl;
          // deduct progressbar size from rootElSize
          const [dw, dh] = [
              ow - this.state.progressBarWidth,
              oh - this.state.progressBarWidth
          ];
          const paddingNum = this.state.viewerPadding * 2;
          let { w: pageWidth, h: pageHeight } = this.state.pageSize;
          // 横読み時にはプログレスバー幅を差し引いた縦幅を計算に使い、
          // 縦読み時はプログレスバー幅を差し引いた横幅を計算に使う
          if (!this.state.isVertView && ow < pageWidth * 2
              || dw > pageWidth && oh < pageHeight) {
              // 横読み時または縦読み時で横幅が狭い場合でのサイズ計算
              const h = dh - paddingNum;
              pageWidth = Math.round(h * aw / ah);
              pageHeight = Math.round(pageWidth * ah / aw);
          }
          else if (oh < pageHeight) {
              // 縦読み時で縦幅が狭い場合のサイズ計算
              const w = dw - paddingNum;
              pageHeight = Math.round(w * ah / aw);
              pageWidth = Math.round(pageHeight * aw / ah);
          }
          this.el.rootEl.style.setProperty("--page-width", pageWidth + "px");
          this.el.rootEl.style.setProperty("--page-height", pageHeight + "px");
      }
      /**
       * プログレスバーの太さ数値をcss変数に登録する
       */
      cssProgressBarWidthUpdate() {
          this.el.rootEl.style.setProperty("--progressbar-width", this.state.progressBarWidth + "px");
      }
      /**
       * viewerPadding数値をcss変数に登録する
       */
      cssViewerPaddingUpdate() {
          this.el.rootEl.style.setProperty("--viewer-padding", this.state.viewerPadding + "px");
      }
      /**
       * 各スライドの実質サイズをcss変数に登録する
       */
      cssPageRealSizeUpdate() {
          const { w: aw, h: ah } = this.state.pageAspect;
          const { clientWidth: cw, clientHeight: ch } = this.el.swiperEl;
          let width = cw / 2;
          let height = width * ah / aw;
          if (this.state.isVertView || !this.isDoubleSlideHorizView) {
              height = ch;
              width = height * aw / ah;
          }
          this.el.rootEl.style.setProperty("--page-real-width", width + "px");
          this.el.rootEl.style.setProperty("--page-real-height", height + "px");
      }
      // NOTE: 今は使用していないのでコメントアウト
      //
      // private cssPageAspectUpdate() {
      //   const {w: aw, h: ah} = this.state.pageAspect;
      //   this.el.rootEl.style.setProperty("--page-aspect-width", aw.toString());
      //   this.el.rootEl.style.setProperty("--page-aspect-height", ah.toString());
      // }
      cssJsVhUpdate() {
          calcWindowVH(this.el.rootEl);
      }
      /**
       * mangaViewerと紐付いたrootElを表示する
       */
      showRootEl() {
          this.el.rootEl.style.opacity = "1";
          this.el.rootEl.style.visibility = "visible";
      }
      /**
       * mangaViewerと紐付いたrootElを非表示にする
       */
      hideRootEl() {
          this.el.rootEl.style.opacity = "";
          this.el.rootEl.style.visibility = "";
      }
      /**
       * body要素のスクロールを停止させる
       */
      disableBodyScroll() {
          const docEl = document.documentElement;
          this.state.bodyScrollTop = docEl.scrollTop;
          docEl.style.overflowY = "hidden";
          document.body.style.overflowY = "hidden";
      }
      /**
       * body要素のスクロールを再開させる
       */
      enableBodyScroll() {
          const docEl = document.documentElement;
          docEl.style.overflowY = "";
          document.body.style.overflowY = "";
          sleep(1).then(() => {
              // 次のプロセスへと移してから
              // スクロール状況を復帰させる
              docEl.scrollTop = this.state.bodyScrollTop;
          });
      }
      /**
       * ページ送りボタンを強制的非表示化する
       * ステート状態をいじるのはバグの元なので直書きで非表示化する
       */
      disablePagination() {
          const { prevPage, nextPage } = this.el.buttons;
          prevPage.style.display = "none";
          nextPage.style.display = "none";
      }
      /**
       * ページ送りボタン強制的非表示化を解除する
       * 直書きでのstyle付与を無くす
       */
      enablePagination() {
          const { prevPage, nextPage } = this.el.buttons;
          prevPage.style.display = "";
          nextPage.style.display = "";
      }
      /**
       * pageSizeと関連する部分を一挙に設定する
       * @param  width  新たなページ横幅
       * @param  height 新たなページ縦幅
       */
      setPageSize(width, height) {
          this.state.pageSize = {
              w: width,
              h: height,
          };
          const gcd = calcGCD(width, height);
          this.state.pageAspect = {
              w: width / gcd,
              h: height / gcd,
          };
          this.state.thresholdWidth = width;
      }
      /**
       * orientationcange eventに登録する処理
       */
      orientationChange() {
          const orientation = getDeviceOrientation();
          this.state.deviceOrientation = orientation;
          // PC、または縦読みモードの際は早期リターン
          if (!this.state.isMobile || this.state.isVertView)
              return;
          const idx = (this.swiper) ? this.swiper.activeIndex : 0;
          if (orientation === "landscape") {
              // 横画面処理
              this.reinitSwiperInstance(this.swiper2pHorizViewConf, idx);
          }
          else {
              // 縦画面処理
              this.reinitSwiperInstance(this.swiperResponsiveHorizViewConf, idx);
          }
          this.switchSingleSlideState();
      }
  }

  // 複数ビューワーを一括登録したり、
  // html側から情報を読み取ってビューワー登録したりするためのclass
  class LaymicApplicator {
      constructor(selector = ".laymic_template", laymicOptions = {}) {
          // laymic instanceを格納するMap object
          this.laymicMap = new Map();
          const applicatorOptions = (typeof selector === "string")
              ? Object.assign(this.defaultLaymicApplicatorOptions, { templateSelector: selector })
              : Object.assign(this.defaultLaymicApplicatorOptions, selector);
          // laymic templateの配列
          const elements = Array.from(document.querySelectorAll(applicatorOptions.templateSelector) || []);
          // laymic展開イベントを登録するopener配列
          const openers = Array.from(document.querySelectorAll(applicatorOptions.openerSelector) || []);
          // templateになるhtml要素から必要な情報を抜き出す
          elements.forEach(el => this.applyLaymicInstance(el, laymicOptions));
          // openerのdata-for属性がlaymic viewerIdと紐付いている場合
          // クリック時に当該viewerを展開するイベントを登録する
          openers.forEach(el => {
              if (!(el instanceof HTMLElement))
                  return;
              const dataFor = el.dataset.for || "laymic";
              if (!this.laymicMap.has(dataFor))
                  return;
              el.addEventListener("click", () => {
                  this.open(dataFor);
              });
          });
      }
      get defaultLaymicApplicatorOptions() {
          return {
              templateSelector: ".laymic_template",
              openerSelector: ".laymic_opener",
              defaultViewerId: "laymic",
          };
      }
      applyLaymicInstance(el, initOptions) {
          if (!(el instanceof HTMLElement))
              return;
          const viewerId = el.dataset.viewerId;
          const progressBarWidth = (isBarWidth(el.dataset.progressBarWidth))
              ? el.dataset.progressBarWidth
              : undefined;
          const viewerDirection = (el.dataset.viewerDirection === "vertical") ? "vertical" : undefined;
          const isVisiblePagination = compareString(el.dataset.isVisiblePagination || "", "true", true);
          const isFirstSlideEmpty = compareString(el.dataset.isFirstSlideEmpty || "", "false", false);
          const isInstantOpen = compareString(el.dataset.isInstantOpen || "", "false", false);
          const isLTR = compareString(el.dir, "ltr", true);
          const options = {
              viewerId,
              progressBarWidth,
              viewerDirection,
              isFirstSlideEmpty,
              isInstantOpen,
              isVisiblePagination,
              isLTR,
          };
          {
              // わかりやすくスコープを分けておく
              const pageWidth = parseInt(el.dataset.pageWidth || "", 10);
              const pageHeight = parseInt(el.dataset.pageHeight || "", 10);
              const vertPageMargin = parseInt(el.dataset.vertPageMargin || "", 10);
              const horizPageMargin = parseInt(el.dataset.horizPageMargin || "", 10);
              const viewerPadding = parseInt(el.dataset.viewerPadding || "", 10);
              if (isFinite(pageWidth))
                  options.pageWidth = pageWidth;
              if (isFinite(pageHeight))
                  options.pageHeight = pageHeight;
              if (isFinite(vertPageMargin))
                  options.vertPageMargin = vertPageMargin;
              if (isFinite(horizPageMargin))
                  options.horizPageMargin = horizPageMargin;
              if (isFinite(viewerPadding))
                  options.viewerPadding = viewerPadding;
          }
          const pageEls = Array.from(el.children).filter(el => el.tagName.toLowerCase() !== "br");
          const pages = pageEls.map(childEl => {
              let result = childEl;
              if (childEl instanceof HTMLImageElement) {
                  const src = childEl.dataset.src || childEl.src || "";
                  result = src;
              }
              return result;
          });
          const thumbs = pageEls.map(childEl => {
              return (childEl instanceof HTMLElement)
                  ? childEl.dataset.thumbSrc || ""
                  : "";
          });
          const laymicPages = {
              pages,
              thumbs
          };
          // JSON.stringifyを経由させてundefined部分を抹消する
          const opts = Object.assign({}, initOptions, JSON.parse(JSON.stringify(options)));
          this.laymicMap.set(viewerId || "laymic", new Laymic(laymicPages, opts));
      }
      open(viewerId) {
          const laymic = this.laymicMap.get(viewerId);
          if (laymic) {
              laymic.open();
          }
          else {
              console.warn(`LaymicApplicator: ${viewerId} と紐づくlaymic instanceが存在しない`);
          }
      }
      close(viewerId) {
          const laymic = this.laymicMap.get(viewerId);
          if (laymic) {
              laymic.close();
          }
          else {
              console.warn(`LaymicApplicator: ${viewerId} と紐づくlaymic instanceが存在しない`);
          }
      }
  }

  exports.Laymic = Laymic;
  exports.LaymicApplicator = LaymicApplicator;

  return exports;

}({}));
