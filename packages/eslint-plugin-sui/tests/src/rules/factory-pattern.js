/**
 * @fileoverview Ensure that our classes are using the convetion of has a static create method as factory.
 * @author factory pattern
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
import {RuleTester} from 'eslint'

import rule from '../../../src/rules/factory-pattern'

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('factory-pattern', rule, {
  valid: [
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: "class Model { constructor() { this.name = 'John Doe' }  }",
      errors: [{message: 'Fill me in.', type: 'Me too'}]
    }
  ]
})
