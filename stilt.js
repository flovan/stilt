//  Stilt.js 2.0.0
//  https://github.com/flovan/stilt
//  (c) 2015-whateverthecurrentyearis Florian Vanthuyne
//  Stilt may be freely distributed under the MIT license.

(function (w) {

	///////////////////////////////////////////////////////////////////////////
	//                                                                       //
	// IE POLYFILLS                                                          //
	//                                                                       //
	///////////////////////////////////////////////////////////////////////////

	// Map console to empty function to prevent page errors
	w.console = w.console || {
		error: function () {},
		warn: function () {}
	}

	// Add a `hasOwnProperty()` method on window if there is none
	window.hasOwnProperty = window.hasOwnProperty || Object.prototype.hasOwnProperty;

	// Add `.bind()` to functions if there is none
	// https://github.com/enyo/functionbind
	if (!Function.prototype.bind) {
		Function.prototype.bind = function (oThis) {
			if (typeof this !== "function") {
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}
	 
			var aArgs = Array.prototype.slice.call(arguments, 1),
				fToBind = this, 
				fNOP = function () {},
				fBound = function () {
					return fToBind.apply((this instanceof fNOP && oThis ? this : oThis), aArgs.concat(Array.prototype.slice.call(arguments)));
				};
	 
			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();
	 
			return fBound;
		};
	}

	///////////////////////////////////////////////////////////////////////////
	//                                                                       //
	// Constructor                                                           //
	//                                                                       //
	///////////////////////////////////////////////////////////////////////////

	var Stilt = function (selector, opts) {

		// Shield for undefined selector
		if (typeof selector !== 'string') {
			console.error('Stilt warning: selector should be a String.');
			return;
		}

		// PRIVATE VARS

		var
			_self                = this,
			_elms                = document.querySelectorAll(selector),
			_numElms             = _elms.length,
			_hasResize           = false,
			_listenerCallback    = null,
			_previousWindowWidth = 0,
			_referenceElm        = null,
			_defaults            = {
				minWidth:       0,
				maxWidth:       null,
				throttleDelay:  50,
				referenceElm:   null
			},
			_settings            = {}
		;

		// Merge settings
		opts = opts || {};
		_settings = extend(_settings, _defaults, opts);

		// Grab the reference element if there is one
		if (typeof _settings.referenceElm === 'string') {
			_referenceElm = document.querySelector(_settings.referenceElm);

			// If no element was matched, stop working and log an error
			if (_referenceElm === null) {
				console.error('Stilt warning: the reference element selector `' + _settings.referenceElm + '` did not match any elements.');
				return;
			}
		}

		// Log a warning if the plugin won't actually be doing anything
		if (_numElms === 0) {
			console.warn('Stilt warning: selector "' + selector + '" did not match any elements.');
		}

		// Log an error if minWidth is not numerical
		if (typeof _settings.minWidth !== 'number') {
			console.error('Stilt warning: `minWidth` (' + _settings.minWidth + ') should be a Number.');
			return;
		}

		// If we have a maxWidth passed in
		if (_settings.maxWidth !== null) {
			// Log an error if its not numerical
			if (typeof _settings.maxWidth !== 'number') {
				console.error('Stilt warning: `maxWidth` (' + _settings.maxWidth + ') should be a Number.');
				return;
			}

			// Log an error if it'ss smaller than the minWidth
			if (_settings.maxWidth < _settings.minWidth) {
				console.error('Stilt warning: `maxWidth` (' + _settings.maxWidth + ') should be larger than `minWidth` (' + _settings.minWidth + ').');
				return;
			}
		}

		// Log an error if throttleDelay is not numerical
		if (typeof _settings.throttleDelay !== 'number') {
			console.error('Stilt warning: `throttleDelay` (' + _settings.throttleDelay + ') should be a Number.');
			return;
		}

		// PRIVATE FUNCTIONS

		// Adds a resize listener to the window
		var _addWindowListener = function () {
			// Stop early if there's already a listener attached
			if (_hasResize) {
				return;
			}

			// Make a throttled callback if there is none
			if (_listenerCallback === null) {
				_listenerCallback = throttle(_windowResizeHandler.bind(this), _settings.throttleDelay);
			}

			// Try adding a listener for modern browsers,
			// then IE
			try {
				w.addEventListener('resize', _listenerCallback);
			} catch (e) {
				w.attachEvent('onresize', _listenerCallback);
			}

			// Toggle the flag
			_hasResize = true;

			// Call the handler
			_self.calc();
		};

		// Removes the resize listener from the window
		var _removeWindowListener = function () {
			if (_hasResize) {
				try {
					w.removeEventListener('resize', _listenerCallback);
				} catch (e) {
					w.detachEvent('onresize', _listenerCallback);
				}

				// Toggle the flag
				_hasResize = false;
			}
		};

		// A handler for window resizes
		var _windowResizeHandler = function (e) {
			var 
				windowWidth = Math.max(
					document.body.offsetWidth || 0,
					document.documentElement.offsetWidth || 0,
					w.innerWidth || 0
				),
				currElHeight = 0,
				elMaxHeight = 0
			;

			// If we're within the boundaries, sync heights
			if (windowWidth >= _settings.minWidth && (!!_settings.maxWidth ? windowWidth <= _settings.maxWidth : true)) {
				// Some other script might have triggered a resize,
				// so skip if we're still at the same width
				if (windowWidth === _previousWindowWidth) {
					return;
				}

				// Reset the height of all elements
				_resetElements();

				// If we have a reference elements, grab its size
				if (_referenceElm !== null) {
					elMaxHeight = _getHeight(_referenceElm);
				} else {
					// Otherwise, loop over target elements to find the height
					for (var i = 0, elm; i < _numElms; i++) {
						elm = _elms[i];
						currElHeight = _getHeight(elm);

						elMaxHeight = elMaxHeight > currElHeight ? elMaxHeight : currElHeight;
					}
				}

				// Set the height of all the elements
				for (var i = 0, elm; i < _numElms; i++) {
					elm = _elms[i];
					currElHeight = _getHeight(elm);

					if (elMaxHeight !== currElHeight) {
						_elms[i].style.height = elMaxHeight + 'px';
					}
				}
			} else {
				// Otherwise reset elements
				_resetElements();
			}

			_previousWindowWidth = windowWidth;
		};

		// Gets the height of an element
		var _getHeight = function (elm) {
			return Math.max(
				elm.clientHeight,
				elm.offsetHeight,
				elm.scrollHeight
			);
		}

		// Resets all elements by removing the applied height
		var _resetElements = function () {
			for (var i = 0, len = _elms.length; i < len; i++) {
				_elms[i].style.height = '';
			}
		};

		// PUBLIC FUNCTIONS

		this.sync = function () {
			_addWindowListener();
			return this;
		};

		this.calc = function () {
			_listenerCallback.apply(this);
			return this;
		};

		this.release = function () {
			_removeWindowListener();
			_resetElements();
			return this;
		};

		return this;
	};

	///////////////////////////////////////////////////////////////////////////
	//                                                                       //
	// LIBS                                                                  //
	//                                                                       //
	// A simplified subset of Underscore.js functions                        //
	// https://github.com/jashkenas/underscore                               //
	//                                                                       //
	///////////////////////////////////////////////////////////////////////////

	// Get the current timestamp as integer
	var now = Date.now || function() {
		return new Date().getTime();
	};

	// Extends an object with another object
	var extend = function(obj) {
		if (!isObject(obj)) return obj;
		var source, prop;
		for (var i = 1, length = arguments.length; i < length; i++) {
			source = arguments[i];
			for (prop in source) {
				if (hasOwnProperty.call(source, prop)) {
					obj[prop] = source[prop];
				}
			}
		}
		return obj;
	};

	// Checks if a variable is an object
	var isObject = function(obj) {
		var type = typeof obj;
		return type === 'function' || type === 'object' && !!obj;
	};

	// Trigger the passed function only once during the
	// passed in wait period
	var throttle = function(func, wait, options) {
		var context, args, result;
		var timeout = null;
		var previous = 0;
		if (!options) options = {};
		var later = function() {
			previous = options.leading === false ? 0 : now();
			timeout = null;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		};
		return function() {
			var rightNow = now();
			if (!previous && options.leading === false) previous = rightNow;
			var remaining = wait - (rightNow - previous);
			context = this;
			args = arguments;
			if (remaining <= 0 || remaining > wait) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				previous = rightNow;
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		};
	};

	w.Stilt = w.Stilt || Stilt;
}(window));