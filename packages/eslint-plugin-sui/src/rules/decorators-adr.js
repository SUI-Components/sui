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
        You have to use the @AsyncInlineError() decorator in your UseCase execute method
        `,
      asyncInlineErrorDecoratorIsNotFirst: dedent`
        The @AsyncInlineError() decorator should be the first one
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
          const decorators = executeFn?.decorators
          const isAsyncInlineErrorFirstDecorator = decorators?.[0]?.expression?.callee?.name === 'AsyncInlineError'
          const hasAsyncInlineError = decorators?.find(
            decorator => decorator.expression.callee.name === 'AsyncInlineError'
          )

          // TODO comprobar orden de decoradores, inlineError el primero
          // TODO validar en services
          // TODO validar en repositories
          // TODO quickFix implementar
          if (!hasAsyncInlineError) {
            context.report({
              node: executeFn.key,
              messageId: 'notFoundAsyncInlineErrorDecorator'
            })
          }

          if (hasAsyncInlineError && !isAsyncInlineErrorFirstDecorator) {
            context.report({
              node: decorators[0],
              messageId: 'asyncInlineErrorDecoratorIsNotFirst'
            })
          }
        }
      }
    }
  }
}
