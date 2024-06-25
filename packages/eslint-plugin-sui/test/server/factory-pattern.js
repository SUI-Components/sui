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
          static create() {
            return new User()
          }
        }
      `
    },
    {
      code: dedent`
        class User extends UseCase {
          static create() {
            return new User()
          }
        }
        export const factory = User.create
      `
    }
  ],

  invalid: [
    {
      code: dedent`
        class Model {
          constructor() {
            this.name = 'John Doe'
          }
        }
      `,
      errors: [
        {
          message: dedent`
      You have to define at least one static method that returns an instance of your class.
      Avoid using the 'new' keyword directly in your code.
      Always use a factory function
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
      You have to define at least one static method that returns an instance of your class.
      Avoid using the 'new' keyword directly in your code.
      Always use a factory function
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
      You have to define at least one static method that returns an instance of your class.
      Avoid using the 'new' keyword directly in your code.
      Always use a factory function
      `
        }
      ]
    },
    {
      code: dedent`
        class Config extends UseCase {
          static create() {
            return new Config()
          }
        }
      `,
      errors: [
        {
          message: dedent`
      You have to define a constant named 'factory' that returns the create method.
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
      You have to define at least one static method that returns an instance of your class.
      Avoid using the 'new' keyword directly in your code.
      Always use a factory function
      `
        }
      ]
    }
  ]
})
