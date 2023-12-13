import isPromise from '../helpers/isPromise'

const _runner = ({instance, original} = {}) => {
  return function inlineErrorHandler(...args) {
    const response = []
    Object.defineProperty(response, '__INLINE_ERROR__', {
      enumerable: false,
      writable: true,
      value: true
    })
    try {
      const returns = original.apply(instance.__STREAMIFY__ ? this : instance, args)
      if (!isPromise(returns)) {
        console.warn(
          "It is required wrapping a promise when you use asyncInlineError decorator, so that let's return the fn as original"
        )
        return returns
      }
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
    } catch (e) {
      response[0] = e
      response[1] = null
      return response
    }
  }
}

export default function AsyncInlineError() {
  return function AsyncInlineErrorDecorator(_, {name, addInitializer}) {
    addInitializer(function () {
      const fn = this[name]
      this[name] = _runner({instance: this, original: fn})
    })
  }
}
