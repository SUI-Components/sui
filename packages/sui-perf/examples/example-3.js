// Generate and print entries in Timeline graph
import {printTimelineChart} from '../src/chart'

const task = (i) => { i *= 1000000; while (i > 0) i-- }
const asyncTask = (time) => new Promise(resolve => setTimeout(resolve, time))
const executeSimpleSyncTask = ({mark, stop}) => {
  mark('Example 3 - SimpleSyncTask')
  task(30)
  stop('Example 3 - SimpleSyncTask')
}
const executeSimpleAsyncTask = async ({mark, stop}) => {
  mark('Example 3 - SimpleAsyncTask')
  return asyncTask(70).then(() => stop('Example 3 - SimpleAsyncTask'))
}

export default (perf) => {
  perf.mark('Example 3')
  perf.measure('Example 3 - task(70)')(() => task(70))

  Promise
    .all([
      perf.measure('Example 3 - asyncTask(100)')(() => asyncTask(200)),
      executeSimpleAsyncTask(perf)
    ])
    .then(() => executeSimpleSyncTask(perf))
    .then(x => perf.stop('Example 3'))
    .then(x => perf.getEntries())
    .then(printTimelineChart())
}
