const prettierOptions = require('./.prettierrc.js')

module.exports = {
  extends: ['stylelint-config-recommended-scss'],
  plugins: ['stylelint-prettier'],
  rules: {
    'prettier/prettier': [true, prettierOptions],
    'scss/at-rule-no-unknown': true,
    'scss/at-import-partial-extension': {severity: 'warning'},
    'scss/at-import-no-partial-leading-underscore': {severity: 'warning'},
    'scss/comment-no-empty': {severity: 'warning'},
    'scss/dollar-variable-no-missing-interpolation': {severity: 'warning'},
    'scss/no-global-function-names': {severity: 'warning'},
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
    'no-invalid-position-at-import-rule': 'warning',
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
