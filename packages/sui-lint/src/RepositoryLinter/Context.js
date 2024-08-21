const {Runner} = require('./Runner')

const EMPTY = 0

module.exports.Context = class Context {
  #messages = []
  #monitorings = []
  #handler
  #runner

  static MISSING_REDUCER_MONITORING_MSG = `
      [RepositoryLinter Context#signal] If your has call to 'context.monitoring' more than one time in your rule.
      You have to create a function 'reduceMonitoring' to be able reduce all of them to 1 value.
  `

  static create(level, handler, rule, runner) {
    return new Context(level, handler, rule, runner ?? Runner.create())
  }

  constructor(level, handler, rule, runner) {
    this.#handler = handler
    this.#runner = runner
    this.rule = rule
    this.level = level
  }

  run() {
    const assertions = this.#handler.create(this)
    const {missmatch = () => {}, ...restAssertions} = assertions
    Object.entries(restAssertions).forEach(([key, fn]) => {
      const matches = this.#runner.assertion(key)
      if (matches.length === EMPTY) {
        this._assertion = 'missmatch'
        return missmatch(key)
      }
      this._assertion = key // We cant execute assertions in parallel
      fn(matches)
    })
    return this
  }

  get messages() {
    return this.#messages.map(opts => {
      let message = this.#handler?.meta?.messages[opts.messageId] ?? opts.messageId
      message = Object.entries(opts.data ?? {}).reduce((acc, [key, value]) => {
        return acc.replaceAll(`{{${key}}}`, value)
      }, message)
      return {...opts, message, rule: this.rule, level: this.level}
    })
  }

  get signal() {
    const _signal = {rule: this.rule, level: this.level}
    if (this.#monitorings.length === 0) return _signal
    if (this.#monitorings.length === 1) return {..._signal, value: this.#monitorings[0].value}

    if (this.#handler.reduceMonitoring === undefined) throw new Error(Context.MISSING_REDUCER_MONITORING_MSG)

    return {rule: this.rule, level: this.level, value: this.#handler?.reduceMonitoring(this.#monitorings)}
  }

  report(opts) {
    this.#messages.push(opts)
  }

  monitoring(value, assertion) {
    this.#monitorings.push({assertion: assertion ?? this._assertion, rule: this.rule, value, level: this.level})
  }
}
