//  Stilt.js 0.1.0
//  https://github.com/flovan/stilt
//  (c) 2015-whateverthecurrentyearis Florian Vanthuyne
//  Stilt may be freely distributed under the MIT license.

(function(window){

	window.Stilt = window.Stilt || function () {

		// Private variables
		//

		var 
			elms = {},
			resizeElm = window,
			hasResize = false,
			minWidth = 0,
			previousWindowWidth = 0
		;

		// A simplified subset of Underscore.js functions
		// https://github.com/jashkenas/underscore

		// Get the current timestamp as integer
		var now = Date.now || function() {
			return new Date().getTime();
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

		// Private functions
		//

		// Removes all non-letter characters from a selector
		var selectorToProperty = function (selector) {
			return selector.replace(/[^a-zA-Z]/g,'');
		};

		// Binds a `resize` eventlistener to the resize element, but only
		// if it hasn't been added before. This also always triggers the
		// `resize` event
		var bindResize = function () {
			if (!hasResize) {
				try {
					resizeElm.addEventListener('resize', throttle(resizeHandler, 50));
				} catch (e) {
					resizeElm.attachEvent('onresize', throttle(resizeHandler, 50));
				}
				hasResize = true;
			}
			resizeHandler.apply(window);
			return;
		};

		// Remove the listener for the `resize` event from the resize element
		var unbindResize = function () {
			resizeElm.removeEventListener('resize');
			hasResize = false;
		}

		// The handler function for the `resize` event.
		// This checks if the minimum width is available, and then loops over
		// all elements, finding the largest height and applying that height
		// again to all elements. If the minimum width is not met, elements
		// are reset.
		var resizeHandler = function (e) {
			var windowWidth = Math.max(
					document.body.offsetWidth || 0,
					document.documentElement.offsetWidth || 0,
					window.innerWidth || 0
			);

			if (windowWidth >= minWidth) {
				if (windowWidth > previousWindowWidth) {
					resetElements();
				}

				for (var groupKey in elms) {
					var elmsGroup = elms[groupKey],
						len = elmsGroup.length,
						maxSize = 0;

					for (var i = 0; i < len; i++) {
						var
							elm = elmsGroup[i],
							elmSize = Math.max(
								elm.clientHeight,
								elm.offsetHeight,
								elm.scrollHeight
							)
						;

						maxSize = maxSize > elmSize ? maxSize : elmSize;
					}
					for (var i = 0; i < len; i++) {
						var
							elm = elmsGroup[i],
							elmSize = Math.max(
								elm.clientHeight,
								elm.offsetHeight,
								elm.scrollHeight
							)
						;

						if (maxSize !== elmSize) {
							elmsGroup[i].style.height = maxSize + 'px';
						}
					}
				}
			} else {
				resetElements();
			}

			previousWindowWidth = windowWidth;
		};

		// Resets all elements by removing the applied height
		var resetElements = function () {
			for (var groupKey in elms) {
				var elmsGroup = elms[groupKey];

				for (var i = 0, len = elmsGroup.length, elm; i < len; i++) {
					elmsGroup[i].style.height = 'inherit';
				}
			}
		};

		// Public API

		return {

			// Synchronise the height of all elements matching the passed in
			// selector
			sync: function (selector) {
				if (selector === undefined) {
					console.error('`Stilt.sync()` requires a String selector.');
					return;
				}
				elms[selectorToProperty(selector)] = document.querySelectorAll(selector);
				bindResize();
			},

			// Release all elements that were previously synced through
			// the passed in selector
			release: function (elements) {
				var prop = selectorToProperty(elements.selector);
				if (elms[prop] !== undefined) {
					delete elms[prop];
				}
				bindResize();
			},

			// Set the minimum width used by any synced elements
			setMinimumWidth: function (w) {
				if (w === undefined || w !== parseInt(w, 10)) {
					console.error('`Stilt.setMinimumWidth()` requires an Integer value.');
					return;
				}
				minWidth = w;
			},

			// Set the target used to listen for resizes
			/*setResizeTarget: function (selector) {
				if (selector === undefined || !(typeof selector == 'string' || myVar selector String)) {
					console.error('`Stilt.setResizeTarget()` requires a String selector.');
					return;
				}

				unbindResize();
				resizeElm = document.querySelector(selector) || resizeElm;
				bindResize();
			}*/
		};
	}();
}(window));