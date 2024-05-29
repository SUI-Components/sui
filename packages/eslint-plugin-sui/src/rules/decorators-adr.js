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

        // Pepe
        // AsyncInlineErrror
        // function()

        if (executeFn) {
          const decorators = executeFn?.decorators
          const isAsyncInlineErrorLastDecorator = decorators?.at(-1)?.expression?.callee?.name === 'AsyncInlineError'
          const asyncInlineErrorDecoratorNode = decorators?.find(
            decorator => decorator.expression.callee.name === 'AsyncInlineError'
          )

          // TODO validar en services
          // TODO validar en repositories
          // TODO quickFix implementar
          if (!asyncInlineErrorDecoratorNode) {
            context.report({
              node: executeFn.key,
              messageId: 'notFoundAsyncInlineErrorDecorator',
              fix: fixer => {
                return fixer.insertTextBefore(executeFn, '@AsyncInlineError()\n')
              }
            })
          }

          if (asyncInlineErrorDecoratorNode && !isAsyncInlineErrorLastDecorator) {
            context.report({
              node: asyncInlineErrorDecoratorNode,
              messageId: 'asyncInlineErrorDecoratorIsNotFirst',
              *fix(fixer) {
                yield fixer.remove(asyncInlineErrorDecoratorNode)
                yield fixer.insertTextAfter(decorators.at(-1), '\n@AsyncInlineError()')
              }
            })
          }
        }
      }
    }
  }
}
