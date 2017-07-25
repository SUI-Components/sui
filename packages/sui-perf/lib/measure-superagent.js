'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var restoreSuperagent = null;
var callbacks = [];

var spySuperagentRequest = function spySuperagentRequest(superagent) {
  restoreSuperagent = restoreSuperagent || spyMethod(superagent.Request.prototype, 'end', function () {
    var _this = this;

    callbacks.forEach(function (callback) {
      return callback.call(_this);
    });
  });
};

var measureSuperagent = function measureSuperagent(superagent, perf) {
  spySuperagentRequest(superagent);

  var callback = getMeasurementCallback(perf);
  callbacks.push(callback);
  return function () {
    callbacks = callbacks.filter(function (cb) {
      return cb !== callback;
    });
  };
};

var getMeasurementCallback = function getMeasurementCallback(perf) {
  return function () {
    var _this2 = this;

    this.on('request', function (req) {
      var label = '\uD83C\uDF0E  /' + req.url.split('//').pop().split('?')[0];
      perf.mark(label);
      _this2.on('response', function (res) {
        return perf.stop(label);
      });
    });
  };
};

var spyMethod = function spyMethod(obj, methodName, func) {
  var originalMethod = obj[methodName];
  obj[methodName] = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    func && func.call.apply(func, [this].concat(args));
    return originalMethod.call.apply(originalMethod, [this].concat(args));
  };
  return function () {
    obj[methodName] = originalMethod;
  };
};

exports.default = measureSuperagent;
var unmeasureSuperagent = exports.unmeasureSuperagent = function unmeasureSuperagent(perf) {
  restoreSuperagent && restoreSuperagent();
  callbacks = [];
};