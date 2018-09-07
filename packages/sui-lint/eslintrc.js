const prettierOptions = require('./.prettierrc.js')

const RULES = {
  OFF: 0,
  WARNING: 1,
  ERROR: 2
}

module.exports = {
  env: {
    mocha: true
  },
  extends: [
    'standard',
    'standard-react',
    'prettier',
    'prettier/standard',
    'prettier/react'
  ],
  parser: 'babel-eslint',
  plugins: ['chai-friendly', 'no-only-tests', 'prettier'],
  rules: {
    'chai-friendly/no-unused-expressions': [
      RULES.ERROR,
      {allowShortCircuit: true, allowTernary: true}
    ],
    'no-console': RULES.WARNING,
    'no-debugger': RULES.ERROR,
    'no-nested-ternary': RULES.WARNING,
    'no-only-tests/no-only-tests': RULES.ERROR,
    'no-unused-expressions': RULES.OFF,
    'react/default-props-match-prop-types': RULES.WARNING,
    'react/jsx-no-duplicate-props': [RULES.WARNING, {ignoreCase: true}],
    'react/jsx-no-undef': RULES.WARNING,
    'react/jsx-pascal-case': [
      RULES.WARNING,
      {
        allowAllCaps: true,
        ignore: []
      }
    ],
    'react/jsx-uses-react': RULES.WARNING,
    'react/jsx-uses-vars': RULES.WARNING,
    'react/no-deprecated': RULES.WARNING,
    'react/no-direct-mutation-state': RULES.ERROR,
    'react/no-is-mounted': RULES.WARNING,
    'react/no-multi-comp': [RULES.WARNING, {ignoreStateless: true}],
    'react/no-unused-prop-types': RULES.WARNING,
    'react/react-in-jsx-scope': RULES.WARNING,
    'react/require-render-return': RULES.WARNING,
    strict: RULES.OFF,
    'prettier/prettier': [RULES.ERROR, prettierOptions]
  }
}
