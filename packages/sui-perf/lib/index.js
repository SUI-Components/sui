'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

require('colors');

var _measure = require('./measure');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('marky'),
    _mark = _require.mark,
    _stop = _require.stop,
    _getEntries = _require.getEntries;

if (process.env.NODE_ENV === 'production') {
  console.warn('Perf monitoring is not recommendend in production builds.'.yellow); //eslint-disable-line
}

exports.default = function (namespace) {
  var prefix = '(' + namespace + ')';
  var perf = {
    mark: function mark(label) {
      return _mark(prefix + label);
    },
    stop: function stop(label) {
      return _stop(prefix + label);
    },
    getEntries: function getEntries() {
      return _getEntries().map(function (entry) {
        var name = entry.name;

        if (name.indexOf(prefix) === 0) {
          return (0, _extends3.default)({}, entry, { name: name.replace(prefix, '') });
        }
      }).filter(Boolean);
    }
  };

  perf.measure = (0, _measure.measureFunc)(perf);
  perf.measureMethod = (0, _measure.measureMethod)(perf);

  return perf;
};