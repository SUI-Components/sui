import isPromise from '../helpers/isPromise.js'

const _runner = ({instance, original} = {}) => {
  return function (...args) {
    const response = []
    Object.defineProperty(response, '__INLINE_ERROR__', {
      enumerable: false,
      writable: true,
      value: true
    })
    try {
      const returns = original.apply(instance.__STREAMIFY__ ? this : instance, args)
      if (isPromise(returns)) {
        console.warn('You should use the @AsyncInlineError() decorator in async functions.')
        return returns
          .then(r => {
            response[0] = null
            response[1] = r
            return response
          })
          .catch(e => {
            response[0] = e
            response[1] = null
            return Promise.resolve(response)
          })
      } else {
        response[0] = null
        response[1] = returns
        return response
      }
    } catch (e) {
      response[0] = e
      response[1] = null
      return response
    }
  }
}

export default (target, fnName, descriptor) => {
  const {value: fn, configurable, enumerable} = descriptor

  // https://github.com/jayphelps/core-decorators.js/blob/master/src/autobind.js
  return Object.assign(
    {},
    {
      configurable,
      enumerable,
      get() {
        const _fnRunner = _runner({
          instance: this,
          original: fn
        })

        if (this === target && !target.__STREAMIFY__) {
          return fn
        }

        Object.defineProperty(this, fnName, {
          configurable: true,
          writable: true,
          enumerable: false,
          value: _fnRunner
        })
        return _fnRunner
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
