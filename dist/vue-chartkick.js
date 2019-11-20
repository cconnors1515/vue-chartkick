/*
 * Vue Chartkick
 * Create beautiful JavaScript charts with one line of Vue
 * https://github.com/ankane/vue-chartkick
 * v0.6.2
 * MIT License
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('chartkick')) :
	typeof define === 'function' && define.amd ? define(['chartkick'], factory) :
	(global = global || self, global.VueChartkick = factory(global.Chartkick));
}(this, (function (Chartkick) { 'use strict';

	Chartkick = Chartkick && Chartkick.hasOwnProperty('default') ? Chartkick['default'] : Chartkick;

	var toStr = Object.prototype.toString;

	var isArguments = function isArguments(value) {
		var str = toStr.call(value);
		var isArgs = str === '[object Arguments]';
		if (!isArgs) {
			isArgs = str !== '[object Array]' &&
				value !== null &&
				typeof value === 'object' &&
				typeof value.length === 'number' &&
				value.length >= 0 &&
				toStr.call(value.callee) === '[object Function]';
		}
		return isArgs;
	};

	var keysShim;
	if (!Object.keys) {
		// modified from https://github.com/es-shims/es5-shim
		var has = Object.prototype.hasOwnProperty;
		var toStr$1 = Object.prototype.toString;
		var isArgs = isArguments; // eslint-disable-line global-require
		var isEnumerable = Object.prototype.propertyIsEnumerable;
		var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
		var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
		var dontEnums = [
			'toString',
			'toLocaleString',
			'valueOf',
			'hasOwnProperty',
			'isPrototypeOf',
			'propertyIsEnumerable',
			'constructor'
		];
		var equalsConstructorPrototype = function (o) {
			var ctor = o.constructor;
			return ctor && ctor.prototype === o;
		};
		var excludedKeys = {
			$applicationCache: true,
			$console: true,
			$external: true,
			$frame: true,
			$frameElement: true,
			$frames: true,
			$innerHeight: true,
			$innerWidth: true,
			$onmozfullscreenchange: true,
			$onmozfullscreenerror: true,
			$outerHeight: true,
			$outerWidth: true,
			$pageXOffset: true,
			$pageYOffset: true,
			$parent: true,
			$scrollLeft: true,
			$scrollTop: true,
			$scrollX: true,
			$scrollY: true,
			$self: true,
			$webkitIndexedDB: true,
			$webkitStorageInfo: true,
			$window: true
		};
		var hasAutomationEqualityBug = (function () {
			/* global window */
			if (typeof window === 'undefined') { return false; }
			for (var k in window) {
				try {
					if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
						try {
							equalsConstructorPrototype(window[k]);
						} catch (e) {
							return true;
						}
					}
				} catch (e) {
					return true;
				}
			}
			return false;
		}());
		var equalsConstructorPrototypeIfNotBuggy = function (o) {
			/* global window */
			if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
				return equalsConstructorPrototype(o);
			}
			try {
				return equalsConstructorPrototype(o);
			} catch (e) {
				return false;
			}
		};

		keysShim = function keys(object) {
			var isObject = object !== null && typeof object === 'object';
			var isFunction = toStr$1.call(object) === '[object Function]';
			var isArguments = isArgs(object);
			var isString = isObject && toStr$1.call(object) === '[object String]';
			var theKeys = [];

			if (!isObject && !isFunction && !isArguments) {
				throw new TypeError('Object.keys called on a non-object');
			}

			var skipProto = hasProtoEnumBug && isFunction;
			if (isString && object.length > 0 && !has.call(object, 0)) {
				for (var i = 0; i < object.length; ++i) {
					theKeys.push(String(i));
				}
			}

			if (isArguments && object.length > 0) {
				for (var j = 0; j < object.length; ++j) {
					theKeys.push(String(j));
				}
			} else {
				for (var name in object) {
					if (!(skipProto && name === 'prototype') && has.call(object, name)) {
						theKeys.push(String(name));
					}
				}
			}

			if (hasDontEnumBug) {
				var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

				for (var k = 0; k < dontEnums.length; ++k) {
					if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
						theKeys.push(dontEnums[k]);
					}
				}
			}
			return theKeys;
		};
	}
	var implementation = keysShim;

	var slice = Array.prototype.slice;


	var origKeys = Object.keys;
	var keysShim$1 = origKeys ? function keys(o) { return origKeys(o); } : implementation;

	var originalKeys = Object.keys;

	keysShim$1.shim = function shimObjectKeys() {
		if (Object.keys) {
			var keysWorksWithArguments = (function () {
				// Safari 5.0 bug
				var args = Object.keys(arguments);
				return args && args.length === arguments.length;
			}(1, 2));
			if (!keysWorksWithArguments) {
				Object.keys = function keys(object) { // eslint-disable-line func-name-matching
					if (isArguments(object)) {
						return originalKeys(slice.call(object));
					}
					return originalKeys(object);
				};
			}
		} else {
			Object.keys = keysShim$1;
		}
		return Object.keys || keysShim$1;
	};

	var objectKeys = keysShim$1;

	var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
	var toStr$2 = Object.prototype.toString;

	var isStandardArguments = function isArguments(value) {
		if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
			return false;
		}
		return toStr$2.call(value) === '[object Arguments]';
	};

	var isLegacyArguments = function isArguments(value) {
		if (isStandardArguments(value)) {
			return true;
		}
		return value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr$2.call(value) !== '[object Array]' &&
			toStr$2.call(value.callee) === '[object Function]';
	};

	var supportsStandardArguments = (function () {
		return isStandardArguments(arguments);
	}());

	isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

	var isArguments$1 = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

	/* https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.is */

	var NumberIsNaN = function (value) {
		return value !== value;
	};

	var objectIs = function is(a, b) {
		if (a === 0 && b === 0) {
			return 1 / a === 1 / b;
		} else if (a === b) {
			return true;
		} else if (NumberIsNaN(a) && NumberIsNaN(b)) {
			return true;
		}
		return false;
	};

	/* eslint no-invalid-this: 1 */

	var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
	var slice$1 = Array.prototype.slice;
	var toStr$3 = Object.prototype.toString;
	var funcType = '[object Function]';

	var implementation$1 = function bind(that) {
	    var target = this;
	    if (typeof target !== 'function' || toStr$3.call(target) !== funcType) {
	        throw new TypeError(ERROR_MESSAGE + target);
	    }
	    var args = slice$1.call(arguments, 1);

	    var bound;
	    var binder = function () {
	        if (this instanceof bound) {
	            var result = target.apply(
	                this,
	                args.concat(slice$1.call(arguments))
	            );
	            if (Object(result) === result) {
	                return result;
	            }
	            return this;
	        } else {
	            return target.apply(
	                that,
	                args.concat(slice$1.call(arguments))
	            );
	        }
	    };

	    var boundLength = Math.max(0, target.length - args.length);
	    var boundArgs = [];
	    for (var i = 0; i < boundLength; i++) {
	        boundArgs.push('$' + i);
	    }

	    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

	    if (target.prototype) {
	        var Empty = function Empty() {};
	        Empty.prototype = target.prototype;
	        bound.prototype = new Empty();
	        Empty.prototype = null;
	    }

	    return bound;
	};

	var functionBind = Function.prototype.bind || implementation$1;

	var src = functionBind.call(Function.call, Object.prototype.hasOwnProperty);

	var regexExec = RegExp.prototype.exec;
	var gOPD = Object.getOwnPropertyDescriptor;

	var tryRegexExecCall = function tryRegexExec(value) {
		try {
			var lastIndex = value.lastIndex;
			value.lastIndex = 0;

			regexExec.call(value);
			return true;
		} catch (e) {
			return false;
		} finally {
			value.lastIndex = lastIndex;
		}
	};
	var toStr$4 = Object.prototype.toString;
	var regexClass = '[object RegExp]';
	var hasToStringTag$1 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

	var isRegex = function isRegex(value) {
		if (!value || typeof value !== 'object') {
			return false;
		}
		if (!hasToStringTag$1) {
			return toStr$4.call(value) === regexClass;
		}

		var descriptor = gOPD(value, 'lastIndex');
		var hasLastIndexDataProperty = descriptor && src(descriptor, 'value');
		if (!hasLastIndexDataProperty) {
			return false;
		}

		return tryRegexExecCall(value);
	};

	var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

	var toStr$5 = Object.prototype.toString;
	var concat = Array.prototype.concat;
	var origDefineProperty = Object.defineProperty;

	var isFunction = function (fn) {
		return typeof fn === 'function' && toStr$5.call(fn) === '[object Function]';
	};

	var arePropertyDescriptorsSupported = function () {
		var obj = {};
		try {
			origDefineProperty(obj, 'x', { enumerable: false, value: obj });
			// eslint-disable-next-line no-unused-vars, no-restricted-syntax
			for (var _ in obj) { // jscs:ignore disallowUnusedVariables
				return false;
			}
			return obj.x === obj;
		} catch (e) { /* this is IE 8. */
			return false;
		}
	};
	var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();

	var defineProperty = function (object, name, value, predicate) {
		if (name in object && (!isFunction(predicate) || !predicate())) {
			return;
		}
		if (supportsDescriptors) {
			origDefineProperty(object, name, {
				configurable: true,
				enumerable: false,
				value: value,
				writable: true
			});
		} else {
			object[name] = value;
		}
	};

	var defineProperties = function (object, map) {
		var predicates = arguments.length > 2 ? arguments[2] : {};
		var props = objectKeys(map);
		if (hasSymbols) {
			props = concat.call(props, Object.getOwnPropertySymbols(map));
		}
		for (var i = 0; i < props.length; i += 1) {
			defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
		}
	};

	defineProperties.supportsDescriptors = !!supportsDescriptors;

	var defineProperties_1 = defineProperties;

	var toObject = Object;
	var TypeErr = TypeError;

	var implementation$2 = function flags() {
		if (this != null && this !== toObject(this)) {
			throw new TypeErr('RegExp.prototype.flags getter called on non-object');
		}
		var result = '';
		if (this.global) {
			result += 'g';
		}
		if (this.ignoreCase) {
			result += 'i';
		}
		if (this.multiline) {
			result += 'm';
		}
		if (this.dotAll) {
			result += 's';
		}
		if (this.unicode) {
			result += 'u';
		}
		if (this.sticky) {
			result += 'y';
		}
		return result;
	};

	var supportsDescriptors$1 = defineProperties_1.supportsDescriptors;
	var gOPD$1 = Object.getOwnPropertyDescriptor;
	var TypeErr$1 = TypeError;

	var polyfill = function getPolyfill() {
		if (!supportsDescriptors$1) {
			throw new TypeErr$1('RegExp.prototype.flags requires a true ES5 environment that supports property descriptors');
		}
		if (/a/mig.flags === 'gim') {
			var descriptor = gOPD$1(RegExp.prototype, 'flags');
			if (descriptor && typeof descriptor.get === 'function' && typeof (/a/).dotAll === 'boolean') {
				return descriptor.get;
			}
		}
		return implementation$2;
	};

	var supportsDescriptors$2 = defineProperties_1.supportsDescriptors;

	var gOPD$2 = Object.getOwnPropertyDescriptor;
	var defineProperty$1 = Object.defineProperty;
	var TypeErr$2 = TypeError;
	var getProto = Object.getPrototypeOf;
	var regex = /a/;

	var shim = function shimFlags() {
		if (!supportsDescriptors$2 || !getProto) {
			throw new TypeErr$2('RegExp.prototype.flags requires a true ES5 environment that supports property descriptors');
		}
		var polyfill$1 = polyfill();
		var proto = getProto(regex);
		var descriptor = gOPD$2(proto, 'flags');
		if (!descriptor || descriptor.get !== polyfill$1) {
			defineProperty$1(proto, 'flags', {
				configurable: true,
				enumerable: false,
				get: polyfill$1
			});
		}
		return polyfill$1;
	};

	var flagsBound = Function.call.bind(implementation$2);

	defineProperties_1(flagsBound, {
		getPolyfill: polyfill,
		implementation: implementation$2,
		shim: shim
	});

	var regexp_prototype_flags = flagsBound;

	var getDay = Date.prototype.getDay;
	var tryDateObject = function tryDateObject(value) {
		try {
			getDay.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};

	var toStr$6 = Object.prototype.toString;
	var dateClass = '[object Date]';
	var hasToStringTag$2 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

	var isDateObject = function isDateObject(value) {
		if (typeof value !== 'object' || value === null) { return false; }
		return hasToStringTag$2 ? tryDateObject(value) : toStr$6.call(value) === dateClass;
	};

	var getTime = Date.prototype.getTime;

	function deepEqual(actual, expected, options) {
	  var opts = options || {};

	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (opts.strict ? objectIs(actual, expected) : actual === expected) {
	    return true;
	  }

	  // 7.3. Other pairs that do not both pass typeof value == 'object', equivalence is determined by ==.
	  if (!actual || !expected || (typeof actual !== 'object' && typeof expected !== 'object')) {
	    return opts.strict ? objectIs(actual, expected) : actual == expected;
	  }

	  /*
	   * 7.4. For all other Object pairs, including Array objects, equivalence is
	   * determined by having the same number of owned properties (as verified
	   * with Object.prototype.hasOwnProperty.call), the same set of keys
	   * (although not necessarily the same order), equivalent values for every
	   * corresponding key, and an identical 'prototype' property. Note: this
	   * accounts for both named and indexed properties on Arrays.
	   */
	  // eslint-disable-next-line no-use-before-define
	  return objEquiv(actual, expected, opts);
	}

	function isUndefinedOrNull(value) {
	  return value === null || value === undefined;
	}

	function isBuffer(x) {
	  if (!x || typeof x !== 'object' || typeof x.length !== 'number') {
	    return false;
	  }
	  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
	    return false;
	  }
	  if (x.length > 0 && typeof x[0] !== 'number') {
	    return false;
	  }
	  return true;
	}

	function objEquiv(a, b, opts) {
	  /* eslint max-statements: [2, 50] */
	  var i, key;
	  if (typeof a !== typeof b) { return false; }
	  if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) { return false; }

	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) { return false; }

	  if (isArguments$1(a) !== isArguments$1(b)) { return false; }

	  var aIsRegex = isRegex(a);
	  var bIsRegex = isRegex(b);
	  if (aIsRegex !== bIsRegex) { return false; }
	  if (aIsRegex || bIsRegex) {
	    return a.source === b.source && regexp_prototype_flags(a) === regexp_prototype_flags(b);
	  }

	  if (isDateObject(a) && isDateObject(b)) {
	    return getTime.call(a) === getTime.call(b);
	  }

	  var aIsBuffer = isBuffer(a);
	  var bIsBuffer = isBuffer(b);
	  if (aIsBuffer !== bIsBuffer) { return false; }
	  if (aIsBuffer || bIsBuffer) { // && would work too, because both are true or both false here
	    if (a.length !== b.length) { return false; }
	    for (i = 0; i < a.length; i++) {
	      if (a[i] !== b[i]) { return false; }
	    }
	    return true;
	  }

	  if (typeof a !== typeof b) { return false; }

	  try {
	    var ka = objectKeys(a);
	    var kb = objectKeys(b);
	  } catch (e) { // happens when one is a string literal and the other isn't
	    return false;
	  }
	  // having the same number of owned properties (keys incorporates hasOwnProperty)
	  if (ka.length !== kb.length) { return false; }

	  // the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  // ~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i]) { return false; }
	  }
	  // equivalent values for every corresponding key, and ~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!deepEqual(a[key], b[key], opts)) { return false; }
	  }

	  return true;
	}

	var deepEqual_1 = deepEqual;

	var isMergeableObject = function isMergeableObject(value) {
		return isNonNullObject(value)
			&& !isSpecial(value)
	};

	function isNonNullObject(value) {
		return !!value && typeof value === 'object'
	}

	function isSpecial(value) {
		var stringValue = Object.prototype.toString.call(value);

		return stringValue === '[object RegExp]'
			|| stringValue === '[object Date]'
			|| isReactElement(value)
	}

	// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
	var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
	var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

	function isReactElement(value) {
		return value.$$typeof === REACT_ELEMENT_TYPE
	}

	function emptyTarget(val) {
		return Array.isArray(val) ? [] : {}
	}

	function cloneUnlessOtherwiseSpecified(value, options) {
		return (options.clone !== false && options.isMergeableObject(value))
			? deepmerge(emptyTarget(value), value, options)
			: value
	}

	function defaultArrayMerge(target, source, options) {
		return target.concat(source).map(function(element) {
			return cloneUnlessOtherwiseSpecified(element, options)
		})
	}

	function getMergeFunction(key, options) {
		if (!options.customMerge) {
			return deepmerge
		}
		var customMerge = options.customMerge(key);
		return typeof customMerge === 'function' ? customMerge : deepmerge
	}

	function getEnumerableOwnPropertySymbols(target) {
		return Object.getOwnPropertySymbols
			? Object.getOwnPropertySymbols(target).filter(function(symbol) {
				return target.propertyIsEnumerable(symbol)
			})
			: []
	}

	function getKeys(target) {
		return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
	}

	function propertyIsOnObject(object, property) {
		try {
			return property in object
		} catch(_) {
			return false
		}
	}

	// Protects from prototype poisoning and unexpected merging up the prototype chain.
	function propertyIsUnsafe(target, key) {
		return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
			&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
				&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
	}

	function mergeObject(target, source, options) {
		var destination = {};
		if (options.isMergeableObject(target)) {
			getKeys(target).forEach(function(key) {
				destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
			});
		}
		getKeys(source).forEach(function(key) {
			if (propertyIsUnsafe(target, key)) {
				return
			}

			if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
				destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
			} else {
				destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
			}
		});
		return destination
	}

	function deepmerge(target, source, options) {
		options = options || {};
		options.arrayMerge = options.arrayMerge || defaultArrayMerge;
		options.isMergeableObject = options.isMergeableObject || isMergeableObject;
		// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
		// implementations can use it. The caller may not replace it.
		options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

		var sourceIsArray = Array.isArray(source);
		var targetIsArray = Array.isArray(target);
		var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

		if (!sourceAndTargetTypesMatch) {
			return cloneUnlessOtherwiseSpecified(source, options)
		} else if (sourceIsArray) {
			return options.arrayMerge(target, source, options)
		} else {
			return mergeObject(target, source, options)
		}
	}

	deepmerge.all = function deepmergeAll(array, options) {
		if (!Array.isArray(array)) {
			throw new Error('first argument should be an array')
		}

		return array.reduce(function(prev, next) {
			return deepmerge(prev, next, options)
		}, {})
	};

	var deepmerge_1 = deepmerge;

	var cjs = deepmerge_1;

	var chartId = 1;

	var createComponent = function(Vue, tagName, chartType) {
	  var chartProps = [
	    "adapter", "bytes", "colors", "curve", "dataset", "decimal", "discrete", "donut", "download", "label",
	    "legend", "library", "max", "messages", "min", "points", "precision", "prefix", "refresh",
	    "round", "stacked", "suffix", "thousands", "title", "xmax", "xmin", "xtitle", "ytitle", "zeros"
	  ];
	  Vue.component(tagName, {
	    props: ["data", "id", "width", "height"].concat(chartProps),
	    render: function(createElement) {
	      return createElement(
	        "div",
	        {
	          attrs: {
	            id: this.chartId
	          },
	          style: this.chartStyle
	        },
	        ["Loading..."]
	      )
	    },
	    data: function() {
	      return {
	        chartId: null
	      }
	    },
	    computed: {
	      chartStyle: function() {
	        // hack to watch data and options
	        this.data;
	        this.chartOptions;

	        return {
	          height: this.height || "300px",
	          lineHeight: this.height || "300px",
	          width: this.width || "100%",
	          textAlign: "center",
	          color: "#999",
	          fontSize: "14px",
	          fontFamily: "'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif"
	        }
	      },
	      chartOptions: function() {
	        var options = {};
	        var props = chartProps;
	        for (var i = 0; i < props.length; i++) {
	          var prop = props[i];
	          if (this[prop] !== undefined) {
	            options[prop] = this[prop];
	          }
	        }
	        return options
	      }
	    },
	    created: function() {
	      this.chartId = this.chartId || this.id || ("chart-" + chartId++);
	    },
	    mounted: function() {
	      this.updateChart();
	      this.savedState = this.currentState();
	    },
	    updated: function() {
	      // avoid updates when literal objects are used as props
	      // see https://github.com/ankane/vue-chartkick/pull/52
	      // and https://github.com/vuejs/vue/issues/4060
	      var currentState = this.currentState();
	      if (!deepEqual_1(currentState, this.savedState)) {
	        this.updateChart();
	        this.savedState = currentState;
	      }
	    },
	    beforeDestroy: function() {
	      if (this.chart) {
	        this.chart.destroy();
	      }
	    },
	    methods: {
	      updateChart: function() {
	        if (this.data !== null) {
	          if (this.chart) {
	            this.chart.updateData(this.data, this.chartOptions);
	          } else {
	            this.chart = new chartType(this.chartId, this.data, this.chartOptions);
	          }
	        } else if (this.chart) {
	          this.chart.destroy();
	          this.chart = null;
	          this.$el.innerText = "Loading...";
	        }
	      },
	      currentState: function() {
	        return cjs({}, {
	          data: this.data,
	          chartOptions: this.chartOptions
	        })
	      }
	    }
	  });
	};

	Chartkick.version = "0.6.0"; // TODO remove in future versions
	Chartkick.install = function(Vue, options) {
	  if (options && options.adapter) {
	    Chartkick.addAdapter(options.adapter);
	  }
	  createComponent(Vue, "line-chart", Chartkick.LineChart);
	  createComponent(Vue, "pie-chart", Chartkick.PieChart);
	  createComponent(Vue, "column-chart", Chartkick.ColumnChart);
	  createComponent(Vue, "bar-chart", Chartkick.BarChart);
	  createComponent(Vue, "area-chart", Chartkick.AreaChart);
	  createComponent(Vue, "scatter-chart", Chartkick.ScatterChart);
	  createComponent(Vue, "geo-chart", Chartkick.GeoChart);
	  createComponent(Vue, "timeline", Chartkick.Timeline);
	};

	var VueChartkick = Chartkick;

	// in browser
	if (typeof window !== "undefined" && window.Vue) {
	  window.Vue.use(VueChartkick);
	}

	return VueChartkick;

})));
