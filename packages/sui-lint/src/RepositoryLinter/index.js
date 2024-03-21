const {Config} = require('./Config')
const {Context} = require('./Context')
const {Results} = require('./Results')

module.exports.RepositoryLinter = class RepositoryLinter {
  #cofig

  static create(config) {
    return new RepositoryLinter(config ?? Config.create())
  }

  constructor(config) {
    this.#cofig = config
  }

  async lint() {
    const rules = await this.#cofig.load()
    const executions = Object.entries(rules).map(([rule, {handler, level}]) =>
      Context.create(level, handler, rule).run()
    )

    return Results.create(executions)
  }
}
