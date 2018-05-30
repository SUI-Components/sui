// Measure a func
import {printTimelineChart} from '../src/chart'

const task = i => {
  i *= 1000000
  while (i > 0) i--
}
const asyncTask = time => new Promise(resolve => setTimeout(resolve, time))

export default perf => {
  perf.mark('Example 2')
  // perf.measure can measure sync and async funcs
  perf.measure('Example 2 - task(70)')(() => task(70))
  perf
    .measure('Example 2 - asyncTask(200)')(() => asyncTask(200))
    .then(x => perf.stop('Example 2'))
    .then(x => perf.getEntries())
    .then(printTimelineChart())
}
