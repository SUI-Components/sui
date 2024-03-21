import dedent from 'dedent'
import {RuleTester} from 'eslint'

import rule from '../../src/rules/serialize-deserialize.js'

// ------------------------------------------------------------------------------
// Tests
// more info: https://eslint.org/docs/latest/integrate/nodejs-api#ruletester
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions: {ecmaVersion: 2018}})
ruleTester.run('serialize-deserialize', rule, {
  valid: [
    {
      code: dedent`
        class User {
          static create({id, name}) { return new User(id, name) }
          constructor(id, name) {
            this.id = id
            this.name = name
          }
          toJSON() {
            return {
              id: this.id,
              name: this.name
            }
          }
        }
      `
    },
    {
      code: dedent`
        class User {
          static create({id, name}) { return new User(id, name) }
          constructor(id, name) {
            this.id = id
            this.name = name
          }
          toJSON() {
            const name="John"
            const surname="Doe"

            return {
              id: this.id,
              name: this.name
            }
          }
        }
      `
    }
  ],

  invalid: [
    {
      code: dedent`
        class User {
          static create({id, name}) { return new User(id, name) }
          constructor(id, name) {
            this.id = id
            this.name = name
          }
          toJSON() {
            return this.id
          }
        }
      `,
      errors: [
        {
          message: dedent`toJSON should return an object`
        }
      ]
    },
    {
      code: dedent`
        class User {
          constructor(id, name) {
            this.id = id
            this.name = name
          }
          toJSON() {
            return {
              Noid: this.id,
              Noname: this.name
            }
          }
        }
      `,
      errors: [
        {
          message: dedent`
          If your class has a 'toJSON' method. You have to define a 'static create' method too.
          The output of the 'toJSON' should be the same as the input of your 'static create' method
          `
        }
      ]
    },
    {
      code: dedent`
        class User {
          static create({id, name}) { return new User(id, name) }
          constructor(id, name) {
            this.id = id
            this.name = name
          }
          toJSON() {
            return {
              Noid: this.id,
              Noname: this.name
            }
          }
        }
      `,
      errors: [{message: 'Missing toJSON properties (id, name)'}]
    },
    {
      code: dedent`
        class User {
          static create({id, name}) { return new User(id, name) }
          constructor(id, name) {
            this.id = id
            this.name = name
          }
          toJSON() {
            return {
              Noid: this.id,
              ...this.user.toJSON()
            }
          }
        }
      `,
      errors: [
        {
          message: dedent`
      Spread operation are not allowed as part of the toJSON function.
      The output of the 'toJSON' should be the same as the input of your 'static create' method
      `
        }
      ]
    }
  ]
})
