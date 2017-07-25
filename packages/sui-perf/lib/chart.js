'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printTimelineChart = exports.getTimelineChart = undefined;

require('colors');

var round = Math.round; /* eslint no-console:0 */

var pad = function pad() {
  var padChar = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ' ';
  return function (length) {
    return function () {
      var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      length = round(length);
      while (text.length < length) {
        text += padChar;
      }return text;
    };
  };
};

var padEmpty = pad(' ');

var padRectangle = pad('█');

var getStartTime = function getStartTime(entries) {
  return entries.reduce(function (time, _ref) {
    var startTime = _ref.startTime;
    return getLowest(time, startTime);
  }, entries[0].startTime);
};

var getLowest = function getLowest(num1, num2) {
  return num1 < num2 ? num1 : num2;
};

var getEndTime = function getEndTime(entries) {
  return entries.reduce(function (time, _ref2) {
    var startTime = _ref2.startTime,
        duration = _ref2.duration;
    return getHighest(time, startTime + duration);
  }, 0);
};

var getHighest = function getHighest(num1, num2) {
  return num1 > num2 ? num1 : num2;
};

var getTextRow = function getTextRow(layout) {
  var pads = layout.map(function (num) {
    return padEmpty(num);
  });
  return function (cells) {
    return cells.map(function (cell, idx) {
      return pads[idx](cell);
    }).join(' ');
  };
};

var getBarForPeriod = function getBarForPeriod(periodTime, width) {
  var padWidth = padEmpty(width);
  return function (startTime, duration) {
    var startPad = padEmpty(startTime / periodTime * width)();
    var durationPad = padRectangle(duration / periodTime * width)() || '⸠';
    return padWidth(startPad + durationPad);
  };
};

var getRowValues = function getRowValues(fullDuration, timeRange, width) {
  var getBar = getBarForPeriod(timeRange, width);
  return function (_ref3) {
    var startTime = _ref3.startTime,
        duration = _ref3.duration,
        name = _ref3.name;
    return [getBar(startTime, duration).cyan, round(startTime) + 'ms', round(duration) + 'ms', round(duration / fullDuration * 100) + '%', name.grey];
  };
};

var rewindEntriesBy = function rewindEntriesBy(entries, time) {
  return entries.map(function (entry) {
    entry.startTime += time;
    return entry;
  });
};

var getTextTable = function getTextTable(layout) {
  var getTextTableRow = getTextRow(layout);
  return function (rows) {
    return rows.map(getTextTableRow).join('\n');
  };
};

var getTimelineChart = function getTimelineChart() {
  var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref4$width = _ref4.width,
      width = _ref4$width === undefined ? 15 : _ref4$width,
      _ref4$timeRange = _ref4.timeRange,
      timeRange = _ref4$timeRange === undefined ? 0 : _ref4$timeRange;

  var getChartTable = getTextTable([width, 6, 6, 4, 0]);
  return function (entries) {
    if (entries.length < 1) return '';
    var startTime = getStartTime(entries);
    var duration = getEndTime(entries) - startTime;
    var timeRangeRef = timeRange > duration ? timeRange : duration;
    var rows = rewindEntriesBy(entries, -startTime).map(getRowValues(duration, timeRangeRef, width));
    return getChartTable([['timeline', 'start', 'time', '%', 'label']]).grey + '\n' + getChartTable(rows);
  };
};

var printTimelineChart = function printTimelineChart(opts) {
  var getTimeline = getTimelineChart(opts);
  return function (entries) {
    return console.log(getTimeline(entries));
  };
};

exports.getTimelineChart = getTimelineChart;
exports.printTimelineChart = printTimelineChart;