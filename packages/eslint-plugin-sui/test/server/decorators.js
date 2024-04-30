import dedent from 'dedent'
import {RuleTester} from 'eslint'

import rule from '../../src/rules/decorators.js'

// ------------------------------------------------------------------------------
// Tests
// more info: https://eslint.org/docs/latest/integrate/nodejs-api#ruletester
// ------------------------------------------------------------------------------

const resolvedBabelPresetSui = require.resolve('babel-preset-sui')
const parser = require.resolve('@babel/eslint-parser')

const ruleTester = new RuleTester({parser, parserOptions: {babelOptions: {configFile: resolvedBabelPresetSui}}})
ruleTester.run('decorators', rule, {
  valid: [
    {
      code: dedent`
        class MyUseCase extends UseCase {

          @tracer({metric: 'MyUseCase#execute'})
          @inlineError
          execute(){}
        }
      `
    }
  ],

  invalid: [
    {
      code: dedent`
        class MyUseCase extends UseCase {

          execute(){}
        }
      `,
      errors: [
        {
          message: dedent`
            All our UseCases must have an @inlineError decorator.
        `
        },
        {
          message: dedent`
            All our UseCases must have a @tracer() decorator.
        `
        }
      ]
    },
    {
      code: dedent`
        class MyUseCase extends UseCase {

          @inlineError
          execute(){}
        }
      `,
      errors: [
        {
          message: dedent`
            All our UseCases must have a @tracer() decorator.
        `
        }
      ]
    },
    {
      code: dedent`
        class MyUseCase extends UseCase {

          @tracer()
          @inlineError
          execute(){}
        }
      `,
      output: dedent`
        class MyUseCase extends UseCase {

          @tracer({metric: 'MyUseCase#execute'})
          @inlineError
          execute(){}
        }
      `,
      errors: [
        {
          message: dedent`
            Your tracer decorator should be call always with the name of your class
        `
        }
      ]
    },
    {
      code: dedent`
        class MyUseCase extends UseCase {

          @inlineError
          @tracer({metric: 'MyUseCase#execute'})
          execute(){}
        }
      `,
      errors: [
        {
          message: dedent`
            the inlineError decorator should be always the first
        `
        }
      ]
    }
  ]
})
