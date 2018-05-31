import 'colors'
import {measureFunc, measureMethod} from './measure'

const {mark, stop, getEntries} = require('marky')

if (process.env.NODE_ENV === 'production') {
  console.warn('Perf monitoring is not recommendend in production builds.'.yellow) //eslint-disable-line
}

export default namespace => {
  const prefix = `(${namespace})`
  const perf = {
    mark(label) {
      return mark(prefix + label)
    },
    stop(label) {
      return stop(prefix + label)
    },
    getEntries() {
      return getEntries()
        .map(entry => {
          let {name} = entry
          if (name.indexOf(prefix) === 0) {
            return {...entry, name: name.replace(prefix, '')}
          }
        })
        .filter(Boolean)
    }
  }

  perf.measure = measureFunc(perf)
  perf.measureMethod = measureMethod(perf)

  return perf
}
