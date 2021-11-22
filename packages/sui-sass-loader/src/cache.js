// @ts-check

const fs = require('fs')
const utils = require('./utils')

// compile cache
// cache = {
//   <entry>: {
//      mtime: <Number>,            // change time
//      writeTimes: <Number>,       // compilation times
//      readTimes: <Number>,        // read times (from last compilation)
//      lastCompile: <Number>,      // last compilation time
//      result: <String>,           // compilation result
//      dependencies: {             // dependencies files status
//          <file>: <Number>,       // file and modification time
//          ...
//      }
//   },
//   ...
// }
const CACHE_STORE = {}

/**
 * Cache
 *
 * Usage:
 *
 * let cache = new Cache(entry)
 *
 * if (cache.isValid()) {
 *   return cache.read()
 * } else {
 *   // compile sass ....
 *   cache.write(dependencies, result.css.toString())
 * }
 */
class Cache {
  constructor(entry) {
    this.entry = entry
  }

  isCached() {
    return this.entry in CACHE_STORE
  }

  isValid() {
    if (!this.isCached()) return false

    const cache = CACHE_STORE[this.entry]
    const estat = utils.fstat(this.entry)

    // The file does not exist or the time is incorrect
    if (!estat || estat.mtime.getTime() !== cache.mtime) {
      return false
    }

    for (const depFile in cache.dependencies) {
      if (!Object.prototype.hasOwnProperty.call(cache.dependencies, depFile)) {
        continue
      }

      const mtime = cache.dependencies[depFile]
      const dstat = utils.fstat(depFile)

      if (!dstat || dstat.mtime.getTime() !== mtime) {
        return false
      }
    }

    return true
  }

  read() {
    if (!this.isCached()) return false

    const cache = CACHE_STORE[this.entry]
    cache.readTimes++
    return cache.result
  }

  getDependencies() {
    if (!this.isCached()) return []

    const cache = CACHE_STORE[this.entry]
    return Object.keys(cache.dependencies)
  }

  markInvalid() {
    delete CACHE_STORE[this.entry]
  }

  write(dependencies, result) {
    if (!fs.existsSync(this.entry)) return

    let cache = CACHE_STORE[this.entry]

    if (!cache) {
      CACHE_STORE[this.entry] = cache = {
        mtime: 0,
        writeTimes: 0,
        readTimes: 0,
        lastCompile: Date.now(),
        result: null,
        dependencies: {}
      }
    }

    const mtime = utils.fstat(this.entry)

    cache.mtime = mtime ? mtime.mtimeMs : 0
    cache.writeTimes++
    cache.readTimes = 0
    cache.result = result
    cache.dependencies = {}

    for (let i = 0; i < dependencies.length; i++) {
      const depFile = dependencies[i]
      const dstat = utils.fstat(depFile)

      cache.dependencies[depFile] = dstat ? dstat.mtime.getTime() : 0
    }
  }
}

module.exports = Cache
