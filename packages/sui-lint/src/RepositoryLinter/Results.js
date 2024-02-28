const dedent = require('string-dedent')
const {Table} = require('console-table-printer')

const COLORS_BY_LEVEL = ['green', 'yellow', 'red']

module.exports.Results = class Results {
  #executions
  #messages
  #monitorings

  static create(executions) {
    return new Results(executions)
  }

  constructor(executions) {
    this.#executions = executions
    this.#messages = executions.reduce((acc, ctxt) => [...acc, ...ctxt.messages], [])
    this.#monitorings = executions.map(ctxt => ctxt.signal)
  }

  get monitorings() {
    return this.#monitorings
  }

  logTable() {
    if (this.#messages.length === 0)
      return console.log(dedent`
      🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳
      🥳 Your repository follow all our internal conventions  🥳
      🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳
    `)

    const p = new Table({
      title: dedent`
      Lint Respository messages (green=OFF, yellow=WARNING, red=ERROR)
      `
    })
    this.#messages.forEach(msg =>
      p.addRow({rule: msg.rule, message: msg.message.replaceAll('\n', ' ')}, {color: COLORS_BY_LEVEL[msg.level]})
    )
    p.printTable()
  }

  logJSON() {
    return console.log(JSON.stringify(this.#messages, null, 2))
  }

  logMonitorings() {
    if (this.#monitorings.length === 0)
      return console.log(dedent`

      There is not signal to be send to DD. Use 'context.monitoring' to add signals at your execution

    `)

    const p = new Table({title: 'List of Signals that will be send to DD'})
    this.#monitorings.forEach(monitor => p.addRow(monitor))
    p.printTable()
  }
}
