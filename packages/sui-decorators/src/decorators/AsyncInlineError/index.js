import isPromise from '../../helpers/isPromise.js'

const GENERIC_ERROR_MESSAGE = 'You might decorate an async function with use @AsyncInlineError'

const _runner = ({instance, original} = {}) => {
  return function (...args) {
    const response = []
    Object.defineProperty(response, '__INLINE_ERROR__', {
      enumerable: false,
      writable: true,
      value: true
    })

    let promise = null

    try {
      promise = original.apply(instance, args)
    } catch (error) {
      throw new Error(GENERIC_ERROR_MESSAGE, {cause: error})
    }

    if (!isPromise(promise)) {
      throw new Error(GENERIC_ERROR_MESSAGE)
    }

    return promise
      .then(r => {
        response[0] = null
        response[1] = r
        return response
      })
      .catch(e => {
        response[0] = e
        response[1] = null
        return response
      })
  }
}

export function AsyncInlineError(config = {}) {
  return function (target, fnName, descriptor) {
    const {value: fn, configurable, enumerable} = descriptor

    return Object.assign(
      {},
      {
        configurable,
        enumerable,
        value(...args) {
          const _fnRunner = _runner({
            instance: this,
            original: fn
          })

          return _fnRunner.apply(this, args)
        }
      }
    )
  }
}
