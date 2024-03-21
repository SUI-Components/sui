/**
 * @fileoverview Ensure that our classes are using the convetion of has a static create method as factory.
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
    type: 'warning',
    docs: {
      description: 'ensure to define at least one factory function',
      recommended: true,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: null,
    schema: [],
    messages: {
      notFoundFactoryFunction: dedent`
      You have to define at least one static function that return an instance of your class.
      Avoid to use the 'new' keyword directly in your code.
      Use always a factory function
      `
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
      ClassDeclaration(node) {
        const hasStaticFactoryMethod = Boolean(
          node.body?.body?.find(methodDefinition => {
            return (
              methodDefinition.static &&
              methodDefinition.value?.body?.body?.find?.(body => body.type === 'ReturnStatement')?.argument?.callee?.name === node?.id?.name // eslint-disable-line
            )
          })
        )

        if (!hasStaticFactoryMethod) {
          context.report({
            node: node?.id ?? node.superClass ?? node,
            messageId: 'notFoundFactoryFunction'
          })
        }
      }
    }
  }
}
