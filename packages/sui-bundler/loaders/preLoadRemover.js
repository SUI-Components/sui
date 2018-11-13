module.exports = function({config, preLoader}) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: config.module.rules.filter(
        rule => preLoader || rule.enforce !== 'pre'
      )
    }
  }
}
