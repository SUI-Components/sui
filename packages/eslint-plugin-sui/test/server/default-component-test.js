import dedent from 'dedent'
import {RuleTester} from 'eslint'

import rule from '../../src/rules/default-component-test.js'

const resolvedBabelPresetSui = require.resolve('babel-preset-sui')
const parser = require.resolve('@babel/eslint-parser')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser,
  parserOptions: {
    babelOptions: {configFile: resolvedBabelPresetSui}
  }
})

ruleTester.run('default-component-test', rule, {
  valid: [
    // Should ignore non-component test files
    {
      filename: '/domain/value-objects/test/car.test.js',
      code: dedent`
        describe.context.default('Car', () => {
          it('should render without crashing', () => {})
          it('should NOT render null', () => {})
          it('should NOT extend classNames', () => {})
        })
      `
    },
    // Should be valid when there are custom tests along with default ones
    {
      filename: '/components/card/alert/test/index.test.js',
      code: dedent`
        describe.context.default('CardAlert', Component => {
          it('should render without crashing', () => {})
          it('should NOT render null', () => {})
          it('should show custom alert message', () => {})
          it('should trigger onClose callback', () => {})
        })
      `
    },
    // Should be valid when all tests are custom
    {
      filename: '/components/card/alert/test/index.test.js',
      code: dedent`
        describe.context.default('CardAlert', Component => {
          it('should show title correctly', () => {})
          it('should handle click events', () => {})
        })
      `
    }
  ],

  invalid: [
    // Should detect when only default tests are present
    {
      filename: '/components/card/alert/test/index.test.js',
      code: dedent`
        describe.context.default('CardAlert', Component => {
          it('should render without crashing', () => {})
          it('should NOT render null', () => {})
          it('should NOT extend classNames', () => {})
        })
      `,
      errors: [
        {
          messageId: 'defaultTestCase',
          line: 2
        },
        {
          messageId: 'defaultTestCase',
          line: 3
        },
        {
          messageId: 'defaultTestCase',
          line: 4
        }
      ]
    },
    // Should detect individual default tests
    {
      filename: '/components/card/alert/test/index.test.js',
      code: dedent`
        describe.context.default('CardAlert', Component => {
          it('should render without crashing', () => {})
          it('should handle click events', () => {})
        })
      `,
      errors: [
        {
          messageId: 'defaultTestCase',
          line: 2
        }
      ]
    }
  ]
})
