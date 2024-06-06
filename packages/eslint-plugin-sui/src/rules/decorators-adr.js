/**
 * @fileoverview Ensure that at least all your UseCases, Services and Repositories are using @AsyncInlineError decorator from sui
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
        The execute method of an UseCase or Service and the public Repository methods should use the @AsyncInlineError() decorator in order to follow the Adevinta domain code guidelines.
        `,
      asyncInlineErrorDecoratorIsNotFirst: dedent`
        The @AsyncInlineError() decorator must be the first one assigned into the method to avoid inconsistence with other decorators.
        `
    }
  },
  create: function (context) {
    return {
      ClassDeclaration(node) {
        const className = node.id.name
        const superClassName = node.superClass?.name

        console.log('ClassName: ', className)

        // UseCase
        const containUseCase = className.endsWith('UseCase')
        const extendsUseCase = superClassName === 'UseCase'
        const isUsecase = containUseCase || extendsUseCase

        // Service
        const containService = className.endsWith('Service')
        const extendsService = superClassName === 'Service'
        const isService = containService || extendsService

        // Repository
        const containRepository = className.endsWith('Repository')
        const extendsRepository = superClassName === 'Repository'
        const isRepository = containRepository || extendsRepository

        // Skip if it's not a UseCase, Service or Repository
        if (!isUsecase && !isService && !isRepository) return

        // UseCases and Services always have a execute method
        if (isUsecase || isService) {
          const executeFn = node?.body?.body?.find(
            methodDefinition => methodDefinition.type === 'MethodDefinition' && methodDefinition.key.name === 'execute'
          )

          if (executeFn) {
            const decorators = executeFn?.decorators
            const isAsyncInlineErrorLastDecorator = decorators?.at(-1)?.expression?.callee?.name === 'AsyncInlineError'
            const asyncInlineErrorDecoratorNode = decorators?.find(
              decorator => decorator?.expression?.callee?.name === 'AsyncInlineError'
            )

            if (!asyncInlineErrorDecoratorNode) {
              context.report({
                node: executeFn.key,
                messageId: 'notFoundAsyncInlineErrorDecorator'
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

        if (isRepository) {
          // Get all public methods from the repository
          const publicMethods = node?.body?.body?.filter(
            methodDefinition =>
              methodDefinition.type === 'MethodDefinition' &&
              methodDefinition.key.name !== 'constructor' && // skip constructor method
              !methodDefinition.key.name.startsWith('_') && // Remove methods with _ prefix
              methodDefinition.key.type !== 'PrivateIdentifier' // Remove methods with # decorator
          )

          publicMethods?.forEach(method => {
            const methodDecorators = method.decorators
            const decorators = method?.decorators
            const isAsyncInlineErrorLastDecorator =
              methodDecorators?.at(-1)?.expression?.callee?.name === 'AsyncInlineError'
            const asyncInlineErrorDecoratorNode = methodDecorators?.find(
              decorator => decorator?.expression?.callee?.name === 'AsyncInlineError'
            )

            if (!asyncInlineErrorDecoratorNode) {
              context.report({
                node: method.key,
                messageId: 'notFoundAsyncInlineErrorDecorator'
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
          })
        }
      }
    }
  }
}
