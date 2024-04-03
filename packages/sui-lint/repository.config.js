const RULES = {
  OFF: 0,
  WARNING: 1,
  ERROR: 2
}

module.exports = {
  plugins: ['sui'],
  rules: {
    'sui/node-version': RULES.WARNING,
    'sui/react-version': RULES.WARNING,
    'sui/package-lock': RULES.WARNING,
    'sui/github-action': RULES.WARNING,
    'sui/typescript': RULES.WARNING,
    'sui/structure': RULES.WARNING,
    'sui/sui-tools-version': RULES.WARNING,
    'sui/adv-tools-version': RULES.WARNING
  }
}
