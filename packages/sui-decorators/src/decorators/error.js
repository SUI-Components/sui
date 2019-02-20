import isPromise from '../helpers/isPromise'

const _runner = ({instance, original} = {}) => {
  return (...args) => {
    try {
      const returns = original.apply(instance, args)
      return isPromise(returns)
        ? returns.then(r => [null, r]).catch(e => [e, null])
        : [null, returns]
    } catch (e) {
      return [e, null]
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
        if (this === target) {
          return fn
        }
        const _fnRunner = _runner({
          instance: this,
          original: fn
        })

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
