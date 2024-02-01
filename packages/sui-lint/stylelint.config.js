import prettierOptions from './.prettierrc.js'

const config = {
  extends: ['stylelint-config-recommended-scss'],
  plugins: ['stylelint-prettier'],
  rules: {
    'prettier/prettier': [true, prettierOptions],
    'scss/at-rule-no-unknown': true,
    'scss/at-import-partial-extension': null, // we should consider this? extensions yes or no?
    'scss/at-import-no-partial-leading-underscore': null, // we should consider this?
    'scss/comment-no-empty': null, // we must activate this sometime
    'scss/dollar-variable-no-missing-interpolation': null, // we must activate this sometime
    'scss/no-global-function-names': null, // we must activate this sometime
    'scss/operator-no-newline-after': null,
    'scss/operator-no-unspaced': null,
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
    'font-family-name-quotes': 'always-where-recommended',
    'font-family-no-duplicate-names': true,
    'font-family-no-missing-generic-family-keyword': true,
    // 'function-calc-no-invalid': true,
    'function-calc-no-unspaced-operator': null, // we must activate this sometime
    'function-linear-gradient-no-nonstandard-direction': true,
    'function-url-quotes': 'always',
    'keyframe-declaration-no-important': true,
    'length-zero-no-unit': true,
    'media-feature-name-no-unknown': true,
    'no-descending-specificity': null, // we must activate this sometime
    'no-duplicate-at-import-rules': true,
    'no-duplicate-selectors': true,
    'no-empty-source': true,
    'no-invalid-position-at-import-rule': null, // we must activate this sometime!!
    'no-invalid-double-slash-comments': true,
    'property-no-unknown': true,
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': true,
    'string-no-newline': true,
    'unit-no-unknown': true
  }
}

export default config
