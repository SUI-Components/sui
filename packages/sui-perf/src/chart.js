/* eslint no-console:0 */
import 'colors'

const {round} = Math

const pad = (padChar = ' ') => length => (text = '') => {
  length = round(length)
  while (text.length < length) text += padChar
  return text
}

const padEmpty = pad(' ')

const padRectangle = pad('█')

const getStartTime = entries => {
  return entries.reduce(
    (time, {startTime}) => getLowest(time, startTime),
    entries[0].startTime
  )
}

const getLowest = (num1, num2) => (num1 < num2 ? num1 : num2)

const getEndTime = entries => {
  return entries.reduce(
    (time, {startTime, duration}) => getHighest(time, startTime + duration),
    0
  )
}

const getHighest = (num1, num2) => (num1 > num2 ? num1 : num2)

const getTextRow = layout => {
  const pads = layout.map(num => padEmpty(num))
  return cells => {
    return cells.map((cell, idx) => pads[idx](cell)).join(' ')
  }
}

const getBarForPeriod = (periodTime, width) => {
  const padWidth = padEmpty(width)
  return (startTime, duration) => {
    const startPad = padEmpty((startTime / periodTime) * width)()
    const durationPad = padRectangle((duration / periodTime) * width)() || '⸠'
    return padWidth(startPad + durationPad)
  }
}

const getRowValues = (fullDuration, timeRange, width) => {
  const getBar = getBarForPeriod(timeRange, width)
  return ({startTime, duration, name}) => [
    getBar(startTime, duration).cyan,
    round(startTime) + 'ms',
    round(duration) + 'ms',
    round((duration / fullDuration) * 100) + '%',
    name.grey
  ]
}

const rewindEntriesBy = (entries, time) => {
  return entries.map(entry => {
    entry.startTime += time
    return entry
  })
}

const getTextTable = layout => {
  const getTextTableRow = getTextRow(layout)
  return rows => rows.map(getTextTableRow).join('\n')
}

const getTimelineChart = ({width = 15, timeRange = 0, minPercent = 0} = {}) => {
  minPercent = minPercent / 100
  const getChartTable = getTextTable([width, 6, 6, 4, 0])
  return entries => {
    if (entries.length < 1) return ''
    const startTime = getStartTime(entries)
    const duration = getEndTime(entries) - startTime
    const timeRangeRef = timeRange > duration ? timeRange : duration
    const rows = rewindEntriesBy(entries, -startTime)
      .filter(entry => entry.duration / duration >= minPercent)
      .map(getRowValues(duration, timeRangeRef, width))
    return (
      getChartTable([['timeline', 'start', 'time', '%', 'label']]).grey +
      '\n' +
      getChartTable(rows)
    )
  }
}

const printTimelineChart = opts => {
  const getTimeline = getTimelineChart(opts)
  return entries => console.log(getTimeline(entries))
}

export {getTimelineChart, printTimelineChart}
