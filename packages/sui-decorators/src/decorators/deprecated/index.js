import isNode from '../../helpers/isNode.js'

const noop = () => {}

const getListener = () => {
  const listener = isNode ? global.__SUI_DECORATOR_DEPRECATED_REPORTER__ : window.__SUI_DECORATOR_DEPRECATED_REPORTER__
  return listener || noop
}

const _runner = ({instance, original, config} = {}) => {
  return function (...args) {
    const listener = getListener()
    listener(config)

    const {message} = config

    if (process.env.NODE_ENV !== 'production') {
      console.warn(message)
    }

    return original.apply(instance, args)
  }
}

export function Deprecated(config = {message: ''}) {
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
            original: fn,
            config
          })

          return _fnRunner.apply(this, args)
        }
      }
    )
  }
}
