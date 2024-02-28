module.exports.Config = class Config {
  static create() {
    return new Config()
  }

  async load() {
    const repositoryConfig = require('../../repository.config.js')

    const rules = repositoryConfig.plugins.reduce((acc, pkg) => {
      const pkgConfig = require(`lint-repository-${pkg}`)
      const rulesEntries = Object.entries(pkgConfig.rules)
        .map(([rule, handler]) => {
          const key = `${pkg}/${rule}`
          const level = repositoryConfig.rules[key]
          return level ? [key, {handler, level}] : []
        })
        .filter(([key, value]) => key && value)
      return {...acc, ...Object.fromEntries(rulesEntries)}
    }, {})

    return rules
  }
}
