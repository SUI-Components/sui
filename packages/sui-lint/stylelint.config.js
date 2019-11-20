const prettierOptions = require('./.prettierrc')

function suitSelector(componentName) {
  const ns = '[a-z]{2,3}'
  const WORD = '[a-z0-9][a-zA-Z0-9]*'
  const descendant = `(?:-${WORD})?`
  const modifier = `(?:--${WORD}(?:\\.${ns}${componentName}${descendant}--${WORD})*)?`
  const attribute = '(?:\\[.+\\])?'
  const state = `(?:\\.(is|has)-${WORD})*`
  const body = descendant + modifier + attribute + state
  return new RegExp(`^\\.${ns}${componentName}\\b${body}$`)
}

module.exports = {
  plugins: [
    'stylelint-selector-bem-pattern',
    'stylelint-scss',
    'stylelint-prettier'
  ],
  rules: {
    'prettier/prettier': [true, prettierOptions],
    'plugin/selector-bem-pattern': {
      componentName: /^[a-zA-Z]+$/,
      componentSelectors: suitSelector
    },
    'scss/at-rule-no-unknown': true,
    'at-rule-no-unknown': null,
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'comment-no-empty': true,
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates-with-different-values'] // useful for fallback properties
      }
    ],
    'declaration-block-no-shorthand-property-overrides': true,
    'font-family-no-duplicate-names': true,
    'font-family-no-missing-generic-family-keyword': true,
    // 'function-calc-no-invalid': true,
    'function-calc-no-unspaced-operator': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    'keyframe-declaration-no-important': true,
    'media-feature-name-no-unknown': true,
    'no-descending-specificity': null, // we must activate this sometime
    'no-duplicate-at-import-rules': true,
    'no-duplicate-selectors': true,
    'no-empty-source': true,
    'no-invalid-double-slash-comments': true,
    'number-leading-zero': 'always',
    'property-no-unknown': true,
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': true,
    'string-quotes': 'single',
    'string-no-newline': true,
    'unit-no-unknown': true
  }
}
