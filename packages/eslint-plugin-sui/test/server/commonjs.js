import dedent from 'dedent'
import {RuleTester} from 'eslint'

import rule from '../../src/rules/commonjs.js'

const resolvedBabelPresetSui = require.resolve('babel-preset-sui')
const parser = require.resolve('@babel/eslint-parser')

// ------------------------------------------------------------------------------
// Tests
// more info: https://eslint.org/docs/latest/integrate/nodejs-api#ruletester
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parser, parserOptions: {babelOptions: {configFile: resolvedBabelPresetSui}}})
ruleTester.run('esm', rule, {
  valid: [
    {
      code: dedent`
        class User {
          static create() { return new User() }
        }
      `
    },
    {
      code: dedent`
        import { createRequire } from "module"
        const require = createRequire(import.meta.url)

        require('whatever')

        class User {
          static create() { return new User() }
        }
      `
    }
  ],

  invalid: [
    {
      code: dedent`
        class Model {
          constructor() { this.name = 'John Doe' }
        }
        module.exports = Model
      `,
      errors: [
        {
          message: dedent`
            Use module.* should be avoid.
        `
        }
      ]
    },
    {
      code: dedent`
        const deps = require('my-dep')
        class Config {
          static create() {
            return {API_URL: 'google.com'}
          }
        }
      `,
      errors: [
        {
          message: dedent`
            Use require function should be avoid.
        `
        }
      ]
    },
    {
      code: dedent`
        const path = require.resolve('my-dep')
      `,
      errors: [
        {
          message: dedent`
            Use require.resolve function should be avoid.
        `
        }
      ]
    },
    {
      code: dedent`
         console.log(require.main)
      `,
      errors: [
        {
          message: dedent`
            Use require.cache or require.extensions or require.main should be avoid.
        `
        }
      ]
    },
    {
      code: dedent`
         console.log(require.cache)
      `,
      errors: [
        {
          message: dedent`
            Use require.cache or require.extensions or require.main should be avoid.
        `
        }
      ]
    },
    {
      code: dedent`
         console.log(require.extensions)
      `,
      errors: [
        {
          message: dedent`
            Use require.cache or require.extensions or require.main should be avoid.
        `
        }
      ]
    },
    {
      code: dedent`
        console.log(__dirname)
      `,
      errors: [
        {
          message: dedent`
            __dirname should be avoid
        `
        }
      ]
    },
    {
      code: dedent`
        console.log(__filename)
      `,
      errors: [
        {
          message: dedent`
            __filename should be avoid
        `
        }
      ]
    },
    {
      code: dedent`
        module.require(id)
      `,
      errors: [
        {
          message: dedent`
            Use module.require function should be avoid.
        `
        }
      ]
    }
  ]
})
