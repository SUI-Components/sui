const prettierOptions = require('./.prettierrc')

const RULES = {
  OFF: 0,
  WARNING: 1,
  ERROR: 2
}

const REACT_RULES = {
  'react-hooks/exhaustive-deps': RULES.WARNING, // Checks effect dependencies
  'react-hooks/rules-of-hooks': RULES.ERROR, // Checks rules of Hooks
  'react/default-props-match-prop-types': RULES.WARNING,
  'react/jsx-handler-names': RULES.WARNING,
  'react/jsx-no-bind': RULES.WARNING,
  'react/jsx-no-duplicate-props': [RULES.WARNING, {ignoreCase: true}],
  'react/jsx-no-undef': RULES.WARNING,
  'react/jsx-pascal-case': [
    RULES.WARNING,
    {
      allowAllCaps: true,
      ignore: []
    }
  ],
  'react/jsx-uses-react': RULES.OFF,
  'react/jsx-uses-vars': RULES.WARNING,
  'react/no-deprecated': RULES.WARNING,
  'react/no-direct-mutation-state': RULES.ERROR,
  'react/no-is-mounted': RULES.WARNING,
  'react/no-multi-comp': [RULES.WARNING, {ignoreStateless: true}],
  'react/no-unused-prop-types': RULES.WARNING,
  'react/react-in-jsx-scope': RULES.OFF,
  'react/require-render-return': RULES.WARNING
}

const TESTING_RULES = {
  'chai-friendly/no-unused-expressions': [
    RULES.ERROR,
    {allowShortCircuit: true, allowTernary: true}
  ],
  'no-only-tests/no-only-tests': RULES.ERROR
}

const IMPORT_SORT_GROUPS = [
  // Side effect and polyfill imports.
  ['^\\u0000'],
  // Built-in node dependencies
  [
    '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)'
  ],
  // Packages. `react` related packages come first.
  ['^react'],
  // Standalone packages.
  ['^\\w'],
  // Generic organization packages.
  ['^@'],
  // S-UI & ADV-UI organization packages.
  ['^@s-ui', '^@adv-ui'],
  // Relative imports. Put `./` last.
  [
    '^\\.\\.(?!/?$)',
    '^\\.\\./?$',
    '^\\./(?=.*/)(?!/?$)',
    '^\\.(?!/?$)',
    '^\\./?$'
  ],
  // Style imports.
  ['^.+\\.s?css$']
]

let resolvedBabelPresetSui
try {
  resolvedBabelPresetSui = require.resolve('babel-preset-sui')
} catch {}

const parser = resolvedBabelPresetSui ? '@babel/eslint-parser' : undefined

module.exports = {
  env: {
    es6: true,
    mocha: true
  },
  globals: {
    'cypress/globals': true,
    preval: 'readonly'
  },
  parser,
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    babelOptions: {
      configFile: resolvedBabelPresetSui
    }
  },
  extends: [
    'standard',
    'standard-react',
    'plugin:cypress/recommended',
    'prettier'
  ],
  plugins: [
    '@babel',
    'chai-friendly',
    'no-only-tests',
    'prettier',
    'react-hooks',
    'simple-import-sort'
  ],
  rules: {
    ...REACT_RULES,
    ...TESTING_RULES,
    '@babel/no-unused-expressions': RULES.OFF,
    'accessor-pairs': RULES.OFF,
    'array-callback-return': RULES.WARNING,
    'import/no-webpack-loader-syntax': RULES.WARNING,
    'import/extensions': [RULES.WARNING, 'always', {ignorePackages: true}],
    'n/no-path-concat': RULES.WARNING,
    'no-console': RULES.WARNING,
    'no-debugger': RULES.ERROR,
    'no-nested-ternary': RULES.WARNING,
    'no-prototype-builtins': RULES.OFF,
    'no-return-await': RULES.WARNING,
    'no-unused-expressions': RULES.OFF,
    'no-unused-vars': [
      RULES.ERROR,
      {args: 'none', ignoreRestSiblings: true, varsIgnorePattern: 'React'}
    ],
    'no-var': RULES.WARNING,
    strict: RULES.OFF,
    'prefer-regex-literals': RULES.WARNING,
    'prettier/prettier': [RULES.ERROR, prettierOptions],
    'simple-import-sort/imports': [RULES.WARNING, {groups: IMPORT_SORT_GROUPS}]
  },
  overrides: [
    {
      files: ['**/*.+(ts|tsx)'],
      extends: ['standard-with-typescript', 'standard-react'],
      parserOptions: {
        project: './tsconfig.json'
      },
      rules: {
        'no-return-await': RULES.OFF,
        'prettier/prettier': RULES.OFF,
        'react/react-in-jsx-scope': RULES.OFF
      }
    }
  ]
}
