import {performance} from 'node:perf_hooks'

import isNode from '../../helpers/isNode.js'
import isPromise from '../../helpers/isPromise.js'
import {ConsoleReporter} from './reporters/ConsoleReporter.js'
import {statusCodes} from './statusCodes.js'
export {DataDogReporter} from './reporters/DataDogReporter.js'

const getPerformanceMeter = () => (isNode ? performance : window.performance)

const getReporter = () => {
  const customReporter = isNode ? global.__SUI_DECORATOR_TRACER_REPORTER__ : window.__SUI_DECORATOR_TRACER_REPORTER__

  return customReporter || new ConsoleReporter()
}

const getErrorReporter = () => {
  const defaultErrorReporter = () => undefined
  const customErrorReporter = isNode
    ? global.__SUI_DECORATOR_TRACER_ERROR_REPORTER__
    : window.__SUI_DECORATOR_TRACER_ERROR_REPORTER__

  return customErrorReporter || defaultErrorReporter
}

export default ({metric = null} = {}) => {
  return (target, fnName, descriptor) => {
    const {configurable, enumerable, writable} = descriptor
    const originalGet = descriptor.get
    const originalFunction = descriptor.value
    const isGetter = !!originalGet

    // https://github.com/jayphelps/core-decorators.js/blob/master/src/autobind.js
    return Object.assign(
      {},
      {
        configurable,
        enumerable,
        get() {
          const fn = isGetter ? originalGet.call(this) : originalFunction

          if (this === target) {
            return fn
          }

          const reporter = getReporter()
          const perf = getPerformanceMeter()
          const classMethodName = `${target.constructor.name}::${fnName}`
          const metricName = metric || classMethodName

          const _fnTimed = (...args) => {
            // performance metric start
            const startTime = perf.now()

            //  original function
            const returnValue = fn.apply(this, args)
            if (isPromise(returnValue)) {
              return returnValue
                .then(res => {
                  const endTime = perf.now()

                  if (res.__INLINE_ERROR__) {
                    const [error] = res

                    reporter.send({
                      metricName,
                      status: error ? statusCodes.FAIL : statusCodes.SUCCESS,
                      value: endTime - startTime
                    })
                    if (error) {
                      getErrorReporter()(error, metricName)
                    }
                  } else {
                    reporter.send({
                      metricName,
                      status: statusCodes.SUCCESS,
                      value: endTime - startTime
                    })
                  }

                  return Promise.resolve(res)
                })
                .catch(error => {
                  const endTime = perf.now()

                  reporter.send({
                    metricName,
                    status: statusCodes.FAIL,
                    value: endTime - startTime
                  })
                  getErrorReporter()(error, metricName)

                  return Promise.reject(error)
                })
            } else {
              // performance metric ends
              const endTime = perf.now()

              reporter.send({
                metricName,
                status: statusCodes.SUCCESS,
                value: endTime - startTime
              })

              return returnValue
            }
          }

          Object.defineProperty(this, fnName, {
            configurable,
            writable,
            enumerable,
            value: _fnTimed
          })
          return _fnTimed
        },
        set(newValue) {
          Object.defineProperty(this, fnName, {
            configurable: true,
            writable: true,
            enumerable: true,
            value: newValue
          })

          return newValue
        }
      }
    )
  }
}
