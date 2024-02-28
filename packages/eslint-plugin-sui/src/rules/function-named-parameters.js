/**
 * @fileoverview Ensure that our function are using always named parameters
 * @author factory pattern
 */
'use strict'

const dedent = require('string-dedent')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'ensure to use named parameters',
      recommended: true,
      url: null
    },
    fixable: null,
    schema: [],
    messages: {
      badFileName: dedent``,
      badClassName: dedent``
    }
  },
  create: function (context) {
    // variables should be defined here

    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return {
      ClassDeclaration(node) {}
    }
  }
}
