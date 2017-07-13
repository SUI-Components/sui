
let restoreSuperagent = null
let callbacks = []

const spySuperagentRequest = (superagent) => {
  restoreSuperagent = restoreSuperagent || spyMethod(superagent.Request.prototype, 'end', function () {
    callbacks.forEach((callback) => callback.call(this))
  })
}

const measureSuperagent = (superagent, perf) => {
  spySuperagentRequest(superagent)

  let callback = getMeasurementCallback(perf)
  callbacks.push(callback)
  return () => { callbacks = callbacks.filter((cb) => cb !== callback) }
}

const getMeasurementCallback = (perf) => function () {
  this.on('request', (req) => {
    let label = `🌎  /${req.url.split('//').pop().split('?')[0]}`
    perf.mark(label)
    this.on('response', (res) => perf.stop(label))
  })
}

const spyMethod = (obj, methodName, func) => {
  const originalMethod = obj[methodName]
  obj[methodName] = function (...args) {
    func && func.call(this, ...args)
    return originalMethod.call(this, ...args)
  }
  return () => { obj[methodName] = originalMethod }
}

export default measureSuperagent
export const unmeasureSuperagent = (perf) => {
  restoreSuperagent && restoreSuperagent()
  callbacks = []
}
