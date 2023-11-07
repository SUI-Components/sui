/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

// TODO: add sui jest common config
const jestConfig = {
  testMatch: [
    '**/__tests__/**/suite/**/?(*.)+(test).+(ts|tsx|js|jsx)',
    '**/__tests__/**/*.(client|browser)+.*.(ts|tsx|js|jsx)',
    '!**/__tests__/**/*server*'
  ]
}

module.exports = jestConfig
