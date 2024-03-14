import dedent from 'dedent'
import {RuleTester} from 'eslint'

import rule from '../../src/rules/factory-pattern.js'

// ------------------------------------------------------------------------------
// Tests
// more info: https://eslint.org/docs/latest/integrate/nodejs-api#ruletester
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions: {ecmaVersion: 2018, sourceType: 'module'}})
ruleTester.run('factory-pattern', rule, {
  valid: [
    {
      code: dedent`
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
        }`,
      errors: [
        {
          message: dedent`
            You have to define at least one static function that return an instance of your class.
            Avoid to use the 'new' keyword directly in your code.
            Use always a factory function
        `
        }
      ]
    },
    {
      code: dedent`
        class Config {
          static create() {
            return {API_URL: 'google.com'}
          }
        }
      `,
      errors: [
        {
          message: dedent`
            You have to define at least one static function that return an instance of your class.
            Avoid to use the 'new' keyword directly in your code.
            Use always a factory function
        `
        }
      ]
    },
    {
      code: dedent`
        class Config {
          static create() {
            return () => {}
          }
        }
      `,
      errors: [
        {
          message: dedent`
            You have to define at least one static function that return an instance of your class.
            Avoid to use the 'new' keyword directly in your code.
            Use always a factory function
        `
        }
      ]
    },
    {
      code: dedent`
        export default class extends Model {}
      `,
      errors: [
        {
          message: dedent`
            You have to define at least one static function that return an instance of your class.
            Avoid to use the 'new' keyword directly in your code.
            Use always a factory function
        `
        }
      ]
    }
  ]
})
