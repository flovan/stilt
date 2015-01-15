;(function(window){

	window.Stilt = window.Stilt || function () {

		// Private vars
		//

		var elms = {},
			hasResize = false,
			minWidth = 0;

		// Simplified subset of Underscore.js functions
		// https://github.com/jashkenas/underscore
		var _ = function () {
			var optimizeCb = function(func, context, argCount) {
					if (context === void 0) return func;
					switch (argCount == null ? 3 : argCount) {
						case 1: return function(value) {
							return func.call(context, value);
						};
						case 2: return function(value, other) {
							return func.call(context, value, other);
						};
						case 3: return function(value, index, collection) {
							return func.call(context, value, index, collection);
						};
						case 4: return function(accumulator, value, index, collection) {
							return func.call(context, accumulator, value, index, collection);
						};
					}
					return function() {
						return func.apply(context, arguments);
					};
				},
				nativeKeys = Object.keys,
				nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString',
					'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'],
				collectNonEnumProps = function (obj, keys) {
					var nonEnumIdx = nonEnumerableProps.length;
					var proto = typeof obj.constructor === 'function' ? FuncProto : ObjProto;

					while (nonEnumIdx--) {
						var prop = nonEnumerableProps[nonEnumIdx];
						if (prop === 'constructor' ? _.has(obj, prop) : prop in obj &&
							obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
							keys.push(prop);
						}
					}
				};

			return {
				debounce: function (func, wait, immediate) {
					var timeout, args, context, timestamp, result;

					var later = function() {
						var last = _.now() - timestamp;

						if (last < wait && last >= 0) {
							timeout = setTimeout(later, wait - last);
						} else {
							timeout = null;
							if (!immediate) {
								result = func.apply(context, args);
								if (!timeout) context = args = null;
							}
						}
					};

					return function() {
						context = this;
						args = arguments;
						timestamp = _.now();
						var callNow = immediate && !timeout;
						if (!timeout) timeout = setTimeout(later, wait);
						if (callNow) {
							result = func.apply(context, args);
							context = args = null;
						}

						return result;
					}
				},
				each: function(obj, iteratee, context) {
					if (obj == null) return obj;
					iteratee = optimizeCb(iteratee, context);
					var i, length = obj.length;
					if (length === +length) {
						for (i = 0; i < length; i++) {
							iteratee(obj[i], i, obj);
						}
					} else {
						var keys = _.keys(obj);
						for (i = 0, length = keys.length; i < length; i++) {
							iteratee(obj[keys[i]], keys[i], obj);
						}
					}
					return obj;
				},
				now: Date.now || function() {
					return new Date().getTime();
				},
				keys: function(obj) {
					if (!_.isObject(obj)) return [];
					if (nativeKeys) return nativeKeys(obj);
					var keys = [];
					for (var key in obj) if (_.has(obj, key)) keys.push(key);
					// Ahem, IE < 9.
					if (hasEnumBug) collectNonEnumProps(obj, keys);
					return keys;
				},
				isObject: function(obj) {
					var type = typeof obj;
					return type === 'function' || type === 'object' && !!obj;
				},
				has: function(obj, key) {
					return obj != null && hasOwnProperty.call(obj, key);
				}
			};
		}();

		// Private functions
		//



		function dispatch (targetEl, eventString, opts) {
			var evt;
			opts = opts || { bubbles: true, cancelable: true };

			if(!targetEl.dispatchEvent) {
				console.error('Helper `dispatch()` requires an element object.');
				return;
			}
			if (!!window.CustomEvent) {
				evt = new CustomEvent(eventString, opts);
			} else {
				evt = document.createEvent('Event');
				evt.initEvent(eventString, opts.bubbles, opts.cancelable);
			}
			targetEl.dispatchEvent(evt);
		}

		function selectorToProperty (selector) {
			return selector.replace(/[^a-zA-Z]/g,'');
		}

		function bindResize () {
			if (!hasResize) {
				window.addEventListener('resize', _.debounce(resizeHandler, 50));
				hasResize = true;
			}
			dispatch(window, 'resize');
			return;
		}

		function resizeHandler (e) {
			if (window.innerWidth >= minWidth) {
				_.each(elms, function (elmsGroup, groupKey) {
					var maxSize = 0;

					_.each(elmsGroup, function (elm, key) {
						var elmSize = Math.max(
							elm.clientHeight,
							elm.offsetHeight,
							elm.scrollHeight
						);
						console.log(elmSize);
						maxSize = maxSize > elmSize ? maxSize : elmSize;
					});
					console.log(maxSize);
					_.each(elmsGroup, function (elm, key) {
						elm.style.height = maxSize + 'px';
					});
				});
			} else {
				resetElements();
			}
		}

		function resetElements () {
			_.each(elms, function (elmsGroup, groupKey) {
				_.each(elmsGroup, function (elm, key) {
					elm.style.height = 'inherit';
				});
			});
		}

		// Public API

		return {
			sync: function (selector) {
				if (selector === undefined) {
					console.error('`Stilt.sync()` requires a String selector.');
					return;
				}
				elms[selectorToProperty(selector)] = document.querySelectorAll(selector);
				bindResize();
			},

			release: function (elements) {
				var prop = selectorToProperty(elements.selector);
				if (elms[prop] !== undefined) {
					delete elms[prop];
				}
				bindResize();
			},

			setMinimumWidth: function (w) {
				minWidth = w;
			}
		};
	}();
}(window))