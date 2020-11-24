const prettierOptions = require('./.prettierrc')

const RULES = {
  OFF: 0,
  WARNING: 1,
  ERROR: 2
}

const ACCESIBILITY_RULES = {
  'jsx-a11y/accessible-emoji': RULES.WARNING,
  'jsx-a11y/alt-text': RULES.WARNING,
  'jsx-a11y/anchor-has-content': RULES.WARNING,
  'jsx-a11y/anchor-is-valid': RULES.WARNING,
  'jsx-a11y/aria-activedescendant-has-tabindex': RULES.WARNING,
  'jsx-a11y/aria-props': RULES.WARNING,
  'jsx-a11y/aria-proptypes': RULES.WARNING,
  'jsx-a11y/aria-role': RULES.WARNING,
  'jsx-a11y/aria-unsupported-elements': RULES.WARNING,
  // 'jsx-a11y/autocomplete-valid': RULES.WARNING, // we need to update eslint for this
  'jsx-a11y/click-events-have-key-events': RULES.WARNING,
  'jsx-a11y/control-has-associated-label': [
    'off',
    {
      ignoreElements: [
        'audio',
        'canvas',
        'embed',
        'input',
        'textarea',
        'tr',
        'video'
      ],
      ignoreRoles: [
        'grid',
        'listbox',
        'menu',
        'menubar',
        'radiogroup',
        'row',
        'tablist',
        'toolbar',
        'tree',
        'treegrid'
      ],
      includeRoles: ['alert', 'dialog']
    }
  ],
  'jsx-a11y/heading-has-content': RULES.WARNING,
  'jsx-a11y/html-has-lang': RULES.WARNING,
  'jsx-a11y/iframe-has-title': RULES.WARNING,
  'jsx-a11y/img-redundant-alt': RULES.WARNING,
  'jsx-a11y/interactive-supports-focus': [
    RULES.WARNING,
    {
      tabbable: [
        'button',
        'checkbox',
        'link',
        'searchbox',
        'spinbutton',
        'switch',
        'textbox'
      ]
    }
  ],
  'jsx-a11y/label-has-associated-control': RULES.WARNING,
  'jsx-a11y/label-has-for': 'off',
  'jsx-a11y/media-has-caption': RULES.WARNING,
  'jsx-a11y/mouse-events-have-key-events': RULES.WARNING,
  'jsx-a11y/no-access-key': RULES.WARNING,
  'jsx-a11y/no-autofocus': RULES.WARNING,
  'jsx-a11y/no-distracting-elements': RULES.WARNING,
  'jsx-a11y/no-interactive-element-to-noninteractive-role': [
    RULES.WARNING,
    {
      tr: ['none', 'presentation']
    }
  ],
  'jsx-a11y/no-noninteractive-element-interactions': [
    RULES.WARNING,
    {
      handlers: [
        'onClick',
        'onError',
        'onLoad',
        'onMouseDown',
        'onMouseUp',
        'onKeyPress',
        'onKeyDown',
        'onKeyUp'
      ],
      alert: ['onKeyUp', 'onKeyDown', 'onKeyPress'],
      body: ['onError', 'onLoad'],
      dialog: ['onKeyUp', 'onKeyDown', 'onKeyPress'],
      iframe: ['onError', 'onLoad'],
      img: ['onError', 'onLoad']
    }
  ],
  'jsx-a11y/no-noninteractive-element-to-interactive-role': [
    RULES.WARNING,
    {
      ul: [
        'listbox',
        'menu',
        'menubar',
        'radiogroup',
        'tablist',
        'tree',
        'treegrid'
      ],
      ol: [
        'listbox',
        'menu',
        'menubar',
        'radiogroup',
        'tablist',
        'tree',
        'treegrid'
      ],
      li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
      table: ['grid'],
      td: ['gridcell']
    }
  ],
  'jsx-a11y/no-noninteractive-tabindex': [
    RULES.WARNING,
    {
      tags: [],
      roles: ['tabpanel'],
      allowExpressionValues: true
    }
  ],
  'jsx-a11y/no-onchange': RULES.WARNING,
  'jsx-a11y/no-redundant-roles': RULES.WARNING,
  'jsx-a11y/no-static-element-interactions': [
    RULES.WARNING,
    {
      allowExpressionValues: true,
      handlers: [
        'onClick',
        'onMouseDown',
        'onMouseUp',
        'onKeyPress',
        'onKeyDown',
        'onKeyUp'
      ]
    }
  ],
  'jsx-a11y/role-has-required-aria-props': RULES.WARNING,
  'jsx-a11y/role-supports-aria-props': RULES.WARNING,
  'jsx-a11y/scope': RULES.WARNING,
  'jsx-a11y/tabindex-no-positive': RULES.WARNING
}

const REACT_RULES = {
  'react-hooks/exhaustive-deps': RULES.WARNING, // Checks effect dependencies
  'react-hooks/rules-of-hooks': RULES.ERROR, // Checks rules of Hooks
  'react/default-props-match-prop-types': RULES.WARNING,
  'react/jsx-handler-names': RULES.WARNING,
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
    'prettier',
    'plugin:cypress/recommended',
    'prettier/standard',
    'prettier/react'
  ],
  plugins: [
    '@babel',
    'chai-friendly',
    'jsx-a11y',
    'no-only-tests',
    'prettier',
    'react-hooks'
  ],
  rules: {
    ...ACCESIBILITY_RULES,
    ...REACT_RULES,
    ...TESTING_RULES,
    'accessor-pairs': RULES.OFF,
    '@babel/no-unused-expressions': RULES.OFF,
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
    'prettier/prettier': [RULES.ERROR, prettierOptions]
  }
}
