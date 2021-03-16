export const measureFunc = ({mark, stop}) => label => func => {
  if (func.__isBeingMeasured__) {
    return
  } else {
    func.__isBeingMeasured__ = true
  }

  mark(label)
  const result = func()
  const stopMeasure = () => stop(label)
  result instanceof Promise
    ? result.then(stopMeasure, stopMeasure)
    : stopMeasure()
  return result
}

export const measureMethod = perf => {
  const measure = measureFunc(perf)
  return label => (obj, methodName) => {
    const originalMethod = obj[methodName]
    obj[methodName] = function(...args) {
      const labelText =
        (typeof label === 'function' && label.call(this, ...args)) ||
        label ||
        methodName
      return measure(labelText)(() => originalMethod.call(this, ...args))
    }
  }
}
