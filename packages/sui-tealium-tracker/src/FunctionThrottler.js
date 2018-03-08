export class FunctionThrottler {
  static throttle (fn, wait) {
    let previous
    const throttled = (...args) => {
      const now = +new Date()

      if (!previous || now - previous >= wait) {
        previous = now
        return fn.apply(this, args)
      }
    }

    return throttled
  }
}
