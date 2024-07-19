/**
 * @fileoverview Ensure that method using @Deprecated() displays a warning alert
 */
'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure that method using @Deprecated() displays a warning alert',
      recommended: true,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: 'code',
    schema: [],
    messages: {}
  },
  create: function (context) {
    // TODO: Check using decorator in a Class.

    return {
      MethodDefinition(node) {
        // Method
        const method = node

        // Method decorators
        const methodDecorators = method.decorators
        const hasDecorators = methodDecorators?.length > 0

        if (!hasDecorators) return

        // Get the @Deprecated() decorator from method
        const deprecatedDecoratorNode =
          hasDecorators && methodDecorators?.find(decorator => decorator?.expression?.callee?.name === 'Deprecated')

        if (!deprecatedDecoratorNode) return

        // RULE: Mark method with a warning
        context.report({
          node: method.key,
          message: 'This method is marked as a deprecated.'
        })
      }
    }
  }
}
