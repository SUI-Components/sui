module.exports.Config = class Config {
  static create() {
    return new Config()
  }

  async load() {
    const repositoryConfig = this.requireConfig()

    const rules = repositoryConfig.plugins.reduce((acc, pkg) => {
      const pkgConfig = this.requirePkg(pkg)
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

  requireConfig() {
    return require('../../repository.config.js')
  }

  requirePkg(pkg) {
    return require(`lint-repository-${pkg}`)
  }
}
