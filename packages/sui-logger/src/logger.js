const LOGGER_NAME = 'adv.logger'
const EVENT_TYPES = {
  DISTRIBUTION: 'DISTRIBUTION',
  ERROR: 'ERROR',
  LOG: 'LOG',
  METRIC: 'METRIC',
  PERFORMANCE_LOG: 'PERFORMANCE_LOG',
  WEB_RULE_FAILED: 'WEB_RULE_FAILED',
  WEB_GOLDEN_PATH_METRIC: 'WEB_GOLDEN_PATH_METRIC',
  TIMING: 'TIMING'
}
const EVENT_STATUSES = {
  SUCCESS: 'success',
  FAIL: 'fail'
}

const noop = () => {}
// eslint-disable-next-line no-console
const originalConsoleError = console.error

const getErrorProperties = ({name, message, stack}) => ({name, message, stack})

export default ({
  Trackers,
  trackerName = LOGGER_NAME,
  forwardConsoleErrors = true,
  listenUnhandled = noop,
  userAgent,
  userId,
  getUrlFactory = () => {}
}) => {
  const trackerOptions = {
    userAgent,
    userId,
    url: getUrlFactory()
  }

  const tracker = Trackers.create(trackerName, trackerOptions)

  // Patch `console.error`
  if (forwardConsoleErrors) {
    // eslint-disable-next-line no-console
    console.error = function () {
      originalConsoleError.apply(console, arguments)

      const argumentsArray = Array.from(arguments)
      const error = argumentsArray.find(param => param instanceof Error)

      tracker.emit(EVENT_TYPES.ERROR, {
        ...(error && {error: getErrorProperties(error)}),
        message: arguments,
        url: getUrlFactory()
      })
    }
  }

  const logError = error => {
    tracker.emit(EVENT_TYPES.ERROR, {
      error: getErrorProperties(error),
      url: getUrlFactory()
    })
  }

  const log = message => {
    tracker.emit(EVENT_TYPES.LOG, {
      message,
      url: getUrlFactory()
    })
  }

  /**
   * @param {String} name
   * @param {Number} amount
   * @param {String} path
   * @param {String} [target]
   * @param {String} [loadState]
   * @param {String} [eventType]
   * @param {String} [visibilityState]
   * @param {Number} [deviceMemory]
   * @param {String} [effectiveType]
   * @param {Number} [hardwareConcurrency]
   */
  const cwv = ({
    name,
    amount,
    path,
    target,
    loadState,
    eventType,
    visibilityState,
    deviceMemory,
    effectiveType,
    hardwareConcurrency
  }) => {
    tracker.emit(EVENT_TYPES.PERFORMANCE_LOG, {
      name,
      amount,
      path,
      target,
      loadState,
      eventType,
      url: getUrlFactory(),
      visibilityState,
      deviceMemory,
      effectiveType,
      hardwareConcurrency
    })
  }

  /**
   * @typedef {Object} WEB_RULE_FAILED_INPUT
   * @property {String} WEB_RULE_FAILED_INPUT.ruleName
   * @property {number} WEB_RULE_FAILED_INPUT.numberOfFails
   * @property {string} WEB_RULE_FAILED_INPUT.repository
   *
   * @param {WEB_RULE_FAILED_INPUT} metric
   */
  const webRuleFailed = ({ruleName, numberOfFails, repository}) => {
    tracker.emit(EVENT_TYPES.WEB_RULE_FAILED, {
      ruleName,
      numberOfFails,
      repository
    })
  }

  /**
   * @typedef {Object}  WEB_GOLDEN_PATH_INPUT
   * @property {String} WEB_GOLDEN_PATH_INPUT.ruleName
   * @property {string | number} WEB_GOLDEN_PATH_INPUT.value
   * @property {string} WEB_GOLDEN_PATH_INPUT.repository
   *
   * @param {WEB_GOLDEN_PATH_INPUT} metric
   */
  const webGoldenPath = ({ruleName, value, repository}) => {
    tracker.emit(EVENT_TYPES.WEB_GOLDEN_PATH_METRIC, {
      ruleName,
      value,
      repository
    })
  }

  /**
   * @typedef {Object} Tag
   * @property {String} Tag.key
   * @property {any} Tag.value
   *
   * @typedef {Object} Metric
   * @property {String} Metric.name
   * @property {Array<Tag>} Metric.tags
   *
   * @param {Metric} metric
   */
  const metric = ({name, tags}) => {
    tracker.emit(EVENT_TYPES.METRIC, {
      name,
      tags,
      url: getUrlFactory()
    })
  }

  /**
   * @typedef {Object} Tag
   * @property {String} Tag.key
   * @property {any} Tag.value
   *
   * @typedef {Object} TimingMetric
   * @property {String} Metric.name
   * @property {Number} Metric.amount
   * @property {Array<Tag>} Metric.tags
   *
   * @param {TimingMetric} metric
   */
  const timing = ({name, amount, tags}) => {
    tracker.emit(EVENT_TYPES.TIMING, {
      name,
      amount,
      tags,
      url: getUrlFactory()
    })
  }

  /**
   * @typedef {Object} Tag
   * @property {String} Tag.key
   * @property {any} Tag.value
   *
   * @typedef {Object} DistributionMetric
   * @property {String} Metric.name
   * @property {Number} Metric.amount
   * @property {Array<Tag>} Metric.tags
   *
   * @param {TimingMetric} metric
   */
  const distribution = ({name, amount, tags}) => {
    tracker.emit(EVENT_TYPES.DISTRIBUTION, {
      name,
      amount,
      tags,
      url: getUrlFactory()
    })
  }

  /**
   * @typedef {Boolean} LogErrors
   * @typedef {Object} Tag
   * @property {String} Tag.key
   * @property {any} Tag.value
   *
   * @typedef {Object} TraceOptions
   * @property {Tag} [TraceOptions.tags]
   * @property {Function} [TraceOptions.onSuccess]
   * @property {Function} [TraceOptions.onError]
   * @property {Function} [TraceOptions.filter]
   * @property {LogErrors} [TraceOptions.logErrors]
   *
   * @param {String} name
   * @param {Function} fn
   * @param {TraceOptions} [options]
   */
  const trace = (name, fn, options = {}) => {
    const isNode = typeof window === 'undefined'
    const {tags = [], logErrors = false, onSuccess = () => [], onError = () => [], filter = () => false} = options
    const perf = isNode ? performance : window.performance

    return (...args) => {
      const startTime = perf.now()
      const value = fn.apply(this, args)
      const isPromise = value !== undefined && typeof value.then === 'function'

      if (isPromise) {
        return value
          .then((...args) => {
            const endTime = perf.now()
            const amount = endTime - startTime
            const res = args && args[0]

            if (res?.__INLINE_ERROR__) {
              const [error, response] = res
              const customTags = error ? onSuccess(response) : onError(error)
              const isIgnored = error ? filter(error) : false

              timing({
                name,
                amount,
                tags: [
                  {
                    key: 'status',
                    value: error && !isIgnored ? EVENT_STATUSES.FAIL : EVENT_STATUSES.SUCCESS
                  },
                  ...tags,
                  ...customTags
                ]
              })
            } else {
              const successTags = onSuccess(...args)

              timing({
                name,
                amount,
                tags: [
                  {
                    key: 'status',
                    value: EVENT_STATUSES.SUCCESS
                  },
                  ...tags,
                  ...successTags
                ]
              })
            }

            return Promise.resolve(...args)
          })
          .catch(error => {
            const endTime = perf.now()
            const errorTags = onError(error)
            const isIgnored = filter(error)
            const amount = endTime - startTime

            if (!isIgnored) {
              timing({
                name,
                amount,
                tags: [
                  {
                    key: 'status',
                    value: EVENT_STATUSES.FAIL
                  },
                  ...tags,
                  ...errorTags
                ]
              })

              if (logErrors) {
                logError(error)
              }
            } else {
              timing({
                name,
                amount,
                tags: [
                  {
                    key: 'status',
                    value: EVENT_STATUSES.SUCCESS
                  },
                  ...tags,
                  ...errorTags
                ]
              })
            }

            return Promise.reject(error)
          })
      }

      const endTime = perf.now()
      const successTags = onSuccess(value)

      timing({
        name,
        amount: endTime - startTime,
        tags: [
          {
            key: 'status',
            value: EVENT_STATUSES.SUCCESS
          },
          ...tags,
          ...successTags
        ]
      })

      return value
    }
  }

  listenUnhandled(logError)

  return {
    distribution,
    error: logError,
    log,
    metric,
    cwv,
    timing,
    webRuleFailed,
    webGoldenPath,
    trace
  }
}
