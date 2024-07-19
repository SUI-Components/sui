const prettierOptions = require('./.prettierrc.js')

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
  'react/no-did-update-set-state': RULES.ERROR,
  'react/no-direct-mutation-state': RULES.ERROR,
  'react/no-is-mounted': RULES.WARNING,
  'react/no-multi-comp': [RULES.WARNING, {ignoreStateless: true}],
  'react/no-unused-prop-types': RULES.WARNING,
  'react/no-unknown-property': RULES.ERROR,
  'react/prop-types': RULES.ERROR,
  'react/react-in-jsx-scope': RULES.OFF,
  'react/require-render-return': RULES.WARNING,
  'react/no-unstable-nested-components': RULES.WARNING
}

const TESTING_RULES = {
  'chai-friendly/no-unused-expressions': [RULES.ERROR, {allowShortCircuit: true, allowTernary: true}],
  'no-only-tests/no-only-tests': RULES.ERROR
}

const JEST_TESTING_RULES = {
  'react/display-name': RULES.OFF,
  'jest/consistent-test-it': RULES.OFF,
  'jest/expect-expect': RULES.OFF,
  'jest/max-expects': RULES.OFF,
  'jest/max-nested-describe': RULES.ERROR,
  'jest/no-alias-methods': RULES.OFF,
  'jest/no-commented-out-tests': RULES.WARNING,
  'jest/no-conditional-expect': RULES.ERROR,
  'jest/no-conditional-in-test': RULES.ERROR,
  'jest/no-deprecated-functions': RULES.ERROR,
  'jest/no-disabled-tests': RULES.WARNING,
  'jest/no-done-callback': RULES.ERROR,
  'jest/no-duplicate-hooks': RULES.OFF,
  'jest/no-export': RULES.ERROR,
  'jest/no-focused-tests': RULES.ERROR,
  'jest/no-hooks': RULES.OFF,
  'jest/no-identical-title': RULES.ERROR,
  'jest/no-if': RULES.ERROR,
  'jest/no-interpolation-in-snapshots': RULES.ERROR,
  'jest/no-jasmine-globals': RULES.OFF,
  'jest/no-large-snapshots': [RULES.WARNING, {maxSize: 300}],
  'jest/no-mocks-import': RULES.ERROR,
  'jest/no-restricted-matchers': RULES.OFF,
  'jest/no-standalone-expect': RULES.OFF,
  'jest/no-test-prefixes': RULES.ERROR,
  'jest/no-test-return-statement': RULES.OFF,
  'jest/prefer-called-with': RULES.ERROR,
  'jest/prefer-comparison-matcher': RULES.ERROR,
  'jest/prefer-each': RULES.ERROR,
  'jest/prefer-equality-matcher': RULES.ERROR,
  'jest/prefer-expect-assertions': RULES.OFF,
  'jest/prefer-expect-resolves': RULES.OFF,
  'jest/prefer-hooks-in-order': RULES.ERROR,
  'jest/prefer-hooks-on-top': RULES.ERROR,
  'jest/prefer-lowercase-title': RULES.OFF,
  'jest/prefer-mock-promise-shorthand': RULES.ERROR,
  'jest/prefer-snapshot-hint': RULES.ERROR,
  'jest/prefer-spy-on': RULES.OFF,
  'jest/prefer-strict-equal': RULES.OFF,
  'jest/prefer-to-be': RULES.OFF,
  'jest/prefer-to-contain': RULES.WARNING,
  'jest/prefer-to-have-length': RULES.WARNING,
  'jest/prefer-todo': RULES.WARNING,
  'jest/require-hook': RULES.OFF,
  'jest/require-to-throw-message': RULES.OFF,
  'jest/require-top-level-describe': RULES.OFF,
  'jest/unbound-method': RULES.OFF,
  'jest/valid-describe-callback': RULES.ERROR,
  'jest/valid-expect': RULES.ERROR,
  'jest/valid-expect-in-promise': RULES.ERROR,
  'jest/valid-title': RULES.WARNING,
  'jest-dom/prefer-checked': RULES.ERROR,
  'jest-dom/prefer-empty': RULES.ERROR,
  'jest-dom/prefer-enabled-disabled': RULES.ERROR,
  'jest-dom/prefer-focus': RULES.ERROR,
  'jest-dom/prefer-in-document': RULES.ERROR,
  'jest-dom/prefer-required': RULES.ERROR,
  'jest-dom/prefer-to-have-attribute': RULES.ERROR,
  'jest-dom/prefer-to-have-class': RULES.ERROR,
  'jest-dom/prefer-to-have-style': RULES.ERROR,
  'jest-dom/prefer-to-have-text-content': RULES.ERROR,
  'jest-dom/prefer-to-have-value': RULES.ERROR
}

const TESTING_LIBRARY_RULES = {
  'testing-library/await-async-events': RULES.WARNING,
  'testing-library/await-async-queries': RULES.WARNING,
  'testing-library/await-async-utils': RULES.WARNING,
  'testing-library/consistent-data-testid': RULES.OFF,
  'testing-library/no-await-sync-events': RULES.WARNING,
  'testing-library/no-await-sync-queries': RULES.WARNING,
  'testing-library/no-container': RULES.WARNING,
  'testing-library/no-debugging-utils': RULES.WARNING,
  'testing-library/no-dom-import': RULES.WARNING,
  'testing-library/no-global-regexp-flag-in-query': RULES.WARNING,
  'testing-library/no-manual-cleanup': RULES.WARNING,
  'testing-library/no-node-access': RULES.WARNING,
  'testing-library/no-promise-in-fire-event': RULES.WARNING,
  'testing-library/no-render-in-lifecycle': RULES.WARNING,
  'testing-library/no-unnecessary-act': RULES.WARNING,
  'testing-library/no-wait-for-multiple-assertions': RULES.WARNING,
  'testing-library/no-wait-for-side-effects': RULES.WARNING,
  'testing-library/no-wait-for-snapshot': RULES.WARNING,
  'testing-library/prefer-explicit-assert': RULES.WARNING,
  'testing-library/prefer-find-by': RULES.WARNING,
  'testing-library/prefer-implicit-assert': RULES.WARNING,
  'testing-library/prefer-presence-queries': RULES.WARNING,
  'testing-library/prefer-query-matchers': RULES.WARNING,
  'testing-library/prefer-screen-queries': RULES.WARNING,
  'testing-library/prefer-user-event': RULES.WARNING,
  'testing-library/render-result-naming-convention': RULES.WARNING
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
  ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
  // Style imports.
  ['^.+\\.s?css$']
]

let resolvedBabelPresetSui
try {
  resolvedBabelPresetSui = require.resolve('babel-preset-sui')
} catch {}

const parser = resolvedBabelPresetSui ? '@babel/eslint-parser' : undefined

module.exports = {
  parser,

  env: {
    es6: true,
    mocha: true,
    'jest/globals': true
  },

  globals: {
    'cypress/globals': true,
    preval: 'readonly'
  },

  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    babelOptions: {
      configFile: resolvedBabelPresetSui
    }
  },

  settings: {
    react: {
      version: 'detect'
    }
  },

  extends: ['standard', 'plugin:cypress/recommended', 'prettier'],

  plugins: [
    '@babel',
    'chai-friendly',
    'no-only-tests',
    'prettier',
    'react',
    'react-hooks',
    'simple-import-sort',
    'jest',
    'jest-dom',
    'sui'
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
    'no-unused-vars': [RULES.ERROR, {args: 'none', ignoreRestSiblings: true, varsIgnorePattern: 'React'}],
    'no-var': RULES.WARNING,
    strict: RULES.OFF,
    'prefer-regex-literals': RULES.WARNING,
    'prettier/prettier': [RULES.ERROR, prettierOptions],
    'simple-import-sort/imports': [RULES.WARNING, {groups: IMPORT_SORT_GROUPS}],
    'react/jsx-no-bind': RULES.OFF,
    'sui/commonjs': RULES.WARNING,
    'sui/layers-arch': RULES.WARNING
  },
  overrides: [
    {
      files: ['**/domain/src/**', 'domain/src/**'],
      plugins: ['sui'],
      rules: {
        'sui/factory-pattern': RULES.WARNING,
        'sui/serialize-deserialize': RULES.WARNING,
        'sui/decorators': RULES.WARNING,
        'sui/private-attributes-model': RULES.WARNING
      }
    },
    {
      files: ['**/*.+(ts|tsx)'],
      extends: ['standard-with-typescript', 'standard-react', 'prettier'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json'
      },
      rules: {
        'import/extensions': RULES.OFF,
        'no-return-await': RULES.OFF,
        'prettier/prettier': [RULES.ERROR, prettierOptions],
        'react/react-in-jsx-scope': RULES.OFF,
        'react/no-unused-prop-types': RULES.OFF,
        '@typescript-eslint/explicit-function-return-type': [RULES.OFF, {allowTypedFunctionExpressions: false}],
        'chai-friendly/no-unused-expressions': RULES.ERROR,
        '@typescript-eslint/no-unused-expressions': RULES.OFF,
        '@typescript-eslint/return-await': RULES.OFF
      }
    },
    {
      files: ['**/__tests__/**/*.js'],
      rules: JEST_TESTING_RULES
    },
    {
      files: ['**/components/**/__tests__/*.test.js', 'components/**/__tests__/*.test.js'],
      plugins: ['testing-library'],
      rules: {
        ...TESTING_LIBRARY_RULES
      }
    }
  ]
}
