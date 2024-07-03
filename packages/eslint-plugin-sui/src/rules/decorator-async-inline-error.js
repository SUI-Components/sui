/**
 * @fileoverview Ensure that at least all your UseCases, Services and Repositories are using @AsyncInlineError decorator from sui
 */
'use strict'

const dedent = require('string-dedent')
const path = require('path')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ensure that at least all your UseCases, Services and Repositories are using @AsyncInlineError decorator from sui',
      recommended: true,
      url: 'https://github.mpi-internal.com/scmspain/es-td-agreements/blob/master/30-Frontend/00-agreements'
    },
    fixable: 'code',
    schema: [],
    messages: {
      notFoundAsyncInlineErrorDecoratorOnUseCase: dedent`
        The execute method of a UseCase should use the @AsyncInlineError() decorator in order to follow the Adevinta domain code guidelines.
        `,
      notFoundAsyncInlineErrorDecoratorOnService: dedent`
        The execute method of a Service should use the @AsyncInlineError() decorator in order to follow the Adevinta domain code guidelines.
        `,
      notFoundAsyncInlineErrorDecoratorOnRepository: dedent`
        The public Repository methods should use the @AsyncInlineError() decorator in order to follow the Adevinta domain code guidelines.
        `,
      asyncInlineErrorDecoratorIsNotFirst: dedent`
        The @AsyncInlineError() decorator must always be closest to the execute method to avoid inconsistence with other decorators.
        `
    }
  },
  create: function (context) {
    const filePath = context.getFilename()
    const relativePath = path.relative(context.getCwd(), filePath)

    // Check if the file is inside requierd folders (useCases, services, repositories, ...)
    const useCasePattern = /useCases|usecases/i
    const isUseCasePath = useCasePattern.test(relativePath)

    const servicePattern = /services/i
    const isServicePath = servicePattern.test(relativePath)

    const repositoryPattern = /repositories/i
    const isRepositoryPath = repositoryPattern.test(relativePath)

    return {
      MethodDefinition(node) {
        // Method
        const method = node
        const methodName = method.key?.name
        const isExecuteMethod = methodName === 'execute'

        // Class
        const classObject = node.parent?.parent
        const className = classObject?.id?.name
        const superClassName = classObject?.superClass?.name

        // UseCase
        const containUseCase = className?.endsWith('UseCase')
        const extendsUseCase = superClassName === 'UseCase'
        const isUsecase = containUseCase || extendsUseCase || isUseCasePath

        // Service
        const containService = className?.endsWith('Service')
        const extendsService = superClassName === 'Service'
        const isService = containService || extendsService || isServicePath

        // Repository
        const containRepository = className?.endsWith('Repository')
        const extendsRepository = superClassName === 'Repository'
        const isRepository = containRepository || extendsRepository || isRepositoryPath

        // Skip if it's not a UseCase, Service or Repository
        if (!isUsecase && !isService && !isRepository && !isExecuteMethod) return

        // Skip if a constructor or a not public method (starts by _ or #)
        if (methodName === 'constructor') return
        if (methodName.startsWith('_')) return
        if (methodName.startsWith('#')) return
        if ((isUsecase || isService) && !isExecuteMethod) return

        // Method decorators
        const methodDecorators = method.decorators
        const hasDecorators = methodDecorators?.length > 0

        // Get the @AsyncInlineError decorator from method
        const asyncInlineErrorDecoratorNode =
          hasDecorators &&
          methodDecorators?.find(decorator => decorator?.expression?.callee?.name === 'AsyncInlineError')

        // Check if the @AsyncInlineError decorator is the last one
        const isAsyncInlineErrorLastDecorator =
          hasDecorators && methodDecorators?.at(-1)?.expression?.callee?.name === 'AsyncInlineError'

        // RULE: The method should have the @AsyncInlineError decorator
        if (!asyncInlineErrorDecoratorNode && isUsecase) {
          context.report({
            node: method.key,
            messageId: 'notFoundAsyncInlineErrorDecoratorOnUseCase'
          })
        }
        if (!asyncInlineErrorDecoratorNode && isService) {
          context.report({
            node: method.key,
            messageId: 'notFoundAsyncInlineErrorDecoratorOnService'
          })
        }
        if (!asyncInlineErrorDecoratorNode && isRepository) {
          context.report({
            node: method.key,
            messageId: 'notFoundAsyncInlineErrorDecoratorOnRepository'
          })
        }

        // RULE: The @AsyncInlineError decorator should be the first one, to avoid inconsistencies with other decorators
        if (asyncInlineErrorDecoratorNode && !isAsyncInlineErrorLastDecorator) {
          context.report({
            node: asyncInlineErrorDecoratorNode,
            messageId: 'asyncInlineErrorDecoratorIsNotFirst',
            *fix(fixer) {
              yield fixer.remove(asyncInlineErrorDecoratorNode)
              yield fixer.insertTextAfter(methodDecorators.at(-1), '\n@AsyncInlineError()')
            }
          })
        }
      }
    }
  }
}
