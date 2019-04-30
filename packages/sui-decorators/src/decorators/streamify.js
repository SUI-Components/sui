import isPromise from '../helpers/isPromise'

const defaultErrorHandler = err => {
  console.error(err)
}

const dispatchToListeners = ({onError, onNext, params, result}) => {
  if (isPromise(result)) {
    result
      .then(value => {
        if (value.__INLINE_ERROR__) {
          const [error, val] = value
          return !error
            ? onNext({params, result: val})
            : onError({params, error})
        }
        onNext({params, result: value})
      })
      .catch(error => onError({params, error}))
  } else if (result) {
    if (result.__INLINE_ERROR__) {
      const [error, val] = result
      return !error ? onNext({params, result: val}) : onError({params, error})
    }
    onNext({params, result})
  }
}

const createSubscription = (proto, method, originalMethod) => {
  let onNextListeners = []
  let onErrorListeners = []

  proto[method] = function(...args) {
    const params = args
    try {
      const result = originalMethod.apply(this, args)
      dispatchToListeners({onError, onNext, params, result})
      return result
    } catch (error) {
      onError({params, error})
      throw error
    }
  }

  const onNext = ({params, result}) => {
    onNextListeners.forEach(listener => listener({params, result}))
  }

  const onError = ({params, error}) => {
    onErrorListeners.forEach(listener => listener({params, error}))
  }

  const subscribe = (onNext = () => {}, onError = defaultErrorHandler) => {
    onNextListeners.push(onNext)
    onErrorListeners.push(onError)

    return {
      dispose: () => {
        onNextListeners = onNextListeners.filter(l => l !== onNext)
        onErrorListeners = onErrorListeners.filter(l => l !== onError)
      }
    }
  }

  return {subscribe}
}

const reducer = (Target, proto, method) => {
  const originalMethod = Target.prototype[method]
  proto.$ = proto.$ || {}
  proto.$[method] = createSubscription(proto, method, originalMethod)
  return proto
}

export default (...methods) => {
  return Target => {
    Target.prototype.__STREAMIFY__ = true
    Object.assign(
      Target.prototype,
      methods
        .filter(method => !!Target.prototype[method])
        .reduce(reducer.bind(null, Target), {})
    )
    return Target
  }
}
