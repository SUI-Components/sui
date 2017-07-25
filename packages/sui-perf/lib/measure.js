'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.measureMethod = exports.measureFunc = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var measureFunc = exports.measureFunc = function measureFunc(_ref) {
  var mark = _ref.mark,
      stop = _ref.stop;
  return function (label) {
    return function (func) {
      if (func.__isBeingMeasured__) {
        return;
      } else {
        func.__isBeingMeasured__ = true;
      }

      mark(label);
      var result = func();
      var stopMeasure = function stopMeasure() {
        return stop(label);
      };
      result instanceof _promise2.default ? result.then(stopMeasure, stopMeasure) : stopMeasure();
      return result;
    };
  };
};

var measureMethod = exports.measureMethod = function measureMethod(perf) {
  var measure = measureFunc(perf);
  return function (label) {
    return function (obj, methodName) {
      var originalMethod = obj[methodName];
      obj[methodName] = function () {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var labelText = typeof label === 'function' && label.call.apply(label, [this].concat(args)) || label || methodName;
        return measure(labelText)(function () {
          return originalMethod.call.apply(originalMethod, [_this].concat(args));
        });
      };
    };
  };
};