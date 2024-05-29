/**
 * @fileoverview Ensure that at least all your UseCases are using @AsyncInlineError decorator from sui
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
      description: 'Ensure that at least all your UseCases are using @AsyncInlineError decorator from sui',
      recommended: true,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: 'code',
    schema: [],
    messages: {
      notFoundAsyncInlineErrorDecorator: dedent`
        You have to use the @AsyncInlineError decorator in your UseCase execute method
        `
    }
  },
  create: function (context) {
    // Estamos en una clase UseCase

    return {
      ClassDeclaration(node) {
        const executeFn = node?.body?.body?.find(
          methodDefinition => methodDefinition.type === 'MethodDefinition' && methodDefinition.key.name === 'execute'
        )

        if (executeFn) {
          const hasDecorator = executeFn?.decorators?.find(
            decorator => decorator.expression.callee.name === 'AsyncInlineError'
          )

          // TODO comprobar orden de decoradores, inlineError el primero
          // TODO validar en services
          // TODO validar en repositories
          // TODO quickFix implementar
          if (!hasDecorator)
            context.report({
              node: executeFn.key,
              messageId: 'notFoundAsyncInlineErrorDecorator'
            })
        }
      }
    }
  }
}
